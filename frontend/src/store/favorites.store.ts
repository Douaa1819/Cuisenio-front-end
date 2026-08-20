import { create } from "zustand"
import { persist } from "zustand/middleware"

export type FavoriteSort = "recent" | "cooked" | "rating"

export interface FavoriteCollection {
  id: string
  name: string
  recipeIds: number[]
  createdAt: number
}

export interface FavoriteMeta {
  recipeId: number
  savedAt: number
  cookCount: number
  rating?: number
  collectionIds: string[]
}

interface FavoritesState {
  items: FavoriteMeta[]
  collections: FavoriteCollection[]
  sort: FavoriteSort
  activeCollectionId: string | null
  setSort: (sort: FavoriteSort) => void
  setActiveCollection: (id: string | null) => void
  toggleFavorite: (recipeId: number) => void
  isFavorite: (recipeId: number) => boolean
  recordCook: (recipeId: number) => void
  setRating: (recipeId: number, rating: number) => void
  createCollection: (name: string) => string
  renameCollection: (id: string, name: string) => void
  deleteCollection: (id: string) => void
  addToCollection: (collectionId: string, recipeId: number) => void
  removeFromCollection: (collectionId: string, recipeId: number) => void
  sortedIds: () => number[]
}

const DEFAULT_COLLECTION: FavoriteCollection = {
  id: "all",
  name: "Tous les favoris",
  recipeIds: [],
  createdAt: 0,
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      collections: [DEFAULT_COLLECTION],
      sort: "recent",
      activeCollectionId: "all",

      setSort: (sort) => set({ sort }),
      setActiveCollection: (id) => set({ activeCollectionId: id }),

      isFavorite: (recipeId) => get().items.some((i) => i.recipeId === recipeId),

      toggleFavorite: (recipeId) => {
        const exists = get().items.some((i) => i.recipeId === recipeId)
        if (exists) {
          set({
            items: get().items.filter((i) => i.recipeId !== recipeId),
            collections: get().collections.map((c) => ({
              ...c,
              recipeIds: c.recipeIds.filter((id) => id !== recipeId),
            })),
          })
        } else {
          set({
            items: [
              {
                recipeId,
                savedAt: Date.now(),
                cookCount: 0,
                collectionIds: ["all"],
              },
              ...get().items,
            ],
          })
        }
      },

      recordCook: (recipeId) => {
        const items = get().items
        const found = items.find((i) => i.recipeId === recipeId)
        if (!found) {
          set({
            items: [
              { recipeId, savedAt: Date.now(), cookCount: 1, collectionIds: ["all"] },
              ...items,
            ],
          })
          return
        }
        set({
          items: items.map((i) =>
            i.recipeId === recipeId ? { ...i, cookCount: i.cookCount + 1 } : i,
          ),
        })
      },

      setRating: (recipeId, rating) => {
        const items = get().items
        if (!items.some((i) => i.recipeId === recipeId)) {
          set({
            items: [
              {
                recipeId,
                savedAt: Date.now(),
                cookCount: 0,
                rating,
                collectionIds: ["all"],
              },
              ...items,
            ],
          })
          return
        }
        set({
          items: items.map((i) => (i.recipeId === recipeId ? { ...i, rating } : i)),
        })
      },

      createCollection: (name) => {
        const id = `col-${Date.now()}`
        set({
          collections: [
            ...get().collections,
            { id, name: name.trim() || "Nouvelle collection", recipeIds: [], createdAt: Date.now() },
          ],
        })
        return id
      },

      renameCollection: (id, name) => {
        if (id === "all") return
        set({
          collections: get().collections.map((c) =>
            c.id === id ? { ...c, name: name.trim() || c.name } : c,
          ),
        })
      },

      deleteCollection: (id) => {
        if (id === "all") return
        set({
          collections: get().collections.filter((c) => c.id !== id),
          activeCollectionId:
            get().activeCollectionId === id ? "all" : get().activeCollectionId,
        })
      },

      addToCollection: (collectionId, recipeId) => {
        if (!get().isFavorite(recipeId)) get().toggleFavorite(recipeId)
        set({
          collections: get().collections.map((c) =>
            c.id === collectionId && !c.recipeIds.includes(recipeId)
              ? { ...c, recipeIds: [...c.recipeIds, recipeId] }
              : c,
          ),
          items: get().items.map((i) =>
            i.recipeId === recipeId && !i.collectionIds.includes(collectionId)
              ? { ...i, collectionIds: [...i.collectionIds, collectionId] }
              : i,
          ),
        })
      },

      removeFromCollection: (collectionId, recipeId) => {
        if (collectionId === "all") return
        set({
          collections: get().collections.map((c) =>
            c.id === collectionId
              ? { ...c, recipeIds: c.recipeIds.filter((id) => id !== recipeId) }
              : c,
          ),
          items: get().items.map((i) =>
            i.recipeId === recipeId
              ? { ...i, collectionIds: i.collectionIds.filter((id) => id !== collectionId) }
              : i,
          ),
        })
      },

      sortedIds: () => {
        const { items, sort, activeCollectionId, collections } = get()
        let list = [...items]
        if (activeCollectionId && activeCollectionId !== "all") {
          const col = collections.find((c) => c.id === activeCollectionId)
          const allowed = new Set(col?.recipeIds ?? [])
          list = list.filter((i) => allowed.has(i.recipeId))
        }
        list.sort((a, b) => {
          if (sort === "cooked") return b.cookCount - a.cookCount
          if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0)
          return b.savedAt - a.savedAt
        })
        return list.map((i) => i.recipeId)
      },
    }),
    { name: "cuisenio-favorites" },
  ),
)
