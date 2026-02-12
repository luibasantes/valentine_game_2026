import { create } from 'zustand';
import { en, es } from '../i18n/translations';
import type { Translations } from '../i18n/translations';

type Lang = 'en' | 'es';

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: 'en',
  setLang: (lang) => set({ lang }),
}));

const translations: Record<Lang, Translations> = { en, es };

export function useT(): Translations {
  const lang = useLangStore((s) => s.lang);
  return translations[lang];
}
