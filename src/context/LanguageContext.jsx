import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getTranslate } from '../utils/Models';
import { readText, writeText } from './storage';

export const LANGS = ['en', 'az'];
const LANG_KEY = 'default_lang';

const LanguageContext = createContext(null);

const initialLang = () => {
  // Older versions stored the value JSON-encoded ("\"en\"").
  const stored = (readText(LANG_KEY) || '').replace(/"/g, '');
  return LANGS.includes(stored) ? stored : 'en';
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang);
  const [strings, setStrings] = useState({});

  useEffect(() => {
    writeText(LANG_KEY, lang);
    document.documentElement.lang = lang;

    let current = true;
    getTranslate(lang)
      .then((res) => current && setStrings(res.data))
      .catch(() => current && setStrings({}));
    return () => {
      current = false;
    };
  }, [lang]);

  /** Translated UI text: t('only_left', 'Only {n} left', { n: 2 }). */
  const t = useCallback(
    (key, fallback, vars) => {
      let text = strings[key] ?? fallback ?? key;
      for (const [name, value] of Object.entries(vars ?? {})) text = text.replace(`{${name}}`, value);
      return text;
    },
    [strings]
  );

  const value = useMemo(
    () => ({ lang, setLang: (next) => LANGS.includes(next) && setLang(next), t }),
    [lang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return context;
}
