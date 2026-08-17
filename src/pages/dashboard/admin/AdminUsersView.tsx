import { useMemo, useState } from "react"
import { Shield, Trash2, UserRound } from "lucide-react"
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
      ? "bg-foreground text-background"
      : "bg-muted text-muted-foreground"

  const Icon = label === "ROLE_ADMIN" ? Shield : UserRound

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
  showAdminBadge?: boolean
  adminsCount?: number
}

export function AdminUsersView({
  title = "Utilisateurs & Rôles",
  rows,
  onStatus,
  onDelete,
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
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} compte(s)
          {showAdminBadge ? ` · ${adminsCount ?? 0} admin` : ""}
          {" · "}toutes les fonctionnalités sont gratuites
        </p>
      </div>

      <AdminPanel title="Liste paginée">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="pb-2 font-medium">Nom</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Rôle actuel</th>
                <th className="pb-2 font-medium">Statut</th>
                <th className="pb-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageRows.map((u) => {
                const role = normalizeRole(u.role)
                const isAdmin = role === Role.ADMIN
                return (
                  <tr key={u.id} className="text-foreground">
                    <td className="py-3 font-medium">
                      {u.username} {u.lastName}
                    </td>
                    <td className="py-3 text-muted-foreground">{u.email}</td>
                    <td className="py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="py-3 capitalize text-muted-foreground">{u.status}</td>
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
                            className="text-destructive"
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
            <p className="text-muted-foreground">
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
