import ReactDOM from "react-dom/client";
import './index.css';
import App from "./views/main_window";
import {initReactI18next} from 'react-i18next';
import i18n from 'i18next';
i18n
    .use(initReactI18next)
    .init({
        interpolation: {
            escapeValue: false
        }, // необходимо для поддержки React-компонентов в переводах
        lng: 'ru', // язык по умолчанию
        resources: {
            en: {
                translation: require('./locales/en.json')
            },
            ru: {
                translation: require('./locales/ru.json')
            },
            // Добавьте другие языки здесь
        }
    });

export const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);