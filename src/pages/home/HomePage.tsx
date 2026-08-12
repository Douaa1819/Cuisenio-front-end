import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Flame, Leaf, Sparkles, Star, Sunrise, Trophy, Users } from "lucide-react"
import { AppShell } from "../../components/layout/AppShell"
import { RecipeRail } from "../../components/home/RecipeRail"
import { HomeSearch } from "../../components/home/HomeSearch"
import { ListSkeleton } from "../../components/ui/list-skeleton"
import { Button } from "../../components/ui/button"
import { recipeService } from "../../api/recipe.service"
import { useAuthStore } from "../../store/auth.store"
import { useRecentlyViewedStore } from "../../store/recently-viewed.store"
import { useCookingStore } from "../../store/cooking.store"
import { useAchievementsStore, achievementsFromUnlocked } from "../../store/achievements.store"
import { useShoppingListStore } from "../../store/shopping-list.store"
import { usePageMeta } from "../../hooks/usePageMeta"
import type { RecipeResponse } from "../../types/recipe.types"
import {
  getSeasonLabel,
  isEasy,
  isQuick,
  rankForYou,
  seasonalRecipes,
  topChefs,
} from "../../lib/recipe-intelligence"

function hourGreeting() {
  const h = new Date().getHours()
  if (h < 11) return "Bonjour"
  if (h < 18) return "Bon après-midi"
  return "Bonsoir"
}

