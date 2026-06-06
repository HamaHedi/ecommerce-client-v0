import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "fr",
        debug: false,
        supportedLngs: ["fr", "en", "ar"],
        detection: {
            order: ["querystring", "localStorage", "navigator", "htmlTag"],
            lookupQuerystring: "lng",
            caches: ["localStorage"],
        },
        ns: [
            "auth",
            "cart",
            "footer",
            "header",
            "product",
            "sidebar",
            "user",
            "contact",
            "home"
        ],
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
