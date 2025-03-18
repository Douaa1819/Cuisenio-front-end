"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Calendar,
  ChefHat,
  Clock,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  X,
  Menu,
  Bell,
  User,
  ChevronDown,
  LogOut,
  BookmarkIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Avatar } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { useAuthStore } from "../../store/auth.store"
import { MealPlannerService, type MealPlannerRequest, type MealPlannerResponse } from "../../api/meal-planner.service"
import { recipeService } from "../../api/recipe.service"
import type { RecipeResponse } from "../../types/recipe.types"

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

const Image = ({ src, alt, width, height, className, fill }: ImageProps) => {
  const style = fill
    ? {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
      }
    : {}

  return (
    <img src={src || "/placeholder.svg"} alt={alt} width={width} height={height} className={className} style={style} />
  )
}

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Lundi" },
  { value: "TUESDAY", label: "Mardi" },
  { value: "WEDNESDAY", label: "Mercredi" },
  { value: "THURSDAY", label: "Jeudi" },
  { value: "FRIDAY", label: "Vendredi" },
  { value: "SATURDAY", label: "Samedi" },
  { value: "SUNDAY", label: "Dimanche" },
]

const MEAL_TYPES = [
  { value: "BREAKFAST", label: "Petit déjeuner" },
  { value: "LUNCH", label: "Déjeuner" },
  { value: "DINNER", label: "Dîner" },
  { value: "SNACK", label: "Collation" },
]

