import { z } from "zod"
import { QUANTITY_REGEX, TEXT_CONTENT_REGEX, TITLE_REGEX, UNIT_REGEX } from "../../../utils/validation"

export const recipeSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(120, "Le titre ne peut pas dépasser 120 caractères")
    .regex(TITLE_REGEX, "Le titre contient des caractères non autorisés"),

  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(2000, "La description ne peut pas dépasser 2000 caractères")
    .regex(TEXT_CONTENT_REGEX, "Contenu invalide"),

  difficultyLevel: z.enum(["EASY", "INTERMEDIATE", "ADVANCED"], {
    errorMap: () => ({ message: "Niveau de difficulté invalide" }),
  }),

  preparationTime: z
    .number({ invalid_type_error: "Valeur numérique requise" })
    .int("Le temps doit être un entier")
    .min(1, "Le temps de préparation doit être d'au moins 1 minute")
    .max(480, "Le temps de préparation ne peut pas dépasser 480 minutes"),

  cookingTime: z
    .number({ invalid_type_error: "Valeur numérique requise" })
    .int("Le temps doit être un entier")
    .min(0, "Le temps de cuisson ne peut pas être négatif")
    .max(600, "Le temps de cuisson ne peut pas dépasser 600 minutes"),

  servings: z
    .number({ invalid_type_error: "Valeur numérique requise" })
    .int("Le nombre de portions doit être un entier")
    .min(1, "Au moins 1 portion requise")
    .max(100, "Maximum 100 portions"),

  categoryIds: z
    .number({ invalid_type_error: "Catégorie invalide" })
    .int()
    .positive("La catégorie est requise"),

  ingredients: z
    .array(
      z.object({
        ingredientId: z.number().int().positive("Ingrédient invalide"),
        quantity: z
          .string()
          .min(1, "La quantité est requise")
          .max(10, "Quantité trop longue")
          .regex(QUANTITY_REGEX, "Format de quantité invalide (ex: 200 ou 1.5)"),
        unit: z
          .string()
          .min(1, "L'unité est requise")
          .max(20, "Unité trop longue")
          .regex(UNIT_REGEX, "Unité invalide"),
      }),
    )
    .min(1, "Au moins un ingrédient est requis")
    .max(50, "Maximum 50 ingrédients"),

  steps: z
    .array(
      z.object({
        stepNumber: z.number().int().positive("Numéro d'étape invalide"),
        description: z
          .string()
          .min(5, "La description de l'étape doit contenir au moins 5 caractères")
          .max(1000, "Description de l'étape trop longue"),
      }),
    )
    .min(1, "Au moins une étape est requise")
    .max(30, "Maximum 30 étapes"),
})

export type RecipeFormData = z.infer<typeof recipeSchema>
