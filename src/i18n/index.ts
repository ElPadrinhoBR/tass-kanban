import { Language, Translations } from './types';
import { pt } from './locales/pt';
import { en } from './locales/en';
import { es } from './locales/es';

export * from './types';

export const LOCALES: Record<Language, Translations> = {
  pt,
  en,
  es,
};

export const DEFAULT_LANGUAGE: Language = 'pt';

export const LANGUAGE_OPTIONS: { id: Language; label: string; flag: string }[] = [
  { id: 'pt', label: 'Português', flag: '🇧🇷' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
];

export function getTranslations(lang: Language): Translations {
  return LOCALES[lang] || LOCALES.pt;
}
