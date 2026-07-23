import { create } from "zustand"
import { persist } from "zustand/middleware"
import { THEME_STORAGE_KEY, applyThemeClass, type ProductTheme } from "../lib/theme"
import { readStoredTheme } from "../lib/theme-storage"

interface ThemeState {
  theme: ProductTheme
  setTheme: (theme: ProductTheme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: readStoredTheme(),
      setTheme: (theme) => {
        applyThemeClass(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const next: ProductTheme = get().theme === "dark" ? "light" : "dark"
        applyThemeClass(next)
        set({ theme: next })
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (s) => ({ theme: s.theme }),
      onRehydrateStorage: () => (state) => {
        applyThemeClass(state?.theme ?? readStoredTheme())
      },
    },
  ),
)

void useThemeStore.persist.onFinishHydration(() => {
  applyThemeClass(useThemeStore.getState().theme)
})

// Ensure DOM matches store on module load (after anti-FOUC script)
applyThemeClass(useThemeStore.getState().theme)
