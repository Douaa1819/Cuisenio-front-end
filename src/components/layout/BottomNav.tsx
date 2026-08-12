import { NavLink } from "react-router-dom"
import { CalendarDays, ChefHat, Home, PlusCircle, User } from "lucide-react"
import { useAuthStore } from "../../store/auth.store"
import { Role, normalizeRole } from "../../types/auth.types"
import { cn } from "../../lib/utils"
import { Icon } from "../ui/icon"

const chefLinks = [
  { to: "/chef", label: "Chef", icon: ChefHat, end: true },
  { to: "/home", label: "Fil", icon: Home },
  { to: "/add-recipe", label: "Créer", icon: PlusCircle },
  { to: "/meal-planner", label: "Plans", icon: CalendarDays },
  { to: "/profile", label: "Profil", icon: User },
]

/** Thumb-zone navigation for chefs (admins use the dashboard shell). */
export function BottomNav() {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated || normalizeRole(user?.role) === Role.ADMIN) return null

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Navigation principale"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {chefLinks.map(({ to, label, icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              <Icon icon={icon} size={20} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
