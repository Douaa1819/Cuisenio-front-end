import client  from "./client"
import type { RecipeRequest, RecipeResponse } from "../types/recipe.types"

const BASE_URL = "/v1/recipes"

export const recipeService = {
  getAllRecipes: async (page = 0, size = 10, sort = "creationDate") => {
    try {
      const response = await client.get(`${BASE_URL}?page=${page}&size=${size}&sort=${sort}`)
      return response.data
    } catch (error) {
      console.error("Error fetching recipes:", error)
      throw error
    }
  },

  getRecipeById: async (id: number): Promise<RecipeResponse> => {
    try {
      const response = await client.get(`${BASE_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching recipe with id ${id}:`, error)
      throw error
    }
  },
  getSavedRecipes: async (page = 0, size = 10, sort = "creationDate") => {
    try {
      const response = await client.get(`${BASE_URL}/saved?page=${page}&size=${size}&sort=${sort}`)
      return response.data
    } catch (error) {
      console.error("Error fetching saved recipes:", error)
      throw error
    }
  },

  createRecipe: async (detailsData: RecipeRequest) => {
    try {
      const response = await client.post(BASE_URL, detailsData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error creating recipe:", error)
      throw error
    }
  },

  searchRecipes: async (
    query?: string,
    difficultyLevel?: string,
    maxPrepTime?: number,
    maxCookTime?: number,
    categoryType?: string,
    isApproved?: boolean,
    page = 0,
    size = 10,
    sort = "creationDate",
  ) => {
    try {
      const params = new URLSearchParams()

      if (query) params.append("query", query)
      if (difficultyLevel) params.append("difficultyLevel", difficultyLevel)
      if (maxPrepTime) params.append("maxPrepTime", maxPrepTime.toString())
      if (maxCookTime) params.append("maxCookTime", maxCookTime.toString())
      if (categoryType) params.append("categoryType", categoryType)
      if (isApproved !== undefined) params.append("isApproved", isApproved.toString())

      params.append("page", page.toString())
      params.append("size", size.toString())
      params.append("sort", sort)

      const response = await client.get(`${BASE_URL}/search?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error("Error searching recipes:", error)
      throw error
    }
  },

  getMyRecipes: async (page = 0, size = 10, sort = "creationDate") => {
    try {
      const response = await client.get(`${BASE_URL}/my-recipes?page=${page}&size=${size}&sort=${sort}`)
      return response.data
    } catch (error) {
      console.error("Error fetching my recipes:", error)
      throw error
    }
  },
}

