import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ny from './locales/ny.json';
import to from './locales/to.json';
import bem from './locales/bem.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ny: { translation: ny },
      to: { translation: to },
      bem: { translation: bem },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;