import client from "./client"

export interface MealPlannerRequest {
  planningDate: string
  dayOfWeek: string
  mealType: string
  servings?: number
  notes?: string
}

export interface MealPlannerResponse {
  id: number
  planningDate: string
  dayOfWeek: string
  mealType: string
  servings: number
  notes: string
  recipe: {
    id: number
    title: string
    description: string
    difficultyLevel: string
    preparationTime: number
    cookingTime: number
    servings: number
    imageUrl: string
  }
}

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

