import { useTranslation as use18nTranslation } from 'react-i18next';

import { useI18nStore } from './store';

import type { Language, TranslationKey, TranslationValues } from './types';

export const useTranslation = () => {
  const { t, i18n } = use18nTranslation();
  const setLanguage = useI18nStore((state) => state.setLanguage);

  return {
    t: (key: TranslationKey, values?: TranslationValues) => t(key, values),
    language: i18n.language as Language,
    changeLanguage: (lng: Language) => {
      i18n.changeLanguage(lng);
      setLanguage(lng);
    },
  };
};
