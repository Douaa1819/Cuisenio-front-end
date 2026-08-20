import { useShoppingListStore } from "../src/store/shopping-list.store"
import { useRecentlyViewedStore } from "../src/store/recently-viewed.store"

describe("shopping-list.store", () => {
  beforeEach(() => {
    useShoppingListStore.getState().clearAll()
  })

  it("adds unique ingredients", () => {
    const { addItems } = useShoppingListStore.getState()
    addItems([{ name: "Farine", quantity: "250", unit: "g", recipeTitle: "Crêpes" }])
    addItems([{ name: "Farine", quantity: "100", unit: "g", recipeTitle: "Gâteau" }])
    expect(useShoppingListStore.getState().items).toHaveLength(1)
  })

  it("toggles and clears checked items", () => {
    useShoppingListStore.getState().addItems([{ name: "Sucre" }])
    const id = useShoppingListStore.getState().items[0].id
    useShoppingListStore.getState().toggle(id)
    expect(useShoppingListStore.getState().items[0].checked).toBe(true)
    useShoppingListStore.getState().clearChecked()
    expect(useShoppingListStore.getState().items).toHaveLength(0)
  })
})

describe("recently-viewed.store", () => {
  beforeEach(() => {
    useRecentlyViewedStore.getState().clear()
  })

  it("keeps newest first and dedupes", () => {
    const { add } = useRecentlyViewedStore.getState()
    add({ id: 1, title: "Tajine" })
    add({ id: 2, title: "Risotto" })
    add({ id: 1, title: "Tajine" })
    const items = useRecentlyViewedStore.getState().items
    expect(items).toHaveLength(2)
    expect(items[0].id).toBe(1)
    expect(items[1].id).toBe(2)
  })
})
