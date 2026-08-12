import { useEffect, useRef, useState } from "react"
import { Check, Globe, Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useThemeStore } from "../../store/theme.store"
import { APP_LOCALES, LOCALE_META, type AppLocale } from "../../i18n/locales"
import { cn } from "../../lib/utils"

interface ThemeAndLanguageBarProps {
  className?: string
  /** Compact = icon-only language trigger (navbar). */
  compact?: boolean
}

export function ThemeAndLanguageBar({ className, compact = true }: ThemeAndLanguageBarProps) {
  const { t, i18n } = useTranslation()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const isDark = theme === "dark"
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const locale = (APP_LOCALES.includes(i18n.language as AppLocale)
    ? i18n.language
    : "fr") as AppLocale

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  return (
    <div ref={rootRef} className={cn("flex items-center gap-1.5 sm:gap-2", className)}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card/80 px-2.5 text-sm text-foreground backdrop-blur transition hover:border-primary/40 hover:bg-primary/10"
          aria-label={t("lang.switch")}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <Globe className="h-4 w-4 text-primary" aria-hidden />
          {!compact && <span className="hidden sm:inline">{LOCALE_META[locale].label}</span>}
          <span className="text-xs font-semibold tracking-wide text-muted-foreground">
            {LOCALE_META[locale].short}
          </span>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute end-0 z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-border bg-card/95 py-1 shadow-card-theme backdrop-blur-xl"
          >
            {APP_LOCALES.map((code) => {
              const active = code === locale
              return (
                <li key={code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-start text-sm transition hover:bg-primary/10",
                      active && "bg-primary/5 text-primary",
                    )}
                    onClick={() => {
                      void i18n.changeLanguage(code)
                      setOpen(false)
                    }}
                  >
                    <span>
                      <span className="font-medium">{LOCALE_META[code].label}</span>
                      <span className="ms-2 text-xs text-muted-foreground">{LOCALE_META[code].short}</span>
                    </span>
                    {active && <Check className="h-3.5 w-3.5" aria-hidden />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/80 text-foreground backdrop-blur transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
        aria-label={isDark ? t("theme.toLight") : t("theme.toDark")}
        title={isDark ? t("theme.toLight") : t("theme.toDark")}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  )
}
