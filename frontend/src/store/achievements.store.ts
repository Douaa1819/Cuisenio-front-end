import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type AchievementId =
  | "first_cook"
  | "streak_3"
  | "streak_7"
  | "cook_5"
  | "shopper"
  | "explorer"

export interface Achievement {
  id: AchievementId
  title: string
  description: string
  unlockedAt?: number
}

export const ACHIEVEMENT_CATALOG: Omit<Achievement, "unlockedAt">[] = [
  { id: "first_cook", title: "Première fournée", description: "Terminez une recette en mode cuisine." },
  { id: "streak_3", title: "Série de 3", description: "Cuisinez 3 jours d'affilée." },
  { id: "streak_7", title: "Chef régulier", description: "Cuisinez 7 jours d'affilée." },
  { id: "cook_5", title: "Cinq plats", description: "Complétez 5 recettes." },
  { id: "shopper", title: "Courses organisées", description: "Ajoutez 5 articles à la liste." },
  { id: "explorer", title: "Explorateur", description: "Consultez 8 recettes différentes." },
]

interface AchievementsState {
  unlocked: Partial<Record<AchievementId, number>>
  toastQueue: Achievement[]
  evaluate: (ctx: { cookCount: number; streak: number; shoppingCount: number; viewedCount: number }) => void
  dismissToast: () => void
}

export function achievementsFromUnlocked(
  unlocked: Partial<Record<AchievementId, number>>,
): Achievement[] {
  return ACHIEVEMENT_CATALOG.map((a) => ({
    ...a,
    unlockedAt: unlocked[a.id],
  }))
}

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      unlocked: {},
      toastQueue: [],

      dismissToast: () => set({ toastQueue: get().toastQueue.slice(1) }),

      evaluate: (ctx) => {
        const checks: [AchievementId, boolean][] = [
          ["first_cook", ctx.cookCount >= 1],
          ["streak_3", ctx.streak >= 3],
          ["streak_7", ctx.streak >= 7],
          ["cook_5", ctx.cookCount >= 5],
          ["shopper", ctx.shoppingCount >= 5],
          ["explorer", ctx.viewedCount >= 8],
        ]
        const unlocked = { ...get().unlocked }
        const newly: Achievement[] = []
        for (const [id, ok] of checks) {
          if (ok && !unlocked[id]) {
            unlocked[id] = Date.now()
            const meta = ACHIEVEMENT_CATALOG.find((c) => c.id === id)!
            newly.push({ ...meta, unlockedAt: unlocked[id] })
          }
        }
        if (newly.length) {
          set({ unlocked, toastQueue: [...get().toastQueue, ...newly] })
        }
      },
    }),
    {
      name: "cuisenio-achievements",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ unlocked: s.unlocked }),
    },
  ),
)
