import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface CookingProgress {
  recipeId: number
  recipePublicId?: string
  title: string
  imageUrl?: string | null
  stepIndex: number
  totalSteps: number
  checkedIngredients: string[]
  updatedAt: number
}

export interface CookedEntry {
  recipeId: number
  title: string
  cookedAt: number
}

interface CookingState {
  active: CookingProgress | null
  history: CookedEntry[]
  streak: number
  lastCookDay: string | null
  start: (payload: Omit<CookingProgress, "updatedAt" | "checkedIngredients"> & { checkedIngredients?: string[] }) => void
  setStep: (stepIndex: number) => void
  toggleIngredient: (name: string) => void
  complete: () => void
  clearActive: () => void
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export const useCookingStore = create<CookingState>()(
  persist(
    (set, get) => ({
      active: null,
      history: [],
      streak: 0,
      lastCookDay: null,

      start: (payload) =>
        set({
          active: {
            ...payload,
            checkedIngredients: payload.checkedIngredients ?? [],
            updatedAt: Date.now(),
          },
        }),

      setStep: (stepIndex) => {
        const active = get().active
        if (!active) return
        set({
          active: { ...active, stepIndex, updatedAt: Date.now() },
        })
      },

      toggleIngredient: (name) => {
        const active = get().active
        if (!active) return
        const has = active.checkedIngredients.includes(name)
        set({
          active: {
            ...active,
            checkedIngredients: has
              ? active.checkedIngredients.filter((n) => n !== name)
              : [...active.checkedIngredients, name],
            updatedAt: Date.now(),
          },
        })
      },

      complete: () => {
        const active = get().active
        if (!active) return
        const day = todayKey()
        const last = get().lastCookDay
        let streak = get().streak
        if (last === day) {
          // already counted today
        } else if (last === yesterdayKey()) {
          streak += 1
        } else {
          streak = 1
        }
        set({
          history: [
            { recipeId: active.recipeId, title: active.title, cookedAt: Date.now() },
            ...get().history,
          ].slice(0, 40),
          streak,
          lastCookDay: day,
          active: null,
        })
      },

      clearActive: () => set({ active: null }),
    }),
    {
      name: "cuisenio-cooking",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
