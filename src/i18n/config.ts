import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './locales/es.json';
import en from './locales/en.json';
import pt from './locales/pt.json';

const resources = {
  es: {
    translation: es,
  },
  en: {
    translation: en,
  },
  pt: {
    translation: pt,
  },
};

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Idioma por defecto
    lng: localStorage.getItem('language') || 'en', // Idioma guardado o por defecto
    debug: false,
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
  });

export default i18n;

