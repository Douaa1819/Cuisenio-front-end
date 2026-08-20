import {
  AlertCircle,
  ArrowLeft,
  BookmarkIcon,
  ChefHat,
  Clock,
  Edit,
  Flag,
  Heart,
  MessageCircle,
  Pencil,
  Send,
  Share2,
  Trash2,
  User,
  Users,
  Utensils,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { recipeService } from "../../api/recipe.service"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { ConfirmDialog } from "../../components/ui/ConfirmDialog"
import { PromptDialog } from "../../components/ui/PromptDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Textarea } from "../../components/ui/textarea"
import { useNotification } from "../../context/NotificationContext"
import { useComments } from "../../hooks/useComments"
import { useAuthStore } from "../../store/auth.store"
import { useFavoritesStore } from "../../store/favorites.store"
import {
  isRecipePublicId,
  recipeEditPath,
  recipePath,
  type RecipeResponse,
} from "../../types/recipe.types"
import { env } from "../../lib/env"
import { usePageMeta } from "../../hooks/usePageMeta"
import { useRecentlyViewedStore } from "../../store/recently-viewed.store"
import { useShoppingListStore } from "../../store/shopping-list.store"
import { KitchenTimer } from "../../components/kitchen/KitchenTimer"
import { CookingMode } from "../../components/kitchen/CookingMode"
import { AppShell } from "../../components/layout/AppShell"
import {
  estimateCostEur,
  estimateNutrition,
  suggestSubstitutions,
} from "../../lib/recipe-intelligence"

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

export default function RecipeDetailPage() {
  const { publicId: routePublicId } = useParams<{ publicId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuthStore()
  const { success, error: notifyError, warning } = useNotification()
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null)
  const [reportTarget, setReportTarget] = useState<
    null | { kind: "recipe" } | { kind: "comment"; commentId: number }
  >(null)
  const [commentText, setCommentText] = useState("")
  const [cookOpen, setCookOpen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [likeBusy, setLikeBusy] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editCommentText, setEditCommentText] = useState("")

  const recipePublicId = recipe?.publicId
  const recipeNumericId = recipe?.id
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
  } = useComments({ recipePublicId })

  const isFavorite = useFavoritesStore((s) =>
    recipeNumericId ? s.isFavorite(recipeNumericId) : false,
  )
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)

  const isOwner = user && recipe?.user?.id === user.id

  useEffect(() => {
    if (searchParams.get("cook") === "1" && recipe) {
      setCookOpen(true)
    }
  }, [searchParams, recipe])

  const nutrition = useMemo(() => (recipe ? estimateNutrition(recipe) : null), [recipe])
  const cost = useMemo(() => (recipe ? estimateCostEur(recipe) : null), [recipe])

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!routePublicId) return

      try {
        setLoading(true)
        setError(null)
        if (!isRecipePublicId(routePublicId)) {
          setError("Identifiant de recette invalide.")
          setLoading(false)
          return
        }
        const recipeData = await recipeService.getRecipeByPublicId(routePublicId)
        setRecipe(recipeData)
        setLiked(Boolean(recipeData.likedByCurrentUser))
        setLikesCount(recipeData.likesCount ?? 0)
        useRecentlyViewedStore.getState().add({
          id: recipeData.id,
          publicId: recipeData.publicId,
          title: recipeData.title,
          imageUrl: recipeData.imageUrl,
        })
        setLoading(false)
      } catch (err) {
        console.error("Error fetching recipe:", err)
        setError("Impossible de charger la recette. Veuillez réessayer plus tard.")
        setLoading(false)
      }
    }

    void fetchRecipe()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-fetch when route id changes
  }, [routePublicId])

  usePageMeta({
    title: recipe?.title ?? "Recette",
    description: recipe?.description?.slice(0, 155) ?? "Découvrez cette recette sur Cuisenio.",
    path: recipe ? recipePath(recipe) : `/recipe/${routePublicId ?? ""}`,
    type: "article",
    image: recipe?.imageUrl ? `${env.uploadsUrl}/${recipe.imageUrl}` : undefined,
    jsonLd: recipe
      ? {
          "@context": "https://schema.org",
          "@type": "Recipe",
          name: recipe.title,
          description: recipe.description,
          recipeYield: String(recipe.servings),
          prepTime: `PT${recipe.preparationTime}M`,
          cookTime: `PT${recipe.cookingTime}M`,
          recipeIngredient: recipe.recipeIngredients?.map(
            (ri) => `${ri.quantity ?? ""} ${ri.unit ?? ""} ${ri.ingredient?.name ?? ""}`.trim(),
          ),
          recipeInstructions: recipe.steps?.map((s) => ({
            "@type": "HowToStep",
            text: s.description,
          })),
          author: {
            "@type": "Person",
            name: recipe.user?.username ?? "Cuisenio",
          },
        }
      : undefined,
  })

  const requireAuth = (action: string) => {
    if (user) return true
    warning("Connexion requise", `Connectez-vous pour ${action}.`)
    navigate(
      `/login?next=${encodeURIComponent(recipe ? recipePath(recipe) : `/recipe/${routePublicId}`)}`,
      { state: { message: `Connectez-vous pour ${action}.` } },
    )
    return false
  }

  const handleToggleLike = async () => {
    if (!recipePublicId || !requireAuth("aimer cette recette")) return
    if (likeBusy) return
    setLikeBusy(true)
    try {
      const res = await recipeService.toggleLike(recipePublicId)
      setLiked(res.likedByCurrentUser)
      setLikesCount(res.likesCount)
    } catch {
      notifyError("Action impossible", "Impossible de mettre à jour le like.")
    } finally {
      setLikeBusy(false)
    }
  }

  const handleShare = async () => {
    if (!recipe) return
    const url = `${window.location.origin}${recipePath(recipe)}`
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: recipe.title, text: recipe.description?.slice(0, 120), url })
        return
      }
      await navigator.clipboard.writeText(url)
      success("Lien copié", "Le lien de la recette a été copié.")
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return
      try {
        await navigator.clipboard.writeText(url)
        success("Lien copié", "Le lien de la recette a été copié.")
      } catch {
        notifyError("Partage impossible", "Impossible de partager ou copier le lien.")
      }
    }
  }

  const handleCommentSubmit = async () => {
    if (!recipePublicId || !commentText.trim()) return
    if (!requireAuth("commenter")) return

    try {
      const created = await addComment(recipePublicId, commentText)
      if (!created) {
        notifyError("Commentaire impossible", "Impossible d'ajouter le commentaire. Veuillez réessayer.")
        return
      }
      setCommentText("")
      setRecipe((prev) =>
        prev ? { ...prev, commentsCount: (prev.commentsCount ?? comments.length) + 1 } : prev,
      )
      success("Commentaire publié", "Votre commentaire a été ajouté.")
    } catch (error) {
      console.error("Error posting comment:", error)
      notifyError("Commentaire impossible", "Impossible d'ajouter le commentaire. Veuillez réessayer.")
    }
  }

  const handleSaveCommentEdit = async () => {
    if (!recipePublicId || editingCommentId == null || !editCommentText.trim()) return
    const updated = await updateComment(recipePublicId, editingCommentId, editCommentText)
    if (updated) {
      setEditingCommentId(null)
      setEditCommentText("")
      success("Commentaire mis à jour", "Les modifications ont été enregistrées.")
    } else {
      notifyError("Modification impossible", "Le commentaire n'a pas pu être modifié.")
    }
  }

  const confirmDeleteComment = async () => {
    if (!recipePublicId || commentToDelete == null) return
    const ok = await deleteComment(recipePublicId, commentToDelete)
    if (ok) {
      setRecipe((prev) =>
        prev
          ? { ...prev, commentsCount: Math.max(0, (prev.commentsCount ?? 1) - 1) }
          : prev,
      )
      success("Commentaire supprimé", "Le commentaire a été retiré.")
    } else {
      notifyError("Suppression impossible", "Le commentaire n'a pas pu être supprimé.")
    }
    setCommentToDelete(null)
  }

  const handleDeleteRecipe = async () => {
    if (!recipePublicId) return

    try {
      await recipeService.deleteRecipe(recipePublicId)
      setConfirmDeleteOpen(false)
      success("Recette archivée", "Elle n'est plus visible sur la plateforme.")
      navigate("/home")
    } catch (error) {
      console.error("Error archiving recipe:", error)
      notifyError("Archivage impossible", "La recette n'a pas pu être archivée.")
      setConfirmDeleteOpen(false)
    }
  }

  const openReportRecipe = () => {
    if (!recipePublicId) return
    if (!requireAuth("signaler cette recette")) return
    setReportTarget({ kind: "recipe" })
  }

  const openReportComment = (commentId: number) => {
    if (!recipePublicId) return
    if (!requireAuth("signaler ce commentaire")) return
    setReportTarget({ kind: "comment", commentId })
  }

  const submitReport = async (reason: string) => {
    if (!recipePublicId || !reportTarget) return
    try {
      if (reportTarget.kind === "recipe") {
        const res = await recipeService.reportRecipe(recipePublicId, reason.trim())
        success("Recette signalée", `${res.reportCount} signalement(s) enregistré(s).`)
      } else {
        const res = await recipeService.reportComment(recipePublicId, reportTarget.commentId, reason.trim())
        success("Commentaire signalé", `${res.reportCount} signalement(s) enregistré(s).`)
      }
      setReportTarget(null)
    } catch {
      notifyError(
        "Signalement impossible",
        reportTarget.kind === "recipe"
          ? "Impossible de signaler cette recette."
          : "Impossible de signaler ce commentaire.",
      )
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center" role="status">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary" />
            <p className="mt-4 text-muted-foreground">Chargement de la recette…</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (error && !recipe) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <div className="mb-4 text-xl text-red-500">Une erreur est survenue</div>
            <p className="text-muted-foreground">{error || "Recette introuvable"}</p>
            <Button onClick={() => navigate("/home")} className="mt-4 bg-primary text-white hover:bg-primary/90">
              Retour à l&apos;accueil
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!recipe) {
    return null
  }

  return (
    <AppShell>
    <div className="min-h-screen text-foreground">
      <CookingMode
        recipe={recipe}
        open={cookOpen}
        onClose={() => {
          setCookOpen(false)
          if (searchParams.get("cook")) {
            searchParams.delete("cook")
            setSearchParams(searchParams, { replace: true })
          }
        }}
      />
      {/* Main Content */}
      <main className="px-4 pb-16 pt-8">
        <div className="container mx-auto max-w-5xl">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">
                <p>{error}</p>
                <button
                  type="button"
                  className="mt-1 text-xs font-medium underline"
                  onClick={() => setError(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>

            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">{recipe.title}</h1>
              <Button
                type="button"
                className="min-h-11 bg-primary text-white hover:bg-primary/90"
                onClick={() => setCookOpen(true)}
              >
                <ChefHat className="mr-2 h-4 w-4" /> Mode cuisine
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <p className="max-w-2xl text-sm text-muted-foreground">{recipe.description}</p>

              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => navigate(recipeEditPath(recipe))}
                  >
                    <Edit className="h-4 w-4" /> Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => setConfirmDeleteOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </Button>
                </div>
              )}
              {!isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50"
                  onClick={openReportRecipe}
                >
                  <Flag className="h-4 w-4" /> Signaler
                </Button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="relative h-80 md:h-96">
              {recipe.imageUrl ? (
                <Image
                  src={`${env.uploadsUrl}/${recipe.imageUrl}`}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
                  <Utensils className="h-16 w-16 text-gray-300 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">{recipe.title}</h2>
                  <p className="text-gray-500 max-w-md">{recipe.description}</p>
                </div>
              )}

              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  type="button"
                  aria-pressed={liked}
                  aria-label={liked ? "Retirer le like" : "Aimer la recette"}
                  disabled={likeBusy}
                  onClick={() => void handleToggleLike()}
                  className="flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-2 shadow-sm transition-colors hover:bg-white disabled:opacity-60"
                >
                  <Heart
                    className={`h-5 w-5 ${liked ? "fill-primary text-primary" : "text-gray-600 hover:text-primary"}`}
                  />
                  <span className="text-xs font-medium text-gray-700 tabular-nums">{likesCount}</span>
                </button>
                <button
                  type="button"
                  aria-pressed={isFavorite}
                  aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  onClick={() => {
                    if (!recipePublicId) return
                    if (!user) {
                      requireAuth("enregistrer en favori")
                      return
                    }
                    if (!recipeNumericId) return
                    toggleFavorite(recipeNumericId)
                  }}
                  className="rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white"
                >
                  <BookmarkIcon
                    className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : "text-gray-600 hover:text-primary"}`}
                  />
                </button>
                <button
                  type="button"
                  aria-label="Partager la recette"
                  onClick={() => void handleShare()}
                  className="rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white"
                >
                  <Share2 className="h-5 w-5 text-gray-600 hover:text-primary" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.categories &&
                  recipe.categories.map((category) => (
                    <Badge key={category.id} className="bg-primary/10 text-primary hover:bg-primary/15">
                      {category.name}
                    </Badge>
                  ))}
                <Badge className="bg-gray-100 text-gray-700">
                  {recipe.difficultyLevel === "EASY"
                    ? "Facile"
                    : recipe.difficultyLevel === "INTERMEDIATE"
                      ? "Intermédiaire"
                      : "Difficile"}
                </Badge>
                {recipe.isFeatured && <Badge className="bg-primary/10 text-primary">Featured</Badge>}
              </div>

              <div className="flex items-center mb-6">
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
                  <p className="font-medium">{recipe.user?.username || "Chef inconnu"}</p>
                  <p className="text-sm text-gray-500">
                    Publié le{" "}
                    {new Date(recipe.creationDate).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="font-medium">Temps de préparation</p>
                    <p>{recipe.preparationTime} min</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="font-medium">Temps de cuisson</p>
                    <p>{recipe.cookingTime || 0} min</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="font-medium">Portions</p>
                    <p>{recipe.servings} personnes</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                {nutrition && (
                  <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm">
                    <p className="font-semibold text-foreground">Nutrition (estim.)</p>
                    <p className="text-muted-foreground">
                      ~{nutrition.calories} kcal · P {nutrition.protein}g · G {nutrition.carbs}g · L {nutrition.fat}g
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Indicatif — pour guidage cuisine</p>
                  </div>
                )}
                {cost != null && (
                  <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm">
                    <p className="font-semibold text-foreground">Coût estimé</p>
                    <p className="text-muted-foreground">≈ {cost.toFixed(1)} €</p>
                  </div>
                )}
                <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm">
                  <p className="font-semibold text-foreground">Interactions</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Heart className={`h-3.5 w-3.5 ${liked ? "fill-primary text-primary" : ""}`} />
                      {likesCount} like{likesCount === 1 ? "" : "s"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {recipe.commentsCount ?? comments.length} commentaire
                      {(recipe.commentsCount ?? comments.length) === 1 ? "" : "s"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-1.5 text-primary hover:underline"
                    onClick={() => void handleShare()}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Partager
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="ingredients" className="mb-10">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="ingredients" className="text-sm">
                Ingrédients
              </TabsTrigger>
              <TabsTrigger value="steps" className="text-sm">
                Étapes
              </TabsTrigger>
              <TabsTrigger value="comments" className="text-sm">
                Commentaires
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <Card className="p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-bold">Ingrédients</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      useShoppingListStore.getState().addItems(
                        (recipe.recipeIngredients ?? []).map((ri) => ({
                          name: ri.ingredient.name,
                          quantity: String(ri.quantity ?? ""),
                          unit: ri.unit,
                          recipeTitle: recipe.title,
                        })),
                      )
                      success("Liste de courses", "Les ingrédients ont été ajoutés.")
                    }}
                  >
                    Ajouter à la liste
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Pour {recipe.servings} personnes</p>

                <ul className="space-y-3">
                  {recipe.recipeIngredients &&
                    recipe.recipeIngredients.map((ingredientRecipe) => {
                      const subs = suggestSubstitutions(ingredientRecipe.ingredient.name)
                      return (
                      <li key={ingredientRecipe.id} className="border-b border-gray-100 py-2 last:border-0">
                        <div className="flex items-center">
                        <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <ChefHat className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{ingredientRecipe.ingredient.name}</span>
                        <span className="ml-auto text-gray-600">
                          {ingredientRecipe.quantity} {ingredientRecipe.unit}
                        </span>
                        </div>
                        {subs.length > 0 && (
                          <p className="mt-1 pl-11 text-xs text-muted-foreground">
                            Remplacer par : {subs.join(" · ")}
                          </p>
                        )}
                      </li>
                      )
                    })}
                </ul>
              </Card>
              <KitchenTimer
                defaultMinutes={Math.max(1, recipe.cookingTime || recipe.preparationTime || 10)}
                label="Minuteur de cuisson"
              />
              </div>
            </TabsContent>

            <TabsContent value="steps" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Instructions</h3>

                <ol className="space-y-6">
                  {recipe.steps &&
                    recipe.steps.map((step) => (
                      <li key={step.id} className="flex">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                          {step.stepNumber}
                        </div>
                        <div>
                          <p className="text-gray-700">{step.description}</p>
                        </div>
                      </li>
                    ))}
                </ol>
                {recipe.videoUrl ? (
                  <div className="mt-6 rounded-md border border-border bg-muted/30 p-4 text-sm">
                    <p className="font-medium mb-2">Video</p>
                    <a className="text-primary underline" href={recipe.videoUrl} target="_blank" rel="noreferrer">
                      Ouvrir la video de la recette
                    </a>
                  </div>
                ) : null}
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-1 text-xl font-bold">
                  Commentaires
                  <span className="ml-2 text-base font-normal text-muted-foreground">
                    ({recipe.commentsCount ?? comments.length})
                  </span>
                </h3>

                <div className="mb-6">
                  {user ? (
                    <div className="mb-6 flex gap-3">
                      <Avatar className="h-8 w-8 border">
                        {user.profilePicture ? (
                          <AvatarImage
                            src={user.profilePicture}
                            alt={user.username || "Utilisateur"}
                          />
                        ) : (
                          <AvatarFallback>
                            <User className="text-2xl text-primary" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="relative flex-1">
                        <Textarea
                          placeholder="Partagez votre avis sur cette recette..."
                          className="resize-none pr-12 text-sm"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <Button
                          className={`absolute bottom-3 right-3 rounded-full p-2 ${
                            commentText.trim()
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "bg-gray-100 text-gray-400"
                          }`}
                          size="sm"
                          disabled={!commentText.trim()}
                          onClick={() => void handleCommentSubmit()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 rounded-lg border border-dashed border-border bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                      <Link to={`/login?next=${encodeURIComponent(recipePath(recipe))}`} className="font-medium text-primary hover:underline">
                        Connectez-vous
                      </Link>{" "}
                      pour laisser un commentaire.
                    </div>
                  )}

                  <div className="space-y-4">
                    {commentsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : commentsError ? (
                      <div className="py-8 text-center">
                        <p className="mb-2 text-red-500">{commentsError}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => recipePublicId && void fetchComments(recipePublicId)}
                        >
                          Réessayer
                        </Button>
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="py-8 text-center text-gray-500">
                        <MessageCircle className="mx-auto mb-2 h-12 w-12 text-gray-300" />
                        <p>Aucun commentaire pour cette recette</p>
                        <p className="mt-1 text-sm">Soyez le premier à donner votre avis !</p>
                      </div>
                    ) : (
                      comments.map((comment) => {
                        const isCommentOwner = user?.id === comment.user?.id
                        const isEditing = editingCommentId === comment.id
                        return (
                          <div key={comment.id} className="rounded-lg bg-gray-50 p-4">
                            <div className="mb-2 flex items-center">
                              <Avatar className="mr-2 h-8 w-8 border">
                                <AvatarFallback>
                                  {(comment.user?.username ?? "?").slice(0, 1).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {comment.user?.username ?? "Utilisateur"}
                                </p>
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
                            {isEditing ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editCommentText}
                                  onChange={(e) => setEditCommentText(e.target.value)}
                                  className="text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => void handleSaveCommentEdit()}>
                                    Enregistrer
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setEditingCommentId(null)
                                      setEditCommentText("")
                                    }}
                                  >
                                    Annuler
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-3">
                              {isCommentOwner && !isEditing && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-slate-600 hover:text-primary"
                                    onClick={() => {
                                      setEditingCommentId(comment.id)
                                      setEditCommentText(comment.content)
                                    }}
                                  >
                                    <Pencil className="mr-1 h-3.5 w-3.5" />
                                    Modifier
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-red-600 hover:text-red-700"
                                    onClick={() => setCommentToDelete(comment.id)}
                                  >
                                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                                    Supprimer
                                  </Button>
                                </>
                              )}
                              {!isCommentOwner && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-slate-600 hover:text-primary"
                                  onClick={() => openReportComment(comment.id)}
                                >
                                  <Flag className="mr-1 h-3.5 w-3.5" />
                                  Signaler ce commentaire
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {recipe.kitchenTools && recipe.kitchenTools.length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4 text-xl font-bold">Kitchen Tools</h3>
              <div className="space-y-3">
                {recipe.kitchenTools.map((tool, idx) => (
                  <div key={`${tool.name}-${idx}`} className="flex items-center justify-between rounded-md border border-border p-3">
                    <p className="font-medium">{tool.name}</p>
                    {tool.affiliateUrl ? (
                      <a href={tool.affiliateUrl} target="_blank" rel="noreferrer">
                        <Button size="sm">View on Amazon</Button>
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">No affiliate link</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        severity="danger"
        title="Archiver cette recette ?"
        description="Cette recette sera archivée et ne sera plus visible sur la plateforme."
        confirmLabel="Archiver"
        onConfirm={handleDeleteRecipe}
      />

      <ConfirmDialog
        open={commentToDelete != null}
        onOpenChange={(open) => {
          if (!open) setCommentToDelete(null)
        }}
        severity="danger"
        title="Supprimer ce commentaire ?"
        description="Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={confirmDeleteComment}
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
    </div>
    </AppShell>
  )
}

