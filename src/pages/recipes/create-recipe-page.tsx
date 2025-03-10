"use client"

import { useState, ChangeEvent } from "react";
import { ChevronLeft, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";


interface IngredientInput {
  ingredientId: number
  name: string
  quantity: number
  unit: string
}

interface StepInput {
  stepNumber: number
  description: string
}

export default function CreateRecipePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficultyLevel, setDifficultyLevel] = useState("")
  const [preparationTime, setPreparationTime] = useState<number>(0)
  const [cookingTime, setCookingTime] = useState<number>(0)
  const [servings, setServings] = useState<number>(2)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<number[]>([])
  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { ingredientId: 0, name: "", quantity: 0, unit: "g" },
  ])
  const [steps, setSteps] = useState<StepInput[]>([{ stepNumber: 1, description: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { showToast } = useToast()

  const availableCategories = [
    { id: 1, name: "Entrée" },
    { id: 2, name: "Plat principal" },
    { id: 3, name: "Dessert" },
  ]

  const availableIngredients = [
    { id: 1, name: "Farine" },
    { id: 2, name: "Sucre" },
  ]

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredientId: 0, name: "", quantity: 0, unit: "g" }])
  }

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleIngredientChange = (
    index: number,
    field: keyof IngredientInput,
    value: string | number
  ) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setIngredients(newIngredients)
  }

  const handleAddStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, description: "" }])
  }

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, stepNumber: i + 1 }))
    setSteps(newSteps)
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index].description = value
    setSteps(newSteps)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("difficultyLevel", difficultyLevel)
      formData.append("preparationTime", preparationTime.toString())
      formData.append("cookingTime", cookingTime.toString())
      formData.append("servings", servings.toString())
      if (image) formData.append("image", image)

      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showToast({
        title: "Succès",
        description: "Recette créée avec succès",
      })
      
    } catch (error) {
      console.error("Error creating recipe:", error)
      showToast({
        title: "Erreur",
        description: "Échec de la création",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" >
        <ChevronLeft className="mr-2" /> Retour
      </Button>

      <h1 className="text-3xl font-bold my-8">Créer une recette</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section Informations de base */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label>Titre *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Difficulté *</Label>
                <Select
                  value={difficultyLevel}
                  onValueChange={setDifficultyLevel}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Facile</SelectItem>
                    <SelectItem value="MEDIUM">Moyen</SelectItem>
                    <SelectItem value="HARD">Difficile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Portions *</Label>
                <Input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Temps de préparation (min) *</Label>
                <Input
                  type="number"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label>Temps de cuisson (min)</Label>
                <Input
                  type="number"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label>Catégories</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableCategories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={categories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategories([...categories, category.id])
                        } else {
                          setCategories(categories.filter(id => id !== category.id))
                        }
                      }}
                    />
                    <Label>{category.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Image *</Label>
              <div className="border-dashed border-2 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 mb-2" />
                  <span>Télécharger une image</span>
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-4 max-h-40 mx-auto"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Ingrédients */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-semibold">Ingrédients</h2>
            
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-end">
                <Select
                  value={ingredient.ingredientId.toString()}
                  onValueChange={(value) => handleIngredientChange(index, 'ingredientId', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ingrédient" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIngredients.map((ing) => (
                      <SelectItem key={ing.id} value={ing.id.toString()}>
                        {ing.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Quantité"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, 'quantity', Number(e.target.value))}
                />

                <Select
                  value={ingredient.unit}
                  onValueChange={(value) => handleIngredientChange(index, 'unit', value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="pièce(s)">pièce(s)</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  onClick={() => handleRemoveIngredient(index)}
                  disabled={ingredients.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddIngredient}
              className="w-full"
            >
              <Plus className="mr-2" /> Ajouter un ingrédient
            </Button>
          </CardContent>
        </Card>

        {/* Section Étapes */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-semibold">Étapes de préparation</h2>
            
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100">
                  {step.stepNumber}
                </div>
                
                <Textarea
                  value={step.description}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="flex-1"
                />
                
                <Button
                  variant="ghost"
                  onClick={() => handleRemoveStep(index)}
                  disabled={steps.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddStep}
              className="w-full"
            >
              <Plus className="mr-2" /> Ajouter une étape
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Créer la recette"}
          </Button>
        </div>
      </form>
    </div>
  )
}