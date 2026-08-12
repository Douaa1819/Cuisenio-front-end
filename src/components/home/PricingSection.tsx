import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  Link2,
  Mic,
  Package,
  ScanLine,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { paymentService } from "../../api/payment.service"
import { ButtonWithAnimatedIcon } from "../ui/ButtonWithAnimatedIcon"
import { useNotification } from "../../context/NotificationContext"
import { useAuthStore } from "../../store/auth.store"
import { isPremiumUser } from "../../types/auth.types"
import { cn } from "../../lib/utils"

type BillingCycle = "monthly" | "annual"

const FREE_FEATURES = [
  { icon: BookOpen, key: "pricing.free.f1" },
  { icon: CalendarDays, key: "pricing.free.f2" },
  { icon: ShoppingCart, key: "pricing.free.f3" },
  { icon: Mic, key: "pricing.free.f4" },
  { icon: Package, key: "pricing.free.f5" },
] as const

const PRO_FEATURES = [
  { icon: Link2, titleKey: "pricing.pro.f1.title", textKey: "pricing.pro.f1.text" },
  { icon: ScanLine, titleKey: "pricing.pro.f2.title", textKey: "pricing.pro.f2.text" },
  { icon: Brain, titleKey: "pricing.pro.f3.title", textKey: "pricing.pro.f3.text" },
  { icon: ShoppingCart, titleKey: "pricing.pro.f4.title", textKey: "pricing.pro.f4.text" },
] as const

