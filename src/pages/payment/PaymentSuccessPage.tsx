import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle2, ChefHat, Loader2, Sparkles } from "lucide-react"
import { paymentService } from "../../api/payment.service"
import { ButtonWithAnimatedIcon } from "../../components/ui/ButtonWithAnimatedIcon"
import { SiteFooter } from "../../components/layout/SiteFooter"
import { usePageMeta } from "../../hooks/usePageMeta"
import { useAuthStore } from "../../store/auth.store"
import { homePathForRole, normalizeRole } from "../../types/auth.types"

export default function PaymentSuccessPage() {
  usePageMeta({
    title: "Paiement confirmé | Cuisenio",
    description: "Votre Pass Gourmet Pro est actif.",
    path: "/payment/success",
  })

  const [params] = useSearchParams()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const user = useAuthStore((s) => s.user)

  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")
  const [message, setMessage] = useState("Confirmation du paiement en cours…")

  useEffect(() => {
    if (!hasHydrated) return

    const sessionId = params.get("session_id")
    if (!sessionId) {
      setStatus("error")
      setMessage("Session Stripe manquante. Revenez depuis la page tarifs.")
      return
    }

    if (!isAuthenticated) {
      navigate(`/login?next=${encodeURIComponent(`/payment/success?session_id=${sessionId}`)}`, {
        replace: true,
      })
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await paymentService.confirmSession(sessionId)
        if (cancelled) return
        login(res.token, {
          id: res.id ?? res.userId,
          email: res.email,
          username: res.username,
          lastName: res.lastName,
          profilePicture: res.profilePicture ?? undefined,
          role: normalizeRole(res.role),
          subscriptionTier: res.subscriptionTier,
        })
        setStatus("ok")
        setMessage("Bienvenue dans le Pass Gourmet Pro. Votre cuisine vient de gagner un super-pouvoir.")
      } catch (err) {
        if (cancelled) return
        console.error("[payment/success]", err)
        setStatus("error")
        setMessage(
          "Le paiement a peut-être réussi, mais la confirmation a échoué. Réessayez dans un instant ou reconnectez-vous.",
        )
      }
    })()

    return () => {
      cancelled = true
    }
  }, [hasHydrated, isAuthenticated, login, navigate, params])

  const appHome = homePathForRole(user?.role)

  return (
    <div className="organic-surface flex min-h-screen flex-col text-foreground">
      <div className="flex flex-1 items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 text-center shadow-card-theme"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-primary-foreground">
          {status === "loading" ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : status === "ok" ? (
            <CheckCircle2 className="h-7 w-7" />
          ) : (
            <ChefHat className="h-7 w-7" />
          )}
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {status === "ok" ? "Paiement confirmé" : status === "loading" ? "Un instant…" : "Presque"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{message}</p>

        {status === "ok" && (
          <div className="mt-8 flex flex-col gap-3">
            <ButtonWithAnimatedIcon as="link" to={appHome} icon={Sparkles} iconMotion="sparkle" className="w-full">
              Ouvrir mon espace chef
            </ButtonWithAnimatedIcon>
            <Link to="/#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Revoir l'offre
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="mt-8">
            <ButtonWithAnimatedIcon as="link" to="/#pricing" icon={ChefHat} iconMotion="bounce" variant="outline" className="w-full">
              Retour aux tarifs
            </ButtonWithAnimatedIcon>
          </div>
        )}
      </motion.div>
      </div>
      <SiteFooter variant="marketing" />
    </div>
  )
}
