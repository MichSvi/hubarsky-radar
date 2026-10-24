export type ForestType = 'deciduous' | 'coniferous' | 'mixed' | 'meadow' | 'unknown';

export interface HabitatInfo {
  type: ForestType;
  source: 'copernicus' | 'osm';
  /** Shares 0–1 of sampled area. */
  broadleaf: number;
  conifer: number;
  open: number;
}

const DLT = 'https://image.discomap.eea.europa.eu/arcgis/rest/services/GioLandPublic/HRL_DominantLeafType2018/ImageServer/getSamples';

/**
 * Copernicus High Resolution Layer "Dominant Leaf Type" (10 m, whole Europe):
 * samples a 7×7 grid within ~2 km and counts broadleaf / conifer / treeless pixels.
 */
async function fromCopernicus(lat: number, lon: number, radiusM: number): Promise<HabitatInfo> {
  const dLat = radiusM / 111320;
  const dLon = radiusM / (111320 * Math.cos((lat * Math.PI) / 180));
  const points: [number, number][] = [];
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) points.push([lon + (j / 3) * dLon, lat + (i / 3) * dLat]);
  const params = new URLSearchParams({
    geometry: JSON.stringify({ points, spatialReference: { wkid: 4326 } }),
    geometryType: 'esriGeometryMultipoint',
    returnFirstValueOnly: 'true',
    f: 'json',
  });
  const res = await fetchWithTimeout(`${DLT}?${params}`, {}, 15000);
  const j = await res.json();
  if (!j.samples?.length) throw new Error('no samples');
  let b = 0, c = 0, o = 0;
  for (const s of j.samples) {
    const v = Math.round(Number(s.value));
    if (v === 1) b++;
    else if (v === 2) c++;
    else o++;
  }
  const n = b + c + o;
  return classify(b / n, c / n, o / n, 'copernicus');
}

/** Fallback: OpenStreetMap forest polygons with leaf_type. Public Overpass servers are often overloaded. */
async function fromOsm(lat: number, lon: number, radiusM: number): Promise<HabitatInfo> {
  const q = `[out:json][timeout:15];(way(around:${radiusM},${lat},${lon})["landuse"="forest"];way(around:${radiusM},${lat},${lon})["natural"="wood"];way(around:${radiusM},${lat},${lon})["landuse"~"meadow|grass"];);out tags;`;
  const res = await fetchWithTimeout('https://overpass-api.de/api/interpreter', {
    method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }, 15000);
  const els: { tags?: Record<string, string> }[] = (await res.json()).elements ?? [];
  let b = 0, c = 0, m = 0, o = 0;
  for (const el of els) {
    const t = el.tags ?? {};
    if (t.landuse === 'forest' || t.natural === 'wood') {
      if (t.leaf_type === 'broadleaved') b++;
      else if (t.leaf_type === 'needleleaved') c++;
      else m++;
    } else o++;
  }
  // untyped forest counts half to each leaf type
  const n = Math.max(1, b + c + m + o);
  return classify((b + m / 2) / n, (c + m / 2) / n, o / n, 'osm');
}

function classify(broadleaf: number, conifer: number, open: number, source: HabitatInfo['source']): HabitatInfo {
  const forest = broadleaf + conifer;
  let type: ForestType;
  if (forest < 0.15) type = 'meadow';
  else if (broadleaf / forest >= 0.7) type = 'deciduous';
  else if (conifer / forest >= 0.7) type = 'coniferous';
  else type = 'mixed';
  return { type, source, broadleaf, conifer, open };
}

async function fetchWithTimeout(url: string, init: RequestInit, ms: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchHabitat(lat: number, lon: number, radiusM = 2000): Promise<HabitatInfo> {
  try {
    return await fromCopernicus(lat, lon, radiusM);
  } catch {
    return fromOsm(lat, lon, radiusM);
  }
}