export default function HomePage() {
  const user = useAuthStore((s) => s.user)
  const recent = useRecentlyViewedStore((s) => s.items)
  const cooking = useCookingStore((s) => s.active)
  const streak = useCookingStore((s) => s.streak)
  const historyLength = useCookingStore((s) => s.history.length)
  const [recipes, setRecipes] = useState<RecipeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageMeta({
    title: "Accueil",
    description: "Votre fil culinaire personnalisé — continuez, explorez, cuisinez.",
    path: "/home",
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await recipeService.getAllRecipes()
        if (!cancelled) {
          setRecipes(res.content ?? [])
          setError(null)
        }
      } catch {
        if (!cancelled) setError("Impossible de charger le fil. Réessayez.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      useAchievementsStore.getState().evaluate({
        cookCount: historyLength,
        streak,
        shoppingCount: useShoppingListStore.getState().items.length,
        viewedCount: recent.length,
      })
    }, 0)
    return () => window.clearTimeout(id)
  }, [historyLength, streak, recent.length])

  const preferredCats = useMemo(() => {
    const names: string[] = []
    for (const r of recent) {
      const full = recipes.find((x) => x.id === r.id)
      full?.categories?.forEach((c) => names.push(c.name))
    }
    return [...new Set(names)].slice(0, 5)
  }, [recent, recipes])

  const forYou = useMemo(
    () => rankForYou(recipes, recent.map((r) => r.id), preferredCats).slice(0, 10),
    [recipes, recent, preferredCats],
  )
  const trending = useMemo(
    () =>
      [...recipes]
        .sort(
          (a, b) =>
            (b.averageRating ?? 0) * (b.totalRatings ?? 1) -
            (a.averageRating ?? 0) * (a.totalRatings ?? 1),
        )
        .slice(0, 10),
    [recipes],
  )
  const quick = useMemo(() => recipes.filter((r) => isQuick(r, 20)).slice(0, 10), [recipes])
  const breakfast = useMemo(
    () =>
      recipes
        .filter((r) => {
          const hay = `${r.title} ${r.categories?.map((c) => c.name).join(" ")}`.toLowerCase()
          return hay.includes("brunch") || hay.includes("crêpe") || hay.includes("petit") || isEasy(r)
        })
        .slice(0, 8),
    [recipes],
  )
  const healthy = useMemo(
    () =>
      recipes
        .filter((r) => {
          const hay = `${r.title} ${r.description}`.toLowerCase()
          return (
            hay.includes("salade") ||
            hay.includes("légume") ||
            hay.includes("soupe") ||
            hay.includes("végét")
          )
        })
        .slice(0, 8),
    [recipes],
  )
  const seasonal = useMemo(() => seasonalRecipes(recipes).slice(0, 8), [recipes])
  const newest = useMemo(
    () =>
      [...recipes]
        .sort((a, b) => +new Date(b.creationDate) - +new Date(a.creationDate))
        .slice(0, 8),
    [recipes],
  )
  const continueRecipes = useMemo(() => {
    if (!cooking) return []
    const match = recipes.find((r) => r.id === cooking.recipeId)
    return match ? [match] : []
  }, [cooking, recipes])
  const chefs = useMemo(() => topChefs(recipes), [recipes])
  const season = getSeasonLabel()
  const unlocked = useAchievementsStore((s) => s.unlocked)
  const achievements = useMemo(() => achievementsFromUnlocked(unlocked), [unlocked])

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <section className="mb-8 rounded-3xl border border-border bg-card p-5 shadow-card-theme sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-sans text-sm font-medium text-primary">
                {hourGreeting()}
                {user?.username ? `, ${user.username}` : ""}
              </p>
              <h1 className="mt-1 max-w-xl font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Que cuisine-t-on aujourd&apos;hui&nbsp;?
              </h1>
              <p className="mt-2 max-w-lg font-sans text-sm text-muted-foreground">
                Un fil vivant selon vos envies — reprise rapide, tendances, et idées de saison ({season.label}).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {streak > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-sans text-xs font-semibold text-foreground">
                  <Flame className="h-3.5 w-3.5 text-primary" /> Série {streak} j
                </span>
              )}
              <Link to="/discover">
                <Button type="button" variant="outline" size="sm">
                  Explorer
                </Button>
              </Link>
              <Link to="/add-recipe">
                <Button type="button" size="sm" className="bg-primary hover:bg-primary/90">
                  Nouvelle recette
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <HomeSearch recipes={recipes} />
          </div>
        </section>

        {loading && <ListSkeleton />}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
            {error}
            <div className="mt-3">
              <Button type="button" size="sm" onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {cooking && (
              <section className="mb-8 overflow-hidden rounded-2xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">Continuer</p>
                    <p className="text-base font-semibold">{cooking.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Étape {cooking.stepIndex + 1}/{cooking.totalSteps}
                    </p>
                  </div>
                  <Link to={`/recipe/${cooking.recipeId}?cook=1`}>
                    <Button type="button" className="bg-primary hover:bg-primary/90">
                      Reprendre
                    </Button>
                  </Link>
                </div>
              </section>
            )}

            <RecipeRail
              title="Continuer la cuisine"
              subtitle="Reprenez là où vous vous étiez arrêté"
              recipes={continueRecipes}
              emptyHint="Lancez le mode cuisine sur une recette pour la retrouver ici."
            />

            <RecipeRail
              title="Pour vous"
              subtitle={
                preferredCats.length
                  ? `Inspiré de vos envies (${preferredCats.slice(0, 2).join(", ")})`
                  : "Basé sur la popularité — explorez pour personnaliser"
              }
              recipes={forYou}
            />

            <RecipeRail title="Tendances de la semaine" subtitle="Les mieux notées de la communauté" recipes={trending} />

            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              <QuickChip icon={<Sunrise className="h-4 w-4" />} label="Petit-déj / brunch" to="#rail-breakfast" />
              <QuickChip icon={<Leaf className="h-4 w-4" />} label="Choix plus légers" to="#rail-healthy" />
              <QuickChip icon={<Sparkles className="h-4 w-4" />} label={`Saison · ${season.label}`} to="#rail-season" />
            </div>

            <div id="rail-breakfast">
              <RecipeRail title="Petit-déjeuner & brunch" recipes={breakfast} />
            </div>
            <div id="rail-healthy">
              <RecipeRail title="Choix plus sains" subtitle="Salades, soupes, végétarien…" recipes={healthy} />
            </div>
            <RecipeRail title="En moins de 20 minutes" recipes={quick} />
            <div id="rail-season">
              <RecipeRail title={`Recettes de ${season.label.toLowerCase()}`} recipes={seasonal} />
            </div>

            <RecipeRail
              title="Récemment vues"
              recipes={recent
                .map((r) => recipes.find((x) => x.id === r.id))
                .filter(Boolean) as RecipeResponse[]}
              emptyHint="Ouvrez une recette pour démarrer votre historique."
            />

            <RecipeRail title="Nouveautés communauté" recipes={newest} />

            <section className="mb-10" aria-label="Chefs populaires">
              <h2 className="mb-3 flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5 text-primary" strokeWidth={1.75} /> Chefs de la communauté
              </h2>
              {chefs.length === 0 ? (
                <p className="font-sans text-sm text-muted-foreground">Les créateurs apparaîtront ici.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {chefs.map((c) => (
                    <div
                      key={c.user.id}
                      className="rounded-2xl border border-border bg-card px-4 py-3 shadow-card-theme"
                    >
                      <p className="font-sans font-semibold text-foreground">{c.user.username}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 font-sans text-xs text-muted-foreground">
                        {c.count} recette{c.count > 1 ? "s" : ""} ·
                        <Star className="h-3 w-3 fill-primary text-primary" strokeWidth={1.75} aria-hidden />
                        {c.avgRating.toFixed(1)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-12 rounded-2xl border border-border bg-card p-5 shadow-card-theme" aria-label="Succès">
              <h2 className="mb-3 flex items-center gap-2 text-foreground">
                <Trophy className="h-5 w-5 text-primary" strokeWidth={1.75} /> Vos succès
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className={`rounded-xl border px-3 py-2 font-sans text-sm ${
                      a.unlockedAt
                        ? "border-primary/25 bg-primary/5"
                        : "border-border opacity-60"
                    }`}
                  >
                    <p className="font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </AppShell>
  )
}

function QuickChip({
  icon,
  label,
  to,
}: {
  icon: ReactNode
  label: string
  to: string
}) {
  return (
    <a
      href={to}
      className="flex min-h-12 items-center gap-2 rounded-2xl border border-border bg-background/80 px-4 text-sm font-medium transition hover:border-primary/40 hover:bg-primary/5"
    >
      <span className="text-primary">{icon}</span>
      {label}
    </a>
  )
}
