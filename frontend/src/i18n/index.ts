import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './ar.json';
import fr from './fr.json';
import en from './en.json';

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
});

export function getDirection(lng: string): 'rtl' | 'ltr' {
  return lng === 'ar' ? 'rtl' : 'ltr';
}

export default i18n;
