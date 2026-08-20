import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Archive,
  BarChart3,
  BookOpen,
  Clock,
  Eye,
  Link2,
  Pencil,
  Plus,
  Refrigerator,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react"
import { recipeService } from "../../api/recipe.service"
import { AppShell } from "../../components/layout/AppShell"
import { RecipeUrlImport } from "../../components/recipe/RecipeUrlImport"
import { Button } from "../../components/ui/button"
import { ConfirmDialog } from "../../components/ui/ConfirmDialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Icon } from "../../components/ui/icon"
import { ListSkeleton } from "../../components/ui/list-skeleton"
import { useNotification } from "../../context/NotificationContext"
import { usePageMeta } from "../../hooks/usePageMeta"
import { dateLocaleTag } from "../../i18n/locales"
import { env } from "../../lib/env"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/auth.store"
import { recipeEditPath, recipePath, type RecipeResponse } from "../../types/recipe.types"

type RecipeStatus = "published" | "pending" | "draft" | "archived"

function resolveStatus(r: RecipeResponse): RecipeStatus {
  if ((r as { isArchived?: boolean }).isArchived) return "archived"
  if (r.status === "draft") return "draft"
  if (r.status === "pending_review" || r.isApproved === false) return "pending"
  return "published"
}

function statusLabel(status: RecipeStatus, t: (key: string) => string) {
  return t(`chef.status.${status}`)
}

function statusClass(status: RecipeStatus) {
  switch (status) {
    case "published":
      return "bg-primary/10 text-primary"
    case "pending":
      return "bg-secondary text-muted-foreground"
    case "draft":
      return "bg-muted text-muted-foreground"
    case "archived":
      return "bg-destructive/10 text-destructive"
  }
}

function formatDate(iso?: string, locale?: string) {
  if (!iso) return "—"
  try {
    return new Intl.DateTimeFormat(dateLocaleTag(locale), { dateStyle: "medium" }).format(new Date(iso))
  } catch {
    return iso
  }
}

function recipeImageUrl(r: RecipeResponse) {
  if (!r.imageUrl) return null
  return r.imageUrl.startsWith("http") ? r.imageUrl : `${env.uploadsUrl}/${r.imageUrl}`
}

function estimateViews(r: RecipeResponse) {
  return (r.totalRatings ?? 0) * 12 + (r.totalComments ?? 0) * 5
}

