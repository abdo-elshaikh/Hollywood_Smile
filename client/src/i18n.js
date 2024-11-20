// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './locales/en.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector) // Detects the user's language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en
      },
      ar: {
        translation: ar
      }
    },
    fallbackLng: 'ar',
    debug: true,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
