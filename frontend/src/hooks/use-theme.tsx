/**
 * Compatibility shim — Profile / Admin still import useTheme from here.
 * Source of truth is Zustand theme.store + CSS variables.
 */
import { createContext, useContext, type ReactNode } from "react"
import { useThemeStore } from "../store/theme.store"
import type { ProductTheme } from "../lib/theme"

type ThemeProviderState = {
  theme: ProductTheme
  setTheme: (theme: ProductTheme) => void
  toggleTheme: () => void
}

const ThemeProviderContext = createContext<ThemeProviderState | null>(null)

export function ThemeProvider({
  children,
}: {
  children: ReactNode
  defaultTheme?: ProductTheme | "system"
  storageKey?: string
}) {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const storeTheme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const ctx = useContext(ThemeProviderContext)

  return ctx ?? { theme: storeTheme, setTheme, toggleTheme }
}
