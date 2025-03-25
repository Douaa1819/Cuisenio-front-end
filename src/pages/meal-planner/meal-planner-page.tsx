import { useState, useEffect, useRef } from "react"
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
  CalendarDays,
  Utensils,
  ShoppingCart,
  Search,
  Download,
  AlertCircle,
  Loader2,
  Check,
  FileDown,
  SlidersHorizontal,
  Heart,
  Sparkles,
} from "lucide-react"
import { AnimatePresence, motion, useAnimation } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { authService } from "../../api/auth.service"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Checkbox } from "../../components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { useAuthStore } from "../../store/auth.store"
import type { MealPlannerRequest, MealPlannerResponse } from "../../types/mealPlanner.types"
import { recipeService } from "../../api/recipe.service"
import type { RecipeResponse } from "../../types/recipe.types"
import { useMealPlanner } from "../../hooks/useMealPlanner"
import { cn } from "../../lib/utils"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const cardHoverVariants = {
  rest: { scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

const Coffee = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
    <line x1="6" x2="6" y1="2" y2="4"></line>
    <line x1="10" x2="10" y1="2" y2="4"></line>
    <line x1="14" x2="14" y1="2" y2="4"></line>
  </svg>
)

const Apple = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
    <path d="M10 2c1 .5 2 2 2 5"></path>
  </svg>
)

