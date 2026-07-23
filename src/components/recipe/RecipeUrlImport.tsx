import { Link2, Loader2, Sparkles } from "lucide-react"
import { useState } from "react"
import { recipeImportService, type RecipeImportPreview } from "../../api/recipe-import.service"
import { useNotification } from "../../context/NotificationContext"
import { useAuthStore } from "../../store/auth.store"
import { isPremiumUser } from "../../types/auth.types"
import { PremiumUpgradeModal } from "../premium/PremiumUpgradeModal"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface RecipeUrlImportProps {
  onApply?: (preview: RecipeImportPreview) => void
}

export function RecipeUrlImport({ onApply }: RecipeUrlImportProps) {
  const user = useAuthStore((s) => s.user)
  const premium = isPremiumUser(user?.role, user?.subscriptionTier)
  const { error: notifyError, success } = useNotification()

  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<RecipeImportPreview | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const handleImport = async () => {
    if (!premium) {
      setShowUpgrade(true)
      return
    }
    if (!url.trim()) return
    setLoading(true)
    setPreview(null)
    try {
      const data = await recipeImportService.preview(url.trim())
      setPreview(data)
      success("Recette extraite", `Parser: ${data.parserUsed}`)
    } catch (err: unknown) {
      const axiosLike = err as { response?: { status?: number; data?: { detail?: string; message?: string } } }
      if (axiosLike.response?.status === 403) {
        setShowUpgrade(true)
        return
      }
      console.error("[recipe-import]", err)
      notifyError(
        "Import échoué",
        axiosLike.response?.data?.detail ?? axiosLike.response?.data?.message ?? "URL non supportée",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card-theme">
      <div className="mb-4 flex items-center gap-2">
        <Link2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Importer par lien</h2>
        {!premium && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
            Premium
          </span>
        )}
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Collez l&apos;URL d&apos;une recette web. Cuisenio extrait titre, ingrédients et étapes (JSON-LD puis fallback HTML).
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="import-url">URL de la recette</Label>
          <Input
            id="import-url"
            type="url"
            placeholder="https://…"
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

      <PremiumUpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        featureLabel="Import par URL"
      />
    </section>
  )
}
