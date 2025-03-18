"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ChefHat,
  Clock,
  Users,
  Utensils,
  Heart,
  MessageCircle,
  BookmarkIcon,
  Share2,
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Avatar } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { recipeService } from "../../api/recipe.service"
import { useAuthStore } from "../../store/auth.store"
import { useComments } from "../../hooks/useComments"
import { Textarea } from "../../components/ui/textarea"
import { Send } from "lucide-react"
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

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    fetchComments,
    addComment,
  } = useComments({ recipeId: id ? Number.parseInt(id) : undefined })

  const isOwner = user && recipe?.user?.id === user.id

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return

      try {
        setLoading(true)
        const recipeData = await recipeService.getRecipeById(Number.parseInt(id))
        setRecipe(recipeData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching recipe:", err)
        setError("Impossible de charger la recette. Veuillez réessayer plus tard.")
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

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
      setSuccessMessage("Recette supprimée avec succès!")
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        navigate("/home")
      }, 2000)
    } catch (error) {
      console.error("Error deleting recipe:", error)
      setError("Erreur lors de la suppression de la recette")
    } finally {
      setConfirmDeleteOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la recette...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 text-xl mb-4">Une erreur est survenue</div>
          <p className="text-gray-600">{error || "Recette introuvable"}</p>
          <Button onClick={() => navigate(-1)} className="mt-4 bg-rose-500 hover:bg-rose-600 text-white">
            Retour
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Main Content */}
      <main className="pt-8 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-600 hover:text-rose-500 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour
            </Button>

            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{recipe.title}</h1>

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
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="relative h-80 md:h-96">
              {recipe.imageUrl ? (
                <Image
                  src={"http://localhost:8080/uploads/" + recipe.imageUrl}
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
                  <Heart className="h-5 w-5 text-gray-600 hover:text-rose-500" />
                </button>
                <button className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-sm">
                  <BookmarkIcon className="h-5 w-5 text-gray-600 hover:text-rose-500" />
                </button>
                <button className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-sm">
                  <Share2 className="h-5 w-5 text-gray-600 hover:text-rose-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.categories &&
                  recipe.categories.map((category) => (
                    <Badge key={category.id} className="bg-rose-100 text-rose-700 hover:bg-rose-200">
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
              </div>

              <div className="flex items-center mb-6">
                <Avatar className="h-10 w-10 mr-3 border">
                  <Image
                    src={recipe.user?.profilePicture || "/placeholder.svg?height=40&width=40"}
                    alt={recipe.user?.username || "Chef"}
                    width={40}
                    height={40}
                  />
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
                  <Clock className="h-5 w-5 mr-2 text-rose-500" />
                  <div>
                    <p className="font-medium">Temps de préparation</p>
                    <p>{recipe.preparationTime} min</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-rose-500" />
                  <div>
                    <p className="font-medium">Temps de cuisson</p>
                    <p>{recipe.cookingTime || 0} min</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-rose-500" />
                  <div>
                    <p className="font-medium">Portions</p>
                    <p>{recipe.servings} personnes</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-8">{recipe.description}</p>
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
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Ingrédients</h3>
                <p className="text-sm text-gray-500 mb-4">Pour {recipe.servings} personnes</p>

                <ul className="space-y-3">
                  {recipe.recipeIngredients &&
                    recipe.recipeIngredients.map((ingredientRecipe) => (
                      <li key={ingredientRecipe.id} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <ChefHat className="h-4 w-4 text-rose-500" />
                        </div>
                        <span className="font-medium">{ingredientRecipe.ingredient.name}</span>
                        <span className="ml-auto text-gray-600">
                          {ingredientRecipe.quantity} {ingredientRecipe.unit}
                        </span>
                      </li>
                    ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="steps" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Instructions</h3>

                <ol className="space-y-6">
                  {recipe.steps &&
                    recipe.steps.map((step) => (
                      <li key={step.id} className="flex">
                        <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                          {step.stepNumber}
                        </div>
                        <div>
                          <p className="text-gray-700">{step.description}</p>
                        </div>
                      </li>
                    ))}
                </ol>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Commentaires</h3>

                <div className="mb-6">
                  <div className="flex gap-3 mb-6">
                    <Avatar className="h-10 w-10 flex-shrink-0 border">
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

                  <div className="space-y-4">
                    {commentsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
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
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

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
            <Button variant="danger" onClick={handleDeleteRecipe} className="bg-red-500 hover:bg-red-600 text-white">
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

