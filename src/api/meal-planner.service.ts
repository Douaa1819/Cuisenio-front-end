import { MealPlannerRequest, MealPlannerResponse } from "../types/mealPlanner.types"
import client from "./client"




export const MealPlannerService = {
  createMealPlan: async (recipeId: number, data: MealPlannerRequest): Promise<MealPlannerResponse> => {
    const response = await client.post(`/v1/meal-plans/${recipeId}`, data)
    return response.data
  },

  getMealPlansByUser: async (): Promise<MealPlannerResponse[]> => {
    const response = await client.get("/v1/meal-plans")
    return response.data
  },

  updateMealPlan: async (id: number, data: MealPlannerRequest): Promise<MealPlannerResponse> => {
    const response = await client.put(`/v1/meal-plans/${id}`, data)
    return response.data
  },

  deleteMealPlan: async (id: number): Promise<void> => {
    await client.delete(`/v1/meal-plans/${id}`)
  },
}

