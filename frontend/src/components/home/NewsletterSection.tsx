import { useId, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Mail, Send } from "lucide-react"
import { useTranslation } from "react-i18next"
import { newsletterService } from "../../api/newsletter.service"
import { ButtonWithAnimatedIcon } from "../ui/ButtonWithAnimatedIcon"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion"
import { isTechnicalMessage } from "../../lib/user-facing-error"
import { cn } from "../../lib/utils"

export function NewsletterSection() {
  const { t } = useTranslation()
  const reduced = usePrefersReducedMotion()
  const emailId = useId()
  const consentId = useId()
  const statusId = useId()

  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "dup" | "error">("idle")
  const [message, setMessage] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) {
      setStatus("error")
      setMessage(t("newsletter.errorConsent"))
      return
    }
    setLoading(true)
    setStatus("idle")
    setMessage("")
    try {
      const res = await newsletterService.subscribe(email.trim(), true)
      setStatus(res.alreadySubscribed ? "dup" : "ok")
      setMessage(
        typeof res.message === "string" && !isTechnicalMessage(res.message)
          ? res.message
          : res.alreadySubscribed
            ? "Vous êtes déjà inscrit(e) à la newsletter."
            : "Inscription confirmée. Merci !",
      )
      if (!res.alreadySubscribed) {
        setEmail("")
        setConsent(false)
      }
    } catch (err: unknown) {
      console.error("[newsletter]", err)
      setStatus("error")
      setMessage(t("newsletter.errorGeneric"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="newsletter" aria-labelledby="newsletter-heading" className="px-4 py-16 sm:px-6">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reduced ? 0 : 0.45 }}
        className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-card-theme"
      >
        <div
          className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
          style={{
            background:
              "radial-gradient(ellipse at 0% 0%, color-mix(in srgb, var(--cu-primary) 14%, transparent), transparent 50%), radial-gradient(ellipse at 100% 100%, color-mix(in srgb, var(--cu-accent) 12%, transparent), transparent 45%)",
          }}
        >
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-primary">
              <Mail className="h-3.5 w-3.5" aria-hidden />
              {t("newsletter.badge")}
            </p>
            <h2 id="newsletter-heading" className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("newsletter.title")}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("newsletter.subtitle")}
            </p>
          </div>

          <form onSubmit={(e) => void submit(e)} className="rounded-[1.5rem] border border-border bg-background/80 p-5 backdrop-blur sm:p-6" noValidate>
            <div className="space-y-2">
              <Label htmlFor={emailId}>{t("newsletter.emailLabel")}</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id={emailId}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.emailPlaceholder")}
                  className="rounded-xl ps-10"
                  aria-describedby={status !== "idle" ? statusId : undefined}
                  aria-invalid={status === "error"}
                />
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <Checkbox
                id={consentId}
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                aria-required="true"
                className="mt-1"
              />
              <Label htmlFor={consentId} className="text-sm font-normal leading-snug text-muted-foreground">
                {t("newsletter.consent")}
              </Label>
            </div>

            <div className="mt-5">
              <ButtonWithAnimatedIcon
                type="submit"
                icon={Send}
                iconMotion="arrow"
                variant="primary"
                className="w-full"
                isLoading={loading}
                disabled={loading}
              >
                {t("newsletter.submit")}
              </ButtonWithAnimatedIcon>
            </div>

            <div
              id={statusId}
              role="status"
              aria-live="polite"
              className={cn(
                "mt-4 min-h-[1.25rem] text-sm",
                status === "ok" && "text-primary",
                status === "dup" && "text-foreground",
                status === "error" && "text-destructive",
              )}
            >
              {message && (
                <span className="inline-flex items-start gap-2">
                  {(status === "ok" || status === "dup") && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
                  {message}
                </span>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  )
}
