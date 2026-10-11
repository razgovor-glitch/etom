import type { Locale } from './dictionaries';

/**
 * MODA domain names are official TM Forum names, so the English form is always
 * shown. In Russian we append a gloss rather than replacing it — an
 * architecture reference is useless if you cannot trace a label back to the
 * published model.
 */
const DOMAIN_RU: Record<string, string> = {
  'Market & Sales': 'Рынки и продажи',
  Customer: 'Клиенты',
  Product: 'Продукты',
  Service: 'Услуги',
  Resource: 'Ресурсы',
  'Business Partner': 'Бизнес-партнёры',
  Enterprise: 'Предприятие',
  Integration: 'Интеграция',
  Common: 'Общее',
  Shared: 'Общие ресурсы',
};

/** "Market & Sales · Рынки и продажи" */
export function domainLabel(locale: Locale, domain: string): string {
  const gloss = locale === 'ru' ? DOMAIN_RU[domain] : undefined;
  return gloss ? `${domain} · ${gloss}` : domain;
}

/** "Рынки и продажи" — for compact chips and tags. */
export function domainShort(locale: Locale, domain: string): string {
  return locale === 'ru' ? (DOMAIN_RU[domain] ?? domain) : domain;
}