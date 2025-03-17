
import {
  Bell,
  BookmarkIcon,
  Calendar,
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
  Settings,
  Share2,
  User,
  Users,
  X,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Avatar } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Checkbox } from "../../components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Label } from "../../components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Slider } from "../../components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Textarea } from "../../components/ui/textarea"
import { useRecipe } from "../../hooks/useRecipe"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/auth.store"
import type { RecipeResponse } from "../../types/recipe.types"

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

type CommentType = {
  id: number
  user: string
  avatar: string
  date: string
  text: string
  likes: number
  replies: Reply[]
}

interface Reply {
  id: number
  user: string
  avatar: string
  date: string
  text: string
  likes: number
}

export default function CommunityPage() {
  const { isAuthenticated } = useAuthStore()
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

  const [filterCategory, setFilterCategory] = useState("")
  const [sortOption, setSortOption] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState([15, 60])
  const [dietaryOptions, setDietaryOptions] = useState<string[]>([])
  const [ isPopupOpen, setIsPopupOpen] = useState(false)
  const [ recipeId, setRecipeId] = useState<number | null>(null)

  // Handle search with filters
  const handleSearch = useCallback(() => {
    const difficulty = difficultyFilter.length > 0 ? difficultyFilter[0] : undefined
    searchRecipes(
      searchTerm,
      difficulty,
      timeRange[1], // maxPrepTime
      undefined, // maxCookTime
      filterCategory || undefined,
      undefined, // isApproved
    )
  }, [searchTerm, difficultyFilter, timeRange, filterCategory, searchRecipes])

  // Apply filters
  const applyFilters = () => {
    handleSearch()
    setShowFilters(false)
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const handleCommentSubmit = () => {
    console.log("Posted comment:", commentText)
    setCommentText("")
    setCommentDialogOpen(false)
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
    setCommentDialogOpen(true)
  }
 const handleAddImageClick = (recipeId: number) => {
  setRecipeId(recipeId)
  setIsPopupOpen(true)
 }
  // Initial data fetch
  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  // Handle search term changes
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

  const comments: CommentType[] = [
    {
      id: 1,
      user: "Claire Moreau",
      avatar: "/placeholder.svg?height=50&width=50",
      date: "Il y a 2 jours",
      text: "J'ai essayé cette recette hier soir et c'était délicieux ! J'ai ajouté un peu plus de cannelle et le résultat était parfait. Merci pour le partage !",
      likes: 8,
      replies: [],
    },
    {
      id: 2,
      user: "Lucas Bernard",
      avatar: "/placeholder.svg?height=50&width=50",
      date: "Il y a 5 jours",
      text: "Super recette ! Simple à réaliser et très savoureuse. Toute ma famille a adoré.",
      likes: 5,
      replies: [],
    },
    {
      id: 3,
      user: "Emma Petit",
      avatar: "/placeholder.svg?height=50&width=50",
      date: "Il y a 1 semaine",
      text: "Est-ce qu'on peut remplacer le beurre par de l'huile d'olive ? J'aimerais essayer une version plus légère.",
      likes: 2,
      replies: [
        {
          id: 1,
          user: "Marie Dubois",
          avatar: "/placeholder.svg?height=50&width=50",
          date: "Il y a 6 jours",
          text: "Bonjour Emma ! Oui, vous pouvez remplacer le beurre par de l'huile d'olive pour une version plus légère. La texture sera un peu différente, mais toujours délicieuse !",
          likes: 3,
        },
      ],
    },
  ]

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
            {["Recettes", "Ingrédients", "Communauté", "Planificateur"].map((item) => (
              <Link
                key={item}
                to={item === "Communauté" ? "/community" : item === "Planificateur" ? "/meal-planner" : "#"}
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
            {isAuthenticated && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-rose-500 rounded-full"></span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0 border">
                          <Image src="/placeholder.svg?height=40&width=40" alt="User" width={40} height={40} />
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Marie Dubois</span> a aimé votre recette
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Il y a 2 heures</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0 border">
                          <Image src="/placeholder.svg?height=40&width=40" alt="User" width={40} height={40} />
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Thomas Martin</span> a commenté votre recette
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Il y a 5 heures</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0 border">
                          <Image src="/placeholder.svg?height=40&width=40" alt="User" width={40} height={40} />
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Sophie Laurent</span> vous a mentionné dans un commentaire
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Il y a 1 jour</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-t border-gray-100 text-center">
                    <Button variant="ghost" className="text-rose-500 text-sm p-0 h-auto">
                      Voir toutes les notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* User menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                    <Avatar className="h-8 w-8 border">
                      <Image src="/placeholder.svg?height=40&width=40" alt="Profile" width={40} height={40} />
                    </Avatar>
                    <span className="text-sm font-medium hidden md:inline">Utilisateur</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <BookmarkIcon className="mr-2 h-4 w-4" />
                    <span>Mes recettes sauvegardées</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => useAuthStore.getState().logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="recettes" className="text-sm">
                Recettes Partagées
              </TabsTrigger>
              <TabsTrigger value="discussions" className="text-sm">
                Discussions
              </TabsTrigger>
              <TabsTrigger value="evenements" className="text-sm">
                Événements
              </TabsTrigger>
            </TabsList>

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
                        <Image
                        src={ "http://localhost:8080/uploads/" + recipe.imageUrl}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                        ):(
                          <button onClick={() => handleAddImageClick(recipe.id)}> add image</button>
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
                          <button className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors">
                            <Share2 className="h-4 w-4 text-gray-600 hover:text-rose-500" />
                          </button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-medium mb-1 group-hover:text-rose-500 transition-colors">
                          {recipe.title}
                        </h3>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                          <span>Par {recipe.chef?.username || "Chef inconnu"}</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> {recipe.preparationTime + (recipe.cookingTime || 0)} min
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
                              <Avatar className="h-8 w-8 mr-2 border">
                                <Image
                                  src={recipe.chef?.profilePicture || "/placeholder.svg?height=40&width=40"}
                                  alt={recipe.chef?.username || "Chef"}
                                  width={40}
                                  height={40}
                                />
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{recipe.chef?.username}</p>
                                <p className="text-xs text-gray-500">
                                  Partagé le {new Date(recipe.creationDate).toLocaleDateString()}
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
                            <Button className="bg-rose-500 hover:bg-rose-600 text-white">Voir la recette</Button>
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

            <TabsContent value="discussions">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                  <Users className="h-12 w-12 mx-auto text-rose-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Discussions de la communauté</h3>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    Rejoignez les conversations sur vos sujets culinaires préférés, posez vos questions et partagez vos
                    astuces avec d'autres passionnés de cuisine.
                  </p>
                  <Button className="bg-rose-500 hover:bg-rose-600 text-white">Démarrer une discussion</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base font-medium">
                            Comment réussir une pâte à pizza croustillante ?
                          </CardTitle>
                          <Badge className="bg-gray-100 text-gray-700">Techniques</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">
                          J'ai du mal à obtenir une pâte à pizza croustillante. Quelles sont vos astuces pour éviter
                          qu'elle ne soit trop molle au centre ?
                        </CardDescription>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2 border">
                              <Image src="/placeholder.svg?height=30&width=30" alt="User" width={30} height={30} />
                            </Avatar>
                            <span className="text-xs text-gray-500">Jean Dupont • Il y a 2 jours</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <MessageCircle className="h-3 w-3 mr-1" /> 12 réponses
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evenements">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                  <Calendar className="h-12 w-12 mx-auto text-rose-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Événements culinaires</h3>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    Découvrez les prochains événements et ateliers de cuisine, rencontrez d'autres passionnés et
                    perfectionnez vos compétences culinaires.
                  </p>
                  <Button className="bg-rose-500 hover:bg-rose-600 text-white">Voir tous les événements</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      <div className="relative h-40">
                        <Image
                          src="/placeholder.svg?height=200&width=300"
                          alt="Événement"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge className="mb-2 bg-rose-100 text-rose-700">Atelier</Badge>
                        <h4 className="font-medium mb-1">Masterclass Pâtisserie Française</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Apprenez à réaliser des desserts français classiques avec notre chef pâtissier.
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>15 juin 2023 • 14h00</span>
                          <span>Paris</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
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
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2 border">
                          <Image src={comment.avatar || "/placeholder.svg"} alt={comment.user} width={40} height={40} />
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{comment.user}</p>
                          <p className="text-xs text-gray-500">{comment.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <button className="p-1 hover:text-rose-500">
                          <Heart className="h-4 w-4" />
                        </button>
                        <span className="text-xs ml-1">{comment.likes}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-gray-700">{comment.text}</p>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">
                          {comment.replies.length} réponse{comment.replies.length > 1 ? "s" : ""}
                        </p>
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-2 mb-2">
                            <Avatar className="h-6 w-6 flex-shrink-0 border">
                              <Image src={reply.avatar || "/placeholder.svg"} alt={reply.user} width={30} height={30} />
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <p className="text-xs font-medium">{reply.user}</p>
                                <p className="text-xs text-gray-700">{reply.text}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                      <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-100 shadow-md">
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
          </div>

          {/* Add Comment */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0 border">
                <Image src="/placeholder.svg?height=40&width=40" alt="Votre avatar" width={40} height={40} />
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
          const recipeId = await createRecipe(recipeData);
          return recipeId;
        }}
      />

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

      { recipeId && isPopupOpen &&
         <ImageUploadDialog 
         open={isPopupOpen} 
         onOpenChange={setIsPopupOpen} 
         recipeId={recipeId} 
       />
      }
    </div>
  )
}

