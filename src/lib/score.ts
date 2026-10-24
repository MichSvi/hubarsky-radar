import type { Habitat, Species } from '../data/types';
import type { ForestType } from './habitat';
import { inatId } from './inat';
import type { Day, Weather } from './weather';

export interface Evidence {
  /** iNaturalist observations of each species around the point, all years. */
  allTime?: Map<number, number>;
  /** Observations in the last 14 days within a wider radius. */
  recent?: Map<number, number>;
  /** All fungi observations around the point (sampling effort). */
  fungiTotal?: number;
}

export interface Context {
  weather: Weather;
  forest: ForestType;
  /** Measured land-cover shares (0–1) around the point; used instead of the forest class when present. */
  shares?: { broadleaf: number; conifer: number; open: number };
  evidence: Evidence;
}

export interface Factors {
  season: number;
  moisture: number;
  temp: number;
  frost: number;
  heat: number;
  habitat: number;
  altitude: number;
  evidence: number;
}

export interface Score {
  p: number;
  factors: Factors;
  rainIdx: number;
  t7: number;
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);

export function trapezoid(x: number, [a, b, c, d]: [number, number, number, number]) {
  if (x <= a || x >= d) return 0;
  if (x < b) return (x - a) / (b - a);
  if (x > c) return (d - x) / (d - c);
  return 1;
}

export function inMonths(m: number, [s, e]: [number, number]) {
  return s <= e ? m >= s && m <= e : m >= s || m <= e;
}

function monthValue(sp: Species, m: number) {
  const norm = ((m - 1 + 12) % 12) + 1;
  if (inMonths(norm, sp.peak)) return 1;
  if (inMonths(norm, sp.season)) return 0.55;
  if (inMonths(((norm) % 12) + 1, sp.season) || inMonths(((norm - 2 + 12) % 12) + 1, sp.season)) return 0.08;
  return 0.01;
}

/** Phenology: how typical is the date for this species, smoothly blended between months. */
export function seasonFactor(sp: Species, date: string) {
  const m = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const here = monthValue(sp, m);
  const neighbour = day < 15 ? monthValue(sp, m - 1) : monthValue(sp, m + 1);
  const f = Math.abs(day - 15) / 30;
  return here * (1 - f) + neighbour * f;
}

/**
 * Rain that can trigger fruiting: fruit bodies appear mostly 5–14 days after a soaking rain,
 * so rain in that window counts fully, older or very fresh rain partially.
 */
export function rainIndex(days: Day[], i: number) {
  let sum = 0;
  for (let k = 0; k <= 21; k++) {
    const d = days[i - k];
    if (!d) continue;
    const w = k <= 2 ? 0.4 : k <= 4 ? 0.8 : k <= 14 ? 1 : 0.6;
    sum += d.rain * w;
  }
  return sum;
}

const window7 = (days: Day[], i: number) => days.slice(Math.max(0, i - 6), i + 1);

export function weatherFactors(sp: Pick<Species, 'rain' | 'temp' | 'frostTolerant'>, days: Day[], i: number) {
  const w = window7(days, i);
  const rainIdx = rainIndex(days, i);
  const rainScore = Math.pow(clamp(rainIdx / sp.rain), 0.7);

  const sm = avg(days.slice(Math.max(0, i - 2), i + 1).map((d) => d.soilM).filter((x): x is number => x != null));
  const smScore = Number.isNaN(sm) ? null : sm < 0.12 ? 0.1 : sm < 0.28 ? 0.1 + (0.9 * (sm - 0.12)) / 0.16 : 1;
  const rh = avg(days.slice(Math.max(0, i - 2), i + 1).map((d) => d.rh).filter((x): x is number => x != null));
  let moisture = smScore == null ? rainScore : 0.6 * rainScore + 0.4 * smScore;
  if (!Number.isNaN(rh) && rh < 60) moisture *= 0.8;

  const t7 = avg(w.map((d) => d.tmean));
  const soil7 = avg(w.map((d) => d.soilT).filter((x): x is number => x != null));
  const airScore = trapezoid(t7, sp.temp);
  const temp = Number.isNaN(soil7) ? airScore : 0.6 * airScore + 0.4 * trapezoid(soil7, sp.temp);

  const frostNights = w.filter((d) => d.tmin < -1).length;
  const hardFrost = days.slice(Math.max(0, i - 1), i + 1).some((d) => d.tmin < -3);
  const frost = sp.frostTolerant ? 1 : Math.max(0.1, 1 - 0.3 * frostNights) * (hardFrost ? 0.5 : 1);

  const hotDays = w.filter((d) => d.tmax >= 30).length;
  const heat = Math.max(0.4, 1 - 0.12 * hotDays);

  return { moisture: clamp(moisture), temp, frost, heat, rainIdx, t7 };
}

