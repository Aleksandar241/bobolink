import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { useI18nStore } from './store';
import { resources, type Language } from './translations/resources';

const DEFAULT_LANGUAGE = 'en';

const getDeviceLanguage = (): Language => {
  const savedLanguage = useI18nStore.getState().language;

  if (savedLanguage) {
    return savedLanguage;
  }

  const deviceLocale = getLocales()[0];
  const deviceLanguage = deviceLocale?.languageCode || DEFAULT_LANGUAGE;

  const supportedLanguages = ['en'];
  const isDeviceLanguageSupported = supportedLanguages.includes(deviceLanguage);

  if (isDeviceLanguageSupported) {
    return deviceLanguage as Language;
  }

  return DEFAULT_LANGUAGE;
};

const init = () => {
  const lng = getDeviceLanguage();

  useI18nStore.getState().setLanguage(lng);
  // eslint-disable-next-line import/no-named-as-default-member
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });
};

init();
