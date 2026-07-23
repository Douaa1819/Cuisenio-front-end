import { Crown, Loader2, Sparkles, X } from "lucide-react"
import { useState } from "react"
import { subscriptionService } from "../../api/subscription.service"
import { useNotification } from "../../context/NotificationContext"
import { useAuthStore } from "../../store/auth.store"
import { normalizeRole } from "../../types/auth.types"
import { Button } from "../ui/button"

interface PremiumUpgradeModalProps {
  open: boolean
  onClose: () => void
  featureLabel?: string
}

/**
 * Fictitious upgrade flow — no payment. Refreshes JWT with PREMIUM authority.
 */
export function PremiumUpgradeModal({ open, onClose, featureLabel }: PremiumUpgradeModalProps) {
  const login = useAuthStore((s) => s.login)
  const { success, error: notifyError } = useNotification()
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await subscriptionService.upgradePremium()
      login(res.token, {
        id: res.id ?? res.userId,
        username: res.username,
        lastName: res.lastName,
        email: res.email,
        profilePicture: res.profilePicture ?? undefined,
        role: normalizeRole(res.role),
        subscriptionTier: res.subscriptionTier ?? "PRO",
      })
      success("Bienvenue Premium", "Les fonctionnalités avancées sont débloquées.")
      onClose()
    } catch (err) {
      console.error("[premium] upgrade failed", err)
      notifyError("Upgrade impossible", "Réessayez dans un instant.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card-theme">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-muted-foreground hover:bg-muted"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mb-4 inline-flex rounded-full bg-primary/15 p-3 text-primary">
          <Crown className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Passez à Premium</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {featureLabel
            ? `« ${featureLabel} » est réservé aux comptes Premium (démo recruteurs — aucun paiement).`
            : "Débloquez l'import par URL, le planificateur intelligent et plus encore."}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-foreground">
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Import de recettes par lien
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Génération de semaine illimitée
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Badge PRO visible dans l'app
          </li>
        </ul>
        <Button
          type="button"
          className="mt-6 w-full bg-primary-gradient text-white"
          disabled={loading}
          onClick={handleUpgrade}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Activation…
            </>
          ) : (
            "Activer Premium (fictif)"
          )}
        </Button>
      </div>
    </div>
  )
}

export function PremiumBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary ${className}`}
    >
      <Crown className="h-3 w-3" /> Pro
    </span>
  )
}