export default function MealPlannerPage() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mealPlans, setMealPlans] = useState<MealPlannerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [addMealDialogOpen, setAddMealDialogOpen] = useState(false)
  const [editMealDialogOpen, setEditMealDialogOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [mealToDelete, setMealToDelete] = useState<number | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeResponse | null>(null)
  const [recipes, setRecipes] = useState<RecipeResponse[]>([])
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const [currentMeal, setCurrentMeal] = useState<MealPlannerResponse | null>(null)

  const [mealForm, setMealForm] = useState<MealPlannerRequest>({
    planningDate: new Date().toISOString().split("T")[0],
    dayOfWeek: DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].value,
    mealType: "LUNCH",
    servings: 2,
    notes: "",
  })

  const fetchMealPlans = async () => {
    try {
      setLoading(true)
      const response = await MealPlannerService.getMealPlansByUser()
      setMealPlans(response)
      setError(null)
    } catch (err) {
      console.error("Error fetching meal plans:", err)
      setError("Impossible de charger les plans de repas. Veuillez réessayer plus tard.")
    } finally {
      setLoading(false)
    }
  }

  const fetchRecipes = async () => {
    try {
      setLoadingRecipes(true)
      const response = await recipeService.getAllRecipes()
      setRecipes(response.content || [])
    } catch (err) {
      console.error("Error fetching recipes:", err)
    } finally {
      setLoadingRecipes(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchMealPlans()
      fetchRecipes()
    } else {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  const handleInputChange = (name: string, value: string | number) => {
    setMealForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddMeal = async () => {
    if (!selectedRecipe) {
      setError("Veuillez sélectionner une recette")
      return
    }

    try {
      await MealPlannerService.createMealPlan(selectedRecipe.id, mealForm)
      setSuccessMessage("Repas ajouté avec succès!")
      setShowSuccessModal(true)
      setAddMealDialogOpen(false)
      fetchMealPlans()

      // Reset form
      setMealForm({
        planningDate: new Date().toISOString().split("T")[0],
        dayOfWeek: DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].value,
        mealType: "LUNCH",
        servings: 2,
        notes: "",
      })
      setSelectedRecipe(null)

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (err) {
      console.error("Error adding meal plan:", err)
      setError("Erreur lors de l'ajout du repas. Veuillez réessayer.")
    }
  }

  const handleEditMeal = async () => {
    if (!currentMeal) return

    try {
      await MealPlannerService.updateMealPlan(currentMeal.id, mealForm)
      setSuccessMessage("Repas mis à jour avec succès!")
      setShowSuccessModal(true)
      setEditMealDialogOpen(false)
      fetchMealPlans()

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (err) {
      console.error("Error updating meal plan:", err)
      setError("Erreur lors de la mise à jour du repas. Veuillez réessayer.")
    }
  }

  const handleDeleteMeal = async () => {
    if (!mealToDelete) return

    try {
      await MealPlannerService.deleteMealPlan(mealToDelete)
      setSuccessMessage("Repas supprimé avec succès!")
      setShowSuccessModal(true)
      fetchMealPlans()

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (err) {
      console.error("Error deleting meal plan:", err)
      setError("Erreur lors de la suppression du repas. Veuillez réessayer.")
    } finally {
      setConfirmDeleteOpen(false)
      setMealToDelete(null)
    }
  }

  const openEditDialog = (meal: MealPlannerResponse) => {
    setCurrentMeal(meal)
    setMealForm({
      planningDate: new Date(meal.planningDate).toISOString().split("T")[0],
      dayOfWeek: meal.dayOfWeek,
      mealType: meal.mealType,
      servings: meal.servings,
      notes: meal.notes || "",
    })
    setEditMealDialogOpen(true)
  }

  const confirmDelete = (id: number) => {
    setMealToDelete(id)
    setConfirmDeleteOpen(true)
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const getMealsByDay = () => {
    const mealsByDay: Record<string, MealPlannerResponse[]> = {}

    DAYS_OF_WEEK.forEach((day) => {
      mealsByDay[day.value] = mealPlans.filter((meal) => meal.dayOfWeek === day.value)
    })

    return mealsByDay
  }

  const getMealTypeLabel = (type: string) => {
    return MEAL_TYPES.find((meal) => meal.value === type)?.label || type
  }

  const getDayLabel = (day: string) => {
    return DAYS_OF_WEEK.find((d) => d.value === day)?.label || day
  }

  if (loading && mealPlans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre planificateur de repas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-rose-500" />
            <span className="font-medium text-xl">Cuisenio</span>
          </Link>

          <nav
            className={`${mobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-6 md:p-0 space-y-4 md:space-y-0 md:space-x-6 items-center shadow-md md:shadow-none z-50`}
          >
            <Link
              to="/home"
              className="text-sm font-medium transition-colors duration-200 text-gray-600 hover:text-rose-500"
            >
              Communauté
            </Link>
            <Link to="/meal-planner" className="text-sm font-medium transition-colors duration-200 text-rose-500">
              Planificateur
            </Link>

            {/* Notifications */}
            {isAuthenticated && (
              <button className="p-1 rounded-full hover:bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-rose-500 rounded-full"></span>
              </button>
            )}

            {/* User menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                    <Avatar className="h-8 w-8 border">
                      <Image
                        src={user?.profilePicture || "/placeholder.svg?height=40&width=40"}
                        alt="Profile"
                        width={40}
                        height={40}
                      />
                    </Avatar>
                    <span className="text-sm font-medium hidden md:inline">{user?.firstName || "Utilisateur"}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link to="/mes-recettes">
                    <DropdownMenuItem className="cursor-pointer">
                      <BookmarkIcon className="mr-2 h-4 w-4" />
                      <span>Mes recettes sauvegardées</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white">Se connecter</Button>
              </Link>
            )}
          </nav>

          <button onClick={toggleMobileMenu} className="md:hidden text-gray-800">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Planificateur de Repas</h1>
                <p className="text-gray-600 mt-2">Organisez vos repas de la semaine et simplifiez votre quotidien</p>
              </div>
              <Button
                onClick={() => setAddMealDialogOpen(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Ajouter un repas
              </Button>
            </div>

            {error && <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg mb-6">{error}</div>}
          </div>

          {/* Weekly Meal Planner */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-rose-500" />
                Planning de la semaine
              </h2>
            </div>

            <div className="p-6">
              {mealPlans.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun repas planifié</h3>
                  <p className="text-gray-500 mb-6">Commencez à planifier vos repas pour la semaine.</p>
                  <Button
                    onClick={() => setAddMealDialogOpen(true)}
                    className="bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    Ajouter votre premier repas
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(getMealsByDay()).map(([day, meals]) => (
                    <div key={day} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <h3 className="text-lg font-medium mb-4">{getDayLabel(day)}</h3>

                      {meals.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-gray-500">Aucun repas planifié pour ce jour</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setMealForm((prev) => ({ ...prev, dayOfWeek: day }))
                              setAddMealDialogOpen(true)
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Ajouter
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {meals.map((meal) => (
                            <Card key={meal.id} className="overflow-hidden hover:shadow-md transition-shadow">
                              <div className="flex">
                                <div className="relative w-1/3">
                                  <Image
                                    src={
                                      meal.recipe.imageUrl
                                        ? `http://localhost:8080/uploads/${meal.recipe.imageUrl}`
                                        : "/placeholder.svg?height=150&width=150"
                                    }
                                    alt={meal.recipe.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="w-2/3 p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <Badge className="mb-2 bg-rose-100 text-rose-700">
                                        {getMealTypeLabel(meal.mealType)}
                                      </Badge>
                                      <h4 className="font-medium text-sm line-clamp-1">{meal.recipe.title}</h4>
                                    </div>
                                    <div className="flex space-x-1">
                                      <button
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                        onClick={() => openEditDialog(meal)}
                                      >
                                        <Edit className="h-4 w-4 text-gray-500" />
                                      </button>
                                      <button
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                        onClick={() => confirmDelete(meal.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-gray-500" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500 mt-2">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{meal.recipe.preparationTime + (meal.recipe.cookingTime || 0)} min</span>
                                    <span className="mx-2">•</span>
                                    <span>
                                      {meal.servings} {meal.servings > 1 ? "portions" : "portion"}
                                    </span>
                                  </div>
                                  {meal.notes && (
                                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{meal.notes}</p>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                          <Button
                            variant="outline"
                            className="h-full min-h-[100px] border-dashed flex flex-col items-center justify-center gap-2"
                            onClick={() => {
                              setMealForm((prev) => ({ ...prev, dayOfWeek: day }))
                              setAddMealDialogOpen(true)
                            }}
                          >
                            <Plus className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-500">Ajouter un repas</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Meal Dialog */}
      <Dialog open={addMealDialogOpen} onOpenChange={setAddMealDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un repas au planning</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Recipe Selection */}
            <div className="space-y-2">
              <Label htmlFor="recipe">Recette</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto p-2 border rounded-md">
                {loadingRecipes ? (
                  <div className="col-span-full text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-rose-500 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Chargement des recettes...</p>
                  </div>
                ) : recipes.length === 0 ? (
                  <div className="col-span-full text-center py-4">
                    <p className="text-gray-500">Aucune recette disponible</p>
                    <Link to="/home" className="text-rose-500 text-sm hover:underline mt-1 inline-block">
                      Ajouter une recette
                    </Link>
                  </div>
                ) : (
                  recipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className={`p-2 rounded-lg border cursor-pointer flex items-center gap-3 ${
                        selectedRecipe?.id === recipe.id
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={
                            recipe.imageUrl
                              ? `http://localhost:8080/uploads/${recipe.imageUrl}`
                              : "/placeholder.svg?height=50&width=50"
                          }
                          alt={recipe.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{recipe.title}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{recipe.preparationTime + (recipe.cookingTime || 0)} min</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Day and Meal Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dayOfWeek">Jour</Label>
                <Select value={mealForm.dayOfWeek} onValueChange={(value) => handleInputChange("dayOfWeek", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un jour" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mealType">Type de repas</Label>
                <Select value={mealForm.mealType} onValueChange={(value) => handleInputChange("mealType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAL_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Servings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="planningDate">Date</Label>
                <Input
                  id="planningDate"
                  type="date"
                  value={mealForm.planningDate}
                  onChange={(e) => handleInputChange("planningDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Nombre de portions</Label>
                <Input
                  id="servings"
                  type="number"
                  min={1}
                  value={mealForm.servings}
                  onChange={(e) => handleInputChange("servings", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Ajoutez des notes ou des modifications à la recette..."
                value={mealForm.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMealDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-rose-500 hover:bg-rose-600 text-white"
              onClick={handleAddMeal}
              disabled={!selectedRecipe}
            >
              Ajouter au planning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Meal Dialog */}
      <Dialog open={editMealDialogOpen} onOpenChange={setEditMealDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le repas</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {currentMeal && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={
                      currentMeal.recipe.imageUrl
                        ? `http://localhost:8080/uploads/${currentMeal.recipe.imageUrl}`
                        : "/placeholder.svg?height=64&width=64"
                    }
                    alt={currentMeal.recipe.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{currentMeal.recipe.title}</h4>
                  <p className="text-sm text-gray-500">
                    {currentMeal.recipe.preparationTime + (currentMeal.recipe.cookingTime || 0)} min
                  </p>
                </div>
              </div>
            )}

            {/* Day and Meal Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dayOfWeek">Jour</Label>
                <Select value={mealForm.dayOfWeek} onValueChange={(value) => handleInputChange("dayOfWeek", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un jour" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mealType">Type de repas</Label>
                <Select value={mealForm.mealType} onValueChange={(value) => handleInputChange("mealType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAL_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Servings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="planningDate">Date</Label>
                <Input
                  id="planningDate"
                  type="date"
                  value={mealForm.planningDate}
                  onChange={(e) => handleInputChange("planningDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Nombre de portions</Label>
                <Input
                  id="servings"
                  type="number"
                  min={1}
                  value={mealForm.servings}
                  onChange={(e) => handleInputChange("servings", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Ajoutez des notes ou des modifications à la recette..."
                value={mealForm.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMealDialogOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white" onClick={handleEditMeal}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Êtes-vous sûr de vouloir supprimer ce repas du planning ? Cette action est irréversible.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDeleteMeal} className="bg-red-500 hover:bg-red-600 text-white">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg p-4 flex items-center border-l-4 border-green-500"
            >
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <p className="font-medium">{successMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

