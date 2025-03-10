import client from "../api/client"

export interface RecipeRequest {
  title: string
  description: string
  difficultyLevel: string
  preparationTime: number
  cookingTime: number
  servings: number
  imageUrl: File
  categoryIds: number[]
}

export interface RecipeDetailsRequest {
  ingredients: {
    ingredientId: number
    quantity: number
    unit: string
  }[]
  steps: {
    stepNumber: number
    description: string
  }[]
}

export interface RecipeResponse {
  id: number
  title: string
  description: string
  difficultyLevel: string
  preparationTime: number
  cookingTime: number
  servings: number
  imageUrl: string
  categories: string[]
  user: {
    id: number
    name: string
    avatar?: string
  }
  creationDate: string
}

export const RecipeService = {
  createRecipe: async (recipeData: RecipeRequest, detailsData: RecipeDetailsRequest): Promise<RecipeResponse> => {
    const formData = new FormData()

    // Ajouter les données de base de la recette
    formData.append("title", recipeData.title)
    formData.append("description", recipeData.description)
    formData.append("difficultyLevel", recipeData.difficultyLevel)
    formData.append("preparationTime", recipeData.preparationTime.toString())
    formData.append("cookingTime", recipeData.cookingTime.toString())
    formData.append("servings", recipeData.servings.toString())
    formData.append("imageUrl", recipeData.imageUrl)

    recipeData.categoryIds.forEach((categoryId) => {
      formData.append("categoryIds", categoryId.toString())
    })

    // Appel API pour créer la recette
    const response = await client.post("/api/recipes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    // Ajouter les détails (ingrédients et étapes)
    await client.post(`/api/recipes/${response.data.id}/details`, detailsData, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data
  },

  getAllRecipes: async (page = 0, size = 10): Promise<{ content: RecipeResponse[]; totalPages: number }> => {
    const response = await client.get(`/api/recipes?page=${page}&size=${size}`)
    return response.data
  },

  getRecipeById: async (id: number): Promise<RecipeResponse> => {
    const response = await client.get(`/api/recipes/${id}`)
    return response.data
  },

  searchRecipes: async (
    query?: string,
    difficultyLevel?: string,
    maxPrepTime?: number,
    maxCookTime?: number,
    categoryType?: string,
    page = 0,
    size = 10,
  ): Promise<{ content: RecipeResponse[]; totalPages: number }> => {
    let url = `/api/recipes/search?page=${page}&size=${size}`

    if (query) url += `&query=${encodeURIComponent(query)}`
    if (difficultyLevel) url += `&difficultyLevel=${difficultyLevel}`
    if (maxPrepTime) url += `&maxPrepTime=${maxPrepTime}`
    if (maxCookTime) url += `&maxCookTime=${maxCookTime}`
    if (categoryType) url += `&categoryType=${categoryType}`

    const response = await client.get(url)
    return response.data
  },

  likeRecipe: async (id: number): Promise<void> => {
    await client.post(`/api/recipes/${id}/like`)
  },

  favoriteRecipe: async (id: number): Promise<void> => {
    await client.post(`/api/recipes/${id}/favorite`)
  },

  getComments: async (id: number): Promise<{ id: number; content: string; creationDate: string; user: { id: number; name: string; avatar?: string } }> => {
    const response = await client.get(`/api/recipes/${id}/comments`)
    return response.data
},

addComment: async (id: number, content: string): Promise<{ id: number; content: string; creationDate: string; user: { id: number; name: string; avatar?: string } }> => {
    const response = await client.post(`/api/recipes/${id}/comments`, { content })
    return response.data
  },
}