export default function ChefDashboard() {
  const { t, i18n } = useTranslation()
  const locale = dateLocaleTag(i18n.language)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { success, error: notifyError } = useNotification()

  const [recipes, setRecipes] = useState<RecipeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [archiveTarget, setArchiveTarget] = useState<RecipeResponse | null>(null)
  const [archiveLoading, setArchiveLoading] = useState(false)
  const [statsTarget, setStatsTarget] = useState<RecipeResponse | null>(null)

  usePageMeta({
    title: t("chef.metaTitle"),
    description: t("chef.metaDescription"),
    path: "/chef",
  })

  const loadRecipes = useCallback(async () => {
    setLoading(true)
    try {
      let mine: RecipeResponse[] = []
      try {
        const res = await recipeService.getMyRecipes()
        mine = res.content ?? (Array.isArray(res) ? (res as RecipeResponse[]) : [])
      } catch {
        const all = await recipeService.getAllRecipes()
        mine = (all.content ?? []).filter((r) => r.user?.id === user?.id)
      }
      setRecipes(mine)
      setError(null)
    } catch {
      setError(t("chef.loadError"))
    } finally {
      setLoading(false)
    }
  }, [user?.id, t])

  useEffect(() => {
    void loadRecipes()
  }, [loadRecipes])

  const published = useMemo(() => recipes.filter((r) => resolveStatus(r) === "published"), [recipes])
  const pending = useMemo(() => recipes.filter((r) => resolveStatus(r) === "pending"), [recipes])
  const totalViews = useMemo(() => recipes.reduce((acc, r) => acc + estimateViews(r), 0), [recipes])
  const avgRating = useMemo(() => {
    if (!recipes.length) return 0
    return recipes.reduce((a, r) => a + (r.averageRating ?? 0), 0) / recipes.length
  }, [recipes])

  const handleArchive = async () => {
    if (!archiveTarget) return
    setArchiveLoading(true)
    try {
      if (!archiveTarget.publicId) return
      await recipeService.deleteRecipe(archiveTarget.publicId)
      setRecipes((prev) => prev.filter((r) => r.id !== archiveTarget.id))
      success(t("chef.archiveSuccessTitle"), t("chef.archiveSuccessBody", { title: archiveTarget.title }))
      setArchiveTarget(null)
    } catch {
      notifyError(t("chef.errorTitle"), t("chef.archiveError"))
    } finally {
      setArchiveLoading(false)
    }
  }

  return (
    <AppShell>
      <main className="organic-surface min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <header className="mb-8">
            <p className="font-sans text-sm font-medium text-primary">{t("chef.kicker")}</p>
            <h1 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("chef.hello", { name: user?.username ? `, ${user.username}` : "" })}
            </h1>
            <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
              {t("chef.subtitle")}
            </p>
          </header>

          {/* A. Actions rapides de création */}
          <section className="mb-8" aria-labelledby="chef-create-heading">
            <h2
              id="chef-create-heading"
              className="mb-4 font-sans text-base font-semibold tracking-tight text-foreground"
            >
              {t("chef.createHeading")}
            </h2>
            <div className="grid gap-3 lg:grid-cols-3">
              <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card-theme">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon icon={Link2} size={20} />
                </div>
                <h3 className="font-sans text-sm font-semibold text-foreground">{t("chef.importTitle")}</h3>
                <p className="mt-1 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
                  {t("chef.importText")}
                </p>
                <Button
                  type="button"
                  className="mt-4 w-full bg-primary hover:bg-primary/90"
                  onClick={() => setImportOpen(true)}
                >
                  <Icon icon={Sparkles} className="me-1.5" />
                  {t("chef.importCta")}
                </Button>
              </article>

              <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card-theme">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon icon={Pencil} size={20} />
                </div>
                <h3 className="font-sans text-sm font-semibold text-foreground">{t("chef.manualTitle")}</h3>
                <p className="mt-1 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
                  {t("chef.manualText")}
                </p>
                <Link to="/add-recipe" className="mt-4 block">
                  <Button type="button" variant="outline" className="w-full">
                    <Icon icon={Plus} className="me-1.5" />
                    {t("chef.manualCta")}
                  </Button>
                </Link>
              </article>

              <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card-theme">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon icon={Refrigerator} size={20} />
                </div>
                <h3 className="font-sans text-sm font-semibold text-foreground">{t("chef.pantryTitle")}</h3>
                <p className="mt-1 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
                  {t("chef.pantryText")}
                </p>
                <Link to="/meal-planner" className="mt-4 block">
                  <Button type="button" variant="outline" className="w-full">
                    <Icon icon={Refrigerator} className="me-1.5" />
                    {t("chef.pantryCta")}
                  </Button>
                </Link>
              </article>
            </div>
          </section>

          {loading && <ListSkeleton />}
          {error && (
            <div className="mb-8 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-6 font-sans text-sm text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* B. KPI cards */}
              <section className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={t("chef.kpis")}>
                <KpiCard
                  icon={BookOpen}
                  title={t("chef.kpiActive")}
                  value={String(published.length)}
                  badge={t("chef.kpiPublished", { count: published.length })}
                />
                <KpiCard
                  icon={Clock}
                  title={t("chef.kpiPending")}
                  value={String(pending.length)}
                  badge={t("chef.kpiWaiting", { count: pending.length })}
                  badgeTone={pending.length ? "warn" : "ok"}
                />
                <KpiCard
                  icon={Eye}
                  title={t("chef.kpiViews")}
                  value={totalViews.toLocaleString(locale)}
                  badge={t("chef.kpiViewsBadge", { count: totalViews.toLocaleString(locale) })}
                  trailingIcon={TrendingUp}
                />
                <KpiCard
                  icon={Star}
                  title={t("chef.kpiRating")}
                  value={avgRating ? avgRating.toFixed(1) : "—"}
                  badge={avgRating ? t("chef.kpiRatingValue", { rating: avgRating.toFixed(1) }) : t("chef.kpiNoRating")}
                />
              </section>

              {/* C. Recipe management */}
              <section aria-labelledby="chef-recipes-heading">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2
                      id="chef-recipes-heading"
                      className="font-sans text-base font-semibold tracking-tight text-foreground"
                    >
                      {t("chef.myRecipes")}
                    </h2>
                    <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                      {t("chef.myRecipesHint")}
                    </p>
                  </div>
                  <Link to="/home">
                    <Button type="button" variant="ghost" size="sm">
                      {t("chef.feed")}
                    </Button>
                  </Link>
                </div>

                {recipes.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-card/60 px-4 py-14 text-center">
                    <p className="text-sm text-muted-foreground">{t("chef.empty")}</p>
                    <Link to="/add-recipe" className="mt-4 inline-block">
                      <Button type="button" className="bg-primary hover:bg-primary/90">
                        <Icon icon={Plus} className="me-1.5" />
                        {t("chef.firstRecipe")}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-theme">
                    <ul className="divide-y divide-border">
                      {recipes.map((r) => {
                        const status = resolveStatus(r)
                        const img = recipeImageUrl(r)
                        return (
                          <li
                            key={r.id}
                            className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
                          >
                            <Link
                              to={recipePath(r)}
                              className="flex min-w-0 flex-1 items-center gap-3"
                            >
                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                                {img ? (
                                  <img src={img} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                    <Icon icon={BookOpen} size={18} />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-sans text-sm font-semibold text-foreground">{r.title}</p>
                                <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                                  {formatDate(r.creationDate, i18n.language)} · {(r.averageRating ?? 0).toFixed(1)}
                                </p>
                              </div>
                            </Link>

                            <span
                              className={cn(
                                "inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                                statusClass(status),
                              )}
                            >
                              {statusLabel(status, t)}
                            </span>

                            <div className="flex flex-wrap gap-1.5 sm:justify-end">
                              <Button
                                type="button"
                                size="xs"
                                variant="outline"
                                onClick={() => navigate(recipeEditPath(r))}
                              >
                                <Icon icon={Pencil} className="me-1" size={14} />
                                {t("chef.edit")}
                              </Button>
                              <Button
                                type="button"
                                size="xs"
                                variant="outline"
                                onClick={() => setStatsTarget(r)}
                              >
                                <Icon icon={BarChart3} className="me-1" size={14} />
                                {t("chef.stats")}
                              </Button>
                              {status !== "archived" && (
                                <Button
                                  type="button"
                                  size="xs"
                                  variant="ghost"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => setArchiveTarget(r)}
                                >
                                  <Icon icon={Archive} className="me-1" size={14} />
                                  {t("chef.archive")}
                                </Button>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      {/* Import modal */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-lg border-border bg-card dark:bg-card">
          <DialogHeader>
            <DialogTitle className="font-sans text-lg font-semibold text-foreground">{t("chef.importModalTitle")}</DialogTitle>
            <DialogDescription>
              {t("chef.importModalBody")}
            </DialogDescription>
          </DialogHeader>
          <RecipeUrlImport
            onApply={(preview) => {
              setImportOpen(false)
              navigate("/add-recipe", { state: { importPreview: preview } })
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Stats modal */}
      <Dialog open={!!statsTarget} onOpenChange={(open) => !open && setStatsTarget(null)}>
        <DialogContent className="max-w-md border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-sans text-lg font-semibold text-foreground">
              {t("chef.statsTitle", { title: statsTarget?.title ?? "" })}
            </DialogTitle>
            <DialogDescription>{t("chef.statsBody")}</DialogDescription>
          </DialogHeader>
          {statsTarget && (
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <StatTile label={t("chef.statViews")} value={estimateViews(statsTarget).toLocaleString(locale)} />
              <StatTile label={t("chef.statRating")} value={(statsTarget.averageRating ?? 0).toFixed(1)} />
              <StatTile label={t("chef.statReviews")} value={String(statsTarget.totalRatings ?? 0)} />
              <StatTile label={t("chef.statComments")} value={String(statsTarget.totalComments ?? 0)} />
            </dl>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(open) => !open && !archiveLoading && setArchiveTarget(null)}
        severity="danger"
        title={t("chef.archiveTitle")}
        description={
          archiveTarget
            ? t("chef.archiveBody", { title: archiveTarget.title })
            : ""
        }
        confirmLabel={t("chef.archive")}
        isLoading={archiveLoading}
        onConfirm={handleArchive}
      />
    </AppShell>
  )
}

function KpiCard({
  icon,
  title,
  value,
  badge,
  badgeTone = "ok",
  trailingIcon,
}: {
  icon: typeof BookOpen
  title: string
  value: string
  badge: string
  badgeTone?: "ok" | "warn"
  trailingIcon?: typeof TrendingUp
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card-theme">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-sans text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
          <p className="mt-2 font-sans text-3xl font-semibold tabular-nums tracking-tight text-foreground">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon icon={icon} size={20} />
        </span>
      </div>
      <p
        className={cn(
          "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-[11px] font-semibold",
          badgeTone === "ok"
            ? "bg-primary/10 text-primary"
            : "bg-secondary text-muted-foreground",
        )}
      >
        {trailingIcon ? <Icon icon={trailingIcon} size={12} /> : null}
        {badge}
      </p>
    </div>
  )
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{value}</dd>
    </div>
  )
}
