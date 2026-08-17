import { Link } from "react-router-dom"
import { Clock, Star } from "lucide-react"
import { recipePath, type RecipeResponse } from "../../types/recipe.types"
import { env } from "../../lib/env"
import { totalMinutes } from "../../lib/recipe-intelligence"

interface RecipeRailProps {
  title: string
  subtitle?: string
  recipes: RecipeResponse[]
  emptyHint?: string
}

export function RecipeRail({ title, subtitle, recipes, emptyHint }: RecipeRailProps) {
  if (!recipes.length) {
    return (
      <section className="mb-10" aria-label={title}>
        <header className="mb-3">
          <h2 className="text-foreground">{title}</h2>
          {subtitle && <p className="font-sans text-sm text-muted-foreground">{subtitle}</p>}
        </header>
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center font-sans text-sm text-muted-foreground">
          {emptyHint ?? "Aucune recette pour le moment — explorez la communauté."}
        </div>
      </section>
    )
  }

  return (
    <section className="mb-10" aria-label={title}>
      <header className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-foreground">{title}</h2>
          {subtitle && <p className="font-sans text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </header>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:thin]">
        {recipes.map((recipe) => {
          const img = recipe.imageUrl
            ? recipe.imageUrl.startsWith("http")
              ? recipe.imageUrl
              : `${env.uploadsUrl}/${recipe.imageUrl}`
            : null
          return (
            <Link
              key={recipe.id}
              to={recipePath(recipe)}
              className="group w-[220px] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card shadow-card-theme transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative h-32 bg-gradient-to-br from-primary/10 to-muted">
                {img ? (
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-sans text-xs text-muted-foreground">
                    Sans photo
                  </div>
                )}
                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-foreground/70 px-2 py-0.5 font-sans text-[11px] text-background backdrop-blur">
                  <Clock className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                  {totalMinutes(recipe)} min
                </span>
              </div>
              <div className="space-y-1 p-3">
                <p className="line-clamp-2 font-sans text-sm font-semibold leading-snug text-foreground">{recipe.title}</p>
                <div className="flex items-center justify-between font-sans text-xs text-muted-foreground">
                  <span className="truncate">{recipe.user?.username ?? "Cuisenio"}</span>
                  <span className="inline-flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-primary text-primary" strokeWidth={1.75} aria-hidden />
                    {(recipe.averageRating ?? 0).toFixed(1)}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
