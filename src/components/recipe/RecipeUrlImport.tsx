import { Link2, Loader2, Sparkles } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { recipeImportService, mapRecipeImportError, type RecipeImportPreview } from "../../api/recipe-import.service"
import { useNotification } from "../../context/NotificationContext"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface RecipeUrlImportProps {
  onApply?: (preview: RecipeImportPreview) => void
}

export function RecipeUrlImport({ onApply }: RecipeUrlImportProps) {
  const { t } = useTranslation()
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
      success(t("import.successTitle"), t("import.successBody"))
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
        <h2 className="text-lg font-semibold text-foreground">{t("import.title")}</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        {t("import.help")}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="import-url">{t("import.urlLabel")}</Label>
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
              <Loader2 className="me-2 h-4 w-4 animate-spin" /> {t("import.analyzing")}
            </>
          ) : (
            <>
              <Sparkles className="me-2 h-4 w-4" /> {t("import.extract")}
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
            {preview.prepTimeMinutes != null && (
              <span>{t("import.prep", { min: preview.prepTimeMinutes })}</span>
            )}
            {preview.cookTimeMinutes != null && (
              <span>{t("import.cook", { min: preview.cookTimeMinutes })}</span>
            )}
            <span>{t("import.ingredientsCount", { count: preview.ingredients.length })}</span>
            <span>{t("import.stepsCount", { count: preview.steps.length })}</span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("import.ingredients")}</p>
              <ul className="max-h-40 space-y-1 overflow-y-auto text-sm text-foreground">
                {preview.ingredients.slice(0, 12).map((ing) => (
                  <li key={ing}>• {ing}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("import.steps")}</p>
              <ol className="max-h-40 list-decimal space-y-1 overflow-y-auto ps-4 text-sm text-foreground">
                {preview.steps.slice(0, 8).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
          {onApply && (
            <Button type="button" className="mt-4" onClick={() => onApply(preview)}>
              {t("import.apply")}
            </Button>
          )}
        </div>
      )}
    </section>
  )
}
