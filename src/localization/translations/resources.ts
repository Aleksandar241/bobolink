import en from './en.json';
import sr from './sr.json';

export type Language = 'en' | 'sr';
export type TranslationKeys = typeof en;

export const resources: Record<Language, { translation: TranslationKeys }> = {
  en: {
    translation: en,
  },
  sr: {
    translation: sr,
  },
};
