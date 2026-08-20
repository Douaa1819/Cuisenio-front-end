import { Camera, Plus, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { z } from "zod"
import type { RecipeImportPreview } from "../../api/recipe-import.service"
import { categoryService } from "../../api/category.service"
import { ingredientService } from "../../api/ingredient.service"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { useNotification } from "../../context/NotificationContext"
import { env } from "../../lib/env"
import type { CategoryResponse } from "../../types/category.types"
import type { IngredientResponse } from "../../types/ingredient.types"
import type { DifficultyLevel, RecipeResponse, RecipeStepRequest } from "../../types/recipe.types"
import { validateImageFile } from "../../utils/validation"
import { RecipeFormData, recipeSchema } from "./validation/recipe-validation"

interface IngredientDetail {
  ingredientId: number
  quantity: string
  unit: string
}

interface AddRecipeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (recipeData: RecipeFormData, image?: File | null) => Promise<number>
  initialRecipe?: RecipeResponse | null
  importPreview?: RecipeImportPreview | null
  asPage?: boolean
}

function existingImageSrc(imageUrl?: string | null) {
  if (!imageUrl) return ""
  return imageUrl.startsWith("http") ? imageUrl : `${env.uploadsUrl}/${imageUrl}`
}

export default function AddRecipeDialog({
  open,
  onOpenChange,
  onSubmit,
  initialRecipe = null,
  importPreview = null,
  asPage = false,
}: AddRecipeDialogProps) {
  const { error: notifyError } = useNotification()
  const [recipeTitle, setRecipeTitle] = useState("")
  const [recipeDescription, setRecipeDescription] = useState("")
  const [recipeDifficulty, setRecipeDifficulty] = useState<DifficultyLevel | "">("")
  const [prepTime, setPrepTime] = useState<number>(15)
  const [cookTime, setCookTime] = useState<number>(0)
  const [servings, setServings] = useState<number>(4)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([])
  const [ingredientDetails, setIngredientDetails] = useState<IngredientDetail[]>([])
  const [steps, setSteps] = useState<RecipeStepRequest[]>([{ stepNumber: 1, description: "" }])
  const [currentStep, setCurrentStep] = useState(1)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [ingredientsList, setIngredientsList] = useState<IngredientResponse[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [existingImage, setExistingImage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEdit = Boolean(initialRecipe)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.findAll(0, 50)
        setCategories(response.content)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    const fetchIngredients = async () => {
      try {
        const response = await ingredientService.findAll()
        setIngredientsList(response.content)
      } catch (error) {
        console.error("Error fetching ingredients:", error)
      }
    }

    if (open) {
      fetchCategories()
      fetchIngredients()
    }
  }, [open])

  useEffect(() => {
    if (!open || !initialRecipe) return
    setRecipeTitle(initialRecipe.title ?? "")
    setRecipeDescription(initialRecipe.description ?? "")
    setRecipeDifficulty((initialRecipe.difficultyLevel as DifficultyLevel) || "")
    setPrepTime(initialRecipe.preparationTime ?? 15)
    setCookTime(initialRecipe.cookingTime ?? 0)
    setServings(initialRecipe.servings ?? 4)
    const categoryId = initialRecipe.categorie?.id ?? initialRecipe.categories?.[0]?.id
    setSelectedCategory(categoryId ? String(categoryId) : "")
    const details = (initialRecipe.recipeIngredients ?? [])
      .map((item) => ({
        ingredientId: Number(item.ingredient?.id),
        quantity: String(item.quantity ?? "").replace(/\.0$/, ""),
        unit: item.unit ?? "",
      }))
      .filter((item) => Number.isFinite(item.ingredientId) && item.ingredientId > 0)
    setIngredientDetails(details)
    setSelectedIngredients(details.map((item) => item.ingredientId))
    const loadedSteps = (initialRecipe.steps ?? [])
      .slice()
      .sort((a, b) => a.stepNumber - b.stepNumber)
      .map((step, index) => ({
        stepNumber: index + 1,
        description: step.description ?? "",
      }))
    setSteps(loadedSteps.length ? loadedSteps : [{ stepNumber: 1, description: "" }])
    setCurrentStep(1)
    setExistingImage(existingImageSrc(initialRecipe.imageUrl))
    setRecipeImage(null)
    setImagePreview("")
    setErrors({})
  }, [open, initialRecipe])

  useEffect(() => {
    if (!open || initialRecipe || !importPreview || ingredientsList.length === 0) return
    setRecipeTitle(importPreview.title ?? "")
    if (importPreview.description) setRecipeDescription(importPreview.description)
    if (importPreview.prepTimeMinutes != null) setPrepTime(importPreview.prepTimeMinutes)
    if (importPreview.cookTimeMinutes != null) setCookTime(importPreview.cookTimeMinutes)
    if (importPreview.steps?.length) {
      setSteps(importPreview.steps.map((description, index) => ({
        stepNumber: index + 1,
        description,
      })))
    }
    if (importPreview.ingredients?.length) {
      const matched: IngredientDetail[] = []
      for (const line of importPreview.ingredients) {
        const name = line.replace(/^\d+([.,]\d+)?\s*/, "").trim().toLowerCase()
        const found = ingredientsList.find((item) => item.name.toLowerCase() === name)
          ?? ingredientsList.find((item) => name.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(name))
        if (found && !matched.some((row) => row.ingredientId === found.id)) {
          const qtyMatch = line.match(/^(\d+(?:[.,]\d+)?)/)
          matched.push({
            ingredientId: found.id,
            quantity: qtyMatch?.[1]?.replace(",", ".") ?? "1",
            unit: "g",
          })
        }
      }
      if (matched.length) {
        setIngredientDetails(matched)
        setSelectedIngredients(matched.map((row) => row.ingredientId))
      }
    }
    if (importPreview.imageUrl) setExistingImage(importPreview.imageUrl)
  }, [open, initialRecipe, importPreview, ingredientsList])

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const validationError = validateImageFile(file)
    if (validationError) {
      setErrors((prev) => ({ ...prev, image: validationError }))
      e.target.value = ""
      return
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setRecipeImage(file)
    setImagePreview(URL.createObjectURL(file))
    setErrors((prev) => {
      const next = { ...prev }
      delete next.image
      return next
    })
  }

  const handleIngredientSelection = (ingredientId: number) => {
    setSelectedIngredients((prevSelectedIngredients) => {
      if (prevSelectedIngredients.includes(ingredientId)) {
        setIngredientDetails((prevDetails) => prevDetails.filter((detail) => detail.ingredientId !== ingredientId))
        return prevSelectedIngredients.filter((id) => id !== ingredientId)
      } else {
        setIngredientDetails((prevDetails) => [...prevDetails, { ingredientId, quantity: "", unit: "" }])
        return [...prevSelectedIngredients, ingredientId]
      }
    })
  }

  const handleQuantityChange = (ingredientId: number, value: string) => {
    setIngredientDetails((prevDetails) =>
      prevDetails.map((detail) => (detail.ingredientId === ingredientId ? { ...detail, quantity: value } : detail)),
    )
  }

  const handleUnitChange = (ingredientId: number, value: string) => {
    setIngredientDetails((prevDetails) =>
      prevDetails.map((detail) => (detail.ingredientId === ingredientId ? { ...detail, unit: value } : detail)),
    )
  }

  const addStep = () => {
    const nextStepNumber = steps.length + 1
    setSteps([...steps, { stepNumber: nextStepNumber, description: "" }])
    setCurrentStep(nextStepNumber)
  }

  const updateStep = (index: number, description: string) => {
    const updatedSteps = [...steps]
    updatedSteps[index] = { ...updatedSteps[index], description }
    setSteps(updatedSteps)
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const updatedSteps = [...steps]
      updatedSteps.splice(index, 1)

      const reindexedSteps = updatedSteps.map((step, idx) => ({
        ...step,
        stepNumber: idx + 1,
      }))

      setSteps(reindexedSteps)
      setCurrentStep(Math.min(currentStep, reindexedSteps.length))
    }
  }

  const difficultyLevels = [
    { value: "EASY", label: "Facile" },
    { value: "INTERMEDIATE", label: "Intermédiaire" },
    { value: "ADVANCED", label: "Difficile" },
  ]

  const validateForm = () => {
    try {
      const validSteps = steps.filter((step) => step.description.trim() !== "")

      const recipeData: RecipeFormData = {
        title: recipeTitle,
        description: recipeDescription,
        difficultyLevel: recipeDifficulty as DifficultyLevel,
        preparationTime: prepTime,
        cookingTime: cookTime,
        servings: servings,
        categoryIds: Number(selectedCategory),
        ingredients: ingredientDetails,
        steps: validSteps,
      }

      recipeSchema.parse(recipeData)
      setErrors({})
      return { isValid: true, data: recipeData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join(".")
          formattedErrors[path] = err.message
        })
        setErrors(formattedErrors)
        console.error("Validation errors:", formattedErrors)
      }
      return { isValid: false, data: null }
    }
  }

  const handleSubmitRecipe = async () => {
    const { isValid, data } = validateForm()

    if (!isValid || !data) {
      notifyError("Formulaire incomplet", "Veuillez corriger les erreurs dans le formulaire.")
      return
    }

    try {
      setIsSaving(true)
      await onSubmit(data, recipeImage)
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating recipe:", error)
      notifyError(
        isEdit ? "Modification impossible" : "Création impossible",
        isEdit
          ? "La recette n'a pas pu être enregistrée. Veuillez réessayer."
          : "La recette n'a pas pu être créée. Veuillez réessayer.",
      )
    } finally {
      setIsSaving(false)
    }
  }


  const resetForm = () => {
    setRecipeTitle("")
    setRecipeDescription("")
    setRecipeDifficulty("")
    setPrepTime(15)
    setCookTime(0)
    setServings(4)
    // setRecipeImagePreview("")
    setSelectedCategory("")
    setSelectedIngredients([])
    setIngredientDetails([])
    setSteps([{ stepNumber: 1, description: "" }])
    setCurrentStep(1)
    setRecipeImage(null)
    setImagePreview("")
    setExistingImage("")
    setErrors({})

    onOpenChange(false)
  }

  const units = [
    { value: "g", label: "grammes (g)" },
    { value: "kg", label: "kilogrammes (kg)" },
    { value: "ml", label: "millilitres (ml)" },
    { value: "l", label: "litres (l)" },
    { value: "c. à café", label: "cuillère à café" },
    { value: "c. à soupe", label: "cuillère à soupe" },
    { value: "pincée", label: "pincée" },
    { value: "unité", label: "unité(s)" },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]"
          showCloseButton={!asPage}
          onPointerDownOutside={(event) => {
            if (asPage) event.preventDefault()
          }}
          onEscapeKeyDown={(event) => {
            if (asPage) event.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? "Modifier la recette" : "Ajouter une nouvelle recette"}</DialogTitle>
            <DialogDescription className="sr-only">
              {isEdit
                ? "Formulaire de modification d'une recette existante."
                : "Formulaire de création d'une nouvelle recette."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="grid grid-cols-1 gap-6">
            
              {/* Basic information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipe-title" className="block text-sm font-medium mb-1">
                    Titre de la recette <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="recipe-title"
                    value={recipeTitle}
                    onChange={(e) => setRecipeTitle(e.target.value)}
                    placeholder="Ex: Tarte aux pommes traditionnelle"
                    required
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="recipe-description" className="block text-sm font-medium mb-1">
                    Description <span className="text-primary">*</span>
                  </Label>
                  <Textarea
                    id="recipe-description"
                    value={recipeDescription}
                    onChange={(e) => setRecipeDescription(e.target.value)}
                    placeholder="Décrivez brièvement votre recette..."
                    rows={3}
                    required
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                  <Label className="mb-1 block text-sm font-medium">Photo de la recette</Label>
                  <div
                    className="cursor-pointer rounded-xl border-2 border-dashed border-border p-4 text-center transition-colors hover:bg-muted/40"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageChange}
                    />
                    {imagePreview || existingImage ? (
                      <div className="relative h-44 w-full">
                        <img
                          src={imagePreview || existingImage}
                          alt="Aperçu de la recette"
                          className="h-full w-full rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute right-2 top-2 bg-background/90"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (imagePreview) URL.revokeObjectURL(imagePreview)
                            setRecipeImage(null)
                            setImagePreview("")
                            setExistingImage("")
                            if (fileInputRef.current) fileInputRef.current.value = ""
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <Camera className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Cliquez pour importer une image</p>
                        <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, WebP ou GIF — 5 Mo max</p>
                      </div>
                    )}
                  </div>
                  {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recipe-category" className="block text-sm font-medium mb-1">
                      Catégorie <span className="text-primary">*</span>
                    </Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="recipe-category" className={errors.categoryIds ? "border-red-500" : ""}>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryIds && <p className="text-red-500 text-xs mt-1">{errors.categoryIds}</p>}
                  </div>

                  <div>
                    <Label htmlFor="recipe-difficulty" className="block text-sm font-medium mb-1">
                      Niveau de difficulté <span className="text-primary">*</span>
                    </Label>
                    <Select
                      value={recipeDifficulty}
                      onValueChange={(value) => setRecipeDifficulty(value as DifficultyLevel)}
                    >
                      <SelectTrigger id="recipe-difficulty" className={errors.difficultyLevel ? "border-red-500" : ""}>
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.difficultyLevel && <p className="text-red-500 text-xs mt-1">{errors.difficultyLevel}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="prep-time" className="block text-sm font-medium mb-1">
                      Temps de préparation (min) <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="prep-time"
                      type="number"
                      min={1}
                      value={prepTime}
                      onChange={(e) => setPrepTime(Number.parseInt(e.target.value) || 0)}
                      required
                      className={errors.preparationTime ? "border-red-500" : ""}
                    />
                    {errors.preparationTime && <p className="text-red-500 text-xs mt-1">{errors.preparationTime}</p>}
                  </div>

                  <div>
                    <Label htmlFor="cook-time" className="block text-sm font-medium mb-1">
                      Temps de cuisson <br />
                      (min)
                    </Label>
                    <Input
                      id="cook-time"
                      type="number"
                      min={0}
                      value={cookTime}
                      onChange={(e) => setCookTime(Number.parseInt(e.target.value) || 0)}
                      className={errors.cookingTime ? "border-red-500" : ""}
                    />
                    {errors.cookingTime && <p className="text-red-500 text-xs mt-1">{errors.cookingTime}</p>}
                  </div>

                  <div>
                    <Label htmlFor="servings" className="block text-sm font-medium mb-1">
                      Nombre de <br />
                      portions <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="servings"
                      type="number"
                      min={1}
                      value={servings}
                      onChange={(e) => setServings(Number.parseInt(e.target.value) || 1)}
                      required
                      className={errors.servings ? "border-red-500" : ""}
                    />
                    {errors.servings && <p className="text-red-500 text-xs mt-1">{errors.servings}</p>}
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="block text-sm font-medium">
                    Ingrédients <span className="text-primary">*</span>
                  </Label>
                </div>

                <div className="mb-4">
                  <Label htmlFor="ingredients-select" className="block text-sm font-medium mb-3">
                    Sélectionner des ingrédients
                  </Label>

                  <div
                    className={`space-y-4 max-h-[400px] overflow-y-auto p-2 border rounded-md ${errors["ingredients"] ? "border-red-500" : "border-gray-200"}`}
                  >
                    {ingredientsList.map((ingredient) => (
                      <div key={ingredient.id} className="pb-3 border-b border-gray-100 last:border-0">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`ingredient-${ingredient.id}`}
                            checked={selectedIngredients.includes(ingredient.id)}
                            onChange={() => handleIngredientSelection(ingredient.id)}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={`ingredient-${ingredient.id}`} className="text-sm font-medium cursor-pointer">
                            {ingredient.name}
                          </Label>
                        </div>

                        {selectedIngredients.includes(ingredient.id) && (
                          <div className="mt-2 ml-6 flex flex-wrap items-center gap-2">
                            <div className="flex-1 min-w-[120px]">
                              <Input
                                placeholder="Quantité"
                                type="number"
                                value={
                                  ingredientDetails.find((detail) => detail.ingredientId === ingredient.id)?.quantity ||
                                  ""
                                }
                                onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div className="flex-1 min-w-[140px]">
                              <select
                                value={
                                  ingredientDetails.find((detail) => detail.ingredientId === ingredient.id)?.unit || ""
                                }
                                onChange={(e) => handleUnitChange(ingredient.id, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                              >
                                <option value="">Unité</option>
                                {units.map((unit) => (
                                  <option key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors["ingredients"] && <p className="text-red-500 text-xs mt-1">{errors["ingredients"]}</p>}
                </div>
              </div>

              {/* Steps */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="block text-sm font-medium">
                    Étapes de préparation <span className="text-primary">*</span>
                  </Label>
                  <Button variant="outline" size="sm" className="text-xs flex items-center gap-1" onClick={addStep}>
                    <Plus className="h-3 w-3" /> Ajouter
                  </Button>
                </div>

                <div className={`border rounded-lg overflow-hidden ${errors["steps"] ? "border-red-500" : ""}`}>
                  <div className="flex border-b">
                    {steps.map((step, index) => (
                      <button
                        key={index}
                        className={`flex-1 py-2 px-4 text-sm font-medium ${
                          currentStep === step.stepNumber
                            ? "bg-primary/5 text-primary border-b-2 border-primary"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                        onClick={() => setCurrentStep(step.stepNumber)}
                      >
                        Étape {step.stepNumber}
                      </button>
                    ))}
                  </div>

                  <div className="p-4">
                    {steps.map((step, index) => (
                      <div key={index} className={currentStep === step.stepNumber ? "block" : "hidden"}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Étape {step.stepNumber}</h4>
                          {steps.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-primary"
                              onClick={() => removeStep(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <Textarea
                          placeholder={`Décrivez l'étape ${step.stepNumber}...`}
                          value={step.description}
                          onChange={(e) => updateStep(index, e.target.value)}
                          rows={4}
                        />

                        <div className="flex justify-between mt-4">
                          {step.stepNumber > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => setCurrentStep(step.stepNumber - 1)}
                            >
                              Étape précédente
                            </Button>
                          )}
                          {step.stepNumber < steps.length && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs ml-auto"
                              onClick={() => setCurrentStep(step.stepNumber + 1)}
                            >
                              Étape suivante
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {errors["steps"] && <p className="text-red-500 text-xs mt-1">{errors["steps"]}</p>}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSubmitRecipe}
              disabled={isSaving}
            >
              {isSaving ? "Enregistrement…" : isEdit ? "Enregistrer les modifications" : "Publier la recette"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

  
    </>
  )
}

