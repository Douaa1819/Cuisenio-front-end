import { MealPlannerRequest, MealPlannerResponse } from "../types/mealPlanner.types"
import { routes } from "./routes"
import client from "./client"

export const MealPlannerService = {
  createMealPlan: async (recipePublicId: string, data: MealPlannerRequest): Promise<MealPlannerResponse> => {
    const response = await client.post(routes.mealPlanner.create(recipePublicId), data)
    return response.data
  },

  getMealPlansByUser: async (): Promise<MealPlannerResponse[]> => {
    const response = await client.get(routes.mealPlanner.base)
    return response.data
  },

  updateMealPlan: async (publicId: string, data: MealPlannerRequest): Promise<MealPlannerResponse> => {
    const response = await client.put(routes.mealPlanner.detail(publicId), data)
    return response.data
  },

  deleteMealPlan: async (publicId: string): Promise<void> => {
    await client.delete(routes.mealPlanner.detail(publicId))
  },
}
