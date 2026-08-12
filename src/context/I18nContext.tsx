import { I18nextProvider, useTranslation } from "react-i18next"
import i18n from "../i18n"
import { isAppLocale, type AppLocale } from "../i18n/locales"

interface I18nContextValue {
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
  t: (key: string) => string
}

/** Backward-compatible provider — source of truth is react-i18next. */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

export function useI18n(): I18nContextValue {
  const { t, i18n: instance } = useTranslation()
  const locale = (isAppLocale(instance.language) ? instance.language : "fr") as AppLocale

  return {
    locale,
    setLocale: (next) => {
      void instance.changeLanguage(next)
    },
    t: (key) => t(key),
  }
}

export type { AppLocale }
