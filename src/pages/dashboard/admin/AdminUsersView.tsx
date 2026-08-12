import { useMemo, useState } from "react"
import { Crown, Shield, Trash2, UserRound } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { normalizeRole, Role } from "../../../types/auth.types"
import type { UserDTO, UserStatus } from "../../../types/user.types"
import { cn } from "../../../lib/utils"
import { AdminEmpty, AdminPanel } from "./AdminShared"
import { roleAuthorityLabel } from "./types"

const PAGE_SIZE = 8

function RoleBadge({ role }: { role?: string }) {
  const label = roleAuthorityLabel(role)
  const styles =
    label === "ROLE_ADMIN"
      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
      : label === "ROLE_PREMIUM"
        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"

  const Icon = label === "ROLE_ADMIN" ? Shield : label === "ROLE_PREMIUM" ? Crown : UserRound

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", styles)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

type AdminUsersViewProps = {
  title?: string
  rows: UserDTO[]
  onStatus: (id: number, status: UserStatus) => void
  onDelete: (u: UserDTO) => void
  onTogglePremium: (u: UserDTO, enable: boolean) => void
  showAdminBadge?: boolean
  adminsCount?: number
}

export function AdminUsersView({
  title = "Utilisateurs & Rôles",
  rows,
  onStatus,
  onDelete,
  onTogglePremium,
  showAdminBadge,
  adminsCount,
}: AdminUsersViewProps) {
  const [page, setPage] = useState(0)

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageRows = useMemo(
    () => rows.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [rows, safePage],
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {rows.length} compte(s)
          {showAdminBadge ? ` · ${adminsCount ?? 0} admin` : ""}
          {" · "}bascule Premium sans Stripe
        </p>
      </div>

      <AdminPanel title="Liste paginée">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="pb-2 font-medium">Nom</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Rôle actuel</th>
                <th className="pb-2 font-medium">Statut</th>
                <th className="pb-2 font-medium">Premium</th>
                <th className="pb-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pageRows.map((u) => {
                const role = normalizeRole(u.role)
                const isAdmin = role === Role.ADMIN
                const isPremium = role === Role.PREMIUM
                return (
                  <tr key={u.id} className="text-slate-800 dark:text-slate-100">
                    <td className="py-3 font-medium">
                      {u.username} {u.lastName}
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="py-3 capitalize text-slate-600 dark:text-slate-300">{u.status}</td>
                    <td className="py-3">
                      <label
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-2",
                          isAdmin && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <span className="sr-only">Basculer ROLE_PREMIUM</span>
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={isPremium || isAdmin}
                          disabled={isAdmin}
                          onChange={(e) => onTogglePremium(u, e.target.checked)}
                        />
                        <span
                          className={cn(
                            "relative h-6 w-11 rounded-full transition",
                            isPremium || isAdmin ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700",
                          )}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                              (isPremium || isAdmin) && "translate-x-5",
                            )}
                          />
                        </span>
                      </label>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {u.status !== "active" && (
                          <Button type="button" size="xs" variant="outline" onClick={() => onStatus(u.id, "active")}>
                            Activer
                          </Button>
                        )}
                        {u.status !== "suspended" && !isAdmin && (
                          <Button type="button" size="xs" variant="outline" onClick={() => onStatus(u.id, "suspended")}>
                            Suspendre
                          </Button>
                        )}
                        {!isAdmin && (
                          <Button
                            type="button"
                            size="xs"
                            variant="ghost"
                            className="text-red-600"
                            onClick={() => onDelete(u)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!rows.length && <AdminEmpty>Aucun résultat</AdminEmpty>}
        </div>

        {rows.length > PAGE_SIZE && (
          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              Page {safePage + 1} / {pageCount}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={safePage === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Précédent
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={safePage >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </AdminPanel>
    </div>
  )
}
