import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Search, X } from "lucide-react"
import { recipePath, type RecipeResponse } from "../../types/recipe.types"
import { totalMinutes } from "../../lib/recipe-intelligence"

interface HomeSearchProps {
  recipes: RecipeResponse[]
}

export function HomeSearch({ recipes }: HomeSearchProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [maxTime, setMaxTime] = useState<number | "">("")
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    return recipes
      .filter((r) => {
        if (difficulty && String(r.difficultyLevel) !== difficulty) return false
        if (maxTime !== "" && totalMinutes(r) > maxTime) return false
        if (!q) return true
        const hay = [
          r.title,
          r.description,
          ...(r.categories?.map((c) => c.name) ?? []),
          ...(r.recipeIngredients?.map((i) => i.ingredient?.name) ?? []),
        ]
          .join(" ")
          .toLowerCase()
        return hay.includes(q)
      })
      .slice(0, 8)
  }, [recipes, query, difficulty, maxTime])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  return (
    <div ref={rootRef} className="relative w-full max-w-2xl">
      <label htmlFor="home-search" className="sr-only">
        {t("home.searchLabel")}
      </label>
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/40">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          id="home-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("home.searchPlaceholder")}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
        />
        {query && (
          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
            aria-label={t("home.searchClear")}
            onClick={() => setQuery("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <select
          aria-label={t("home.searchDifficulty")}
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs"
        >
          <option value="">{t("home.searchAnyDifficulty")}</option>
          <option value="EASY">{t("home.diffEasy")}</option>
          <option value="INTERMEDIATE">{t("home.diffIntermediate")}</option>
          <option value="ADVANCED">{t("home.diffAdvanced")}</option>
        </select>
        <select
          aria-label={t("home.searchMaxTime")}
          value={maxTime === "" ? "" : String(maxTime)}
          onChange={(e) => setMaxTime(e.target.value ? Number(e.target.value) : "")}
          className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs"
        >
          <option value="">{t("home.searchAnyTime")}</option>
          <option value="15">≤ 15 min</option>
          <option value="20">≤ 20 min</option>
          <option value="30">≤ 30 min</option>
          <option value="60">≤ 60 min</option>
        </select>
        <button
          type="button"
          className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
          onClick={() => navigate(`/discover?q=${encodeURIComponent(query)}`)}
        >
          {t("home.searchAllResults")}
        </button>
      </div>

      {open && (query || difficulty || maxTime !== "") && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-background shadow-lg"
        >
          {suggestions.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">{t("home.searchEmpty")}</li>
          ) : (
            suggestions.map((r) => (
              <li key={r.id} role="option">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start text-sm hover:bg-primary/5"
                  onClick={() => {
                    setOpen(false)
                    navigate(recipePath(r))
                  }}
                >
                  <span className="font-medium text-foreground">{r.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{totalMinutes(r)} min</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
