import { lazy, Suspense, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ChefHat,
  Clock3,
  Leaf,
  Menu,
  Mic,
  Wallet,
  ScanLine,
  ShoppingBag,
  Sparkles,
  User,
  Volume2,
  Wand2,
  X,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { ThemeAndLanguageBar } from "../components/layout/ThemeAndLanguageBar"
import { ButtonWithAnimatedIcon } from "../components/ui/ButtonWithAnimatedIcon"
import { LiveDemoWidget } from "../components/home/LiveDemoWidget"
import { NewsletterSection } from "../components/home/NewsletterSection"
import { MarketingFooter } from "../components/home/MarketingFooter"
import { usePageMeta } from "../hooks/usePageMeta"
import { useAuthStore } from "../store/auth.store"
import { homePathForRole } from "../types/auth.types"

const Hero3DScene = lazy(() => import("../components/home/Hero3DScene"))

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.22 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
}

const FEATURES = [
  { icon: Sparkles, titleKey: "features.import.title", textKey: "features.import.text", motion: "sparkle" as const },
  { icon: Mic, titleKey: "features.voice.title", textKey: "features.voice.text", motion: "mic" as const },
  { icon: ScanLine, titleKey: "features.pantry.title", textKey: "features.pantry.text", motion: "scan" as const },
  { icon: ShoppingBag, titleKey: "features.shopping.title", textKey: "features.shopping.text", motion: "cart" as const },
]

export default function LandingPage() {
  const { t } = useTranslation()
  usePageMeta({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/",
  })

  const { isAuthenticated, user, hasHydrated } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const appEntry =
    hasHydrated && isAuthenticated ? homePathForRole(user?.role) : "/login"

  return (
    <div className="organic-surface min-h-screen overflow-x-hidden text-foreground antialiased">
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? "border-b border-border glass-panel shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-gradient text-primary-foreground shadow-md">
              <ChefHat className="h-5 w-5" aria-hidden />
              <span className="absolute -end-1 -top-1 h-3 w-3 rounded-full bg-primary ring-2 ring-background" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">Cuisenio</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground lg:flex" aria-label="Principal">
            <a href="#concept" className="transition hover:text-foreground">
              {t("nav.concept")}
            </a>
            <a href="#features" className="transition hover:text-foreground">
              {t("nav.features")}
            </a>
            <a href="#recipes" className="transition hover:text-foreground">
              {t("nav.recipes")}
            </a>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeAndLanguageBar />
            {hasHydrated && isAuthenticated ? (
              <ButtonWithAnimatedIcon as="link" to={appEntry} icon={ChefHat} iconMotion="bounce" size="md">
                {t("nav.openApp")}
              </ButtonWithAnimatedIcon>
            ) : (
              <>
                <ButtonWithAnimatedIcon as="link" to="/login" icon={User} iconMotion="user" variant="ghost" size="md">
                  {t("nav.login")}
                </ButtonWithAnimatedIcon>
                <ButtonWithAnimatedIcon as="link" to="/register" icon={Sparkles} iconMotion="sparkle" variant="primary" size="md">
                  {t("nav.trial")}
                </ButtonWithAnimatedIcon>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeAndLanguageBar />
            <button
              type="button"
              className="rounded-xl p-2 text-foreground"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-background/95 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm">
              {[
                ["#concept", "nav.concept"],
                ["#features", "nav.features"],
                ["#recipes", "nav.recipes"],
              ].map(([href, key]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} className="py-2 text-muted-foreground">
                  {t(key)}
                </a>
              ))}
              <ButtonWithAnimatedIcon
                as="link"
                to={isAuthenticated ? appEntry : "/register"}
                icon={Sparkles}
                iconMotion="sparkle"
                variant="primary"
                className="w-full"
                onClick={() => setMenuOpen(false)}
              >
                {isAuthenticated ? t("nav.openApp") : t("nav.trial")}
              </ButtonWithAnimatedIcon>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative px-4 pb-16 pt-28 sm:px-6 sm:pb-24 lg:pt-32">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur">
                <Leaf className="h-3.5 w-3.5" aria-hidden />
                {t("hero.badge")}
              </p>
              <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.35rem]">
                {t("hero.title")}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonWithAnimatedIcon
                  as="link"
                  to={isAuthenticated ? appEntry : "/register"}
                  icon={Wand2}
                  iconMotion="wand"
                  variant="primary"
                  size="lg"
                >
                  {t("hero.ctaPrimary")}
                </ButtonWithAnimatedIcon>
                <ButtonWithAnimatedIcon as="a" href="#demo" icon={Volume2} iconMotion="volume" variant="outline" size="lg">
                  {t("hero.ctaSecondary")}
                </ButtonWithAnimatedIcon>
              </div>
            </motion.div>

            <Suspense
              fallback={<div className="mx-auto aspect-[5/6] w-full max-w-md animate-pulse rounded-[2rem] bg-muted" />}
            >
              <Hero3DScene />
            </Suspense>
          </div>
        </section>

        <section id="concept" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-border bg-card/85 px-6 py-12 shadow-card-theme sm:px-10">
            <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("truth.title")}</h2>
              <p className="mt-3 text-muted-foreground">{t("truth.subtitle")}</p>
            </motion.div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                { icon: Clock3, v: "truth.m1", l: "truth.m1Label" },
                { icon: Wallet, v: "truth.m2", l: "truth.m2Label" },
                { icon: Mic, v: "truth.m3", l: "truth.m3Label" },
              ].map((item, i) => (
                <motion.article
                  key={item.v}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.07 }}
                  className="rounded-[1.5rem] border border-border bg-background/60 p-6 text-center"
                >
                  <item.icon className="mx-auto h-7 w-7 text-primary" aria-hidden />
                  <h3 className="mt-4 font-display text-xl font-semibold">{t(item.v)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.l)}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("features.title")}</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">{t("features.subtitle")}</p>
            </motion.div>

            <div id="recipes" className="mt-12 grid gap-5 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, titleKey, textKey, motion: iconMotion }, i) => (
                <motion.article
                  key={titleKey}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="group rounded-[1.75rem] border border-border bg-card/90 p-6 shadow-card-theme transition hover:border-primary/25 hover:shadow-[0_18px_50px_-24px_var(--cu-surface-glow)]"
                >
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary"
                  >
                    <motion.span
                      variants={{
                        rest: { rotate: 0, y: 0, scale: 1 },
                        hover:
                          iconMotion === "sparkle"
                            ? { rotate: 16, scale: 1.1 }
                            : iconMotion === "mic"
                              ? { y: [0, -2, 0, 2, 0] }
                              : iconMotion === "scan"
                                ? { scaleY: [1, 0.8, 1] }
                                : { y: [0, -5, 0] },
                      }}
                      transition={{ type: "spring", stiffness: 280, damping: 14 }}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </motion.span>
                  </motion.div>
                  <h3 className="font-display text-xl font-semibold">{t(titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(textKey)}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div {...fadeUp}>
              <LiveDemoWidget />
            </motion.div>
          </div>
        </section>

        <NewsletterSection />
      </main>

      <MarketingFooter />
    </div>
  )
}
