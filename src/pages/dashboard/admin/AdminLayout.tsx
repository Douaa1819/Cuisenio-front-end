import type { ReactNode } from "react"
import { LayoutDashboard, Search } from "lucide-react"
import { SiteFooter } from "../../../components/layout/SiteFooter"
import { AdminSidebar } from "./AdminSidebar"
import type { AdminSection } from "./types"

type AdminLayoutProps = {
  section: AdminSection
  onNavigate: (id: AdminSection) => void
  userEmail?: string
  pendingCount?: number
  sidebarOpen: boolean
  onSidebarOpen: () => void
  onSidebarClose: () => void
  onLogout: () => void
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  children: ReactNode
}

export function AdminLayout({
  section,
  onNavigate,
  userEmail,
  pendingCount,
  sidebarOpen,
  onSidebarOpen,
  onSidebarClose,
  onLogout,
  search,
  onSearchChange,
  searchPlaceholder = "Rechercher…",
  children,
}: AdminLayoutProps) {
  return (
    <div className="organic-surface flex min-h-screen text-foreground antialiased dark:bg-slate-950 dark:text-slate-100">
      <AdminSidebar
        section={section}
        onNavigate={onNavigate}
        userEmail={userEmail}
        pendingCount={pendingCount}
        open={sidebarOpen}
        onClose={onSidebarClose}
        onLogout={onLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-secondary lg:hidden dark:hover:bg-slate-900"
            onClick={onSidebarOpen}
            aria-label="Ouvrir le menu"
          >
            <LayoutDashboard className="h-5 w-5" />
          </button>
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-border bg-[color:var(--cu-paper)] py-2 pl-9 pr-3 font-sans text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden font-sans text-xs text-muted-foreground sm:inline">Système OK</span>
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        <SiteFooter variant="app" />
      </div>
    </div>
  )
}
