import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./en.json";
import arTranslation from "./ar.json";

const resources = {
  en: enTranslation,
  ar: arTranslation,
};

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    localePath: "locales",
    lng: "en",
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

// const i18n = new I18n({ ...translations, locale: "ar" });
// i18n.locale = "en" || "ar";

const changeLanguage = (locale) => {
  i18n.changeLanguage(locale);
};

export { changeLanguage };
