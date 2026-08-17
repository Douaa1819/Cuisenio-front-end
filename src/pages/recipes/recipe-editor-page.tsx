import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import type { RecipeImportPreview } from "../../api/recipe-import.service"
import { recipeService } from "../../api/recipe.service"
import { AppShell } from "../../components/layout/AppShell"
import { Button } from "../../components/ui/button"
import { useNotification } from "../../context/NotificationContext"
import { usePageMeta } from "../../hooks/usePageMeta"
import { useAuthStore } from "../../store/auth.store"
import type { RecipeFormData } from "../community/validation/recipe-validation"
import AddRecipeDialog from "../community/AddRecipeForm"
import type { RecipeResponse } from "../../types/recipe.types"

export default function RecipeEditorPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { success } = useNotification()
  const isEdit = Boolean(id)

  const [recipe, setRecipe] = useState<RecipeResponse | null>(null)
  const [loading, setLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState<string | null>(null)

  const importPreview = (location.state as { importPreview?: RecipeImportPreview } | null)?.importPreview ?? null

  usePageMeta({
    title: isEdit ? "Modifier la recette" : "Créer une recette",
    description: "Rédiger ou modifier une fiche recette Cuisenio",
    path: isEdit ? `/edit-recipe/${id}` : "/add-recipe",
  })

  useEffect(() => {
    if (!id) return
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const data = await recipeService.getRecipeById(Number.parseInt(id, 10))
        if (cancelled) return
        if (user?.id && data.user?.id !== user.id) {
          setLoadError("Vous ne pouvez modifier que vos propres recettes.")
          return
        }
        setRecipe(data)
        setLoadError(null)
      } catch {
        if (!cancelled) setLoadError("Impossible de charger cette recette.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [id, user?.id])

  const uploadImageIfNeeded = async (recipeId: number, image?: File | null) => {
    if (!image) return
    const formData = new FormData()
    formData.append("imageUrl", image)
    await recipeService.addImageToRecipe(recipeId, formData)
  }

  const handleSubmit = async (recipeData: RecipeFormData, image?: File | null) => {
    if (isEdit && id) {
      const recipeId = Number.parseInt(id, 10)
      await recipeService.updateRecipe(recipeId, recipeData)
      await uploadImageIfNeeded(recipeId, image)
      success("Recette mise à jour", "Les modifications et l'image ont été enregistrées.")
      navigate("/chef")
      return recipeId
    }
    const created = await recipeService.createRecipe(recipeData)
    await uploadImageIfNeeded(created.id, image)
    success("Recette créée", "Votre fiche a été enregistrée.")
    navigate("/chef")
    return created.id
  }

  return (
    <AppShell>
      <main className="organic-surface min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Button type="button" variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
            Retour
          </Button>
          {loading && <p className="text-sm text-muted-foreground">Chargement de la recette…</p>}
          {loadError && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-6 text-sm text-destructive">
              {loadError}
            </div>
          )}
          {!loading && !loadError && (
            <AddRecipeDialog
              open
              asPage
              initialRecipe={recipe}
              importPreview={isEdit ? null : importPreview}
              onOpenChange={(nextOpen) => {
                if (!nextOpen) navigate(isEdit ? "/chef" : "/home")
              }}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </main>
    </AppShell>
  )
}
