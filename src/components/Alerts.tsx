import { useEffect, useState } from 'react';
import { SPECIES } from '../data/species';
import { useT } from '../i18n';
import { formatDate, getPlaces, savePlaces, type Hit, type WatchedPlace } from '../lib/alerts';
import { enableNotifications, notifSupported, runPageCheck } from '../lib/notify';

const EDIBLE = SPECIES.filter((s) => ['choice', 'edible', 'caution'].includes(s.edibility));

export default function Alerts() {
  const { t, lang } = useT();
  const [places, setPlaces] = useState<WatchedPlace[]>([]);
  const [perm, setPerm] = useState<NotificationPermission | 'unsupported'>(notifSupported() ? Notification.permission : 'unsupported');
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { getPlaces().then(setPlaces); }, []);

  const update = async (next: WatchedPlace[]) => {
    setPlaces(next);
    await savePlaces(next);
  };
  const patch = (id: string, p: Partial<WatchedPlace>) => update(places.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const check = async () => {
    setBusy(true);
    try {
      setHits(await runPageCheck(true));
      setPlaces(await getPlaces());
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <section className="card">
        <h2>{t.alertsTitle}</h2>
        <p>{t.alertsIntro}</p>
        <div className="row">
          {perm === 'unsupported' && <p className="muted">{t.notifUnsupported}</p>}
          {perm === 'denied' && <p className="warn">{t.notifDenied}</p>}
          {perm === 'default' && <button className="btn" onClick={async () => setPerm(await enableNotifications())}>🔔 {t.enableNotif}</button>}
          {perm === 'granted' && <span className="tag ok">✓ {t.notifOn}</span>}
          <button className="btn ghost" onClick={check} disabled={busy || !places.length}>{busy ? '…' : t.testNotif}</button>
        </div>
        <p className="muted small">{t.platformNote}</p>
        {hits && hits.length === 0 && <p className="muted">{t.nothingNow}</p>}
        {hits?.map((h) => (
          <div key={h.place.id} className="hit">
            <b>{h.place.name}:</b> {h.species.map((s) => `${s.name} ${Math.round(s.p * 100)} % (${formatDate(s.date, lang)})`).join(', ')}
          </div>
        ))}
      </section>

      {places.length === 0 && <section className="card"><p className="muted">{t.noPlaces}</p></section>}
      {places.map((p) => (
        <section key={p.id} className="card">
          <div className="place-head">
            <h3>📍 {p.name}</h3>
            <button className="btn ghost" onClick={() => update(places.filter((x) => x.id !== p.id))}>{t.remove}</button>
          </div>
          <p className="muted small">
            {t.forest[p.forest]} · {p.lat.toFixed(3)}, {p.lon.toFixed(3)}
            {p.lastCheck && <> · {t.lastCheck}: {new Date(p.lastCheck).toLocaleString(lang)}</>}
          </p>
          <label className="row">
            {t.threshold}:
            <select value={p.threshold} onChange={(e) => patch(p.id, { threshold: Number(e.target.value) })}>
              {[0.3, 0.4, 0.5, 0.6, 0.7].map((v) => <option key={v} value={v}>{Math.round(v * 100)} %</option>)}
            </select>
          </label>
          <p className="small"><b>{t.speciesFilter}:</b> {p.species.length === 0 && <span className="muted">{t.anyEdible}</span>}</p>
          <div className="chips">
            {EDIBLE.map((s) => {
              const on = p.species.includes(s.id);
              return (
                <button key={s.id} className={`chip ${on ? 'on' : ''}`}
                  onClick={() => patch(p.id, { species: on ? p.species.filter((x) => x !== s.id) : [...p.species, s.id] })}>
                  {lang === 'sk' ? s.sk : s.en}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
