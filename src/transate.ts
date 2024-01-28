import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import eng from "./locales/en.json"
import rus from "./locales/ru.json"

i18n
    .use(initReactI18next)
    .init({
        interpolation: {
            escapeValue: false
        }, // необходимо для поддержки React-компонентов в переводах
        lng: 'ru', // язык по умолчанию
        resources: {
            en: {
                translation: eng
            },
            ru: {
                translation: rus
            },
            // Добавьте другие языки здесь
        }
    });

export default i18n;

