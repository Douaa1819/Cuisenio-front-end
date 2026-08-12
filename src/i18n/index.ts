import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  applyDocumentDirection,
  isAppLocale,
  type AppLocale,
} from "./locales"
import fr from "./locales/fr.json"
import en from "./locales/en.json"
import ar from "./locales/ar.json"
import arMA from "./locales/ar-MA.json"

function readInitialLocale(): AppLocale {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isAppLocale(saved)) return saved
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE
}

const initialLocale = readInitialLocale()

void i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    ar: { translation: ar },
    "ar-MA": { translation: arMA },
  },
  lng: initialLocale,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
  returnNull: false,
})

applyDocumentDirection(initialLocale)

i18n.on("languageChanged", (lng) => {
  if (isAppLocale(lng)) {
    localStorage.setItem(LOCALE_STORAGE_KEY, lng)
    applyDocumentDirection(lng)
  }
})

export default i18n
