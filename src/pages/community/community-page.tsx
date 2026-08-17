
import {
  BookmarkIcon,
  Clock,
  Flag,
  Filter,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Send,
  User,
  Edit,
  Trash2,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Avatar , AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { Checkbox } from "../../components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { ConfirmDialog } from "../../components/ui/ConfirmDialog"
import { PromptDialog } from "../../components/ui/PromptDialog"
import { AppShell } from "../../components/layout/AppShell"
import { env } from "../../lib/env"
import { Label } from "../../components/ui/label"
import { Slider } from "../../components/ui/slider"
import { Tabs, TabsContent} from "../../components/ui/tabs"
import { Textarea } from "../../components/ui/textarea"
import { AsyncSection, type AsyncStatus } from "../../components/ui/async-section"
import { ListSkeleton } from "../../components/ui/list-skeleton"
import { useRecipe } from "../../hooks/useRecipe"
import { useComments } from "../../hooks/useComments"
import { useOptimisticMutation } from "../../hooks/useOptimisticMutation"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/auth.store"
import { useNotification } from "../../context/NotificationContext"
import { recipePath, type RecipeResponse } from "../../types/recipe.types"

import { recipeService } from "../../api/recipe.service"
import AddRecipeDialog from "./AddRecipeForm"
import { ImageUploadDialog } from "./add-image"
import { useRecentlyViewedStore } from "../../store/recently-viewed.store"

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

type CommunityRecipe = RecipeResponse & {
  isLiked?: boolean
  isSaved?: boolean
  optimisticRatingCount?: number
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
  const [searchParams] = useSearchParams()
  const { isAuthenticated, user } = useAuthStore()
  const recentRecipes = useRecentlyViewedStore((s) => s.items)
  const { success: notifySuccess, error: notifyError } = useNotification()
  const { runOptimisticMutation } = useOptimisticMutation()
  const { recipes, loading, error, page, totalPages, fetchRecipes, searchRecipes, createRecipe, nextPage, prevPage } =
    useRecipe({ pageSize: 9 })
  const [feedRecipes, setFeedRecipes] = useState<CommunityRecipe[]>([])

  const [commentText, setCommentText] = useState("")
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("q") ?? "")
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [addRecipeDialogOpen, setAddRecipeDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [activeRecipe, setActiveRecipe] = useState<RecipeResponse | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<number | null>(null)
  const [reportTarget, setReportTarget] = useState<
    null | { kind: "recipe"; recipeId: number } | { kind: "comment"; recipeId: number; commentId: number }
  >(null)

  const [filterCategory, setFilterCategory] = useState("")
  const [sortOption, setSortOption] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState([15, 60])
  const [dietaryOptions, setDietaryOptions] = useState<string[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [recipeId, setRecipeId] = useState<number | null>(null)

  const { comments, loading: commentsLoading, error: commentsError, fetchComments, addComment } = useComments()

  const handleSearch = useCallback(() => {
    const difficulty = difficultyFilter.length > 0 ? difficultyFilter[0] : undefined
    searchRecipes(searchTerm, difficulty, timeRange[1], undefined, filterCategory || undefined, undefined)
  }, [searchTerm, difficultyFilter, timeRange, filterCategory, searchRecipes])

  const applyFilters = () => {
    handleSearch()
    setShowFilters(false)
  }

  const handleCommentSubmit = async () => {
    if (!activeRecipe || !commentText.trim()) return

    try {
      await addComment(activeRecipe.id, commentText)
      setCommentText("")
      notifySuccess("Commentaire ajouté", "Votre commentaire a été publié avec succès.")
    } catch {
      notifyError("Erreur", "Impossible d'ajouter le commentaire. Veuillez réessayer.")
    }
  }

  const handleReplySubmit = (commentId: number) => {
    void commentId
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

    const targetId = recipeToDelete
    setConfirmDeleteOpen(false)
    setRecipeToDelete(null)

    try {
      await runOptimisticMutation({
        applyOptimistic: () => {
          const snapshot = feedRecipes
          setFeedRecipes((prev) => prev.filter((recipe) => recipe.id !== targetId))
          return snapshot
        },
        mutation: () => recipeService.deleteRecipe(targetId),
        rollback: (snapshot) => setFeedRecipes(snapshot),
        onSuccess: () => {
          notifySuccess("Recette archivée", "Cette recette n'est plus visible sur la plateforme.")
        },
        onError: (_error, retry) => {
          notifyError("Archivage annulé", "La recette n'a pas pu être archivée.", {
            action: {
              label: "Réessayer",
              onClick: () => {
                void retry()
              },
            },
            durationMs: 6500,
          })
        },
      })
    } catch {
      // Rollback and toast are handled by the optimistic hook callbacks.
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
    setFeedRecipes(
      recipes.map((recipe) => ({
        ...recipe,
        optimisticRatingCount: recipe.totalRatings ?? 0,
        isLiked: false,
        isSaved: false,
      })),
    )
  }, [recipes])

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

  const feedStatus: AsyncStatus = loading && feedRecipes.length === 0 ? "loading" : error && feedRecipes.length === 0 ? "error" : feedRecipes.length === 0 ? "empty" : "success"
  const isRefreshingFeed = loading && feedRecipes.length > 0

  const handleOptimisticLike = async (recipeId: number) => {
    const currentRecipe = feedRecipes.find((recipe) => recipe.id === recipeId)
    if (!currentRecipe) return

    const nextIsLiked = !currentRecipe.isLiked

    try {
      await runOptimisticMutation({
        applyOptimistic: () => {
          const snapshot = feedRecipes
          setFeedRecipes((prev) =>
            prev.map((recipe) =>
              recipe.id === recipeId
                ? {
                    ...recipe,
                    isLiked: nextIsLiked,
                    optimisticRatingCount: Math.max(0, (recipe.optimisticRatingCount ?? recipe.totalRatings ?? 0) + (nextIsLiked ? 1 : -1)),
                  }
                : recipe,
            ),
          )
          return snapshot
        },
        // Temporary bridge until a dedicated like/unlike endpoint is available.
        mutation: () => recipeService.rateRecipe(recipeId, nextIsLiked ? 5 : 1),
        rollback: (snapshot) => setFeedRecipes(snapshot),
        onError: (_error, retry) => {
          notifyError("Action annulée", "Le like n'a pas été enregistré.", {
            action: {
              label: "Réessayer",
              onClick: () => {
                void retry()
              },
            },
            durationMs: 6500,
          })
        },
      })
    } catch {
      // Rollback and toast are handled by the optimistic hook callbacks.
    }
  }

  const handleOptimisticBookmark = async (recipeId: number) => {
    const currentRecipe = feedRecipes.find((recipe) => recipe.id === recipeId)
    if (!currentRecipe) return

    const nextIsSaved = !currentRecipe.isSaved

    try {
      await runOptimisticMutation({
        applyOptimistic: () => {
          const snapshot = feedRecipes
          setFeedRecipes((prev) =>
            prev.map((recipe) =>
              recipe.id === recipeId
                ? {
                    ...recipe,
                    isSaved: nextIsSaved,
                  }
                : recipe,
            ),
          )
          return snapshot
        },
        mutation: () => (nextIsSaved ? recipeService.saveRecipe(recipeId) : recipeService.unsaveRecipe(recipeId)),
        rollback: (snapshot) => setFeedRecipes(snapshot),
        onSuccess: () => {
          notifySuccess(
            nextIsSaved ? "Recette sauvegardée" : "Recette retirée",
            nextIsSaved ? "La recette a été ajoutée à vos favoris." : "La recette a été retirée de vos favoris.",
          )
        },
        onError: (_error, retry) => {
          notifyError("Action annulée", "La sauvegarde n'a pas été synchronisée.", {
            action: {
              label: "Réessayer",
              onClick: () => {
                void retry()
              },
            },
            durationMs: 6500,
          })
        },
      })
    } catch {
      // Rollback and toast are handled by the optimistic hook callbacks.
    }
  }

  const handleReportRecipe = (recipeId: number) => {
    setReportTarget({ kind: "recipe", recipeId })
  }

  const handleReportComment = (recipeId: number, commentId: number) => {
    setReportTarget({ kind: "comment", recipeId, commentId })
  }

  const submitReport = async (reason: string) => {
    if (!reportTarget) return
    try {
      if (reportTarget.kind === "recipe") {
        const response = await recipeService.reportRecipe(reportTarget.recipeId, reason.trim())
        notifySuccess("Recette signalée", `${response.reportCount} signalement(s) pour cette recette.`)
      } else {
        const response = await recipeService.reportComment(
          reportTarget.recipeId,
          reportTarget.commentId,
          reason.trim(),
        )
        notifySuccess("Commentaire signalé", `${response.reportCount} signalement(s) pour ce commentaire.`)
      }
      setReportTarget(null)
    } catch {
      notifyError(
        "Signalement impossible",
        reportTarget.kind === "recipe"
          ? "Impossible de signaler la recette."
          : "Impossible de signaler le commentaire.",
      )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  return (
    <AppShell>
      {/* Main Content */}
      <main className="px-4 pb-4 pt-6">
        <div className="container mx-auto max-w-6xl">
          {/* Community Header */}
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Explorer</h1>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Recherche avancée, filtres et fil communautaire — pour trouver exactement ce que vous allez cuisiner.
            </p>
            {isAuthenticated && (
              <Button
                onClick={() => setAddRecipeDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-1.5 mx-auto"
              >
                <Plus className="h-4 w-4" /> Ajouter une recette
              </Button>
            )}
          </div>

          {recentRecipes.length > 0 && (
            <section className="mb-8" aria-label="Récemment consultées">
              <h2 className="mb-3 text-left text-sm font-semibold uppercase tracking-wide text-primary">
                Continuer · récemment vues
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recentRecipes.map((r) => (
                  <Link
                    key={r.id}
                    to={recipePath(r)}
                    className="min-w-[180px] rounded-xl border border-border bg-card px-3 py-2 text-left transition-colors duration-150 hover:bg-muted"
                  >
                    <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                    <p className="text-[11px] text-muted-foreground">Reprendre la lecture</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Search and Filter Bar */}
          <div className="mb-8 rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-0 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 transition focus:border-primary focus:ring focus:ring-primary/20"
                />
              </div>

              <Dialog open={showFilters} onOpenChange={setShowFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center">
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
                        <div className="flex justify-between text-sm text-muted-foreground">
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
                  <div className="border-t border-border pt-4">
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

                  <div className="flex justify-end gap-2 mt-6 border-t border-border pt-4">
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
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={applyFilters}>
                      Appliquer les filtres
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2 mt-3 w-full">
                <Badge variant="outline" className="bg-card cursor-pointer hover:bg-muted">
                  Tous
                </Badge>
                <Badge variant="outline" className="bg-card cursor-pointer hover:bg-muted">
                  Desserts
                </Badge>
                <Badge variant="outline" className="bg-card cursor-pointer hover:bg-muted">
                  Plats principaux
                </Badge>
                <Badge variant="outline" className="bg-card cursor-pointer hover:bg-muted">
                  Entrées
                </Badge>
                <Badge variant="outline" className="bg-card cursor-pointer hover:bg-muted">
                  Végétarien
                </Badge>
                <Badge variant="outline" className="bg-card cursor-pointer hover:bg-muted">
                  Facile
                </Badge>
                <Badge variant="outline" className="bg-card cursor-pointer hover:bg-muted">
                  Tendance
                </Badge>
              </div>
            </div>
          </div>

          {/* Community Tabs */}
          <Tabs defaultValue="recettes" className="mb-10">


            <TabsContent value="recettes" className="space-y-8">
              {/* All Recipes as Cards */}
              <AsyncSection
                status={feedStatus}
                loadingView={<ListSkeleton count={9} />}
                errorView={
                  <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                    <p className="mb-2 text-lg font-semibold text-foreground">Une erreur est survenue</p>
                    <p className="text-sm text-muted-foreground">Impossible de charger les recettes. Veuillez réessayer.</p>
                    <Button onClick={() => fetchRecipes()} className="mt-4">
                      Réessayer
                    </Button>
                  </div>
                }
                emptyView={
                  <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
                    <p className="text-base font-medium text-foreground">Aucune recette trouvée</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Essayez un autre filtre ou ajustez votre recherche.
                    </p>
                  </div>
                }
                successView={
                  <div className="relative">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {feedRecipes.map((recipe, index) => (
                        <Card
                          key={recipe.id}
                          className={cn(
                            "overflow-hidden group cursor-pointer hover:shadow-md transition-shadow",
                            index === 0 ? "sm:col-span-2 lg:col-span-3" : "",
                          )}
                        >
                          <div className={cn("relative", index === 0 ? "h-64 md:h-80" : "h-48")}>
                            {recipe.imageUrl ? (
                              <Link to={recipePath(recipe)}>
                                <Image
                                  src={`${env.uploadsUrl}/${recipe.imageUrl}`}
                                  alt={recipe.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </Link>
                            ) : user?.id === recipe.user?.id ? (
                              <div
                                onClick={() => handleAddImageClick(recipe.id)}
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-center bg-muted transition-colors hover:bg-muted/80"
                              >
                                <div className="bg-card p-3 rounded-full mb-3 shadow-sm">
                                  <Plus className="h-6 w-6 text-primary" />
                                </div>
                                <p className="text-sm font-medium text-foreground">Ajouter une image</p>
                                <p className="text-xs text-muted-foreground mt-1">Cliquez pour télécharger</p>
                              </div>
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <p className="text-sm text-muted-foreground">Aucune image</p>
                              </div>
                            )}
                            {recipe.averageRating >= 4.5 && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-primary text-white">Tendance</Badge>
                              </div>
                            )}
                            <div className="absolute top-2 right-2 p-2 flex space-x-1">
                              <button
                                type="button"
                                className="p-1.5 bg-card/80 hover:bg-card rounded-full transition-colors"
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  void handleOptimisticLike(recipe.id)
                                }}
                              >
                                <Heart
                                  className={cn(
                                    "h-4 w-4 transition-colors",
                                    recipe.isLiked ? "text-primary" : "text-muted-foreground hover:text-primary",
                                  )}
                                  fill={recipe.isLiked ? "currentColor" : "none"}
                                />
                              </button>
                              <button
                                type="button"
                                className="p-1.5 bg-card/80 hover:bg-card rounded-full transition-colors"
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  void handleReportRecipe(recipe.id)
                                }}
                                aria-label="Signaler la recette"
                              >
                                <Flag className="h-4 w-4 text-muted-foreground hover:text-primary" />
                              </button>
                              <button
                                type="button"
                                className="p-1.5 bg-card/80 hover:bg-card rounded-full transition-colors"
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  void handleOptimisticBookmark(recipe.id)
                                }}
                              >
                                <BookmarkIcon
                                  className={cn(
                                    "h-4 w-4 transition-colors",
                                    recipe.isSaved ? "text-primary" : "text-muted-foreground hover:text-primary",
                                  )}
                                  fill={recipe.isSaved ? "currentColor" : "none"}
                                />
                              </button>

                              {/* Show edit/delete buttons if user is the recipe owner */}
                              {user && recipe.user && user.id === recipe.user.id && (
                                <>
                                  <Link
                                    to={`/edit-recipe/${recipe.id}`}
                                    className="p-1.5 bg-card/80 hover:bg-card rounded-full transition-colors"
                                  >
                                    <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                  </Link>
                                  <button
                                    className="p-1.5 bg-card/80 hover:bg-card rounded-full transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      confirmDelete(recipe.id)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <Link to={recipePath(recipe)}>
                              <h3 className="text-lg font-medium mb-1 group-hover:text-primary transition-colors">
                                {recipe.title}
                              </h3>
                            </Link>
                            <div className="flex justify-between text-sm text-muted-foreground mb-2">
                              <span>
                                Par{" "}
                                {[recipe.user?.username, recipe.user?.lastName].filter(Boolean).join(" ") ||
                                  "Chef inconnu"}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" /> {recipe.preparationTime} min
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{recipe.description}</p>

                            {index === 0 && recipe.categories && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {recipe.categories.map((category) => (
                                  <Badge key={category.id} className="bg-primary/10 text-primary hover:bg-primary/15">
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
                         <User className="text-primary text-2xl" />
                       </AvatarFallback>
                     )}
                   </Avatar>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium">{recipe.user?.username || "Chef inconnu"}</p>
                                      {recipe.user?.badge && (
                                        <Badge variant="outline" className="text-[10px]">
                                          {recipe.user.badge}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Partagé le{" "}
                                      <span className="text-sm text-muted-foreground">{formatDate(recipe.creationDate)}</span>
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
                                  className="text-primary border-primary/30"
                                  onClick={() => openCommentDialog(recipe)}
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" /> Commenter
                                </Button>
                                <Link to={recipePath(recipe)}>
                                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Voir la recette</Button>
                                </Link>
                              </div>
                            )}
                          </CardContent>

                          {index !== 0 && (
                            <CardFooter className="px-4 py-3 border-t border-border bg-muted">
                              <div className="flex justify-between items-center w-full">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <span className="flex items-center mr-3">
                                    <Heart className="h-3 w-3 mr-1" /> {recipe.optimisticRatingCount ?? recipe.totalRatings ?? 0}
                                  </span>
                                  <button
                                    className="flex items-center hover:text-primary"
                                    onClick={() => openCommentDialog(recipe)}
                                  >
                                    <MessageCircle className="h-3 w-3 mr-1" /> {recipe.totalComments || 0}
                                  </button>
                                </div>
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/15">
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
                      ))}
                    </div>

                    {isRefreshingFeed && (
                      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl border border-border/40 bg-background/45 backdrop-blur-[1px]">
                        <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                      </div>
                    )}
                  </div>
                }
              />

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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : commentsError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Impossible de charger les commentaires</p>
                <Button variant="outline" size="sm" onClick={() => activeRecipe && fetchComments(activeRecipe.id)}>
                  Réessayer
                </Button>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="mx-auto mb-2 h-12 w-12 text-muted-foreground/40" />
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
                      <User className="text-primary text-2xl" />
                    </AvatarFallback>
                  )}
                </Avatar>
                          <div>
                            <p className="font-medium text-sm">{comment.user?.username || "Utilisateur"}</p>
                            <p className="text-xs text-muted-foreground">
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
                        <div className="flex items-center text-muted-foreground">
                          <button className="p-1 hover:text-primary">
                            <Heart className="h-4 w-4" />
                          </button>
                          {activeRecipe && (
                            <button
                              className="p-1 hover:text-primary"
                              onClick={() => void handleReportComment(activeRecipe.id, comment.id)}
                              aria-label="Signaler le commentaire"
                            >
                              <Flag className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-primary"
                        onClick={() => setActiveCommentId(comment.id)}
                      >
                        Répondre
                      </Button>

                      {activeCommentId === comment.id && (
                        <div className="absolute bottom-0 left-0 right-0 bg-card p-3 border-t border-border shadow-md z-10">
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
                                  className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
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
          <div className="border-t border-border pt-4">
            <div className="flex gap-3">
            <Avatar className="h-8 w-8 border">
                 {user?.profilePicture ? (
                   <AvatarImage
                     src={user.profilePicture}
                     alt={user.username || "Utilisateur"}
                   />
                 ) : (
                   <AvatarFallback>
                     <User className="text-primary text-2xl" />
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
                    commentText.trim() ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-muted text-muted-foreground"
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
        onSubmit={async (recipeData, image) => {
          const recipe = await createRecipe(recipeData)
          if (image && recipe?.id) {
            const formData = new FormData()
            formData.append("imageUrl", image)
            await recipeService.addImageToRecipe(recipe.id, formData)
          }
          return recipe?.id ?? 0
        }}
      />

      {/* Archive Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        severity="danger"
        title="Archiver cette recette ?"
        description="Cette recette sera archivée et ne sera plus visible sur la plateforme."
        confirmLabel="Archiver"
        onConfirm={handleDeleteRecipe}
      />

      <PromptDialog
        open={reportTarget != null}
        onOpenChange={(open) => {
          if (!open) setReportTarget(null)
        }}
        title={reportTarget?.kind === "comment" ? "Signaler ce commentaire ?" : "Signaler cette recette ?"}
        description="Indiquez la raison de ce signalement. Elle restera confidentielle."
        label="Raison du signalement"
        confirmLabel="Signaler"
        onConfirm={submitReport}
      />

      {recipeId && isPopupOpen && (
        <ImageUploadDialog open={isPopupOpen} onOpenChange={setIsPopupOpen} recipeId={recipeId} />
      )}

    </AppShell>
  )
}

