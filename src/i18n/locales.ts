export const APP_LOCALES = ["fr", "en", "ar", "ar-MA"] as const

export type AppLocale = (typeof APP_LOCALES)[number]

export const LOCALE_META: Record<
  AppLocale,
  { label: string; short: string; dir: "ltr" | "rtl"; htmlLang: string }
> = {
  fr: { label: "Français", short: "FR", dir: "ltr", htmlLang: "fr" },
  en: { label: "English", short: "EN", dir: "ltr", htmlLang: "en" },
  ar: { label: "العربية", short: "AR", dir: "rtl", htmlLang: "ar" },
  "ar-MA": { label: "الدارجة", short: "Darija", dir: "rtl", htmlLang: "ar-MA" },
}

export const LOCALE_STORAGE_KEY = "ui-locale"
export const DEFAULT_LOCALE: AppLocale = "fr"

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return APP_LOCALES.includes(value as AppLocale)
}

export function applyDocumentDirection(locale: AppLocale) {
  const meta = LOCALE_META[locale]
  const root = document.documentElement
  root.lang = meta.htmlLang
  root.dir = meta.dir
  root.dataset.locale = locale
}
