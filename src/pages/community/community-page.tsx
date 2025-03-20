
import {
  BookmarkIcon,
  ChefHat,
  ChevronDown,
  Clock,
  Filter,
  Heart,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Send,
  User,
  X,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Avatar , AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { Checkbox } from "../../components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Label } from "../../components/ui/label"
import { Slider } from "../../components/ui/slider"
import { Tabs, TabsContent} from "../../components/ui/tabs"
import { Textarea } from "../../components/ui/textarea"
import { useRecipe } from "../../hooks/useRecipe"
import { useComments } from "../../hooks/useComments"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/auth.store"
import type { RecipeResponse } from "../../types/recipe.types"

import { authService } from "../../api/auth.service"
import { recipeService } from "../../api/recipe.service"
import AddRecipeDialog from "./AddRecipeForm"
import { ImageUploadDialog } from "./add-image"

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

export default function CommunityPage() {
  const { isAuthenticated, user } = useAuthStore()
  const { recipes, loading, error, page, totalPages, fetchRecipes, searchRecipes, createRecipe, nextPage, prevPage } =
    useRecipe({ pageSize: 9 })

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [addRecipeDialogOpen, setAddRecipeDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [activeRecipe, setActiveRecipe] = useState<RecipeResponse | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<number | null>(null)

  const [filterCategory, setFilterCategory] = useState("")
  const [sortOption, setSortOption] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState([15, 60])
  const [dietaryOptions, setDietaryOptions] = useState<string[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [recipeId, setRecipeId] = useState<number | null>(null)
  const navigate = useNavigate()

  // Use the comments hook
  const { comments, loading: commentsLoading, error: commentsError, fetchComments, addComment } = useComments()

  const handleSearch = useCallback(() => {
    const difficulty = difficultyFilter.length > 0 ? difficultyFilter[0] : undefined
    searchRecipes(searchTerm, difficulty, timeRange[1], undefined, filterCategory || undefined, undefined)
  }, [searchTerm, difficultyFilter, timeRange, filterCategory, searchRecipes])

  const applyFilters = () => {
    handleSearch()
    setShowFilters(false)
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const handleCommentSubmit = async () => {
    if (!activeRecipe || !commentText.trim()) return

    try {
      await addComment(activeRecipe.id, commentText)
      setCommentText("")
      setSuccessMessage("Commentaire ajouté avec succès!")
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (error) {
      console.error("Error posting comment:", error)
    }
  }

  const handleReplySubmit = (commentId: number) => {
    console.log("Posted reply to comment", commentId, ":", replyText)
    setReplyText("")
    setActiveCommentId(null)
  }

  const handleDifficultyChange = (value: string) => {
    if (difficultyFilter.includes(value)) {
      setDifficultyFilter(difficultyFilter.filter((item) => item !== value))
    } else {
      setDifficultyFilter([...difficultyFilter, value])
    }
  }

  const handleDietaryChange = (value: string) => {
    if (dietaryOptions.includes(value)) {
      setDietaryOptions(dietaryOptions.filter((item) => item !== value))
    } else {
      setDietaryOptions([...dietaryOptions, value])
    }
  }

  const openCommentDialog = (recipe: RecipeResponse) => {
    setActiveRecipe(recipe)
    fetchComments(recipe.id)
    setCommentDialogOpen(true)
  }

  const handleAddImageClick = (recipeId: number) => {
    setRecipeId(recipeId)
    setIsPopupOpen(true)
  }

  const handleDeleteRecipe = async () => {
    if (!recipeToDelete) return

    try {
      await recipeService.deleteRecipe(recipeToDelete)
      setSuccessMessage("Recette supprimée avec succès!")
      setShowSuccessModal(true)
      fetchRecipes() // Refresh the recipes list
      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (error) {
      console.error("Error deleting recipe:", error)
      setSuccessMessage("Erreur lors de la suppression de la recette")
      setShowSuccessModal(true)
    } finally {
      setConfirmDeleteOpen(false)
      setRecipeToDelete(null)
    }
  }

  const confirmDelete = (id: number) => {
    setRecipeToDelete(id)
    setConfirmDeleteOpen(true)
  }

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        handleSearch()
      } else {
        fetchRecipes()
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, handleSearch, fetchRecipes])

  const handleLogout = async () => {
    try {
      await authService.logout()
      setSuccessMessage("Déconnexion réussie !")
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        navigate("/login")
      }, 2000)
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error)
      setSuccessMessage("Erreur lors de la déconnexion. Veuillez réessayer.")
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    }
  }

  const categories = [
    { value: "1", label: "Desserts" },
    { value: "2", label: "Plats principaux" },
    { value: "3", label: "Entrées" },
    { value: "4", label: "Soupes" },
    { value: "5", label: "Salades" },
    { value: "6", label: "Boissons" },
    { value: "7", label: "Apéritifs" },
    { value: "8", label: "Sauces et condiments" },
  ]

  const dietaryPreferences = [
    { value: "vegetarian", label: "Végétarien" },
    { value: "vegan", label: "Végan" },
    { value: "gluten-free", label: "Sans gluten" },
    { value: "lactose-free", label: "Sans lactose" },
    { value: "keto", label: "Keto" },
    { value: "paleo", label: "Paléo" },
  ]

  const difficultyLevels = [
    { value: "EASY", label: "Facile" },
    { value: "MEDIUM", label: "Intermédiaire" },
    { value: "HARD", label: "Difficile" },
  ]

  if (loading && recipes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des recettes...</p>
        </div>
      </div>
    )
  }

  if (error && recipes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Une erreur est survenue</div>
          <p className="text-gray-600">Impossible de charger les recettes. Veuillez réessayer plus tard.</p>
          <Button onClick={() => fetchRecipes()} className="mt-4 bg-rose-500 hover:bg-rose-600 text-white">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Rest of the component remains the same until the comment dialog

  // Replace the comment dialog content with this:
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
            {["Communauté", "Planificateur"].map((item) => (
              <Link
                key={item}
                to={item === "Communauté" ? "/home" : item === "Planificateur" ? "/meal-planner" : "#"}
                className={`text-sm font-medium transition-colors duration-200 ${
                  item === "Communauté" ? "text-rose-500" : "text-gray-600 hover:text-rose-500"
                }`}
              >
                {item}
              </Link>
            ))}

            {/* Add Recipe Button */}
            {isAuthenticated && (
              <Button
                onClick={() => setAddRecipeDialogOpen(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Ajouter une recette
              </Button>
            )}

            {/* Notifications */}


            {/* User menu */}
            {isAuthenticated ? (
           <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
               <Avatar className="h-8 w-8 border">
                 {user?.profilePicture ? (
                   <AvatarImage
                     src={user.profilePicture}
                     alt={user.username || "Utilisateur"}
                   />
                 ) : (
                   <AvatarFallback>
                     <User className="text-[#E57373] text-2xl" />
                   </AvatarFallback>
                 )}
               </Avatar>
               <span className="text-sm font-medium hidden md:inline">{user?.username || "Utilisateur"}</span>
               <ChevronDown className="h-4 w-4 text-gray-500" />
             </Button>
           </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 border-amber-50">
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

                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
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
          {/* Community Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Communauté Cuisenio</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Partagez vos créations culinaires, découvrez de nouvelles recettes et échangez avec d'autres passionnés de
              cuisine
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-0 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 transition"
                />
              </div>

              <Dialog open={showFilters} onOpenChange={setShowFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white border-gray-300 text-gray-700 flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Filtres avancés</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Categories */}
                    <div>
                      <h4 className="font-medium mb-3">Catégories</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <div key={category.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.value}`}
                              checked={filterCategory === category.value}
                              onChange={() =>
                                setFilterCategory(filterCategory === category.value ? "" : category.value)
                              }
                            />
                            <Label htmlFor={`category-${category.value}`} className="text-sm cursor-pointer">
                              {category.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dietary preferences */}
                    <div>
                      <h4 className="font-medium mb-3">Préférences alimentaires</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {dietaryPreferences.map((diet) => (
                          <div key={diet.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`diet-${diet.value}`}
                              checked={dietaryOptions.includes(diet.value)}
                              onChange={() => handleDietaryChange(diet.value)}
                            />
                            <Label htmlFor={`diet-${diet.value}`} className="text-sm cursor-pointer">
                              {diet.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preparation time */}
                    <div>
                      <h4 className="font-medium mb-3">Temps de préparation</h4>
                      <div className="px-2">
                        <Slider
                          defaultValue={timeRange}
                          min={5}
                          max={120}
                          step={5}
                          onValueChange={setTimeRange}
                          className="mb-6"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{timeRange[0]} min</span>
                          <span>à</span>
                          <span>{timeRange[1]} min</span>
                        </div>
                      </div>
                    </div>

                    {/* Difficulty level */}
                    <div>
                      <h4 className="font-medium mb-3">Niveau de difficulté</h4>
                      <div className="space-y-2">
                        {difficultyLevels.map((level) => (
                          <div key={level.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`level-${level.value}`}
                              checked={difficultyFilter.includes(level.value)}
                              onChange={() => handleDifficultyChange(level.value)}
                            />
                            <Label htmlFor={`level-${level.value}`} className="text-sm cursor-pointer">
                              {level.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium mb-3">Trier par</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { value: "creationDate,desc", label: "Plus récent" },
                        { value: "averageRating,desc", label: "Plus populaire" },
                        { value: "totalComments,desc", label: "Plus commenté" },
                        { value: "preparationTime,asc", label: "Temps de préparation" },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`sort-${option.value}`}
                            checked={sortOption === option.value}
                            onChange={() => setSortOption(option.value === sortOption ? "" : option.value)}
                          />
                          <Label htmlFor={`sort-${option.value}`} className="text-sm cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6 border-t border-gray-200 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterCategory("")
                        setSortOption("")
                        setDifficultyFilter([])
                        setTimeRange([15, 60])
                        setDietaryOptions([])
                      }}
                    >
                      Réinitialiser
                    </Button>
                    <Button className="bg-rose-500 hover:bg-rose-600 text-white" onClick={applyFilters}>
                      Appliquer les filtres
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2 mt-3 w-full">
                <Badge variant="outline" className="bg-white cursor-pointer hover:bg-gray-50">
                  Tous
                </Badge>
                <Badge variant="outline" className="bg-white cursor-pointer hover:bg-gray-50">
                  Desserts
                </Badge>
                <Badge variant="outline" className="bg-white cursor-pointer hover:bg-gray-50">
                  Plats principaux
                </Badge>
                <Badge variant="outline" className="bg-white cursor-pointer hover:bg-gray-50">
                  Entrées
                </Badge>
                <Badge variant="outline" className="bg-white cursor-pointer hover:bg-gray-50">
                  Végétarien
                </Badge>
                <Badge variant="outline" className="bg-white cursor-pointer hover:bg-gray-50">
                  Facile
                </Badge>
                <Badge variant="outline" className="bg-white cursor-pointer hover:bg-gray-50">
                  Tendance
                </Badge>
              </div>
            </div>
          </div>

          {/* Community Tabs */}
          <Tabs defaultValue="recettes" className="mb-10">


            <TabsContent value="recettes" className="space-y-8">
              {/* All Recipes as Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.length > 0 ? (
                  recipes.map((recipe, index) => (
                    <Card
                      key={recipe.id}
                      className={cn(
                        "overflow-hidden group cursor-pointer hover:shadow-md transition-shadow",
                        index === 0 ? "sm:col-span-2 lg:col-span-3" : "",
                      )}
                    >
                      <div className={cn("relative", index === 0 ? "h-64 md:h-80" : "h-48")}>
                        {recipe.imageUrl ? (
                          <Link to={`/recipe/${recipe.id}`}>
                            <Image
                              src={"http://localhost:8080/uploads/" + recipe.imageUrl || "/placeholder.svg"}
                              alt={recipe.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>
                        ) : (
                          <div
                            onClick={() => handleAddImageClick(recipe.id)}
                            className="w-full h-full flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                              <Plus className="h-6 w-6 text-rose-500" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">Ajouter une image</p>
                            <p className="text-xs text-gray-500 mt-1">Cliquez pour télécharger</p>
                          </div>
                        )}
                        {recipe.averageRating >= 4.5 && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-rose-500 text-white">Tendance</Badge>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 p-2 flex space-x-1">
                          <button className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors">
                            <Heart className="h-4 w-4 text-gray-600 hover:text-rose-500" />
                          </button>
                          <button className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors">
                            <BookmarkIcon className="h-4 w-4 text-gray-600 hover:text-rose-500" />
                          </button>
                     

                          {/* Show edit/delete buttons if user is the recipe owner */}
                          {user && recipe.user && user.id === recipe.user.id && (
                            <>
                              <Link
                                to={`/edit-recipe/${recipe.id}`}
                                className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors"
                              >
                                <Edit className="h-4 w-4 text-gray-600 hover:text-rose-500" />
                              </Link>
                              <button
                                className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  confirmDelete(recipe.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <Link to={`/recipe/${recipe.id}`}>
                          <h3 className="text-lg font-medium mb-1 group-hover:text-rose-500 transition-colors">
                            {recipe.title}
                          </h3>
                        </Link>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                          <span>
                            Par{" "}
                            {[recipe.user?.username, recipe.user?.lastName].filter(Boolean).join(" ") ||
                              "Chef inconnu"}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> {recipe.preparationTime} min
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

                        {index === 0 && recipe.categories && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {recipe.categories.map((category) => (
                              <Badge key={category.id} className="bg-rose-100 text-rose-700 hover:bg-rose-200">
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {index === 0 && (
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                            <Avatar className="h-8 w-8 border">
                 {user?.profilePicture ? (
                   <AvatarImage
                     src={user.profilePicture}
                     alt={user.username || "Utilisateur"}
                   />
                 ) : (
                   <AvatarFallback>
                     <User className="text-[#E57373] text-2xl" />
                   </AvatarFallback>
                 )}
               </Avatar>
                              <div>
                                <p className="text-sm font-medium">{recipe.user?.username || "Chef inconnu"}</p>
                                <p className="text-xs text-gray-500">
                                  Partagé le{" "}
                                  <span className="text-sm text-gray-500">{formatDate(recipe.creationDate)}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {index === 0 && (
                          <div className="flex justify-between items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-rose-500 border-rose-200"
                              onClick={() => openCommentDialog(recipe)}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" /> Commenter
                            </Button>
                            <Link to={`/recipe/${recipe.id}`}>
                              <Button className="bg-rose-500 hover:bg-rose-600 text-white">Voir la recette</Button>
                            </Link>
                          </div>
                        )}
                      </CardContent>

                      {index !== 0 && (
                        <CardFooter className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="flex items-center mr-3">
                                <Heart className="h-3 w-3 mr-1" /> {recipe.totalRatings || 0}
                              </span>
                              <button
                                className="flex items-center hover:text-rose-500"
                                onClick={() => openCommentDialog(recipe)}
                              >
                                <MessageCircle className="h-3 w-3 mr-1" /> {recipe.totalComments || 0}
                              </button>
                            </div>
                            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200">
                              {recipe.difficultyLevel === "EASY"
                                ? "Facile"
                                : recipe.difficultyLevel === "INTERMEDIATE"
                                  ? "Intermédiaire"
                                  : "Difficile"}
                            </Badge>
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">Aucune recette trouvée</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <Button variant="outline" onClick={prevPage} disabled={page === 0} className="px-4">
                    Précédent
                  </Button>
                  <span className="flex items-center px-4">
                    Page {page + 1} sur {totalPages}
                  </span>
                  <Button variant="outline" onClick={nextPage} disabled={page >= totalPages - 1} className="px-4">
                    Suivant
                  </Button>
                </div>
              )}
            </TabsContent>

           
          </Tabs>
        </div>
      </main>

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Commentaires - {activeRecipe?.title}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto py-4">
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
              </div>
            ) : commentsError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Impossible de charger les commentaires</p>
                <Button variant="outline" size="sm" onClick={() => activeRecipe && fetchComments(activeRecipe.id)}>
                  Réessayer
                </Button>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>Aucun commentaire pour cette recette</p>
                <p className="text-sm mt-1">Soyez le premier à donner votre avis !</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                        <Avatar className="h-8 w-8 border">
                 {user?.profilePicture ? (
                    <AvatarImage
                      src={user.profilePicture}
                      alt={user.username || "Utilisateur"}
                    />
                  ) : (
                    <AvatarFallback>
                      <User className="text-[#E57373] text-2xl" />
                    </AvatarFallback>
                  )}
                </Avatar>
                          <div>
                            <p className="font-medium text-sm">{comment.user?.username || "Utilisateur"}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <button className="p-1 hover:text-rose-500">
                            <Heart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500 hover:text-rose-500"
                        onClick={() => setActiveCommentId(comment.id)}
                      >
                        Répondre
                      </Button>

                      {activeCommentId === comment.id && (
                        <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-100 shadow-md z-10">
                          <div className="flex gap-2">
                            <Avatar className="h-6 w-6 flex-shrink-0 border">
                              <Image
                                src="/placeholder.svg?height=30&width=30"
                                alt="Votre avatar"
                                width={30}
                                height={30}
                              />
                            </Avatar>
                            <div className="flex-1 relative">
                              <Textarea
                                placeholder="Écrire une réponse..."
                                className="resize-none text-xs min-h-[60px]"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                              <div className="flex justify-end mt-2 gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => {
                                    setActiveCommentId(null)
                                    setReplyText("")
                                  }}
                                >
                                  Annuler
                                </Button>
                                <Button
                                  size="sm"
                                  className="text-xs bg-rose-500 hover:bg-rose-600 text-white"
                                  disabled={!replyText.trim()}
                                  onClick={() => handleReplySubmit(comment.id)}
                                >
                                  Envoyer
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Add Comment */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex gap-3">
            <Avatar className="h-8 w-8 border">
                 {user?.profilePicture ? (
                   <AvatarImage
                     src={user.profilePicture}
                     alt={user.username || "Utilisateur"}
                   />
                 ) : (
                   <AvatarFallback>
                     <User className="text-[#E57373] text-2xl" />
                   </AvatarFallback>
                 )}
               </Avatar>
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Partagez votre avis sur cette recette..."
                  className="resize-none pr-12 text-sm"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  className={`absolute bottom-3 right-3 p-2 rounded-full ${
                    commentText.trim() ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                  size="sm"
                  disabled={!commentText.trim()}
                  onClick={handleCommentSubmit}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Recipe Dialog */}
      <AddRecipeDialog
        open={addRecipeDialogOpen}
        onOpenChange={setAddRecipeDialogOpen}
        onSubmit={async (recipeData) => {
          const recipeId = await createRecipe(recipeData)
          return recipeId
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Êtes-vous sûr de vouloir supprimer cette recette ? Cette action est irréversible.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteRecipe}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Supprimer
            </Button>
          </DialogFooter>
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

      {recipeId && isPopupOpen && (
        <ImageUploadDialog open={isPopupOpen} onOpenChange={setIsPopupOpen} recipeId={recipeId} />
      )}

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

