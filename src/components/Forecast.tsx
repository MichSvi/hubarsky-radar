import { useCallback, useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { SPECIES } from '../data/species';
import type { Species } from '../data/types';
import { useT } from '../i18n';
import { formatDate, getPlaces } from '../lib/alerts';
import { fetchHabitat, type ForestType, type HabitatInfo } from '../lib/habitat';
import { fungiTotal, inatId, recentSightings, speciesCounts, type Sighting } from '../lib/inat';
import { useFavorites } from '../lib/favorites';
import { watchPlace } from '../lib/notify';
import { generalIndex, level, rainIndex, scoreSeries, scoreSpecies, type Context, type Evidence } from '../lib/score';
import { fetchWeather, type Weather } from '../lib/weather';
import { Chance, EdibilityBadge, FavStar, Thumb } from './common';
import SpeciesDetail from './SpeciesDetail';

interface Place { lat: number; lon: number; name: string }

const SK_CENTER: [number, number] = [48.7, 19.5];
const EDIBLE = new Set(['choice', 'edible', 'caution']);

function initialPlace(): Place | null {
  const q = new URLSearchParams(location.search);
  const lat = Number(q.get('lat'));
  const lon = Number(q.get('lon'));
  return lat && lon ? { lat, lon, name: q.get('name') ?? `${lat.toFixed(3)}, ${lon.toFixed(3)}` } : null;
}

async function reverseName(lat: number, lon: number, lang: string) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=13&accept-language=${lang}`);
    const j = await r.json();
    const a = j.address ?? {};
    return a.village || a.town || a.city || a.municipality || a.county || j.name || `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
  } catch {
    return `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
  }
}

export default function Forecast() {
  const { t, lang } = useT();
  const favorites = useFavorites();
  const [place, setPlace] = useState<Place | null>(initialPlace);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [habitat, setHabitat] = useState<HabitatInfo | null | 'error'>(null);
  const [forestOverride, setForestOverride] = useState<ForestType | null>(null);
  const [evidence, setEvidence] = useState<Evidence>({});
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [showSightings, setShowSightings] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [onlyEdible, setOnlyEdible] = useState(false);
  const [selected, setSelected] = useState<Species | null>(null);
  const [dayIdx, setDayIdx] = useState(0);
  const [watched, setWatched] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!place) return;
    let alive = true;
    setLoading(true); setError(false); setWeather(null); setHabitat(null); setForestOverride(null);
    setEvidence({}); setSightings([]); setDayIdx(0);
    const url = new URL(location.href);
    url.searchParams.set('lat', place.lat.toFixed(4));
    url.searchParams.set('lon', place.lon.toFixed(4));
    url.searchParams.set('name', place.name);
    history.replaceState(null, '', url);

    fetchWeather(place.lat, place.lon)
      .then((w) => alive && setWeather(w))
      .catch(() => alive && setError(true))
      .finally(() => alive && setLoading(false));
    fetchHabitat(place.lat, place.lon).then((h) => alive && setHabitat(h)).catch(() => alive && setHabitat('error'));
    Promise.allSettled([
      speciesCounts(place.lat, place.lon, 25),
      speciesCounts(place.lat, place.lon, 50, 14),
      fungiTotal(place.lat, place.lon, 25),
    ]).then(([a, r, tot]) => {
      if (!alive) return;
      setEvidence({
        allTime: a.status === 'fulfilled' ? a.value : undefined,
        recent: r.status === 'fulfilled' ? r.value : undefined,
        fungiTotal: tot.status === 'fulfilled' ? tot.value : undefined,
      });
    });
    recentSightings(place.lat, place.lon, 25, 30, lang).then((s) => alive && setSightings(s)).catch(() => {});
    getPlaces().then((ps) => alive && setWatched(ps.some((p) => p.id === `${place.lat.toFixed(3)},${place.lon.toFixed(3)}`)));
    return () => { alive = false; };
  }, [place, reload]); // eslint-disable-line react-hooks/exhaustive-deps

  const forest: ForestType = forestOverride ?? (habitat && habitat !== 'error' ? habitat.type : 'unknown');
  const shares = !forestOverride && habitat && habitat !== 'error' ? habitat : undefined;
  const ctx: Context | null = weather ? { weather, forest, shares, evidence } : null;
  const dayI = weather ? weather.today + dayIdx : 0;

  const ranked = useMemo(() => {
    if (!ctx) return [];
    return SPECIES.map((sp) => ({ sp, score: scoreSpecies(sp, ctx, dayI) })).sort((a, b) => b.score.p - a.score.p);
  }, [ctx?.weather, forest, shares, evidence, dayI]); // eslint-disable-line react-hooks/exhaustive-deps

  const outlook = useMemo(() => {
    if (!ctx) return [];
    const out = [];
    for (let i = ctx.weather.today; i < ctx.weather.days.length; i++) {
      const best = Math.max(...SPECIES.filter((s) => EDIBLE.has(s.edibility)).map((s) => scoreSpecies(s, ctx, i).p));
      out.push({ day: ctx.weather.days[i], general: generalIndex(ctx.weather.days, i), best });
    }
    return out;
  }, [ctx?.weather, forest, shares, evidence]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = useCallback(async (lat: number, lon: number, name?: string) => {
    setPlace({ lat, lon, name: name ?? `${lat.toFixed(3)}, ${lon.toFixed(3)}` });
    if (!name) {
      const n = await reverseName(lat, lon, lang);
      setPlace((p) => (p && p.lat === lat && p.lon === lon ? { ...p, name: n } : p));
    }
  }, [lang]);

  const visible = ranked.filter((r) => (!onlyEdible || EDIBLE.has(r.sp.edibility)) && (showAll || r.score.p >= 0.05));
  const sightingCounts = useMemo(() => {
    const m = new Map<number, number>();
    sightings.forEach((s) => m.set(s.taxonId, (m.get(s.taxonId) ?? 0) + 1));
    return m;
  }, [sightings]);

  // Favourites are always listed (even with a low chance), the rest follow the filters.
  const favRows = ranked.filter((r) => favorites.includes(r.sp.id));
  const otherRows = visible.filter((r) => !favorites.includes(r.sp.id));

  const renderRow = ({ sp, score }: (typeof ranked)[number]) => {
    const id = inatId(sp.latin);
    const recent = id && ((evidence.recent?.get(id) ?? 0) > 0 || (sightingCounts.get(id) ?? 0) > 0);
    const known = id && (evidence.allTime?.get(id) ?? 0) > 0;
    const limiting = (Object.entries(score.factors) as [keyof typeof score.factors, number][])
      .filter(([k]) => k !== 'evidence')
      .sort((a, b) => a[1] - b[1])[0];
    return (
      <li key={sp.id}>
        <button className="species" onClick={() => setSelected(sp)}>
          <Thumb latin={sp.latin} />
          <div className="info">
            <b>{lang === 'sk' ? sp.sk : sp.en}</b>
            <i>{sp.latin}</i>
            <div className="row">
              <EdibilityBadge e={sp.edibility} />
              {recent ? <span className="tag hot">● {t.recentNear}</span> : known ? <span className="tag">{t.knownNear}</span> : null}
            </div>
            {limiting[1] < 0.5 && <span className="small muted">↓ {t.factors[limiting[0]]}</span>}
          </div>
          <Chance p={score.p} />
        </button>
        <FavStar id={sp.id} />
      </li>
    );
  };

  return (
    <div className="forecast">
      <section className="card mapcard">
        <SearchBox onPick={choose} />
        <div className="map">
          <MapContainer center={place ? [place.lat, place.lon] : SK_CENTER} zoom={place ? 11 : 7} scrollWheelZoom fadeAnimation={false}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickHandler onClick={(lat, lon) => choose(lat, lon)} />
            <AutoResize />
            {place && <FlyTo lat={place.lat} lon={place.lon} />}
            {showSightings && sightings.map((s) => (
              <CircleMarker key={s.id} center={[s.lat, s.lon]} radius={5} pathOptions={{ color: '#8a4b2a', fillColor: '#d9884f', fillOpacity: 0.85, weight: 1 }}>
                <Popup>
                  {s.photo && <img src={s.photo} alt="" width={120} />}
                  <div><b>{s.common ?? s.name}</b></div>
                  <i>{s.name}</i>
                  <div>{s.date}</div>
                  <a href={s.url} target="_blank" rel="noreferrer">iNaturalist ↗</a>
                </Popup>
              </CircleMarker>
            ))}
            {place && <CircleMarker center={[place.lat, place.lon]} radius={10} pathOptions={{ color: '#fff', weight: 3, fillColor: '#3d5a3a', fillOpacity: 1 }} />}
          </MapContainer>
        </div>
        {!place && <p className="hint">{t.pickOnMap}</p>}
        {place && sightings.length > 0 && (
          <label className="check">
            <input type="checkbox" checked={showSightings} onChange={(e) => setShowSightings(e.target.checked)} />
            {t.showSightings} ({sightings.length})
          </label>
        )}
      </section>

      {place && (
        <section className="card">
          <div className="place-head">
            <h2>📍 {place.name}</h2>
            <button
              className={watched ? 'btn ghost' : 'btn'}
              disabled={watched || !weather}
              onClick={async () => { await watchPlace({ name: place.name, lat: place.lat, lon: place.lon, forest, shares }); setWatched(true); }}
            >
              {watched ? t.watching : `🔔 ${t.watchPlace}`}
            </button>
          </div>
          {loading && <p className="muted">{t.loading}</p>}
          {error && <p>{t.error} <button className="btn ghost" onClick={() => setReload((r) => r + 1)}>{t.retry}</button></p>}
          {weather && <Conditions weather={weather} i={dayI} />}
          {weather && (
            <div className="forest">
              <span>{t.forestType}: </span>
              {(['deciduous', 'coniferous', 'mixed', 'meadow'] as ForestType[]).map((f) => (
                <button key={f} className={`chip ${forest === f ? 'on' : ''}`} onClick={() => setForestOverride(f)}>{t.forest[f]}</button>
              ))}
              <small className="muted">
                {forestOverride ? t.forestManual : habitat === null ? '…' : habitat === 'error' ? t.forestFail
                  : `${t.forestAuto} (${t.shares(Math.round(habitat.broadleaf * 100), Math.round(habitat.conifer * 100), Math.round(habitat.open * 100))})`}
              </small>
            </div>
          )}
        </section>
      )}

      {weather && outlook.length > 0 && (
        <section className="card">
          <h3>{t.next8}</h3>
          <div className="outlook">
            {outlook.map((o, k) => (
              <button key={o.day.date} className={`day ${k === dayIdx ? 'sel' : ''}`} onClick={() => setDayIdx(k)}>
                <span className="dname">{k === 0 ? t.today : formatDate(o.day.date, lang)}</span>
                <span className={`dot lvbg-${level(o.best)}`}>{Math.round(o.best * 100)}</span>
                <span className="small">{Math.round(o.day.tmin)}°/{Math.round(o.day.tmax)}°</span>
                <span className="small">💧{o.day.rain.toFixed(o.day.rain < 10 ? 1 : 0)}</span>
              </button>
            ))}
          </div>
          <p className="muted small">
            {t.generalIndex}: <b>{t.level[level(outlook[dayIdx].general)]}</b> · {t.bestDay}: <b>{(() => {
              const b = outlook.reduce((a, o, k) => (o.best > outlook[a].best ? k : a), 0);
              return b === 0 ? t.today : formatDate(outlook[b].day.date, lang);
            })()}</b>
          </p>
        </section>
      )}

      {ctx && (
        <section className="card">
          <div className="list-head">
            <h3>{t.speciesHere}</h3>
            <label className="check"><input type="checkbox" checked={onlyEdible} onChange={(e) => setOnlyEdible(e.target.checked)} />{t.onlyEdible}</label>
            <label className="check"><input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />{t.showAll}</label>
          </div>
          {favRows.length > 0 ? (
            <>
              <h4 className="group">★ {t.myMushrooms}</h4>
              <ul className="species-list fav-list">{favRows.map(renderRow)}</ul>
              <h4 className="group">{t.otherMushrooms}</h4>
            </>
          ) : (
            <p className="muted small">{t.favHint}</p>
          )}
          <ul className="species-list">{otherRows.map(renderRow)}</ul>
        </section>
      )}

      {selected && ctx && (
        <SpeciesDetail
          sp={selected}
          score={scoreSpecies(selected, ctx, dayI)}
          series={scoreSeries(selected, ctx)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function Conditions({ weather, i }: { weather: Weather; i: number }) {
  const { t } = useT();
  const d = weather.days;
  const last = (n: number) => d.slice(Math.max(0, i - n + 1), i + 1);
  const rain7 = last(7).reduce((a, x) => a + x.rain, 0);
  const rain21 = last(21).reduce((a, x) => a + x.rain, 0);
  const t7 = last(7).reduce((a, x) => a + x.tmean, 0) / Math.min(7, i + 1);
  const soilT = d[i].soilT;
  const soilM = d[i].soilM;
  const frost = last(7).filter((x) => x.tmin < -1).length;
  const items: [string, string][] = [
    [t.elevation, `${Math.round(weather.elevation)} m`],
    [t.rain7, `${rain7.toFixed(0)} ${t.mm}`],
    [t.rain21, `${rain21.toFixed(0)} ${t.mm}`],
    [t.temp7, `${t7.toFixed(1)} °C`],
    [t.soilT, soilT != null ? `${soilT.toFixed(1)} °C` : '–'],
    [t.soilM, soilM != null ? `${Math.round(soilM * 100)} %` : '–'],
    [t.frostNights, String(frost)],
  ];
  return (
    <dl className="conditions" title={`rain index ${rainIndex(d, i).toFixed(0)}`}>
      {items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

function ClickHandler({ onClick }: { onClick: (lat: number, lon: number) => void }) {
  useMapEvents({ click: (e) => onClick(e.latlng.lat, e.latlng.lng) });
  return null;
}

/** Leaflet measures its container once; re-measure when the layout changes (tabs, rotation). */
function AutoResize() {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, [map]);
  return null;
}

function FlyTo({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], Math.max(map.getZoom(), 11), { duration: 0.8 });
  }, [lat, lon, map]);
  return null;
}

function SearchBox({ onPick }: { onPick: (lat: number, lon: number, name?: string) => void }) {
  const { t, lang } = useT();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ lat: string; lon: string; display_name: string; name: string }[]>([]);
  const [busy, setBusy] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy(true);
    try {
      // Prefer Slovakia and neighbours, but allow anywhere.
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=6&accept-language=${lang}&viewbox=16.8,49.7,22.6,47.7&q=${encodeURIComponent(q)}`);
      setResults(await r.json());
    } catch {
      setResults([]);
    } finally {
      setBusy(false);
    }
  };

  const locate = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => onPick(pos.coords.latitude, pos.coords.longitude),
      () => {},
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  return (
    <div className="search">
      <form onSubmit={search}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
        <button className="btn" type="submit" disabled={busy}>🔍</button>
        <button className="btn ghost" type="button" onClick={locate} title={t.myLocation}>📍 <span className="hide-sm">{t.myLocation}</span></button>
      </form>
      {results.length > 0 && (
        <ul className="results">
          {results.map((r) => (
            <li key={r.lat + r.lon}>
              <button onClick={() => { onPick(Number(r.lat), Number(r.lon), r.name || r.display_name.split(',')[0]); setResults([]); }}>
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
