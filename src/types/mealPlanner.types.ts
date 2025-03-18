export interface MealPlannerRequest {
    planningDate: string
    dayOfWeek: string
    mealType: string
    servings?: number
    notes?: string
  }
  
  export interface MealPlannerResponse {
    id: number
    recipeId: number
    userId: number | null
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
      imageUrl: string | null
    } | null 
  }
  
  