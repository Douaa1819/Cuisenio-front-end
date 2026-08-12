/**
 * Cuisenio organic identity — aligned with index.css design tokens.
 * Light: cream #FDFBF7 / sage #2E7D32 · Dark: #0B1310 (never pure black)
 */
export type ProductTheme = "dark" | "light"

export const THEME_STORAGE_KEY = "cuisenio-theme"
export const DEFAULT_THEME: ProductTheme = "light"

export const themeTokens = {
  dark: {
    background: "#0B1310",
    card: "#121A16",
    primaryFrom: "#34D399",
    primaryTo: "#2E7D32",
    accent: "#34D399",
    foreground: "#F1F5F9",
    muted: "#94A3B8",
  },
  light: {
    background: "#FDFBF7",
    card: "#FFFFFF",
    primaryFrom: "#2E7D32",
    primaryTo: "#047857",
    accent: "#2E7D32",
    secondary: "#F1F5F9",
    foreground: "#0F172A",
    muted: "#475569",
  },
} as const

export function resolveSystemTheme(): ProductTheme {
  if (typeof window === "undefined") return DEFAULT_THEME
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function applyThemeClass(theme: ProductTheme) {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
  root.dataset.theme = theme
  root.style.colorScheme = theme === "dark" ? "dark" : "light"

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute(
      "content",
      theme === "dark" ? themeTokens.dark.background : themeTokens.light.primaryFrom,
    )
  }
}
