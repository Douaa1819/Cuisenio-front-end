import {
  ChefHat,
  Clock,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Users,
  Utensils,
} from "lucide-react"
import { cn } from "../../../lib/utils"
import type { AdminNavItem, AdminSection } from "./types"

const NAV: AdminNavItem[] = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "users", label: "Utilisateurs & Rôles", icon: Users, hint: "ROLE_PREMIUM / comptes" },
  { id: "newsletter", label: "Newsletter & Contacts", icon: Mail },
  { id: "recipes", label: "Recettes & Modération", icon: Utensils },
  { id: "chefs", label: "Chefs & Créateurs", icon: ChefHat },
  { id: "queue", label: "File d'attente & Audit", icon: Clock },
  { id: "settings", label: "Configuration & Système", icon: Settings },
]

type AdminSidebarProps = {
  section: AdminSection
  onNavigate: (id: AdminSection) => void
  userEmail?: string
  pendingCount?: number
  open: boolean
  onClose: () => void
  onLogout: () => void
}

export function AdminSidebar({
  section,
  onNavigate,
  userEmail,
  pendingCount = 0,
  open,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          aria-label="Fermer le menu"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2E7D32]/12 text-[#2E7D32] dark:bg-emerald-500/15 dark:text-emerald-400">
            <ChefHat className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Cuisenio Admin</p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{userEmail}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Navigation admin">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                title={item.hint}
                onClick={() => {
                  onNavigate(item.id)
                  onClose()
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-[#2E7D32]/10 text-[#2E7D32] dark:bg-emerald-500/15 dark:text-emerald-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate text-left">{item.label}</span>
                {item.id === "queue" && pendingCount > 0 && (
                  <span className="ml-auto rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
