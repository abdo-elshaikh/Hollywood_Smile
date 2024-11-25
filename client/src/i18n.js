import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './locales/en.json';
import ar from './locales/ar.json';

i18n
  .use(initReactI18next) // Integrates i18n with React
  .use(LanguageDetector) // Detects browser language settings
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: localStorage.getItem('language') || 'ar', // Default to Arabic if no language is set in localStorage
    fallbackLng: 'en', // Use English as a fallback
    supportedLngs: ['en', 'ar'], // List of supported languages
    detection: {
      // Language detection settings
      order: ['localStorage', 'navigator', 'htmlTag'], // Prioritize localStorage, then browser settings
      caches: ['localStorage'], // Cache detected language in localStorage
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
