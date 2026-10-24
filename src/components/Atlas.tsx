import { useState } from 'react';
import { SPECIES } from '../data/species';
import type { Edibility, Species } from '../data/types';
import { useT } from '../i18n';
import { useFavorites } from '../lib/favorites';
import { inMonths } from '../lib/score';
import { EdibilityBadge, FavStar, SeasonBar, Thumb } from './common';
import SpeciesDetail from './SpeciesDetail';

type Filter = 'all' | 'favorites' | 'edible' | 'dangerous' | 'season';
const EDIBLE: Edibility[] = ['choice', 'edible', 'caution'];

export default function Atlas() {
  const { t, lang } = useT();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Species | null>(null);
  const favorites = useFavorites();
  const month = new Date().getMonth() + 1;

  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const list = SPECIES.filter((s) => {
    if (q && !norm(`${s.sk} ${s.en} ${s.latin}`).includes(norm(q))) return false;
    if (filter === 'favorites') return favorites.includes(s.id);
    if (filter === 'edible') return EDIBLE.includes(s.edibility);
    if (filter === 'dangerous') return s.edibility === 'toxic' || s.edibility === 'deadly';
    if (filter === 'season') return inMonths(month, s.season);
    return true;
  }).sort((x, y) => Number(favorites.includes(y.id)) - Number(favorites.includes(x.id)));

  const labels: Record<Filter, string> = {
    all: t.all,
    favorites: `★ ${t.favorites}`,
    edible: t.onlyEdible,
    dangerous: `☠ ${t.edibility.toxic}`,
    season: t.inSeasonNow,
  };

  return (
    <div>
      <section className="card">
        <input className="full" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.atlasSearch} aria-label={t.atlasSearch} />
        <div className="chips">
          {(Object.keys(labels) as Filter[]).map((f) => (
            <button key={f} className={`chip ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>{labels[f]}</button>
          ))}
        </div>
      </section>
      <div className="grid">
        {list.map((s) => (
          <div key={s.id} className="tile-wrap">
            <button className="card tile" onClick={() => setSelected(s)}>
              <Thumb latin={s.latin} size={300} />
              <b>{lang === 'sk' ? s.sk : s.en}</b>
              <i>{s.latin}</i>
              <EdibilityBadge e={s.edibility} />
              <SeasonBar sp={s} />
            </button>
            <FavStar id={s.id} />
          </div>
        ))}
      </div>
      {selected && <SpeciesDetail sp={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
