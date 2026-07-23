import {
  THEME_STORAGE_KEY,
  applyThemeClass,
  type ProductTheme,
} from "./theme"

/** Parse theme from localStorage — supports plain string or Zustand persist JSON. */
export function readStoredTheme(): ProductTheme {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (!raw) {
      const legacy = localStorage.getItem("ui-theme")
      if (legacy === "light") return "light"
      if (legacy === "dark") return "dark"
      return "dark"
    }
    if (raw === "light" || raw === "dark") return raw
    const parsed = JSON.parse(raw) as { state?: { theme?: string } } | string
    if (typeof parsed === "string" && (parsed === "light" || parsed === "dark")) {
      return parsed
    }
    if (parsed && typeof parsed === "object" && parsed.state?.theme) {
      return parsed.state.theme === "light" ? "light" : "dark"
    }
  } catch {
    /* ignore */
  }
  return "dark"
}

export { THEME_STORAGE_KEY, applyThemeClass, themeTokens } from "./theme"
export type { ProductTheme } from "./theme"
