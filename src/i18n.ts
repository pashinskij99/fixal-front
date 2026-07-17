import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uaTranslations from "./locales/ua.json";
import enTranslations from "./locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    ua: {
      translation: uaTranslations,
    },
    en: {
      translation: enTranslations,
    },
  },
  lng: "ua", // Main language ukraine
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
