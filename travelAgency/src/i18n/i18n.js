import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationsEN from './en/en.json'
import translationsAR from './ar/ar.json'

export const supportedLngs = {
  ar: "Ar",
  en: "En",
};

const resources = {
  ar: {
    translation: translationsAR
  },
  en: {
    translation: translationsEN
  }
};

i18n
.use(Backend)
.use(LanguageDetector)
.use(initReactI18next)
.init({
  resources,
  fallbackLng: 'ar',
  debug: false,
  saveMissing:false,
  interpolation: {
    escapeValue: false,
  },
  // detection: {
  //   // order: ['navigator'],
  //   lookupFromPathIndex: 0,
  //   checkWhitelist: true,
  // },
  // backend: {
  //   projectId: 'b4270b61-2ba5-4308-9d59-7b9f4f555f4c',
  //   apiKey: 'a1aa5788-281d-4a69-9eb6-7909c8f95b43',
  // },
  react: {
    useSuspense: false,
  },
  });


export default i18n;