export default function MealPlannerPage() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { mealPlans, loading, error: hookError, createMealPlan, updateMealPlan, deleteMealPlan } = useMealPlanner()
  const [localError, setError] = useState<string | null>(null)
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
  const [activeView, setActiveView] = useState<"week" | "list">("week")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMealType, setFilterMealType] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv" | "ical">("pdf")
  const [exportOptions, setExportOptions] = useState({
    includeNotes: true,
    includeImages: true,
    includeIngredients: true,
    dateRange: "week" as "day" | "week" | "month" | "all",
  })
  const [sortOrder, setSortOrder] = useState<"dayAsc" | "dayDesc" | "typeAsc">("dayAsc")
  const [isExporting, setIsExporting] = useState(false)
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [shoppingListItems, setShoppingListItems] = useState<{ id: number; name: string; checked: boolean }[]>([])
  const [favoriteRecipes, setFavoriteRecipes] = useState<number[]>([])
  const [showRecipeSearch, setShowRecipeSearch] = useState(false)
  const [recipeSearchQuery, setRecipeSearchQuery] = useState("")

  const headerControls = useAnimation()
  const contentRef = useRef<HTMLDivElement>(null)
  const weekViewRef = useRef<HTMLDivElement>(null)
  const listViewRef = useRef<HTMLDivElement>(null)
  const shoppingListRef = useRef<HTMLDivElement>(null)

  const [mealForm, setMealForm] = useState<MealPlannerRequest>({
    planningDate: new Date().toISOString().split("T")[0],
    dayOfWeek: DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].value,
    mealType: "LUNCH",
    servings: 2,
    notes: "",
  })

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
      fetchRecipes()
      setFavoriteRecipes([1, 3, 5])
    } else {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollY = window.scrollY
        if (scrollY > 100) {
          headerControls.start({
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            height: "60px",
            transition: { duration: 0.3 },
          })
        } else {
          headerControls.start({
            backgroundColor: "rgba(255, 255, 255, 1)",
            backdropFilter: "blur(0px)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            height: "72px",
            transition: { duration: 0.3 },
          })
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headerControls])

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
      await createMealPlan(selectedRecipe.id, mealForm)
      setSuccessMessage("Repas ajouté avec succès!")
      setShowSuccessModal(true)
      setAddMealDialogOpen(false)

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
      await updateMealPlan(currentMeal.id, mealForm)
      setSuccessMessage("Repas mis à jour avec succès!")
      setShowSuccessModal(true)
      setEditMealDialogOpen(false)

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
      await deleteMealPlan(mealToDelete)
      setSuccessMessage("Repas supprimé avec succès!")
      setShowSuccessModal(true)

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

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case "BREAKFAST":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "LUNCH":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "DINNER":
        return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "SNACK":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case "BREAKFAST":
        return <Coffee className="h-3.5 w-3.5 mr-1" />
      case "LUNCH":
        return <Utensils className="h-3.5 w-3.5 mr-1" />
      case "DINNER":
        return <ChefHat className="h-3.5 w-3.5 mr-1" />
      case "SNACK":
        return <Apple className="h-3.5 w-3.5 mr-1" />
      default:
        return <Utensils className="h-3.5 w-3.5 mr-1" />
    }
  }

  const filteredMealPlans = mealPlans
    .filter((meal) => {
      let matches = true

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        matches =
          matches &&
          (meal.recipe?.title?.toLowerCase().includes(searchLower) || meal.notes?.toLowerCase().includes(searchLower))
      }

      if (filterMealType) {
        matches = matches && meal.mealType === filterMealType
      }

      return matches
    })
    .sort((a, b) => {
      const dayOrder =
        DAYS_OF_WEEK.findIndex((d) => d.value === a.dayOfWeek) - DAYS_OF_WEEK.findIndex((d) => d.value === b.dayOfWeek)

      const typeOrder =
        MEAL_TYPES.findIndex((t) => t.value === a.mealType) - MEAL_TYPES.findIndex((t) => t.value === b.mealType)

      switch (sortOrder) {
        case "dayAsc":
          return dayOrder || typeOrder
        case "dayDesc":
          return -dayOrder || typeOrder
        case "typeAsc":
          return typeOrder || dayOrder
        default:
          return dayOrder || typeOrder
      }
    })

    const exportToPDF = async () => {
      setIsExporting(true);
  
      try {
          const doc = new jsPDF({
              orientation: "portrait",
              unit: "mm",
              format: "a4",
          });
  
          doc.setFontSize(20);
          doc.setTextColor(229, 29, 72); 
          doc.text("Planning de Repas", 105, 20, { align: "center" });
  
          doc.setFontSize(12);
          doc.setTextColor(100, 100, 100);
          doc.text(`Exporté le ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });
  
          if (user?.username) {
              doc.text(`Utilisateur: ${user.username}`, 105, 40, { align: "center" });
          }
  
          const elementToCapture = activeView === "week" ? weekViewRef.current : listViewRef.current;
  
          if (elementToCapture) {
              const elementsWithOklch = elementToCapture.querySelectorAll('*');
              const originalStyles: { element: Element; style: string }[] = [];
  
              elementsWithOklch.forEach((element) => {
                  const computedStyle = window.getComputedStyle(element);
                  originalStyles.push({
                      element,
                      style: element.getAttribute("style") || "",
                  });
  
                  if (computedStyle.backgroundColor.includes("oklch")) {
                      element.setAttribute(
                          "style",
                          `${element.getAttribute("style") || ""}; background-color: rgb(249, 250, 251) !important;`
                      );
                  }
              });
  
              const canvas = await html2canvas(elementToCapture, {
                  scale: 1,
                  useCORS: true,
                  allowTaint: true,
                  logging: false,
                  backgroundColor: "#ffffff",
              });
  
              originalStyles.forEach((item) => {
                  item.element.setAttribute("style", item.style);
              });
  
              const imgData = canvas.toDataURL("image/png");
              const imgWidth = 190; 
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
              doc.addImage(imgData, "PNG", 10, 50, imgWidth, imgHeight);
  
              const pageCount = doc.getNumberOfPages();
              for (let i = 1; i <= pageCount; i++) {
                  doc.setPage(i);
                  doc.setFontSize(10);
                  doc.setTextColor(150, 150, 150);
                  doc.text(`Page ${i} sur ${pageCount}`, 105, 290, { align: "center" });
              }
  
              if (exportOptions.includeIngredients && shoppingListItems.length > 0) {
                  doc.addPage();
  
                  doc.setFontSize(16);
                  doc.setTextColor(229, 29, 72);
                  doc.text("Liste de Courses", 105, 20, { align: "center" });
  
                  doc.setFontSize(12);
                  doc.setTextColor(0, 0, 0);
  
                  shoppingListItems.forEach((item, index) => {
                      const y = 40 + index * 10;
                      doc.text(`□ ${item.name}`, 20, y);
                  });
              }
  
              const fileName = `planning-repas-${new Date().toISOString().split("T")[0]}.pdf`;
              doc.save(fileName);
  
              setSuccessMessage(`Planning exporté avec succès en format PDF!`);
          } else {
              throw new Error("Impossible de capturer le contenu pour l'export PDF");
          }
      } catch (error) {
          console.error("Error exporting to PDF:", error);
          setError("Erreur lors de l'exportation en PDF. Veuillez réessayer.");
      } finally {
          setIsExporting(false);
          setExportDialogOpen(false);
          setShowSuccessModal(true);
  
          setTimeout(() => {
              setShowSuccessModal(false);
          }, 2000);
      }
  };
  
  
  const handleExport = () => {
      setIsExporting(true);
  
      switch (exportFormat) {
          case "pdf":
              exportToPDF();
              break;
          case "csv":
              setTimeout(() => {
                  setIsExporting(false);
                  setExportDialogOpen(false);
                  setSuccessMessage(`Planning exporté avec succès en format CSV!`);
                  setShowSuccessModal(true);
  
                  setTimeout(() => {
                      setShowSuccessModal(false);
                  }, 2000);
              }, 1500);
              break;
          case "ical":
              setTimeout(() => {
                  setIsExporting(false);
                  setExportDialogOpen(false);
                  setSuccessMessage(`Planning exporté avec succès en format iCal!`);
                  setShowSuccessModal(true);
  
                  setTimeout(() => {
                      setShowSuccessModal(false);
                  }, 2000);
              }, 1500);
              break;
          default:
              setIsExporting(false);
      }
  };
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
    const generateShoppingList = () => {
    const ingredients: { id: number; name: string; checked: boolean }[] = []



    if (ingredients.length === 0) {
      setShoppingListItems([
        { id: 1, name: "Farine", checked: false },
        { id: 2, name: "Oeufs", checked: false },
        { id: 3, name: "Lait", checked: false },
        { id: 4, name: "Sucre", checked: false },
        { id: 5, name: "Sel", checked: false },
        { id: 6, name: "Beurre", checked: false },
        { id: 7, name: "Tomates", checked: false },
        { id: 8, name: "Oignons", checked: false },
        { id: 9, name: "Ail", checked: false },
        { id: 10, name: "Poulet", checked: false },
      ])
    } else {
      setShoppingListItems(ingredients)
    }

    setShowShoppingList(true)
  }

  const toggleFavorite = (recipeId: number) => {
    setFavoriteRecipes((prev) => (prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]))
  }



  if (loading && mealPlans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            <Loader2 className="h-12 w-12 text-rose-500 animate-spin mx-auto" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ChefHat className="h-6 w-6 text-rose-500" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-gray-600 font-medium"
          >
            Chargement de votre planificateur de repas...
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 flex flex-col items-center"
          >
            <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-rose-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Préparation de vos recettes...</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navigation */}
      <motion.header
        className="fixed top-0 left-0 w-full z-50 border-b border-gray-100"
        initial={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
        animate={headerControls}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-rose-500" />
            <span className="font-medium text-xl">Cuisenio</span>
          </Link>

          <nav
            className={`${mobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-6 md:p-0 space-y-4 md:space-y-0 md:space-x-6 items-center shadow-md md:shadow-none z-50`}
          >
            {["Communauté", "Planificateur", ].map((item) => (
          <Link
          key={item}
          to={
            item === "Communauté"
              ? "/home"
              : item === "Planificateur"
              ? "/meal-planner"
              : "/"
          }
          className={`text-sm font-medium transition-colors duration-200 ${
            item === "Communauté" ? "text-gray-600" : "text-rose-500 hover:text-rose-500"
          }`}
        >
          {item}
        </Link>
      ))}
    
      {/* Ajout de Profile et Logout */}
      <Link
        to="/profile"
        className="text-sm font-medium text-gray-600 hover:text-rose-500"
      >
        Profile
      </Link>
    
      <button
        onClick={handleLogout}
        className="text-sm font-medium text-red-600 hover:text-red-700"
      >
        Se déconnecter
      </button>


            {/* Notifications */}
            {isAuthenticated && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-gray-100 relative">
                      <Bell className="h-5 w-5 text-gray-600" />
                      <span className="absolute top-0 right-0 h-2 w-2 bg-rose-500 rounded-full"></span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* User menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                    <Avatar className="h-8 w-8 border">
                      {user?.profilePicture ? (
                        <AvatarImage src={user.profilePicture} alt={user.username || "Utilisateur"} />
                      ) : (
                        <AvatarFallback>
                          <User className="text-rose-500 h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm font-medium hidden md:inline">{user?.username || "Utilisateur"}</span>
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
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4" ref={contentRef}>
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mb-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                  Planificateur de Repas
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                    className="ml-2"
                  >
                    <Sparkles className="h-6 w-6 text-amber-400" />
                  </motion.span>
                </h1>
                <p className="text-gray-600 mt-2">Organisez vos repas de la semaine et simplifiez votre quotidien</p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
                
              

                {/* Filters Dialog */}
                <Dialog open={showFilters} onOpenChange={setShowFilters}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Filtrer les repas</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <Label>Rechercher</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Rechercher une recette..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Type de repas</Label>
                        <Select
                          value={filterMealType || "all"}
                          onValueChange={(value) => setFilterMealType(value === "all" ? null : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tous les types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous les types</SelectItem>
                            {MEAL_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Trier par</Label>
                        <Select
                          value={sortOrder}
                          onValueChange={(value: "dayAsc" | "dayDesc" | "typeAsc") => setSortOrder(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Ordre de tri" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dayAsc">Jour (croissant)</SelectItem>
                            <SelectItem value="dayDesc">Jour (décroissant)</SelectItem>
                            <SelectItem value="typeAsc">Type de repas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-4 flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchQuery("")
                            setFilterMealType(null)
                            setSortOrder("dayAsc")
                          }}
                        >
                          Réinitialiser
                        </Button>
                        <Button onClick={() => setShowFilters(false)}>Appliquer</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Export Dialog */}
                <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Exporter le planning de repas</DialogTitle>
                      <DialogDescription>Choisissez le format et les options d'exportation</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                      <div className="space-y-4">
                        <Label>Format d'exportation</Label>
                        <div className="grid grid-cols-3 gap-4">
                          <Button
                            variant={exportFormat === "pdf" ? "primary" : "outline"}
                            className={cn(
                              "flex flex-col items-center py-6",
                              exportFormat === "pdf" ? "bg-rose-500 hover:bg-rose-600" : "",
                            )}
                            onClick={() => setExportFormat("pdf")}
                          >
                            <FileDown className="h-8 w-8 mb-2" />
                            <span>PDF</span>
                          </Button>
                          <Button
                            variant={exportFormat === "csv" ? "primary" : "outline"}
                            className={cn(
                              "flex flex-col items-center py-6",
                              exportFormat === "csv" ? "bg-rose-500 hover:bg-rose-600" : "",
                            )}
                            onClick={() => setExportFormat("csv")}
                          >
                            <FileDown className="h-8 w-8 mb-2" />
                            <span>CSV</span>
                          </Button>
                          <Button
                            variant={exportFormat === "ical" ? "primary" : "outline"}
                            className={cn(
                              "flex flex-col items-center py-6",
                              exportFormat === "ical" ? "bg-rose-500 hover:bg-rose-600" : "",
                            )}
                            onClick={() => setExportFormat("ical")}
                          >
                            <Calendar className="h-8 w-8 mb-2" />
                            <span>iCal</span>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Période</Label>
                        <Select
                          value={exportOptions.dateRange}
                          onValueChange={(value: "day" | "week" | "month" | "all") =>
                            setExportOptions((prev) => ({ ...prev, dateRange: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une période" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="day">Aujourd'hui</SelectItem>
                            <SelectItem value="week">Cette semaine</SelectItem>
                            <SelectItem value="month">Ce mois</SelectItem>
                            <SelectItem value="all">Tous les repas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <Label>Options</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="includeNotes"
                              checked={exportOptions.includeNotes}
                              onChange={(e) =>
                                setExportOptions((prev) => ({
                                  ...prev,
                                  includeNotes: e.target.checked,
                                }))
                              }
                            />
                            <label
                              htmlFor="includeNotes"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Inclure les notes
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="includeImages"
                              checked={exportOptions.includeImages}
                              onChange={(e) =>
                                setExportOptions((prev) => ({
                                  ...prev,
                                  includeImages: e.target.checked,
                                }))
                              }
                            />
                            <label
                              htmlFor="includeImages"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Inclure les images
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="includeIngredients"
                              checked={exportOptions.includeIngredients}
                              onChange={(e) =>
                                setExportOptions((prev) => ({
                                  ...prev,
                                  includeIngredients: e.target.checked,
                                }))
                              }
                            />
                            <label
                              htmlFor="includeIngredients"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Inclure les ingrédients
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button
                        className="bg-rose-500 hover:bg-rose-600 text-white"
                        onClick={handleExport}
                        disabled={isExporting}
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Exportation...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Exporter
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </motion.div>
            </div>

            {(hookError || localError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg mb-6 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Une erreur est survenue</p>
                  <p className="text-sm">{hookError || localError}</p>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <Tabs
                defaultValue="week"
                className="w-full"
                onValueChange={(value) => setActiveView(value as "week" | "list")}
              >
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="week" className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      <span>Vue Semaine</span>
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center gap-1.5">
                      <Utensils className="h-4 w-4" />
                      <span>Liste des Repas</span>
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9" onClick={generateShoppingList}>
                            <ShoppingCart className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Liste de courses</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Générer une liste de courses</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9" onClick={() => setExportDialogOpen(true)}>
                            <Download className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Exporter</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Exporter le planning</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9" onClick={() => setShowRecipeSearch(true)}>
                            <Search className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Rechercher</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rechercher des recettes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <TabsContent value="week" className="mt-0">
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="bg-white border-b border-gray-100 pb-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-rose-500" />
                          <CardTitle>Planning de la semaine</CardTitle>
                        </div>
                        
                      </div>
                      <CardDescription>Organisez vos repas pour chaque jour de la semaine</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6" ref={weekViewRef}>
                      {mealPlans.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="text-center py-16 bg-gray-50 rounded-lg"
                        >
                          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-medium text-gray-700 mb-2">Aucun repas planifié</h3>
                          <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Commencez à planifier vos repas pour la semaine et simplifiez votre organisation
                            quotidienne.
                          </p>
                          <Button
                            onClick={() => setAddMealDialogOpen(true)}
                            className="bg-rose-500 hover:bg-rose-600 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" /> Ajouter votre premier repas
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={containerVariants}
                          className="space-y-8"
                        >
                          {Object.entries(getMealsByDay()).map(([day, meals], dayIndex) => (
                            <motion.div
                              key={day}
                              variants={itemVariants}
                              custom={dayIndex}
                              className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">{getDayLabel(day)}</h3>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                  onClick={() => {
                                    setMealForm((prev) => ({ ...prev, dayOfWeek: day }))
                                    setAddMealDialogOpen(true)
                                  }}
                                >
                                  <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter
                                </Button>
                              </div>

                              {meals.length === 0 ? (
                                <div className="bg-gray-50 rounded-lg p-6 text-center">
                                  <p className="text-gray-500">Aucun repas planifié pour ce jour</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <AnimatePresence>
                                    {meals
                                      .filter((meal) => {
                                        if (!searchQuery) return true
                                        return meal.recipe?.title?.toLowerCase().includes(searchQuery.toLowerCase())
                                      })
                                      .map((meal, mealIndex) => (
                                        <motion.div
                                          key={meal.id}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95 }}
                                          transition={{
                                            duration: 0.3,
                                            delay: mealIndex * 0.05,
                                          }}
                                          whileHover="hover"
                                          variants={cardHoverVariants}
                                        >
                                          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200 group">
                                            <div className="flex">
                                              <div className="relative w-1/3">
                                                <Image
                                                  src={
                                                    meal.recipe?.imageUrl
                                                      ? `http://localhost:8080/uploads/${meal.recipe.imageUrl}`
                                                      : "/placeholder.svg?height=150&width=150"
                                                  }
                                                  alt={meal.recipe?.title || "Recipe"}
                                                  fill
                                                  className="object-cover"
                                                />
                                                {meal.recipe && (
                                                  <button
                                                    className={cn(
                                                      "absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-200",
                                                      favoriteRecipes.includes(meal.recipe.id)
                                                        ? "text-rose-500"
                                                        : "text-gray-400 opacity-0 group-hover:opacity-100",
                                                    )}
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      if (meal.recipe) toggleFavorite(meal.recipe.id)
                                                    }}
                                                  >
                                                    <Heart
                                                      className="h-4 w-4"
                                                      fill={
                                                        favoriteRecipes.includes(meal.recipe.id)
                                                          ? "currentColor"
                                                          : "none"
                                                      }
                                                    />
                                                  </button>
                                                )}
                                              </div>
                                              <div className="w-2/3 p-4">
                                                <div className="flex justify-between items-start">
                                                  <div>
                                                    <Badge className={`mb-2 ${getMealTypeColor(meal.mealType)}`}>
                                                      <span className="flex items-center">
                                                        {getMealTypeIcon(meal.mealType)}
                                                        {getMealTypeLabel(meal.mealType)}
                                                      </span>
                                                    </Badge>
                                                    <h4 className="font-medium text-sm line-clamp-1">
                                                      {meal.recipe?.title || "Untitled Recipe"}
                                                    </h4>
                                                  </div>
                                                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <TooltipProvider>
                                                      <Tooltip>
                                                        <TooltipTrigger asChild>
                                                          <button
                                                            className="p-1.5 hover:bg-rose-50 rounded-full transition-colors duration-200"
                                                            onClick={() => openEditDialog(meal)}
                                                            aria-label="Modifier"
                                                          >
                                                            <Edit className="h-4 w-4 text-gray-500 hover:text-rose-500" />
                                                          </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                          <p>Modifier</p>
                                                        </TooltipContent>
                                                      </Tooltip>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                      <Tooltip>
                                                        <TooltipTrigger asChild>
                                                          <button
                                                            className="p-1.5 hover:bg-red-50 rounded-full transition-colors duration-200"
                                                            onClick={() => confirmDelete(meal.id)}
                                                            aria-label="Supprimer"
                                                          >
                                                            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                                                          </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                          <p>Supprimer</p>
                                                        </TooltipContent>
                                                      </Tooltip>
                                                    </TooltipProvider>
                                                  </div>
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500 mt-2">
                                                  <Clock className="h-3 w-3 mr-1" />
                                                  <span>
                                                    {(meal.recipe?.preparationTime || 0) +
                                                      (meal.recipe?.cookingTime || 0)}{" "}
                                                    min
                                                  </span>
                                                  <span className="mx-2">•</span>
                                                  <span>
                                                    {meal.servings} {meal.servings > 1 ? "portions" : "portion"}
                                                  </span>
                                                </div>
                                                {meal.notes && (
                                                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                                    {meal.notes}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </Card>
                                        </motion.div>
                                      ))}
                                  </AnimatePresence>
                                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                      variant="outline"
                                      className="h-full min-h-[100px] border-dashed flex flex-col items-center justify-center gap-2 w-full"
                                      onClick={() => {
                                        setMealForm((prev) => ({ ...prev, dayOfWeek: day }))
                                        setAddMealDialogOpen(true)
                                      }}
                                    >
                                      <Plus className="h-5 w-5 text-gray-400" />
                                      <span className="text-sm text-gray-500">Ajouter un repas</span>
                                    </Button>
                                  </motion.div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="bg-white border-b border-gray-100 pb-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-5 w-5 text-rose-500" />
                          <CardTitle>Liste des repas</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Rechercher..."
                              className="w-[200px] h-9 pl-9"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-9">
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                <span>Filtres</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-4">
                                <h4 className="font-medium">Filtres avancés</h4>
                                <div className="space-y-2">
                                  <Label>Type de repas</Label>
                                  <Select
                                    value={filterMealType || ""}
                                    onValueChange={(value) => setFilterMealType(value || null)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Tous les types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">Tous les types</SelectItem>
                                      {MEAL_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Trier par</Label>
                                  <Select
                                    value={sortOrder}
                                    onValueChange={(value: "dayAsc" | "dayDesc" | "typeAsc") => setSortOrder(value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Ordre de tri" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="dayAsc">Jour (croissant)</SelectItem>
                                      <SelectItem value="dayDesc">Jour (décroissant)</SelectItem>
                                      <SelectItem value="typeAsc">Type de repas</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="pt-2 flex justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSearchQuery("")
                                      setFilterMealType(null)
                                      setSortOrder("dayAsc")
                                    }}
                                  >
                                    Réinitialiser
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <CardDescription>Visualisez tous vos repas planifiés</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0" ref={listViewRef}>
                      {filteredMealPlans.length === 0 ? (
                        <div className="text-center py-16 px-6">
                          <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-medium text-gray-700 mb-2">Aucun repas trouvé</h3>
                          <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            {searchQuery || filterMealType
                              ? "Aucun repas ne correspond à vos critères de recherche."
                              : "Commencez à planifier vos repas pour la semaine."}
                          </p>
                          {searchQuery || filterMealType ? (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSearchQuery("")
                                setFilterMealType(null)
                              }}
                            >
                              Réinitialiser les filtres
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setAddMealDialogOpen(true)}
                              className="bg-rose-500 hover:bg-rose-600 text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" /> Ajouter un repas
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="divide-y">
                          <AnimatePresence>
                            {filteredMealPlans.map((meal, index) => (
                              <motion.div
                                key={meal.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.03 }}
                                className="hover:bg-gray-50"
                                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                              >
                                <div className="flex items-center p-4 md:px-6">
                                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                      src={
                                        meal.recipe?.imageUrl
                                          ? `http://localhost:8080/uploads/${meal.recipe.imageUrl}`
                                          : "/placeholder.svg?height=64&width=64"
                                      }
                                      alt={meal.recipe?.title || "Recipe"}
                                      fill
                                      className="object-cover"
                                    />
                                    {meal.recipe && (
                                      <button
                                        className={cn(
                                          "absolute top-1 right-1 p-1 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-200",
                                          favoriteRecipes.includes(meal.recipe.id)
                                            ? "text-rose-500"
                                            : "text-gray-400 opacity-0 hover:opacity-100",
                                        )}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          if (meal.recipe) toggleFavorite(meal.recipe.id)
                                        }}
                                      >
                                        <Heart
                                          className="h-3.5 w-3.5"
                                          fill={favoriteRecipes.includes(meal.recipe.id) ? "currentColor" : "none"}
                                        />
                                      </button>
                                    )}
                                  </div>
                                  <div className="ml-4 flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                      <div>
                                        <Badge className={`${getMealTypeColor(meal.mealType)} mb-1`}>
                                          <span className="flex items-center">
                                            {getMealTypeIcon(meal.mealType)}
                                            {getMealTypeLabel(meal.mealType)}
                                          </span>
                                        </Badge>
                                        <h4 className="font-medium">{meal.recipe?.title || "Untitled Recipe"}</h4>
                                      </div>
                                      <div className="flex items-center mt-2 md:mt-0">
                                        <Badge variant="outline" className="mr-2">
                                          {getDayLabel(meal.dayOfWeek)}
                                        </Badge>
                                        <div className="flex items-center text-sm text-gray-500">
                                          <Clock className="h-3.5 w-3.5 mr-1" />
                                          <span>
                                            {(meal.recipe?.preparationTime || 0) + (meal.recipe?.cookingTime || 0)} min
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                      <div className="flex items-center text-sm text-gray-500">
                                        <span>
                                          {meal.servings} {meal.servings > 1 ? "portions" : "portion"}
                                        </span>
                                        {meal.notes && (
                                          <>
                                            <span className="mx-2">•</span>
                                            <span className="truncate max-w-[200px]">{meal.notes}</span>
                                          </>
                                        )}
                                      </div>
                                      <div className="flex space-x-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 px-2 text-gray-500 hover:text-rose-500 hover:bg-rose-50"
                                          onClick={() => openEditDialog(meal)}
                                        >
                                          <Edit className="h-3.5 w-3.5 mr-1" />
                                          <span className="hidden md:inline">Modifier</span>
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 px-2 text-gray-500 hover:text-red-500 hover:bg-red-50"
                                          onClick={() => confirmDelete(meal.id)}
                                        >
                                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                                          <span className="hidden md:inline">Supprimer</span>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t p-4 flex justify-between">
                      <div className="text-sm text-gray-500">{filteredMealPlans.length} repas au total</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAddMealDialogOpen(true)}
                        className="flex items-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" /> Ajouter un repas
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
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
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une recette..."
                  className="pl-9 mb-2"
                  value={recipeSearchQuery}
                  onChange={(e) => setRecipeSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto p-2 border rounded-md">
                {loadingRecipes ? (
                  <div className="col-span-full text-center py-4">
                    <Loader2 className="h-6 w-6 text-rose-500 animate-spin mx-auto" />
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
                  recipes
                    .filter(
                      (recipe) =>
                        !recipeSearchQuery || recipe.title.toLowerCase().includes(recipeSearchQuery.toLowerCase()),
                    )
                    .map((recipe) => (
                      <div
                        key={recipe.id}
                        className={`p-2 rounded-lg border cursor-pointer flex items-center gap-3 transition-all duration-200 ${
                          selectedRecipe?.id === recipe.id
                            ? "border-rose-500 bg-rose-50 shadow-sm"
                            : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
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
                        {selectedRecipe?.id === recipe.id && (
                          <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
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
            {currentMeal && currentMeal.recipe && (
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

            {/* If recipe is null, show a placeholder */}
            {currentMeal && !currentMeal.recipe && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Recipe not found"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Recipe not found</h4>
                  <p className="text-sm text-gray-500">The recipe for this meal plan is missing</p>
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
            <Button variant="danger" onClick={handleDeleteMeal}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shopping List Dialog */}
      <Dialog open={showShoppingList} onOpenChange={setShowShoppingList}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Liste de courses</DialogTitle>
            <DialogDescription>Basée sur vos repas planifiés pour la semaine</DialogDescription>
          </DialogHeader>
          <div className="py-4" ref={shoppingListRef}>
            {shoppingListItems.length > 0 ? (
              <div className="space-y-2">
                {shoppingListItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={item.checked}
                      onChange={(e) => {
                        setShoppingListItems((prev) =>
                          prev.map((i) => (i.id === item.id ? { ...i, checked: e.target.checked } : i)),
                        )
                      }}
                    />
                    <label
                      htmlFor={`item-${item.id}`}
                      className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1",
                        item.checked && "line-through text-gray-400",
                      )}
                    >
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Liste de courses vide</h3>
                <p className="text-gray-500">Ajoutez des repas à votre planning pour générer une liste de courses</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {shoppingListItems.filter((item) => item.checked).length} / {shoppingListItems.length} items cochés
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowShoppingList(false)}>
                Fermer
              </Button>
              <Button
                className="bg-rose-500 hover:bg-rose-600 text-white"
                onClick={() => {
                  // Export shopping list as PDF
                  const doc = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4",
                  })

                  // Add title
                  doc.setFontSize(20)
                  doc.setTextColor(229, 29, 72) // Rose color
                  doc.text("Liste de Courses", 105, 20, { align: "center" })

                  doc.setFontSize(12)
                  doc.setTextColor(100, 100, 100)
                  doc.text(`Exporté le ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" })

                  // Add shopping list items
                  doc.setFontSize(12)
                  doc.setTextColor(0, 0, 0)

                  shoppingListItems.forEach((item, index) => {
                    const y = 50 + index * 10
                    doc.text(`□ ${item.name}`, 20, y)
                  })

                  // Save the PDF
                  doc.save(`liste-courses-${new Date().toISOString().split("T")[0]}.pdf`)

                  setSuccessMessage("Liste de courses exportée avec succès!")
                  setShowSuccessModal(true)
                  setShowShoppingList(false)

                  setTimeout(() => {
                    setShowSuccessModal(false)
                  }, 2000)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recipe Search Dialog */}
      <Dialog open={showRecipeSearch} onOpenChange={setShowRecipeSearch}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rechercher des recettes</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une recette..."
                className="pl-9"
                value={recipeSearchQuery}
                onChange={(e) => setRecipeSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {loadingRecipes ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 text-rose-500 animate-spin mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">Chargement des recettes...</p>
                </div>
              ) : recipes.filter(
                  (recipe) =>
                    !recipeSearchQuery || recipe.title.toLowerCase().includes(recipeSearchQuery.toLowerCase()),
                ).length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune recette trouvée</h3>
                  <p className="text-gray-500">Essayez avec d'autres termes de recherche</p>
                </div>
              ) : (
                recipes
                  .filter(
                    (recipe) =>
                      !recipeSearchQuery || recipe.title.toLowerCase().includes(recipeSearchQuery.toLowerCase()),
                  )
                  .map((recipe) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center gap-4 p-3 border rounded-lg hover:border-rose-200 hover:bg-rose-50/30 cursor-pointer"
                      onClick={() => {
                        setSelectedRecipe(recipe)
                        setMealForm((prev) => ({
                          ...prev,
                          dayOfWeek: DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].value,
                        }))
                        setShowRecipeSearch(false)
                        setAddMealDialogOpen(true)
                      }}
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={
                            recipe.imageUrl
                              ? `http://localhost:8080/uploads/${recipe.imageUrl}`
                              : "/placeholder.svg?height=64&width=64"
                          }
                          alt={recipe.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{recipe.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{recipe.preparationTime + (recipe.cookingTime || 0)} min</span>
                          {recipe.difficultyLevel && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Difficulté: {recipe.difficultyLevel}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        <Plus className="h-4 w-4 mr-1" /> Ajouter
                      </Button>
                    </motion.div>
                  ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecipeSearch(false)}>
              Fermer
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

