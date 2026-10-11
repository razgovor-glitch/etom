import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translate, formatNumber, type Locale, type TranslationKey } from './dictionaries';

export type TParams = Record<string, string | number>;
export type T = (key: TranslationKey, params?: TParams) => string;

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
  t: T;
  /** Locale-aware number formatting. */
  fmt: (n: number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'moda-locale';

function initialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ru') return stored;
    return navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en';
  } catch {
    return 'en';
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = translate(locale, 'doc.title');
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage unavailable — the locale still applies for this session */
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const toggle = useCallback(
    () => setLocaleState((prev) => (prev === 'en' ? 'ru' : 'en')),
    [],
  );
  const t = useMemo<T>(() => (key, params) => translate(locale, key, params), [locale]);

  const fmt = useMemo(() => (n: number) => formatNumber(locale, n), [locale]);
  const value = useMemo<I18nValue>(
    () => ({ locale, setLocale, toggle, t, fmt }),
    [locale, setLocale, toggle, t, fmt],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}