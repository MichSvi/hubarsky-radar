import { useEffect, useState } from 'react';
import type { Lookalike, Species } from '../data/types';
import { useT } from '../i18n';
import { inatTaxonUrl } from '../lib/inat';
import { level, type Score } from '../lib/score';
import { Bar, Chance, EdibilityBadge, SeasonBar, Thumb, useTaxon } from './common';

interface Props {
  sp: Species;
  score?: Score;
  series?: { date: string; p: number }[];
  onClose: () => void;
}

export default function SpeciesDetail({ sp, score, series, onClose }: Props) {
  const { t, lang } = useT();
  const info = useTaxon(sp.latin);
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const ph = info?.photos[photo];
  const name = lang === 'sk' ? sp.sk : sp.en;

  return (
    <div className="modal-bg" onClick={onClose}>
      <article className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={name}>
        <button className="close" onClick={onClose} aria-label={t.close}>✕</button>
        <div className="gallery">
          {ph ? <img src={ph.large} alt={name} /> : <div className="noimg">🍄</div>}
          {ph && <p className="attr">{ph.attribution}</p>}
          {info && info.photos.length > 1 && (
            <div className="strip">
              {info.photos.map((p, i) => (
                <button key={i} className={i === photo ? 'sel' : ''} onClick={() => setPhoto(i)}>
                  <img src={p.url} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="body">
          <header>
            <h2>{name}</h2>
            <p className="latin">{sp.latin}{lang === 'sk' ? ` · ${sp.en}` : ` · ${sp.sk}`}</p>
            <div className="row">
              <EdibilityBadge e={sp.edibility} />
              {score && <><span className="muted">{t.chance}:</span> <Chance p={score.p} /></>}
            </div>
          </header>

          {sp.note && <p className={`note ed-${sp.edibility}`}>{sp.note[lang]}</p>}

          {score && (
            <section>
              <div className="factors">
                {(Object.keys(score.factors) as (keyof Score['factors'])[]).map((k) => (
                  <Bar key={k} label={t.factors[k]} value={score.factors[k]} />
                ))}
              </div>
              {series && (
                <div className="mini-forecast">
                  {series.map((d, i) => (
                    <div key={d.date} className="mf">
                      <div className="col"><div style={{ height: `${Math.max(4, d.p * 100)}%` }} className={`lvbg-${level(d.p)}`} /></div>
                      <span>{i === 0 ? t.today : t.daysShort[new Date(d.date + 'T12:00').getDay()]}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <section>
            <h3>{t.id}</h3>
            <ul className="features">{sp.features[lang].map((f, i) => <li key={i}>{f}</li>)}</ul>
          </section>

          <section>
            <h3>{t.where}</h3>
            <p>{sp.where[lang]}</p>
            <p><b>{t.hosts}:</b> {sp.hosts.map((h) => t.trees[h]).join(', ')}</p>
            <p><b>{t.altitude}:</b> {sp.altitude[0]}–{sp.altitude[1]} m</p>
            <SeasonBar sp={sp} />
          </section>

          <section>
            <h3>⚠️ {t.lookalikes}</h3>
            {sp.lookalikes.length === 0 && <p className="muted">{t.noLookalikes}</p>}
            {sp.lookalikes.map((l) => <LookalikeCard key={l.latin} l={l} />)}
          </section>

          <p className="muted small">
            {t.photos} · <a href={inatTaxonUrl(sp.latin)} target="_blank" rel="noreferrer">{t.moreOn} ↗</a>
          </p>
        </div>
      </article>
    </div>
  );
}


function LookalikeCard({ l }: { l: Lookalike }) {
  const { lang } = useT();
  return (
    <div className={`lookalike ed-${l.edibility}`}>
      <a href={inatTaxonUrl(l.latin)} target="_blank" rel="noreferrer"><Thumb latin={l.latin} size={84} /></a>
      <div>
        <div className="row">
          <b>{lang === 'sk' ? l.sk : l.en}</b>
          <EdibilityBadge e={l.edibility} />
        </div>
        <p className="latin">{l.latin}</p>
        <p>{l.diff[lang]}</p>
      </div>
    </div>
  );
}
