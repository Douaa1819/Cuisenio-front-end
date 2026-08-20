import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CheckCircle2, XCircle } from "lucide-react"
import { newsletterService, type NewsletterSubscriberAdmin } from "../../api/newsletter.service"
import { recipeService } from "../../api/recipe.service"
import { userService } from "../../api/user.service"
import { Button } from "../../components/ui/button"
import { ConfirmDialog } from "../../components/ui/ConfirmDialog"
import { useNotification } from "../../context/NotificationContext"
import { useAuthStore } from "../../store/auth.store"
import { useTheme } from "../../hooks/use-theme"
import { usePageMeta } from "../../hooks/usePageMeta"
import { normalizeRole, Role } from "../../types/auth.types"
import { recipePath, type ModerationReportItem, type RecipeResponse } from "../../types/recipe.types"
import type { AdminOverviewMetrics, UserDTO, UserStatus } from "../../types/user.types"
import { AdminDashboardView } from "./admin/AdminDashboardView"
import { AdminLayout } from "./admin/AdminLayout"
import { AdminNewsletterView } from "./admin/AdminNewsletterView"
import { AdminEmpty, AdminPanel, StatusPill } from "./admin/AdminShared"
import { AdminUsersView } from "./admin/AdminUsersView"
import type { AdminSection } from "./admin/types"

type PendingConfirm =
  | { type: "logout" }
  | { type: "archive-user"; user: UserDTO }
  | { type: "newsletter-unsub"; id: number; email: string }
  | { type: "newsletter-archive"; id: number; email: string }
  | null

