import { createPersistStore } from '@/src/store/createStore';

import { type Language } from './translations/resources';

type I18nState = {
  language: null | Language;
  setLanguage: (language: Language) => void;
};

export const useI18nStore = createPersistStore<I18nState>(
  (set) => ({
    language: null,
    setLanguage: (language: Language) => set({ language }),
  }),
  'i18n-storage'
);
