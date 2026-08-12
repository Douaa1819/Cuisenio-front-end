import { AnimatePresence, motion } from "framer-motion"
import { ChefHat, Compass, Home, LayoutDashboard, LogOut, Menu, UtensilsCrossed, User, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { NotificationBell } from "../notifications/NotificationBell"
import { useAuthStore } from "../../store/auth.store"
import { env } from "../../lib/env"
import { ShoppingListButton } from "../kitchen/ShoppingListButton"
import { ThemeAndLanguageBar } from "./ThemeAndLanguageBar"
import { PremiumBadge } from "../premium/PremiumUpgradeModal"
import { ConfirmDialog } from "../ui/ConfirmDialog"
import { Icon } from "../ui/icon"
import { Role, isPremiumUser, normalizeRole } from "../../types/auth.types"

export function Nav() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

  const isAdmin = normalizeRole(user?.role) === Role.ADMIN
  const isPremium = isPremiumUser(user?.role, user?.subscriptionTier)
  const avatarUrl = user?.profilePicture
    ? `${env.uploadsUrl}/${user.profilePicture}`
    : null

  const requestLogout = () => {
    setUserMenuOpen(false)
    setLogoutConfirmOpen(true)
  }

  const confirmLogout = () => {
    setLogoutConfirmOpen(false)
    logout()
  }

  const navLinks = isAdmin
    ? [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]
    : [
        { to: "/chef", label: "Espace Chef", icon: ChefHat },
        { to: "/home", label: "Découvrir", icon: Home },
        { to: "/discover", label: "Explorer", icon: Compass },
        { to: "/meal-planner", label: "Plans", icon: UtensilsCrossed },
      ]

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={isAuthenticated ? (isAdmin ? "/dashboard" : "/chef") : "/"} className="flex items-center gap-2">
            <Icon icon={ChefHat} size={24} className="text-primary" />
            <span className="font-serif text-lg text-foreground">Cuisenio</span>
          </Link>

          {/* Desktop links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                >
                  <Icon icon={link.icon} />
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeAndLanguageBar />
            {isAuthenticated ? (
              <>
                <ShoppingListButton />
                <NotificationBell />

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-primary/10"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user?.username}
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
                        <Icon icon={User} className="text-primary" />
                      </div>
                    )}
                    <div className="hidden sm:block text-left">
                      <p className="flex items-center gap-1.5 text-sm font-medium leading-tight text-foreground">
                        {user?.username}
                        {isPremium && !isAdmin && <PremiumBadge />}
                      </p>
                      <p className="text-xs text-muted-foreground">{isAdmin ? "Administrateur" : isPremium ? "Chef Premium" : "Chef"}</p>
                    </div>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg"
                        >
                          {/* User info header */}
                          <div className="border-b border-border bg-muted/50 px-4 py-3">
                            <p className="text-sm font-semibold text-foreground">{user?.username} {user?.lastName}</p>
                            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                          </div>

                          {/* Menu items */}
                          <div className="py-1">
                            {!isAdmin && (
                              <Link
                                to="/profile"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors duration-200 hover:bg-muted hover:text-primary"
                              >
                                <Icon icon={User} />
                                Mon profil
                              </Link>
                            )}
                            <button
                              onClick={requestLogout}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-600 transition-colors duration-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            >
                              <Icon icon={LogOut} />
                              Se déconnecter
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile menu toggle */}
                <button
                  className="rounded-lg p-2 transition-colors duration-200 hover:bg-muted md:hidden"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="Menu"
                >
                  {mobileOpen ? <Icon icon={X} size={20} /> : <Icon icon={Menu} size={20} />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary/90"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && isAuthenticated && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border py-2 md:hidden"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                >
                  <Icon icon={link.icon} />
                  {link.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <ConfirmDialog
        open={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
        severity="warning"
        title="Se déconnecter ?"
        description="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmLabel="Se déconnecter"
        onConfirm={confirmLogout}
      />
    </header>
  )
}

export default Nav
