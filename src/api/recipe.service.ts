import { RecipeFormData } from './../pages/community/validation/recipe-validation';
import { RecipeResponse, PageResponse } from './../types/recipe.types';
import axios from "axios"
import  client  from './client';

import { routes } from './routes';




export const recipeService = {
  getAllRecipes: async (): Promise<PageResponse<RecipeResponse>> => {
    try {
      const response = await client.get(routes.recipes.base)
      return response.data
    } catch (error) {
      console.error("Error fetching recipes:", error)
      throw error
    }
  },

  getRecipeById: async (id: number): Promise<RecipeResponse> => {
    try {
      const response = await client.get(routes.recipes.detail(id));
      return response.data
    } catch (error) {
      console.error(`Error fetching recipe with id ${id}:`, error)
      throw error
    }
  },

  createRecipe: async (recipeFormData: RecipeFormData) => {
    try {
      

      const response = await client.post(routes.recipes.base, recipeFormData, {
      });
      console.log("Sending request to:", routes.recipes.base); 
      return response.data;
    } catch (error) {
      console.error("Error creating recipe:", error);
      throw error;
    }
  },
  addImageToRecipe: async (id: number,formData: FormData) => {
    try {
      console.log("FormData content:")
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }


      const response = await client.post(routes.recipes.addImage(id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    
      console.log("Sending request to:", response); 
      return response.data;
    } catch (error) {
      console.error("Error creating recipe:", error);
      throw error;
    }
  },


  updateRecipe: async (id: number, recipeData: FormData) => {
    const response = await axios.put(`/api/recipes/${id}`, recipeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  deleteRecipe: async (id: number) => {
    const response = await axios.delete(`/api/recipes/${id}`)
    return response.data
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

      const response = await client.get(`routes.recipes/search?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error("Error searching recipes:", error)
      throw error
    }
  },

  getMyRecipes: async (page = 0, size = 10, sort = "creationDate") => {
    try {
      const response = await client.get(`${routes.recipes}/my-recipes?page=${page}&size=${size}&sort=${sort}`)
      return response.data
    } catch (error) {
      console.error("Error fetching my recipes:", error)
      throw error
    }
  },

  getSavedRecipes: async (page = 0, size = 10, sort = "creationDate") => {
    try {
      const response = await client.get(`${routes.recipes.saved}?page=${page}&size=${size}&sort=${sort}`)
      return response.data
    } catch (error) {
      console.error("Error fetching saved recipes:", error)
      throw error
    }
  },

  saveRecipe: async (recipeId: number) => {
    try {
      const response = await client.post(`${routes.recipes}/${recipeId}/save`)
      return response.data
    } catch (error) {
      console.error(`Error saving recipe with id ${recipeId}:`, error)
      throw error
    }
  },

  unsaveRecipe: async (recipeId: number) => {
    try {
      const response = await client.delete(routes.recipes.unsave(recipeId))
      return response.data
    } catch (error: unknown) {
      console.error(`Error unsaving recipe with id ${recipeId}:`, error)
      throw error
    }
  },

  rateRecipe: async (recipeId: number, rating: number) => {
    try {
      const response = await client.post(`${routes.recipes}/${recipeId}/rate`, { rating })
      return response.data
    } catch (error) {
      console.error(`Error rating recipe with id ${recipeId}:`, error)
      throw error
    }
  },

  // Add a comment to a recipe
  addComment: async (recipeId: number, text: string) => {
    const response = await axios.post(`/api/recipes/${recipeId}/comments`, { text })
    return response.data
  },

  // Get comments for a recipe
  getComments: async (recipeId: number, page = 0, size = 10) => {
    const response = await axios.get(`/api/recipes/${recipeId}/comments`, {
      params: { page, size },
    })
    return response.data
  },

  getCategories: async () => {
    try {
      const response = await client.get("/api/categories")
      return response.data
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  },

  getIngredients: async (query?: string) => {
    try {
      const params = new URLSearchParams()
      if (query) params.append("query", query)

      const response = await client.get(`/api/ingredients?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error("Error fetching ingredients:", error)
      throw error
    }
  },
}

