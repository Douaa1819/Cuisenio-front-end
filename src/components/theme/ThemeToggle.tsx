import { Leaf, Sun } from "lucide-react"
import { useThemeStore } from "../../store/theme.store"
import { cn } from "../../lib/utils"

interface ThemeToggleProps {
  className?: string
}

/**
 * Sun = activate Light/Vert · Leaf = activate Dark/Corail (or show current target).
 * When dark: show Sun (go light). When light: show Leaf (go dark coral garden → charcoal).
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
        className,
      )}
      aria-label={isDark ? "Passer au thème clair vert" : "Passer au thème sombre corail"}
      title={isDark ? "Thème clair / vert" : "Thème sombre / corail"}
    >
      {isDark ? <Sun className="h-4.5 w-4.5 h-4 w-4" /> : <Leaf className="h-4 w-4" />}
    </button>
  )
}
