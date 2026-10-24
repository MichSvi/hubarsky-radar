import { INAT_IDS } from '../data/inatIds';
import type { Lang } from '../data/types';

const API = 'https://api.inaturalist.org/v1';
const FUNGI = 47170;

export interface Photo {
  url: string;
  large: string;
  attribution: string;
}

export interface TaxonInfo {
  id: number;
  photos: Photo[];
  wikipedia?: string;
}

export interface Sighting {
  id: number;
  lat: number;
  lon: number;
  date: string;
  name: string;
  common?: string;
  taxonId: number;
  photo?: string;
  url: string;
}

const taxonCache = new Map<string, Promise<TaxonInfo | null>>();

export const inatId = (latin: string) => INAT_IDS[latin];
export const inatTaxonUrl = (latin: string) =>
  inatId(latin) ? `https://www.inaturalist.org/taxa/${inatId(latin)}` : `https://www.inaturalist.org/search?q=${encodeURIComponent(latin)}`;

const size = (url: string, s: string) => url.replace(/\/(square|small|medium|large|original)\./, `/${s}.`);

/** Photos of a species from iNaturalist (CC-licensed, with attribution). */
export function getTaxon(latin: string, lang: Lang): Promise<TaxonInfo | null> {
  const key = `${latin}|${lang}`;
  if (!taxonCache.has(key)) {
    const id = inatId(latin);
    const p = (async () => {
      const url = id ? `${API}/taxa/${id}?locale=${lang}` : `${API}/taxa?q=${encodeURIComponent(latin)}&per_page=1&locale=${lang}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const t = (await res.json()).results?.[0];
      if (!t) return null;
      const raw = t.taxon_photos?.length ? t.taxon_photos.map((tp: any) => tp.photo) : t.default_photo ? [t.default_photo] : [];
      return {
        id: t.id,
        wikipedia: t.wikipedia_url ?? undefined,
        photos: raw.slice(0, 8).map((ph: any) => ({
          url: size(ph.medium_url ?? ph.url, 'medium'),
          large: size(ph.medium_url ?? ph.url, 'large'),
          attribution: ph.attribution,
        })),
      };
    })().catch(() => null);
    taxonCache.set(key, p);
  }
  return taxonCache.get(key)!;
}

/** Number of verifiable observations of each of our species within radius (all years). */
export async function speciesCounts(lat: number, lon: number, radiusKm: number, daysBack?: number): Promise<Map<number, number>> {
  const ids = Object.values(INAT_IDS).join(',');
  const params = new URLSearchParams({
    taxon_id: ids, lat: String(lat), lng: String(lon), radius: String(radiusKm), verifiable: 'true', per_page: '500',
  });
  if (daysBack) params.set('d1', isoDaysAgo(daysBack));
  const res = await fetch(`${API}/observations/species_counts?${params}`);
  if (!res.ok) throw new Error(`iNat ${res.status}`);
  const j = await res.json();
  return new Map(j.results.map((r: any) => [r.taxon.id, r.count]));
}

/** Total fungi observations around the point – tells whether a missing species is meaningful. */
export async function fungiTotal(lat: number, lon: number, radiusKm: number): Promise<number> {
  const params = new URLSearchParams({ taxon_id: String(FUNGI), lat: String(lat), lng: String(lon), radius: String(radiusKm), verifiable: 'true', per_page: '0' });
  const res = await fetch(`${API}/observations?${params}`);
  if (!res.ok) return 0;
  return (await res.json()).total_results ?? 0;
}

/** Recent fungi sightings near the point – shows where people actually found mushrooms. */
export async function recentSightings(lat: number, lon: number, radiusKm: number, daysBack: number, lang: Lang): Promise<Sighting[]> {
  const params = new URLSearchParams({
    taxon_id: String(FUNGI), lat: String(lat), lng: String(lon), radius: String(radiusKm),
    d1: isoDaysAgo(daysBack), verifiable: 'true', per_page: '200', order_by: 'observed_on', locale: lang,
  });
  const res = await fetch(`${API}/observations?${params}`);
  if (!res.ok) return [];
  const j = await res.json();
  return j.results
    .filter((o: any) => o.geojson && o.taxon)
    .map((o: any) => ({
      id: o.id,
      lon: o.geojson.coordinates[0],
      lat: o.geojson.coordinates[1],
      date: o.observed_on,
      name: o.taxon.name,
      common: o.taxon.preferred_common_name,
      taxonId: o.taxon.id,
      photo: o.photos?.[0]?.url ? size(o.photos[0].url, 'small') : undefined,
      url: o.uri,
    }));
}

function isoDaysAgo(n: number) {
  return new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
}