export function PricingSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { error: notifyError, info } = useNotification()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const [billing, setBilling] = useState<BillingCycle>("annual")
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const alreadyPro = isPremiumUser(user?.role, user?.subscriptionTier)
  const isAnnual = billing === "annual"

  const startCheckout = async () => {
    if (!isAuthenticated) {
      navigate(`/login?next=${encodeURIComponent("/#pricing")}`)
      info(t("pricing.notify.loginTitle"), t("pricing.notify.loginBody"))
      return
    }
    if (alreadyPro) {
      info(t("pricing.notify.alreadyTitle"), t("pricing.notify.alreadyBody"))
      return
    }
    setCheckoutLoading(true)
    try {
      const session = await paymentService.createCheckoutSession()
      window.location.assign(session.checkoutUrl)
    } catch (err) {
      console.error("[pricing] checkout", err)
      notifyError(t("pricing.notify.stripeTitle"), t("pricing.notify.stripeBody"))
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="relative text-slate-900 transition-colors duration-300 dark:text-slate-100">
      {/* Ambient dark glow (visible only in dark mode) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 dark:opacity-100"
      >
        <div className="absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-900/20 blur-3xl" />
      </div>

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold",
              "border-emerald-600/25 bg-emerald-50 text-emerald-800",
              "dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
            )}
          >
            <Zap className="h-3.5 w-3.5" aria-hidden />
            {t("pricing.hookBadge")}
          </p>
          <h2
            id="pricing-heading"
            className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            {t("pricing.title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            {t("pricing.hook")}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("pricing.subtitle")}</p>
        </motion.div>

        {/* Billing toggle */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <div
            role="group"
            aria-label={t("pricing.billing.label")}
            className={cn(
              "relative inline-flex rounded-full border p-1 shadow-sm",
              "border-slate-200 bg-white/80",
              "dark:border-slate-700/80 dark:bg-slate-800/80 dark:backdrop-blur-md",
            )}
          >
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={cn(
                "relative z-10 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                !isAnnual
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
              )}
              aria-pressed={!isAnnual}
            >
              {!isAnnual && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-emerald-700 shadow-md dark:bg-emerald-600 dark:shadow-emerald-950/50"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              {t("pricing.billing.monthly")}
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={cn(
                "relative z-10 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                isAnnual
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
              )}
              aria-pressed={isAnnual}
            >
              {isAnnual && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-emerald-700 shadow-md dark:bg-emerald-600 dark:shadow-emerald-950/50"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              {t("pricing.billing.annual")}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isAnnual ? (
              <motion.span
                key="save"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                  "border-emerald-500/30 bg-emerald-500/20 text-emerald-700",
                  "dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
                )}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                {t("pricing.billing.saveBadge")}
              </motion.span>
            ) : (
              <motion.span
                key="hint"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-xs text-slate-500 dark:text-slate-400"
              >
                {t("pricing.billing.monthlyHint")}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          {/* Free card */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className={cn(
              "flex flex-col rounded-[1.85rem] p-6 sm:p-8",
              "border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/40",
              "dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none dark:backdrop-blur-md",
              "transition-colors duration-300",
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {t("pricing.free.audience")}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
              {t("pricing.free.name")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t("pricing.free.pitch")}
            </p>

            <div className="mt-6 flex items-end gap-2">
              <span className="font-display text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("pricing.free.price")}
              </span>
              <span className="mb-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                {t("pricing.free.forever")}
              </span>
            </div>

            <ul className="mt-8 flex-1 space-y-4">
              {FREE_FEATURES.map(({ icon: Icon, key }) => (
                <li key={key} className="flex gap-3 text-sm leading-snug text-slate-700 dark:text-slate-200">
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                      "bg-emerald-50 text-emerald-700",
                      "dark:bg-slate-800 dark:text-emerald-400",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ButtonWithAnimatedIcon
                as="link"
                to="/register"
                icon={Check}
                iconMotion="bounce"
                variant="outline"
                className={cn(
                  "w-full border-slate-300 bg-transparent text-slate-700",
                  "hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900",
                  "dark:border-slate-700 dark:bg-transparent dark:text-slate-200",
                  "dark:hover:bg-slate-800 dark:hover:text-white",
                )}
              >
                {t("pricing.free.cta")}
              </ButtonWithAnimatedIcon>
            </div>
          </motion.article>

          {/* Pro card */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className={cn(
              "relative flex flex-col overflow-hidden rounded-[1.85rem] p-6 sm:p-8",
              "border-2 border-emerald-500 bg-white shadow-xl",
              "dark:border-emerald-500/60 dark:bg-slate-900/80 dark:shadow-emerald-950/40 dark:backdrop-blur-md",
              "dark:shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_24px_60px_-20px_rgba(16,185,129,0.35)]",
              "transition-colors duration-300",
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/25"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -start-8 h-44 w-44 rounded-full bg-emerald-600/10 blur-3xl dark:bg-emerald-400/10"
            />

            <div className="relative">
              <span
                className={cn(
                  "inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm",
                  "bg-emerald-600 text-white",
                  "dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-1 dark:ring-emerald-500/40",
                )}
              >
                <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="leading-snug">{t("pricing.pro.badge")}</span>
              </span>
            </div>

            <h3 className="relative mt-4 font-display text-2xl font-semibold text-slate-900 dark:text-white">
              {t("pricing.pro.name")}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t("pricing.pro.pitch")}
            </p>

            <div className="relative mt-6 min-h-[5.5rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={billing}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                    <span className="font-display text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {isAnnual ? t("pricing.pro.priceAnnual") : t("pricing.pro.priceMonthly")}
                    </span>
                    <span className="mb-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {t("pricing.pro.period")}
                    </span>
                  </div>
                  {isAnnual ? (
                    <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      {t("pricing.pro.billedAnnual")}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {t("pricing.pro.billedMonthly")}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="relative mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("pricing.pro.trial")}
            </p>

            <ul className="relative mt-8 flex-1 space-y-4">
              {PRO_FEATURES.map(({ icon: Icon, titleKey, textKey }) => (
                <li key={titleKey} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      "bg-emerald-50 text-emerald-700",
                      "dark:bg-emerald-500/15 dark:text-emerald-400",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t(titleKey)}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {t(textKey)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="relative mt-8">
              <ButtonWithAnimatedIcon
                icon={Sparkles}
                iconMotion="sparkle"
                variant="primary"
                className={cn(
                  "w-full border-0 bg-none",
                  "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20",
                  "hover:bg-emerald-500 hover:brightness-100",
                  "dark:bg-emerald-600 dark:text-white dark:shadow-lg dark:shadow-emerald-900/40",
                  "dark:hover:bg-emerald-500",
                )}
                isLoading={checkoutLoading}
                disabled={checkoutLoading || alreadyPro}
                onClick={() => void startCheckout()}
              >
                {alreadyPro ? t("pricing.pro.already") : t("pricing.pro.cta")}
              </ButtonWithAnimatedIcon>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  )
}

/** @deprecated Use PricingSection */
export function PricingTable() {
  return <PricingSection />
}
