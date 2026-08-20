import { motion } from "framer-motion"
import { ArrowLeft, ChefHat, Compass, Home } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ThemeToggle } from "../components/theme/ThemeToggle"
import { SiteFooter } from "../components/layout/SiteFooter"
import { usePageMeta } from "../hooks/usePageMeta"
import { useAuthStore } from "../store/auth.store"
import { homePathForRole } from "../types/auth.types"

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: "easeOut" as const },
}

export default function NotFoundPage() {
  usePageMeta({
    title: "Page introuvable — Cuisenio",
    description: "Cette page n'existe pas ou a été déplacée.",
    path: "/404",
  })

  const navigate = useNavigate()
  const { isAuthenticated, user, hasHydrated } = useAuthStore()
  const appHome =
    hasHydrated && isAuthenticated ? homePathForRole(user?.role) : "/"

  return (
    <div className="organic-surface relative flex min-h-screen flex-col overflow-hidden text-foreground antialiased">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 60% 0%, color-mix(in srgb, var(--cu-primary) 22%, transparent), transparent 55%)",
        }}
      />

      <header className="border-b border-border bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <ChefHat className="h-7 w-7 text-primary" aria-hidden />
            <span className="font-serif text-xl tracking-tight">Cuisenio</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              type="button"
              variant="ghost"
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <motion.div {...pageMotion} className="w-full max-w-lg text-center">
          <div className="mx-auto mb-8 inline-flex rounded-2xl border border-border bg-card p-5 shadow-card-theme">
            <ChefHat className="h-12 w-12 text-primary" aria-hidden />
          </div>

          <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-primary">Erreur 404</p>
          <h1 className="mt-3 font-serif text-5xl tracking-tight text-foreground sm:text-6xl">
            Page introuvable
          </h1>
          <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-muted-foreground">
            Cette adresse n&apos;existe pas — ou la recette a changé d&apos;étagère. Revenez à
            l&apos;accueil ou reprenez votre planification.
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link to={appHome} className="sm:flex-1">
              <Button
                type="button"
                className="w-full border-0 bg-primary-gradient text-primary-foreground hover:brightness-110"
              >
                <Home className="mr-2 h-4 w-4" />
                Accueil
              </Button>
            </Link>
            <Link to={isAuthenticated ? "/discover" : "/register"} className="sm:flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-border bg-transparent text-foreground hover:border-primary/50 hover:bg-muted"
              >
                <Compass className="mr-2 h-4 w-4" />
                {isAuthenticated ? "Explorer les recettes" : "Créer un compte"}
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <SiteFooter variant="marketing" />
    </div>
  )
}
