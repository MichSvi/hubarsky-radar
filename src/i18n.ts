import { createContext, useContext } from 'react';
import type { Lang } from './data/types';
import { STRINGS, type Strings } from './strings';

export { STRINGS, detectLang } from './strings';

export const LangContext = createContext<{ lang: Lang; t: Strings; setLang: (l: Lang) => void }>({
  lang: 'sk', t: STRINGS.sk, setLang: () => {},
});
export const useT = () => useContext(LangContext);
