import { AnimatePresence, motion } from "framer-motion"
import {
  AlertCircle,
  ArrowLeft,
  BookmarkIcon,
  CheckCircle,
  ChefHat,
  Clock,
  Edit,
  Flag,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  User,
  Users,
  Utensils,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { recipeService } from "../../api/recipe.service"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { ConfirmDialog } from "../../components/ui/ConfirmDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Textarea } from "../../components/ui/textarea"
import { useComments } from "../../hooks/useComments"
import { useAuthStore } from "../../store/auth.store"
import type { RecipeResponse } from "../../types/recipe.types"
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
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuthStore()
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [cookOpen, setCookOpen] = useState(false)

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    fetchComments,
    addComment,
  } = useComments({ recipeId: id ? Number.parseInt(id) : undefined })

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
      if (!id) return

      try {
        setLoading(true)
        const recipeData = await recipeService.getRecipeById(Number.parseInt(id))
        setRecipe(recipeData)
        useRecentlyViewedStore.getState().add({
          id: recipeData.id,
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

    fetchRecipe()
  }, [id])

  usePageMeta({
    title: recipe?.title ?? "Recette",
    description: recipe?.description?.slice(0, 155) ?? "Découvrez cette recette sur Cuisenio.",
    path: `/recipe/${id ?? ""}`,
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

  const handleCommentSubmit = async () => {
    if (!id || !commentText.trim()) return

    try {
      await addComment(Number.parseInt(id), commentText)
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

  const handleDeleteRecipe = async () => {
    if (!id) return

    try {
      await recipeService.deleteRecipe(Number.parseInt(id))
      setConfirmDeleteOpen(false)
      setSuccessMessage("Recette archivée — elle n'est plus visible sur la plateforme.")
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        navigate("/home")
      }, 2000)
    } catch (error) {
      console.error("Error archiving recipe:", error)
      setError("Erreur lors de l'archivage de la recette")
      setConfirmDeleteOpen(false)
    }
  }

  const handleReportRecipe = async () => {
    if (!id) return
    const reason = window.prompt("Raison du signalement")
    if (!reason?.trim()) return
    try {
      const res = await recipeService.reportRecipe(Number.parseInt(id), reason.trim())
      setSuccessMessage(`Recette signalee (${res.reportCount} signalement(s)).`)
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 2000)
    } catch {
      setError("Impossible de signaler cette recette.")
    }
  }

  const handleReportComment = async (commentId: number) => {
    if (!id) return
    const reason = window.prompt("Raison du signalement du commentaire")
    if (!reason?.trim()) return
    try {
      const res = await recipeService.reportComment(Number.parseInt(id), commentId, reason.trim())
      setSuccessMessage(`Commentaire signale (${res.reportCount} signalement(s)).`)
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 2000)
    } catch {
      setError("Impossible de signaler ce commentaire.")
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

  if (error || !recipe) {
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
                    onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
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
                  onClick={() => void handleReportRecipe()}
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
                <button className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-sm">
                  <Heart className="h-5 w-5 text-gray-600 hover:text-primary" />
                </button>
                <button className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-sm">
                  <BookmarkIcon className="h-5 w-5 text-gray-600 hover:text-primary" />
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
                {recipe.isPremium && <Badge className="bg-violet-100 text-violet-700">Premium</Badge>}
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
                  <p className="font-semibold text-foreground">Partager</p>
                  <button
                    type="button"
                    className="mt-1 text-primary hover:underline"
                    onClick={async () => {
                      const url = window.location.href
                      try {
                        if (navigator.share) {
                          await navigator.share({ title: recipe.title, url })
                        } else {
                          await navigator.clipboard.writeText(url)
                          setSuccessMessage("Lien copié")
                          setShowSuccessModal(true)
                          setTimeout(() => setShowSuccessModal(false), 1500)
                        }
                      } catch {
                        /* user cancelled share */
                      }
                    }}
                  >
                    Lien / partage natif
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
                      setSuccessMessage("Ingrédients ajoutés à la liste de courses")
                      setShowSuccessModal(true)
                      setTimeout(() => setShowSuccessModal(false), 1800)
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
                {recipe.premiumLocked ? (
                  <div className="rounded-md border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800">
                    Cette recette est reservee aux membres Pro. Passez en Pro pour voir les instructions detaillees et la video.
                  </div>
                ) : null}

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
                {!recipe.premiumLocked && recipe.videoUrl ? (
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
                <h3 className="text-xl font-bold mb-4">Commentaires</h3>

                <div className="mb-6">
                  <div className="flex gap-3 mb-6">
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
                          commentText.trim() ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-gray-100 text-gray-400"
                        }`}
                        size="sm"
                        disabled={!commentText.trim()}
                        onClick={handleCommentSubmit}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {commentsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : commentsError ? (
                      <div className="text-center py-8">
                        <p className="text-red-500 mb-2">Impossible de charger les commentaires</p>
                        <Button variant="outline" size="sm" onClick={() => id && fetchComments(Number.parseInt(id))}>
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
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <Avatar className="h-8 w-8 mr-2 border">
                              <Image
                                src="/placeholder.svg?height=40&width=40"
                                alt={comment.user.username}
                                width={40}
                                height={40}
                              />
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{comment.user.username}</p>
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
                          <p className="text-sm text-gray-700">{comment.content}</p>
                          <div className="mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs text-slate-600 hover:text-primary"
                              onClick={() => void handleReportComment(comment.id)}
                            >
                              <Flag className="mr-1 h-3.5 w-3.5" />
                              Signaler ce commentaire
                            </Button>
                          </div>
                        </div>
                      ))
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
    </AppShell>
  )
}

