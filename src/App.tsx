import { useEffect, useMemo, useState } from 'react';
import type { Lang } from './data/types';
import { detectLang, LangContext, STRINGS } from './i18n';
import { runPageCheck } from './lib/notify';
import * as store from './lib/store';
import Forecast from './components/Forecast';
import Atlas from './components/Atlas';
import Alerts from './components/Alerts';
import Method from './components/Method';

type Tab = 'forecast' | 'atlas' | 'alerts' | 'method';
const TAB_ICONS: Record<Tab, string> = { forecast: '🗺️', atlas: '🍄', alerts: '🔔', method: 'ℹ️' };

export default function App() {
  const [lang, setLangState] = useState<Lang>(detectLang);
  const [tab, setTab] = useState<Tab>('forecast');
  const t = STRINGS[lang];

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('lang', l); } catch {}
    store.set('lang', l).catch(() => {});
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.appName;
    store.set('lang', lang).catch(() => {});
  }, [lang, t.appName]);

  // Check watched places when the app opens (at most every 3 hours) – works on every platform.
  useEffect(() => {
    runPageCheck(false, 3).catch(() => {});
  }, []);

  const ctx = useMemo(() => ({ lang, t, setLang }), [lang, t]);

  return (
    <LangContext.Provider value={ctx}>
      <header className="top">
        <div className="brand">
          <img src="./icon.svg" alt="" width={36} height={36} />
          <div>
            <h1>{t.appName}</h1>
            <p>{t.tagline}</p>
          </div>
        </div>
        <button className="lang" onClick={() => setLang(lang === 'sk' ? 'en' : 'sk')} aria-label="Language">
          {t.lang}
        </button>
      </header>
      <nav className="tabs" role="tablist">
        {(Object.keys(t.tabs) as Tab[]).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            className={tab === k ? 'active' : ''}
            onClick={() => { setTab(k); window.scrollTo({ top: 0 }); }}
          >
            <span className="tab-icon" aria-hidden>{TAB_ICONS[k]}</span>
            <span className="tab-long">{t.tabs[k]}</span>
            <span className="tab-short">{t.tabsShort[k]}</span>
          </button>
        ))}
      </nav>
      <main>
        {/* Forecast stays mounted so the map and loaded data survive tab switches. */}
        <div hidden={tab !== 'forecast'}><Forecast /></div>
        {tab === 'atlas' && <Atlas />}
        {tab === 'alerts' && <Alerts />}
        {tab === 'method' && <Method />}
      </main>
      <footer>
        <p className="disclaimer">⚠️ {t.disclaimer}</p>
        <p className="muted">{t.sources}</p>
      </footer>
    </LangContext.Provider>
  );
}
