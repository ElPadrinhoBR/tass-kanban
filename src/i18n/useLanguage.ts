import { create } from 'zustand';
import { Language, Translations } from './types';
import { LOCALES, DEFAULT_LANGUAGE } from './index';

/** Chave usada para persistir o idioma escolhido no navegador. */
const STORAGE_KEY = 'tass_language_v1';

interface LanguageStore {
  /** Idioma atualmente ativo. */
  lang: Language;
  /** Dicionário de traduções do idioma ativo. */
  t: Translations;
  /** Altera o idioma da aplicação e persiste a escolha. */
  setLang: (lang: Language) => void;
}

function loadLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && (saved === 'pt' || saved === 'en' || saved === 'es')) return saved;
  } catch {
    // localStorage não disponível (ex: SSR / privado)
  }
  return DEFAULT_LANGUAGE;
}

export const useLanguageStore = create<LanguageStore>((set) => {
  const initial = loadLanguage();
  return {
    lang: initial,
    t: LOCALES[initial],
    setLang: (lang: Language) => {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // ignore
      }
      set({ lang, t: LOCALES[lang] });
    },
  };
});
