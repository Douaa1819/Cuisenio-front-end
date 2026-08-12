import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Info } from "lucide-react"
import { ButtonWithAnimatedIcon } from "../../components/ui/ButtonWithAnimatedIcon"
import { SiteFooter } from "../../components/layout/SiteFooter"
import { useNotification } from "../../context/NotificationContext"
import { usePageMeta } from "../../hooks/usePageMeta"

export default function PaymentCancelPage() {
  usePageMeta({
    title: "Paiement annulé | Cuisenio",
    description: "Vous avez annulé le paiement Stripe.",
    path: "/payment/cancel",
  })

  const navigate = useNavigate()
  const { info } = useNotification()

  useEffect(() => {
    info("Paiement annulé", "Aucun débit. Vous pouvez réessayer le Pass Pro quand vous voulez.")
    const timer = window.setTimeout(() => navigate("/#pricing", { replace: true }), 2200)
    return () => window.clearTimeout(timer)
  }, [navigate, info])

  return (
    <div className="organic-surface flex min-h-screen flex-col text-foreground">
      <div className="flex flex-1 items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 text-center shadow-card-theme"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Info className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Pas de souci</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Vous avez quitté Stripe Checkout. Aucun montant n&apos;a été prélevé. On vous ramène vers les tarifs.
        </p>
        <div className="mt-8">
          <ButtonWithAnimatedIcon as="link" to="/#pricing" icon={ArrowLeft} iconMotion="arrow" variant="outline" className="w-full">
            Retour aux tarifs
          </ButtonWithAnimatedIcon>
        </div>
        <Link to="/" className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground">
          Accueil
        </Link>
      </motion.div>
      </div>
      <SiteFooter variant="marketing" />
    </div>
  )
}
