import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import eng from './locales/english.json';
import rus from './locales/russian.json';

i18n
  .use(initReactI18next)
  .init({
    interpolation: {
      escapeValue: false
    }, // необходимо для поддержки React-компонентов в переводах
    lng: 'russian', // язык по умолчанию
    resources: {
      english: {
        translation: eng
      },
      russian: {
        translation: rus
      }
      // Добавьте другие языки здесь
    }
  });

export default i18n;
