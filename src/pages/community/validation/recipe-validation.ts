import { z } from "zod"

export const recipeSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  difficultyLevel: z.enum(["EASY", "INTERMEDIATE", "ADVANCED"]),
  preparationTime: z.number().min(1, "Le temps de préparation est requis"),
  cookingTime: z.number().min(0, "Le temps de cuisson ne peut pas être négatif"),
  servings: z.number().min(1, "Le nombre de portions est requis"),
  categoryIds: z.number().min(0, "La catégorie est requise"),
  ingredients: z
    .array(
      z.object({
        ingredientId: z.number(),
        quantity: z.string(),
        unit: z.string(),
      }),
    )
    .min(1, "Au moins un ingrédient est requis"),
  steps: z
    .array(
      z.object({
        stepNumber: z.number(),
        description: z.string().min(1, "La description de l'étape est requise"),
      }),
    )
    .min(1, "Au moins une étape est requise"),
})

export type RecipeFormData = z.infer<typeof recipeSchema>