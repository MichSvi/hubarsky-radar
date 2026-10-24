import { SPECIES } from '../data/species';
import type { Lang } from '../data/types';
import { STRINGS } from '../strings';
import type { ForestType } from './habitat';
import { scoreSpecies } from './score';
import * as store from './store';
import { fetchWeather } from './weather';

export interface WatchedPlace {
  id: string;
  name: string;
  lat: number;
  lon: number;
  forest: ForestType;
  shares?: { broadleaf: number; conifer: number; open: number };
  threshold: number; // 0–1
  species: string[]; // empty = favourites, or any edible species when there are none
  lastCheck?: string;
  lastNotified?: string;
  lastHits?: string[];
}

export interface Hit {
  place: WatchedPlace;
  species: { id: string; name: string; p: number; date: string }[];
}

const EDIBLE = new Set(['choice', 'edible', 'caution']);
const LOOKAHEAD = 3;

export const getPlaces = async () => (await store.get<WatchedPlace[]>('places')) ?? [];
export const savePlaces = (p: WatchedPlace[]) => store.set('places', p);
export const getLang = async () => (await store.get<Lang>('lang')) ?? 'sk';

/** Checks every watched place, returns hits and shows notifications for new ones. */
export async function checkAlerts(
  showNotification: (title: string, opts: NotificationOptions) => Promise<void> | void,
  force = false,
): Promise<Hit[]> {
  const lang = await getLang();
  const t = STRINGS[lang];
  const places = await getPlaces();
  const favorites = (await store.get<string[]>('favorites')) ?? [];
  const hits: Hit[] = [];
  for (const place of places) {
    try {
      const weather = await fetchWeather(place.lat, place.lon);
      const ctx = { weather, forest: place.forest, shares: place.shares, evidence: {} };
      // Per-place choice wins, then the user's favourites, then any edible species.
      const wanted = place.species.length ? place.species : favorites;
      const candidates = SPECIES.filter((s) => (wanted.length ? wanted.includes(s.id) : EDIBLE.has(s.edibility)));
      const found: Hit['species'] = [];
      for (const sp of candidates) {
        let best = { p: 0, date: '' };
        for (let i = weather.today; i <= Math.min(weather.days.length - 1, weather.today + LOOKAHEAD); i++) {
          const p = scoreSpecies(sp, ctx, i).p;
          if (p > best.p) best = { p, date: weather.days[i].date };
        }
        if (best.p >= place.threshold) found.push({ id: sp.id, name: lang === 'sk' ? sp.sk : sp.en, ...best });
      }
      found.sort((a, b) => b.p - a.p);
      place.lastCheck = new Date().toISOString();
      if (found.length) {
        hits.push({ place, species: found });
        const ids = found.map((f) => f.id).sort();
        const recentlyNotified = place.lastNotified && Date.now() - Date.parse(place.lastNotified) < 20 * 3600e3;
        const sameAsBefore = JSON.stringify(ids) === JSON.stringify(place.lastHits ?? []);
        if (force || !(recentlyNotified && sameAsBefore)) {
          const when = found[0].date === weather.days[weather.today].date ? t.today.toLowerCase() : formatDate(found[0].date, lang);
          await showNotification(t.notifTitle(place.name), {
            body: t.notifBody(found.slice(0, 4).map((f) => `${f.name} ${Math.round(f.p * 100)} %`).join(', '), when),
            icon: './icon.svg',
            badge: './icon.svg',
            tag: `place-${place.id}`,
            data: { url: `./?lat=${place.lat}&lon=${place.lon}` },
          });
          place.lastNotified = new Date().toISOString();
          place.lastHits = ids;
        }
      }
    } catch {
      // network problems: try again next time
    }
  }
  await savePlaces(places);
  return hits;
}

export function formatDate(date: string, lang: Lang) {
  const d = new Date(date + 'T12:00:00');
  return `${STRINGS[lang].daysShort[d.getDay()]} ${d.getDate()}. ${d.getMonth() + 1}.`;
}
