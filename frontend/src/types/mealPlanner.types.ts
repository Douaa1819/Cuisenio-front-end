export interface MealPlannerRequest {
    planningDate: string
    dayOfWeek: string
    mealType: string
    servings?: number
    notes?: string
  }
  
  export interface MealPlannerResponse {
    id: number
    publicId: string
    recipeId: number
    userId: number | null
    planningDate: string
    dayOfWeek: string
    mealType: string
    servings: number
    notes: string
    recipe?: {
      id: number
      publicId?: string
      title: string
      description: string
      difficultyLevel: string
      preparationTime: number
      cookingTime: number
      servings: number
      imageUrl: string | null
    } | null 
  }
  
  