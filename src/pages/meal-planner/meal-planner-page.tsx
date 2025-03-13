"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChefHat,
  Clock,
  Download,
  Filter,
  Menu,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Checkbox } from "../../components/ui/checkbox"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

interface MealItem {
  name: string
  time: string
  image: string
}

interface DayMeals {
  [key: string]: MealItem
}

interface MealPlanType {
  [key: string]: DayMeals
}

// Enum pour les types de repas
enum MealType {
  BREAKFAST = "Petit-déjeuner",
  LUNCH = "Déjeuner",
  DINNER = "Dîner",
  SNACK = "Collation",
}

// Enum pour les jours de la semaine
enum DayOfWeek {
  MONDAY = "Lundi",
  TUESDAY = "Mardi",
  WEDNESDAY = "Mercredi",
  THURSDAY = "Jeudi",
  FRIDAY = "Vendredi",
  SATURDAY = "Samedi",
  SUNDAY = "Dimanche",
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

export default function MealPlannerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentWeek, setCurrentWeek] = useState("Cette semaine")
  const [showFilters, setShowFilters] = useState(false)
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const [openAddDialog, setOpenAddDialog] = useState<string | null>(null)
  const [newPlanDialogOpen, setNewPlanDialogOpen] = useState(false)

  // États pour le formulaire de nouveau plan
  const [planDate, setPlanDate] = useState<string>("")
  const [planDay, setPlanDay] = useState<DayOfWeek | "">("")
  const [planMealType, setPlanMealType] = useState<MealType | "">("")
  const [planServings, setPlanServings] = useState<string>("")
  const [planNotes, setPlanNotes] = useState<string>("")
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null)

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const toggleFilters = () => setShowFilters(!showFilters)

  // Jours de la semaine
  const weekDays = Object.values(DayOfWeek)

  // Repas de la journée
  const mealTypes = Object.values(MealType)

  // Fonction pour créer un nouveau plan
  const handleCreateNewPlan = () => {
    // Ici vous pourriez appeler votre API pour créer un nouveau plan
    console.log({
      planningDate: planDate,
      dayOfWeek: planDay,
      mealType: planMealType,
      servings: planServings ? Number.parseInt(planServings) : null,
      notes: planNotes,
      recipeId: selectedRecipe,
    })

    // Réinitialiser le formulaire
    setPlanDate("")
    setPlanDay("")
    setPlanMealType("")
    setPlanServings("")
    setPlanNotes("")
    setSelectedRecipe(null)

    // Fermer le dialogue
    setNewPlanDialogOpen(false)
  }

  // Exemple de plan de repas
  const mealPlan: MealPlanType = {
    Lundi: {
      "Petit-déjeuner": { name: "Smoothie aux fruits", time: "10 min", image: "/placeholder.svg?height=100&width=100" },
      Déjeuner: { name: "Salade César", time: "20 min", image: "/placeholder.svg?height=100&width=100" },
      Dîner: { name: "Poulet rôti aux herbes", time: "60 min", image: "/placeholder.svg?height=100&width=100" },
    },
    Mardi: {
      "Petit-déjeuner": { name: "Avocado toast", time: "15 min", image: "/placeholder.svg?height=100&width=100" },
      Déjeuner: { name: "Wrap au poulet", time: "15 min", image: "/placeholder.svg?height=100&width=100" },
      Dîner: { name: "Pâtes à la carbonara", time: "30 min", image: "/placeholder.svg?height=100&width=100" },
    },
    Mercredi: {
      "Petit-déjeuner": { name: "Porridge aux fruits", time: "10 min", image: "/placeholder.svg?height=100&width=100" },
      Déjeuner: { name: "Buddha bowl", time: "25 min", image: "/placeholder.svg?height=100&width=100" },
      Dîner: { name: "Saumon grillé", time: "25 min", image: "/placeholder.svg?height=100&width=100" },
    },
    Jeudi: {
      "Petit-déjeuner": { name: "Œufs brouillés", time: "10 min", image: "/placeholder.svg?height=100&width=100" },
      Déjeuner: { name: "Quiche aux légumes", time: "45 min", image: "/placeholder.svg?height=100&width=100" },
      Dîner: { name: "Curry de légumes", time: "35 min", image: "/placeholder.svg?height=100&width=100" },
    },
    Vendredi: {
      "Petit-déjeuner": { name: "Pancakes", time: "20 min", image: "/placeholder.svg?height=100&width=100" },
      Déjeuner: { name: "Soupe de légumes", time: "30 min", image: "/placeholder.svg?height=100&width=100" },
      Dîner: { name: "Pizza maison", time: "45 min", image: "/placeholder.svg?height=100&width=100" },
    },
    Samedi: {
      "Petit-déjeuner": { name: "Granola maison", time: "10 min", image: "/placeholder.svg?height=100&width=100" },
      Déjeuner: { name: "Burger végétarien", time: "30 min", image: "/placeholder.svg?height=100&width=100" },
      Dîner: { name: "Risotto aux champignons", time: "40 min", image: "/placeholder.svg?height=100&width=100" },
    },
    Dimanche: {
      "Petit-déjeuner": { name: "Brunch complet", time: "30 min", image: "/placeholder.svg?height=100&width=100" },
      Déjeuner: { name: "Rôti de bœuf", time: "90 min", image: "/placeholder.svg?height=100&width=100" },
      Dîner: { name: "Soupe miso", time: "20 min", image: "/placeholder.svg?height=100&width=100" },
    },
  }

  // Exemple de liste de courses
  const shoppingList = [
    {
      category: "Fruits et Légumes",
      items: [
        { name: "Avocats", quantity: "3", checked: false },
        { name: "Tomates", quantity: "500g", checked: true },
        { name: "Salade", quantity: "1", checked: false },
        { name: "Carottes", quantity: "6", checked: false },
        { name: "Pommes", quantity: "4", checked: true },
      ],
    },
    {
      category: "Viandes et Poissons",
      items: [
        { name: "Poulet", quantity: "1kg", checked: false },
        { name: "Saumon", quantity: "400g", checked: false },
        { name: "Bœuf haché", quantity: "500g", checked: true },
      ],
    },
    {
      category: "Produits Laitiers",
      items: [
        { name: "Œufs", quantity: "12", checked: false },
        { name: "Fromage râpé", quantity: "200g", checked: false },
        { name: "Yaourt nature", quantity: "4", checked: true },
      ],
    },
    {
      category: "Épicerie",
      items: [
        { name: "Pâtes", quantity: "500g", checked: false },
        { name: "Riz", quantity: "1kg", checked: true },
        { name: "Huile d'olive", quantity: "1", checked: false },
        { name: "Curry en poudre", quantity: "1", checked: false },
      ],
    },
  ]

  // Recettes suggérées
  const suggestedRecipes = [
    {
      id: 1,
      name: "Lasagnes végétariennes",
      time: "60 min",
      difficulty: "Moyen",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Salade niçoise",
      time: "20 min",
      difficulty: "Facile",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Poulet au citron",
      time: "45 min",
      difficulty: "Facile",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Tarte aux légumes",
      time: "50 min",
      difficulty: "Moyen",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-rose-500" />
            <span className="font-medium text-xl">Cuisenio</span>
          </Link>

          <nav
            className={`${mobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-6 md:p-0 space-y-4 md:space-y-0 md:space-x-8 items-center shadow-md md:shadow-none z-50`}
          >
            {["Recettes", "Ingrédients", "Communauté", "Planificateur"].map((item) => (
              <Link
                key={item}
                to={item === "Communauté" ? "/community" : item === "Planificateur" ? "/meal-planner" : "#"}
                className={`text-sm font-medium transition-colors duration-200 ${
                  item === "Planificateur" ? "text-rose-500" : "text-gray-600 hover:text-rose-500"
                }`}
              >
                {item}
              </Link>
            ))}
            <Link to="/auth/login">
              <Button variant="default" className="bg-rose-500 hover:bg-rose-600 text-white">
                Connexion
              </Button>
            </Link>
          </nav>

          <button onClick={toggleMobileMenu} className="md:hidden text-gray-800">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Meal Planner Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Planificateur de Repas</h1>
                <p className="text-gray-600">
                  Organisez vos repas de la semaine et générez automatiquement votre liste de courses
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" /> Exporter
                </Button>
                <Button
                  className="bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-2"
                  onClick={() => setNewPlanDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" /> Nouveau Plan
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Select value={currentWeek} onValueChange={setCurrentWeek}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner une semaine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semaine précédente">Semaine précédente</SelectItem>
                    <SelectItem value="Cette semaine">Cette semaine</SelectItem>
                    <SelectItem value="Semaine prochaine">Semaine prochaine</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={toggleFilters}>
                  <Filter className="h-4 w-4" /> Filtres
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Calendrier
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Filtres</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="diet" className="text-sm">
                    Régime alimentaire
                  </Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="diet" className="w-full mt-1">
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="vegetarian">Végétarien</SelectItem>
                      <SelectItem value="vegan">Végan</SelectItem>
                      <SelectItem value="gluten-free">Sans gluten</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time" className="text-sm">
                    Temps de préparation
                  </Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="time" className="w-full mt-1">
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="15">Moins de 15 min</SelectItem>
                      <SelectItem value="30">Moins de 30 min</SelectItem>
                      <SelectItem value="60">Moins de 60 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty" className="text-sm">
                    Difficulté
                  </Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="difficulty" className="w-full mt-1">
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="easy">Facile</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="hard">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" className="mr-2">
                  Réinitialiser
                </Button>
                <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white">
                  Appliquer
                </Button>
              </div>
            </div>
          )}

          {/* Meal Planner Tabs */}
          <Tabs defaultValue="planner" className="mb-10">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="planner" className="text-sm">
                Planificateur
              </TabsTrigger>
              <TabsTrigger value="shopping" className="text-sm">
                Liste de Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="planner">
              {/* Meal Planner Grid */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 bg-gray-50 border text-left font-medium text-sm"></th>
                      {weekDays.map((day) => (
                        <th key={day} className="p-3 bg-gray-50 border text-left font-medium text-sm">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mealTypes.map((mealType) => (
                      <tr key={mealType}>
                        <td className="p-3 border font-medium text-sm bg-gray-50">{mealType}</td>
                        {weekDays.map((day) => (
                          <td key={`${day}-${mealType}`} className="p-2 border">
                            {mealPlan[day]?.[mealType] ? (
                              <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 flex-shrink-0">
                                  <Image
                                    src={mealPlan[day][mealType].image || "/placeholder.svg"}
                                    alt={mealPlan[day][mealType].name}
                                    fill
                                    className="object-cover rounded-md"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{mealPlan[day][mealType].name}</p>
                                  <p className="text-xs text-gray-500 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" /> {mealPlan[day][mealType].time}
                                  </p>
                                </div>
                                <Dialog
                                  open={openDialog === `${day}-${mealType}`}
                                  onOpenChange={(open) => setOpenDialog(open ? `${day}-${mealType}` : null)}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setOpenDialog(`${day}-${mealType}`)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Modifier le repas</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <p className="text-sm font-medium">
                                        {day} - {mealType}
                                      </p>
                                      <div className="grid grid-cols-1 gap-4">
                                        {suggestedRecipes.map((recipe) => (
                                          <div
                                            key={recipe.id}
                                            className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                          >
                                            <div className="relative h-16 w-16 flex-shrink-0">
                                              <Image
                                                src={recipe.image || "/placeholder.svg"}
                                                alt={recipe.name}
                                                fill
                                                className="object-cover rounded-md"
                                              />
                                            </div>
                                            <div className="flex-1">
                                              <p className="font-medium">{recipe.name}</p>
                                              <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="h-3 w-3 mr-1" /> {recipe.time}
                                                <Badge className="ml-2 bg-gray-100 text-gray-700 hover:bg-gray-200">
                                                  {recipe.difficulty}
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            ) : (
                              <Dialog
                                open={openAddDialog === `${day}-${mealType}`}
                                onOpenChange={(open) => setOpenAddDialog(open ? `${day}-${mealType}` : null)}
                              >
                                <Button
                                  variant="ghost"
                                  className="w-full h-12 border-dashed border-2 border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200"
                                  onClick={() => setOpenAddDialog(`${day}-${mealType}`)}
                                >
                                  <Plus className="h-4 w-4 mr-2" /> Ajouter
                                </Button>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Ajouter un repas</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <p className="text-sm font-medium">
                                      {day} - {mealType}
                                    </p>
                                    <div className="relative">
                                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                      <input
                                        type="text"
                                        placeholder="Rechercher une recette..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 transition"
                                      />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                      {suggestedRecipes.map((recipe) => (
                                        <div
                                          key={recipe.id}
                                          className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                        >
                                          <div className="relative h-16 w-16 flex-shrink-0">
                                            <Image
                                              src={recipe.image || "/placeholder.svg"}
                                              alt={recipe.name}
                                              fill
                                              className="object-cover rounded-md"
                                            />
                                          </div>
                                          <div className="flex-1">
                                            <p className="font-medium">{recipe.name}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                              <Clock className="h-3 w-3 mr-1" /> {recipe.time}
                                              <Badge className="ml-2 bg-gray-100 text-gray-700 hover:bg-gray-200">
                                                {recipe.difficulty}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="shopping">
              {/* Shopping List */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-rose-500" /> Liste de Courses
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" /> Exporter
                    </Button>
                    <Button variant="outline" size="sm" className="text-rose-500 border-rose-200 hover:bg-rose-50">
                      Tout effacer
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  {shoppingList.map((category, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h4 className="font-medium mb-3 pb-2 border-b">{category.category}</h4>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center gap-3">
                            <Checkbox id={`item-${index}-${itemIndex}`} checked={item.checked} />
                            <Label
                              htmlFor={`item-${index}-${itemIndex}`}
                              className={`flex-1 flex justify-between ${item.checked ? "line-through text-gray-400" : ""}`}
                            >
                              <span>{item.name}</span>
                              <span className="text-gray-500">{item.quantity}</span>
                            </Label>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-rose-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ajouter un article..."
                      className="flex-1 py-2 px-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 transition"
                    />
                    <Select defaultValue="fruits">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fruits">Fruits et Légumes</SelectItem>
                        <SelectItem value="meat">Viandes et Poissons</SelectItem>
                        <SelectItem value="dairy">Produits Laitiers</SelectItem>
                        <SelectItem value="grocery">Épicerie</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-rose-500 hover:bg-rose-600 text-white">Ajouter</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Recipe Suggestions */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Suggestions de Recettes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 group cursor-pointer"
                >
                  <div className="relative h-48">
                    <Image
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white h-8 w-8 p-0 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-1 group-hover:text-rose-500 transition-colors">
                      {recipe.name}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {recipe.time}
                      </span>
                      <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200">{recipe.difficulty}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Dialogue pour créer un nouveau plan de repas */}
      <Dialog open={newPlanDialogOpen} onOpenChange={setNewPlanDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un Nouveau Plan de Repas</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="planDate" className="text-sm font-medium">
                  Date de planification
                </Label>
                <Input
                  id="planDate"
                  type="date"
                  value={planDate}
                  onChange={(e) => setPlanDate(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="planDay" className="text-sm font-medium">
                  Jour de la semaine
                </Label>
                <Select value={planDay as string} onValueChange={(value) => setPlanDay(value as DayOfWeek)}>
                  <SelectTrigger id="planDay" className="mt-1">
                    <SelectValue placeholder="Sélectionner un jour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DayOfWeek).map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="planMealType" className="text-sm font-medium">
                  Type de repas
                </Label>
                <Select value={planMealType as string} onValueChange={(value) => setPlanMealType(value as MealType)}>
                  <SelectTrigger id="planMealType" className="mt-1">
                    <SelectValue placeholder="Sélectionner un type de repas" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MealType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="planServings" className="text-sm font-medium">
                  Nombre de portions
                </Label>
                <Input
                  id="planServings"
                  type="number"
                  min="1"
                  value={planServings}
                  onChange={(e) => setPlanServings(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="planNotes" className="text-sm font-medium">
                  Notes
                </Label>
                <Textarea
                  id="planNotes"
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Sélectionner une recette</Label>
                <div className="mt-2 grid grid-cols-1 gap-3 max-h-[150px] overflow-y-auto p-1 border rounded-lg">
                  {suggestedRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className={`flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                        selectedRecipe === recipe.id ? "border-rose-500 bg-rose-50" : ""
                      }`}
                      onClick={() => setSelectedRecipe(recipe.id)}
                    >
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <Image
                          src={recipe.image || "/placeholder.svg"}
                          alt={recipe.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{recipe.name}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" /> {recipe.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setNewPlanDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-rose-500 hover:bg-rose-600 text-white"
              onClick={handleCreateNewPlan}
              disabled={!planDate || !planDay || !planMealType}
            >
              Créer le plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ChefHat className="h-5 w-5 text-rose-500" />
              <span className="font-medium">Cuisenio</span>
            </div>
            <div className="flex space-x-6">
              {["Confidentialité", "Conditions", "Contact"].map((item) => (
                <Link key={item} to="#" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                  {item}
                </Link>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-4 md:mt-0">
              © {new Date().getFullYear()} Cuisenio. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

