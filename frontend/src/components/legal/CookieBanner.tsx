import { useEffect, useId, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Cookie, Shield } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ButtonWithAnimatedIcon } from "../ui/ButtonWithAnimatedIcon"
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion"

const STORAGE_KEY = "cuisenio-cookie-consent"

export type CookieConsent = "accepted" | "rejected"

function readConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === "accepted" || raw === "rejected") return raw
  } catch {
    /* ignore */
  }
  return null
}

export function CookieBanner() {
  const { t } = useTranslation()
  const reduced = usePrefersReducedMotion()
  const titleId = useId()
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setConsent(readConsent())
    setReady(true)
  }, [])

  const persist = (value: CookieConsent) => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* ignore */
    }
    setConsent(value)
    window.dispatchEvent(new CustomEvent("cuisenio:cookie-consent", { detail: value }))
  }

  if (!ready || consent) return null

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: 16 }}
        transition={{ duration: reduced ? 0 : 0.35 }}
        className="fixed inset-x-4 bottom-20 z-[80] mx-auto max-w-3xl rounded-2xl border border-border bg-card/95 p-5 shadow-card-theme backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Cookie className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="font-display text-lg font-semibold tracking-tight">
              {t("cookies.banner.title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("cookies.banner.body")}{" "}
              <Link to="/cookies" className="font-medium text-primary underline-offset-2 hover:underline">
                {t("cookies.banner.policy")}
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonWithAnimatedIcon
                icon={Shield}
                iconMotion="bounce"
                variant="outline"
                onClick={() => persist("rejected")}
              >
                {t("cookies.banner.reject")}
              </ButtonWithAnimatedIcon>
              <ButtonWithAnimatedIcon
                icon={Cookie}
                iconMotion="sparkle"
                variant="primary"
                onClick={() => persist("accepted")}
              >
                {t("cookies.banner.accept")}
              </ButtonWithAnimatedIcon>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{t("cookies.banner.essential")}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
