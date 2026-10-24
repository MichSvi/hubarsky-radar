export interface Day {
  date: string; // YYYY-MM-DD
  tmean: number;
  tmin: number;
  tmax: number;
  rain: number; // mm
  rh: number | null; // %
  soilT: number | null; // °C at 6 cm
  soilM: number | null; // m³/m³ at 3–9 cm
  forecast: boolean;
}

export interface Weather {
  days: Day[];
  today: number; // index of today in days
  elevation: number;
}

export const PAST_DAYS = 30;
export const FORECAST_DAYS = 8;

const mean = (xs: (number | null)[]) => {
  const v = xs.filter((x): x is number => typeof x === 'number');
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};

/** Open-Meteo: free, no API key, combines the best weather models for Central Europe (incl. ICON-D2, ECMWF). */
export async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    daily: 'temperature_2m_mean,temperature_2m_min,temperature_2m_max,precipitation_sum,relative_humidity_2m_mean',
    hourly: 'soil_temperature_6cm,soil_moisture_3_to_9cm',
    past_days: String(PAST_DAYS),
    forecast_days: String(FORECAST_DAYS),
    timezone: 'auto',
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const j = await res.json();
  const d = j.daily;
  const h = j.hourly;
  const todayStr: string = new Date(Date.now() + j.utc_offset_seconds * 1000).toISOString().slice(0, 10);

  const days: Day[] = d.time.map((date: string, i: number) => {
    const hours = h.time
      .map((t: string, k: number) => (t.startsWith(date) ? k : -1))
      .filter((k: number) => k >= 0);
    return {
      date,
      tmean: d.temperature_2m_mean[i] ?? (d.temperature_2m_min[i] + d.temperature_2m_max[i]) / 2,
      tmin: d.temperature_2m_min[i],
      tmax: d.temperature_2m_max[i],
      rain: d.precipitation_sum[i] ?? 0,
      rh: d.relative_humidity_2m_mean[i] ?? null,
      soilT: mean(hours.map((k: number) => h.soil_temperature_6cm[k])),
      soilM: mean(hours.map((k: number) => h.soil_moisture_3_to_9cm[k])),
      forecast: date > todayStr,
    };
  });
  const today = Math.max(0, days.findIndex((x) => x.date === todayStr));
  return { days, today, elevation: j.elevation };
}
