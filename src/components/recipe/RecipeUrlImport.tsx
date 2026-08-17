import { Link2, Loader2, Sparkles } from "lucide-react"
import { useState } from "react"
import { recipeImportService, mapRecipeImportError, type RecipeImportPreview } from "../../api/recipe-import.service"
import { useNotification } from "../../context/NotificationContext"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface RecipeUrlImportProps {
  onApply?: (preview: RecipeImportPreview) => void
}

export function RecipeUrlImport({ onApply }: RecipeUrlImportProps) {
  const { error: notifyError, success } = useNotification()

  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<RecipeImportPreview | null>(null)

  const handleImport = async () => {
    if (!url.trim()) return
    setLoading(true)
    setPreview(null)
    try {
      const data = await recipeImportService.preview(url.trim())
      setPreview(data)
      success("Recette importée", "La recette a été extraite. Vérifiez-la avant de l'enregistrer.")
    } catch (err: unknown) {
      console.error("[recipe-import]", err)
      const mapped = mapRecipeImportError(err)
      notifyError(mapped.title, mapped.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card-theme">
      <div className="mb-4 flex items-center gap-2">
        <Link2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Import rapide par URL</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Collez un lien TikTok, Instagram ou Marmiton pour extraire la fiche. Les sites de recettes avec Schema.org sont aussi pris en charge.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="import-url">URL de la recette</Label>
          <Input
            id="import-url"
            type="url"
            placeholder="https://www.marmiton.org/…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <Button
          type="button"
          className="mt-auto bg-primary-gradient text-white sm:min-w-[140px]"
          disabled={loading || !url.trim()}
          onClick={handleImport}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyse…
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Extraire
            </>
          )}
        </Button>
      </div>

      {preview && (
        <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
          <h3 className="text-base font-semibold text-foreground">{preview.title}</h3>
          {preview.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{preview.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {preview.prepTimeMinutes != null && <span>Préparation {preview.prepTimeMinutes} min</span>}
            {preview.cookTimeMinutes != null && <span>Cuisson {preview.cookTimeMinutes} min</span>}
            <span>{preview.ingredients.length} ingrédients</span>
            <span>{preview.steps.length} étapes</span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ingrédients</p>
              <ul className="max-h-40 space-y-1 overflow-y-auto text-sm text-foreground">
                {preview.ingredients.slice(0, 12).map((ing) => (
                  <li key={ing}>• {ing}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Étapes</p>
              <ol className="max-h-40 list-decimal space-y-1 overflow-y-auto pl-4 text-sm text-foreground">
                {preview.steps.slice(0, 8).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
          {onApply && (
            <Button type="button" className="mt-4" onClick={() => onApply(preview)}>
              Préremplir le formulaire
            </Button>
          )}
        </div>
      )}
    </section>
  )
}
