import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from '../../locales/ar/translation.json' assert { type: 'json' };
import de from '../../locales/de/translation.json' assert { type: 'json' };
import en from '../../locales/en/translation.json' assert { type: 'json' };
import es from '../../locales/es/translation.json' assert { type: 'json' };
import fr from '../../locales/fr/translation.json' assert { type: 'json' };
import hi from '../../locales/hi/translation.json' assert { type: 'json' };
import ja from '../../locales/ja/translation.json' assert { type: 'json' };
import ru from '../../locales/ru/translation.json' assert { type: 'json' };
import tr from '../../locales/tr/translation.json' assert { type: 'json' };
import zh from '../../locales/zh/translation.json' assert { type: 'json' };

const resources = {
  ar: { translation: ar },
  de: { translation: de },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  hi: { translation: hi },
  ja: { translation: ja },
  ru: { translation: ru },
  tr: { translation: tr },
  zh: { translation: zh },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['ar', 'de', 'en', 'es', 'fr', 'hi', 'ja', 'ru', 'tr', 'zh'],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n; 