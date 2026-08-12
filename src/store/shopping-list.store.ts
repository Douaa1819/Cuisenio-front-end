import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface ShoppingItem {
  id: string
  name: string
  quantity?: string
  unit?: string
  recipeTitle?: string
  checked: boolean
}

interface ShoppingListState {
  items: ShoppingItem[]
  addItems: (items: Omit<ShoppingItem, "id" | "checked">[]) => void
  toggle: (id: string) => void
  remove: (id: string) => void
  clearChecked: () => void
  clearAll: () => void
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set, get) => ({
      items: [],
      addItems: (incoming) => {
        const existing = get().items
        const merged = [...existing]
        for (const item of incoming) {
          const key = item.name.toLowerCase()
          const found = merged.find((m) => m.name.toLowerCase() === key && !m.checked)
          if (found) continue
          merged.push({
            ...item,
            id: crypto.randomUUID(),
            checked: false,
          })
        }
        set({ items: merged })
      },
      toggle: (id) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
        }),
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clearChecked: () => set({ items: get().items.filter((i) => !i.checked) }),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: "cuisenio-shopping-list",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
