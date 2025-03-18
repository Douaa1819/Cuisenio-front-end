import { MealPlannerService } from '../api/meal-planner.service';
import { MealPlannerResponse, MealPlannerRequest } from './../types/mealPlanner.types';

import { useState, useCallback, useEffect } from "react"

export const useMealPlanner = () => {
  const [mealPlans, setMealPlans] = useState<MealPlannerResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 

  const fetchMealPlans = useCallback(async () => {
    try {
      setLoading(true)
      const response = await MealPlannerService.getMealPlansByUser()
      setMealPlans(Array.isArray(response) ? response : [])
      setError(null)
    } catch (err) {
      console.error("Error fetching meal plans:", err)
      setError("Impossible de charger les plans de repas. Veuillez réessayer plus tard.")
    } finally {
      setLoading(false)
    }
  }, [])

  const createMealPlan = async (recipeId: number, data: MealPlannerRequest) => {
    try {
      setLoading(true)
      const response = await MealPlannerService.createMealPlan(recipeId, data)
      await fetchMealPlans()
      return response
    } catch (err) {
      console.error("Error creating meal plan:", err)
      setError("Erreur lors de la création du plan de repas.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMealPlan = async (id: number, data: MealPlannerRequest) => {
    try {
      setLoading(true)
      const response = await MealPlannerService.updateMealPlan(id, data)
      await fetchMealPlans()
      return response
    } catch (err) {
      console.error("Error updating meal plan:", err)
      setError("Erreur lors de la mise à jour du plan de repas.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteMealPlan = async (id: number) => {
    try {
      setLoading(true)
      await MealPlannerService.deleteMealPlan(id)
      await fetchMealPlans() 
    } catch (err) {
      console.error("Error deleting meal plan:", err)
      setError("Erreur lors de la suppression du plan de repas.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMealPlans()
  }, [fetchMealPlans])

  return {
    mealPlans,
    loading,
    error,
    fetchMealPlans,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    
  }
}