function habitatFactor(habitats: Habitat[], forest: ForestType, shares?: Context['shares']) {
  if (shares) {
    // Even a small share of the right trees within 2 km is enough to search there; single host trees are often missed.
    const avail = (x: number) => Math.min(1, 0.25 + 2.5 * x);
    const by: Record<Habitat, number> = {
      deciduous: avail(shares.broadleaf),
      coniferous: avail(shares.conifer),
      meadow: avail(shares.open),
      wood: avail(shares.broadleaf + shares.conifer),
    };
    return Math.max(...habitats.map((h) => by[h]));
  }
  if (forest === 'unknown') return 0.75;
  const table: Record<Exclude<ForestType, 'unknown'>, Record<Habitat, number>> = {
    deciduous: { deciduous: 1, coniferous: 0.2, meadow: 0.35, wood: 1 },
    coniferous: { deciduous: 0.2, coniferous: 1, meadow: 0.35, wood: 1 },
    mixed: { deciduous: 0.85, coniferous: 0.85, meadow: 0.4, wood: 1 },
    meadow: { deciduous: 0.3, coniferous: 0.3, meadow: 1, wood: 0.5 },
  };
  return Math.max(...habitats.map((h) => table[forest][h]));
}

function altitudeFactor(sp: Species, elevation: number) {
  const [lo, hi] = sp.altitude;
  const d = elevation < lo ? lo - elevation : elevation > hi ? elevation - hi : 0;
  return Math.max(0.1, 1 - d / 500);
}

function evidenceFactor(sp: Species, ev: Evidence) {
  const id = inatId(sp.latin);
  let f = 1;
  if (ev.allTime && id) {
    if ((ev.allTime.get(id) ?? 0) > 0) f = 1.1;
    else if ((ev.fungiTotal ?? 0) > 300) f = 0.6; // well-sampled area, yet never recorded
  }
  if (ev.recent && id && (ev.recent.get(id) ?? 0) > 0) f *= 1.3;
  return f;
}

export function scoreSpecies(sp: Species, ctx: Context, i = ctx.weather.today): Score {
  const day = ctx.weather.days[i];
  const wf = weatherFactors(sp, ctx.weather.days, i);
  const factors: Factors = {
    season: seasonFactor(sp, day.date),
    moisture: wf.moisture,
    temp: wf.temp,
    frost: wf.frost,
    heat: wf.heat,
    habitat: habitatFactor(sp.habitats, ctx.forest, ctx.shares),
    altitude: altitudeFactor(sp, ctx.weather.elevation),
    evidence: evidenceFactor(sp, ctx.evidence),
  };
  // Moisture and temperature are limiting factors (Liebig's law): use geometric weighting so either can block fruiting.
  const weather = Math.pow(factors.moisture, 0.9) * Math.pow(factors.temp, 0.8) * factors.frost * factors.heat;
  const p = clamp(factors.season * weather * factors.habitat * factors.altitude * factors.evidence, 0, 0.95);
  return { p, factors, rainIdx: wf.rainIdx, t7: wf.t7 };
}

/** Scores for today and each forecast day. */
export function scoreSeries(sp: Species, ctx: Context) {
  const out: { date: string; p: number }[] = [];
  for (let i = ctx.weather.today; i < ctx.weather.days.length; i++) {
    out.push({ date: ctx.weather.days[i].date, p: scoreSpecies(sp, ctx, i).p });
  }
  return out;
}

/** General mushroom weather, independent of species and season. */
export function generalIndex(days: Day[], i: number) {
  const wf = weatherFactors({ rain: 30, temp: [3, 9, 20, 27] }, days, i);
  return clamp(Math.pow(wf.moisture, 0.9) * Math.pow(wf.temp, 0.8) * wf.frost * wf.heat);
}

export type Level = 'high' | 'medium' | 'low' | 'none';
export const level = (p: number): Level => (p >= 0.55 ? 'high' : p >= 0.3 ? 'medium' : p >= 0.12 ? 'low' : 'none');