export default function AdminDashboard() {
  const { logout, user } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const { success, error: notifyError } = useNotification()

  const [section, setSection] = useState<AdminSection>("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<UserDTO[]>([])
  const [metrics, setMetrics] = useState<AdminOverviewMetrics | null>(null)
  const [search, setSearch] = useState("")
  const [moderationQueue, setModerationQueue] = useState<RecipeResponse[]>([])
  const [reportedItems, setReportedItems] = useState<ModerationReportItem[]>([])
  const [recipes, setRecipes] = useState<RecipeResponse[]>([])
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberAdmin[]>([])
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [pending, setPending] = useState<PendingConfirm>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  usePageMeta({ title: "Admin", path: "/dashboard", description: "Administration Cuisenio" })

  const refreshData = async () => {
    const [usersRes, overviewRes, moderationRes, reportsRes, publishedRes] = await Promise.all([
      userService.listUser(),
      userService.getOverviewMetrics(),
      recipeService.getModerationQueue(),
      recipeService.getModerationReports(),
      recipeService.getAllRecipes(),
    ])
    setUsers(usersRes.content ?? [])
    setMetrics(overviewRes)
    setModerationQueue(moderationRes.content ?? [])
    setReportedItems(reportsRes ?? [])
    setRecipes(publishedRes.content ?? [])
  }

  const refreshNewsletter = async () => {
    setNewsletterLoading(true)
    try {
      const list = await newsletterService.listSubscribers()
      setSubscribers(list)
    } catch {
      notifyError("Newsletter", "Impossible de charger les abonnés.")
    } finally {
      setNewsletterLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        await refreshData()
      } catch {
        notifyError("Erreur", "Impossible de charger le dashboard admin.")
      } finally {
        setIsLoading(false)
      }
    }
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (section === "newsletter") {
      void refreshNewsletter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section])

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter(
      (u) =>
        `${u.username} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    )
  }, [users, search])

  const chefs = useMemo(
    () => filteredUsers.filter((u) => normalizeRole(u.role) === Role.CHEF),
    [filteredUsers],
  )
  const admins = useMemo(
    () => filteredUsers.filter((u) => normalizeRole(u.role) === Role.ADMIN),
    [filteredUsers],
  )

  const statusDistribution = useMemo(
    () => [
      { name: "Actifs", value: users.filter((u) => u.status === "active").length },
      { name: "Suspendus", value: users.filter((u) => u.status === "suspended").length },
      { name: "Archivés", value: users.filter((u) => u.status === "archived").length },
    ],
    [users],
  )

  const engagementData = useMemo(
    () =>
      metrics
        ? [
            { name: "Likes", value: metrics.likes },
            { name: "Commentaires", value: metrics.comments },
            { name: "Recettes", value: metrics.activeRecipes },
          ]
        : [],
    [metrics],
  )

  const searchPlaceholder =
    section === "newsletter"
      ? "Rechercher un email newsletter…"
      : "Rechercher un chef, un email…"

  const updateUserStatus = async (userId: number, status: UserStatus) => {
    try {
      await userService.updateStatus(userId, status)
      await refreshData()
      success("Statut mis à jour", `Utilisateur ${status}.`)
    } catch {
      notifyError("Erreur", "Impossible de mettre à jour le statut.")
    }
  }

  const moderateRecipe = async (recipeId: number, approve: boolean) => {
    try {
      if (approve) {
        await recipeService.approveRecipe(recipeId)
      } else {
        await recipeService.updateModerationStatus(recipeId, "rejected")
      }
      await refreshData()
      success(approve ? "Approuvée" : "Rejetée", "File de modération mise à jour.")
    } catch {
      notifyError("Erreur", "Action de modération indisponible sur l'API.")
    }
  }

  const runPendingConfirm = async () => {
    if (!pending) return
    setConfirmLoading(true)
    try {
      switch (pending.type) {
        case "logout":
          setPending(null)
          logout()
          return
        case "archive-user":
          await userService.delete(pending.user.id)
          await refreshData()
          success("Compte archivé", "Le compte n'est plus visible (soft delete).")
          break
        case "newsletter-unsub":
          await newsletterService.adminUnsubscribe(pending.id)
          await refreshNewsletter()
          success("Désinscrit", "Abonnement désactivé (RGPD).")
          break
        case "newsletter-archive":
          await newsletterService.adminDelete(pending.id)
          await refreshNewsletter()
          success("Archivé", "Contact archivé (soft delete, conforme RGPD).")
          break
      }
      setPending(null)
    } catch {
      notifyError("Erreur", "Action impossible.")
    } finally {
      setConfirmLoading(false)
    }
  }

  const confirmDialogProps = (() => {
    if (!pending) {
      return {
        title: "",
        description: "",
        severity: "warning" as const,
        confirmLabel: "Confirmer",
      }
    }
    switch (pending.type) {
      case "logout":
        return {
          title: "Se déconnecter ?",
          description: "Êtes-vous sûr de vouloir vous déconnecter ?",
          severity: "warning" as const,
          confirmLabel: "Se déconnecter",
        }
      case "archive-user":
        return {
          title: "Archiver ce compte ?",
          description: `Le compte ${pending.user.email} sera archivé (soft delete) et ne pourra plus se connecter. Aucune suppression physique.`,
          severity: "danger" as const,
          confirmLabel: "Archiver",
        }
      case "newsletter-unsub":
        return {
          title: "Désinscrire cet email ?",
          description: `${pending.email} ne recevra plus la newsletter. Le consentement RGPD reste tracé.`,
          severity: "warning" as const,
          confirmLabel: "Désinscrire",
        }
      case "newsletter-archive":
        return {
          title: "Archiver ce contact ?",
          description: `${pending.email} sera archivé (soft delete) et retiré des listes actives.`,
          severity: "danger" as const,
          confirmLabel: "Archiver",
        }
    }
  })()

  return (
    <>
      <AdminLayout
        section={section}
        onNavigate={setSection}
        userEmail={user?.email}
        pendingCount={moderationQueue.length + reportedItems.length}
        sidebarOpen={sidebarOpen}
        onSidebarOpen={() => setSidebarOpen(true)}
        onSidebarClose={() => setSidebarOpen(false)}
        onLogout={() => setPending({ type: "logout" })}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
      >
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <>
            {section === "overview" && (
              <AdminDashboardView
                metrics={metrics}
                usersCount={users.length}
                recipes={recipes}
                moderationCount={moderationQueue.length}
                reportsCount={reportedItems.length}
                engagementData={engagementData}
                statusDistribution={statusDistribution}
              />
            )}

            {section === "users" && (
              <AdminUsersView
                rows={filteredUsers}
                onStatus={updateUserStatus}
                onDelete={(u) => setPending({ type: "archive-user", user: u })}
                showAdminBadge
                adminsCount={admins.length}
              />
            )}

            {section === "chefs" && (
              <AdminUsersView
                title="Chefs & Créateurs"
                rows={chefs}
                onStatus={updateUserStatus}
                onDelete={(u) => setPending({ type: "archive-user", user: u })}
              />
            )}

            {section === "newsletter" && (
              <AdminNewsletterView
                subscribers={subscribers.filter((s) =>
                  search ? s.email.toLowerCase().includes(search.toLowerCase()) : true,
                )}
                isLoading={newsletterLoading}
                onUnsubscribe={(id) => {
                  const sub = subscribers.find((s) => s.id === id)
                  setPending({ type: "newsletter-unsub", id, email: sub?.email ?? `#${id}` })
                }}
                onDelete={(id) => {
                  const sub = subscribers.find((s) => s.id === id)
                  setPending({ type: "newsletter-archive", id, email: sub?.email ?? `#${id}` })
                }}
              />
            )}

            {section === "recipes" && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Recettes & Modération</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Valider ou suspendre les publications</p>
                </div>
                <AdminPanel title="Recettes publiées">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="pb-2 font-medium">Titre</th>
                          <th className="pb-2 font-medium">Chef</th>
                          <th className="pb-2 font-medium">Note</th>
                          <th className="pb-2 font-medium">Statut</th>
                          <th className="pb-2 font-medium" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {recipes.map((r) => (
                          <tr key={r.id}>
                            <td className="py-3 font-medium text-slate-900 dark:text-slate-100">{r.title}</td>
                            <td className="py-3 text-slate-500 dark:text-slate-400">{r.user?.username}</td>
                            <td className="py-3">{(r.averageRating ?? 0).toFixed(1)}</td>
                            <td className="py-3">
                              <StatusPill ok={r.isApproved !== false}>
                                {r.isApproved === false ? "Pending" : "Live"}
                              </StatusPill>
                            </td>
                            <td className="py-3 text-right">
                              <Link to={recipePath(r)} className="text-emerald-700 hover:underline dark:text-emerald-400">
                                Voir
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!recipes.length && <AdminEmpty>Aucune recette</AdminEmpty>}
                  </div>
                </AdminPanel>
              </div>
            )}

            {section === "queue" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">File d&apos;attente & Audit</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Approbations et signalements</p>
                </div>
                <AdminPanel title="File d'approbation">
                  <ul className="space-y-3">
                    {moderationQueue.map((r) => (
                      <li
                        key={r.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                      >
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{r.title}</p>
                          <p className="text-xs text-slate-500">par {r.user?.username}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500"
                            onClick={() => void moderateRecipe(r.id, true)}
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" /> Approuver
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => void moderateRecipe(r.id, false)}>
                            <XCircle className="mr-1 h-4 w-4" /> Rejeter
                          </Button>
                        </div>
                      </li>
                    ))}
                    {!moderationQueue.length && <AdminEmpty>Queue vide — rien à modérer</AdminEmpty>}
                  </ul>
                </AdminPanel>

                <AdminPanel title="Signalements (audit)">
                  <ul className="space-y-3">
                    {reportedItems.map((item) => (
                      <li
                        key={`${item.recipeId}-${item.lastReportedAt}`}
                        className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800"
                      >
                        <p className="font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
                        <p className="text-slate-500 dark:text-slate-400">{item.latestReason}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.reportCount} signalement(s) · urgence {item.urgency}
                        </p>
                      </li>
                    ))}
                    {!reportedItems.length && <AdminEmpty>Aucun signalement</AdminEmpty>}
                  </ul>
                </AdminPanel>
              </div>
            )}

            {section === "settings" && (
              <AdminPanel title="Configuration & Système">
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Thème</p>
                      <p className="text-slate-500 dark:text-slate-400">Dark Mode natif (slate / émeraude)</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                      {theme === "dark" ? "Clair" : "Sombre"}
                    </Button>
                  </div>
                  <Button type="button" variant="outline" onClick={() => navigate("/profile")}>
                    Mon profil
                  </Button>
                </div>
              </AdminPanel>
            )}
          </>
        )}
      </AdminLayout>

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !confirmLoading) setPending(null)
        }}
        title={confirmDialogProps.title}
        description={confirmDialogProps.description}
        severity={confirmDialogProps.severity}
        confirmLabel={confirmDialogProps.confirmLabel}
        isLoading={confirmLoading}
        onConfirm={runPendingConfirm}
      />
    </>
  )
}
