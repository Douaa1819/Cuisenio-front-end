import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface RecentRecipe {
  id: number
  publicId?: string
  title: string
  imageUrl?: string | null
  viewedAt: number
}

interface RecentlyViewedState {
  items: RecentRecipe[]
  add: (recipe: Omit<RecentRecipe, "viewedAt">) => void
  clear: () => void
}

const MAX = 12

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (recipe) => {
        const next = [
          { ...recipe, viewedAt: Date.now() },
          ...get().items.filter((r) => r.id !== recipe.id),
        ].slice(0, MAX)
        set({ items: next })
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "cuisenio-recently-viewed",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
