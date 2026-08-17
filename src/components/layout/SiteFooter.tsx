import { ChefHat, Github, Heart, Linkedin } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ThemeAndLanguageBar } from "./ThemeAndLanguageBar"
import { Icon } from "../ui/icon"
import { useAuthStore } from "../../store/auth.store"
import { homePathForRole } from "../../types/auth.types"

type SiteFooterProps = {
  /** Marketing anchors (#concept) vs app links */
  variant?: "marketing" | "app"
}

/**
 * Global Cuisenio footer — same typography & sage palette on landing and app shells.
 */
export function SiteFooter({ variant = "app" }: SiteFooterProps) {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const { isAuthenticated, user } = useAuthStore()
  const home = isAuthenticated ? homePathForRole(user?.role) : "/"

  return (
    <footer className="border-t border-border bg-[color:var(--cu-paper)] px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to={home} className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-gradient text-primary-foreground">
              <Icon icon={ChefHat} size={20} />
            </span>
            <span className="font-serif text-xl tracking-tight text-foreground">Cuisenio</span>
          </Link>
          <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-muted-foreground">
            {t("footer.tagline")}
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-sans text-xs font-medium text-foreground">
            <Icon icon={Heart} size={14} className="text-primary" />
            {t("footer.love")}
          </p>
          {variant === "marketing" && (
            <div className="mt-5">
              <ThemeAndLanguageBar compact={false} />
            </div>
          )}
        </div>

        <div>
          <p className="font-sans text-sm font-semibold text-foreground">{t("footer.product")}</p>
          <ul className="mt-3 space-y-2 font-sans text-sm text-muted-foreground">
            {variant === "marketing" ? (
              <>
                <li>
                  <a href="#concept" className="hover:text-foreground">
                    {t("nav.concept")}
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-foreground">
                    {t("nav.features")}
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/chef" className="hover:text-foreground">
                    {t("nav.chef")}
                  </Link>
                </li>
                <li>
                  <Link to="/home" className="hover:text-foreground">
                    {t("nav.discover")}
                  </Link>
                </li>
                <li>
                  <Link to="/meal-planner" className="hover:text-foreground">
                    {t("nav.plans")}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <p className="font-sans text-sm font-semibold text-foreground">{t("footer.legal")}</p>
          <ul className="mt-3 space-y-2 font-sans text-sm text-muted-foreground">
            <li>
              <Link to="/terms" className="hover:text-foreground">
                {t("footer.terms")}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-foreground">
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="hover:text-foreground">
                {t("footer.cookies")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-sans text-sm font-semibold text-foreground">{t("footer.social")}</p>
          <div className="mt-3 flex gap-3">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition hover:border-primary/30 hover:text-primary"
              aria-label="LinkedIn"
            >
              <Icon icon={Linkedin} size={16} />
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition hover:border-primary/30 hover:text-primary"
              aria-label="GitHub"
            >
              <Icon icon={Github} size={16} />
            </a>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl font-sans text-xs text-muted-foreground">
        © {year} Cuisenio. {t("footer.rights")}
      </p>
    </footer>
  )
}
