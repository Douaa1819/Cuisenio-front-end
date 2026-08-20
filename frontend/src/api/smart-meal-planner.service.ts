import client from "./client"
import { routes } from "./routes"

export interface SmartPlanRequest {
  startDate: string
  mealCount: number
  maxPrepMinutes: number
  budgetLevel: number
}

export interface ShoppingListItem {
  name: string
  quantity: number
  unit: string
  category: string
}

export interface SmartPlanResponse {
  plannedMeals: unknown[]
  shoppingList: {
    items: ShoppingListItem[]
    recipeCount: number
    uniqueIngredientCount: number
  }
  summary: string
}

export const smartMealPlannerService = {
  async generate(request: SmartPlanRequest): Promise<SmartPlanResponse> {
    const { data } = await client.post<SmartPlanResponse>(routes.mealPlanner.smartGenerate, request)
    return data
  },
}
