/**
 * Product themes for Cuisenio.
 * - dark  → coral / charcoal (default brand)
 * - light → sage green / warm paper
 */
export type ProductTheme = "dark" | "light"

export const THEME_STORAGE_KEY = "cuisenio-theme"

export const themeTokens = {
  dark: {
    background: "#0A0A0A",
    card: "#141414",
    primaryFrom: "#E8615C",
    primaryTo: "#C93A3A",
    foreground: "#FAFAFA",
    muted: "#A3A3A3",
  },
  light: {
    background: "#FAFAF7",
    card: "#FFFFFF",
    primaryFrom: "#2F7A4D",
    primaryTo: "#4CAF6D",
    secondary: "#B8D8A8",
    foreground: "#1A1A1A",
    muted: "#5C5C5C",
  },
} as const

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
      theme === "dark" ? themeTokens.dark.primaryFrom : themeTokens.light.primaryFrom,
    )
  }
}
