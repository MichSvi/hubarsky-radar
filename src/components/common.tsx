import { useEffect, useState } from 'react';
import type { Edibility, Species } from '../data/types';
import { useT } from '../i18n';
import { toggleFavorite, useFavorites } from '../lib/favorites';
import { getTaxon, type TaxonInfo } from '../lib/inat';
import { inMonths, level } from '../lib/score';

export function useTaxon(latin: string) {
  const { lang } = useT();
  const [info, setInfo] = useState<TaxonInfo | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    getTaxon(latin, lang).then((i) => alive && setInfo(i));
    return () => { alive = false; };
  }, [latin, lang]);
  return info;
}

export function Thumb({ latin, size = 64 }: { latin: string; size?: number }) {
  const info = useTaxon(latin);
  const ph = info?.photos[0];
  return (
    <div className="thumb" style={{ width: size, height: size }}>
      {ph ? <img src={ph.url} alt={latin} loading="lazy" title={ph.attribution} /> : <span aria-hidden>🍄</span>}
    </div>
  );
}

export function EdibilityBadge({ e }: { e: Edibility }) {
  const { t } = useT();
  const icon = { choice: '★', edible: '✓', caution: '!', inedible: '✕', toxic: '☠', deadly: '☠' }[e];
  return <span className={`badge ed-${e}`}>{icon} {t.edibility[e]}</span>;
}

export function Chance({ p }: { p: number }) {
  const { t } = useT();
  const l = level(p);
  return (
    <span className={`chance lv-${l}`} title={t.level[l]}>
      {Math.round(p * 100)}<small>%</small>
    </span>
  );
}

export function SeasonBar({ sp }: { sp: Species }) {
  const { t } = useT();
  const now = new Date().getMonth() + 1;
  return (
    <div className="season" aria-label={t.seasonChart}>
      {t.months.map((m, i) => {
        const mo = i + 1;
        const cls = inMonths(mo, sp.peak) ? 'peak' : inMonths(mo, sp.season) ? 'on' : '';
        return (
          <div key={i} className={`mo ${cls} ${mo === now ? 'now' : ''}`}>
            <div className="bar" />
            <span>{m}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Bar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(Math.min(1, value) * 100);
  return (
    <div className="fbar">
      <span>{label}</span>
      <div className="track"><div className="fill" style={{ width: `${pct}%`, background: `var(--lv-${level(Math.min(1, value) * 0.8)})` }} /></div>
      <b>{pct}</b>
    </div>
  );
}

export function FavStar({ id, big }: { id: string; big?: boolean }) {
  const { t } = useT();
  const on = useFavorites().includes(id);
  return (
    <button
      type="button"
      className={`fav ${on ? 'on' : ''} ${big ? 'big' : ''}`}
      aria-pressed={on}
      title={on ? t.removeFav : t.addFav}
      aria-label={on ? t.removeFav : t.addFav}
      onClick={(e) => { e.stopPropagation(); toggleFavorite(id); }}
    >
      {on ? '★' : '☆'}
    </button>
  );
}
