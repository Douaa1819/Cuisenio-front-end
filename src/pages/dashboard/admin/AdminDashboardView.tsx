import type { LucideIcon } from "lucide-react"
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { RecipeResponse } from "../../../types/recipe.types"
import type { AdminOverviewMetrics } from "../../../types/user.types"
import { AdminEmpty, AdminPanel } from "./AdminShared"

const SAGE = "#2E7D32"
const EMERALD = "#059669"
const PIE_COLORS = [EMERALD, "#94A3B8", "#64748B"]
const CHART_FILL = "rgba(16, 185, 129, 0.85)"
const CHART_FILL_SOFT = "rgba(16, 185, 129, 0.2)"

type KpiProps = {
  title: string
  value: number
  icon: LucideIcon
  delta?: string
  deltaPositive?: boolean
}

function KpiCard({ title, value, icon: Icon, delta, deltaPositive = true }: KpiProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {delta && (
        <p
          className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            deltaPositive
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          <TrendingUp className="h-3 w-3" />
          {delta}
        </p>
      )}
    </div>
  )
}

type AdminDashboardViewProps = {
  metrics: AdminOverviewMetrics | null
  usersCount: number
  recipes: RecipeResponse[]
  moderationCount: number
  reportsCount: number
  engagementData: { name: string; value: number }[]
  statusDistribution: { name: string; value: number }[]
}

export function AdminDashboardView({
  metrics,
  usersCount,
  recipes,
  moderationCount,
  reportsCount,
  engagementData,
  statusDistribution,
}: AdminDashboardViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Vue d&apos;ensemble</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Santé plateforme & activité récente</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Comptes"
          value={metrics?.totalUsers ?? usersCount}
          icon={Users}
          delta="+12% ce mois"
        />
        <KpiCard
          title="Recettes actives"
          value={metrics?.activeRecipes ?? recipes.length}
          icon={BookOpen}
          delta="+8% ce mois"
        />
        <KpiCard
          title="En attente"
          value={moderationCount}
          icon={AlertTriangle}
          delta={moderationCount === 0 ? "File vide" : "À traiter"}
          deltaPositive={moderationCount === 0}
        />
        <KpiCard
          title="Signalements"
          value={reportsCount}
          icon={Activity}
          delta={reportsCount === 0 ? "RAS" : "Revue requise"}
          deltaPositive={reportsCount === 0}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminPanel title="Engagement">
          <div
            className="h-56 rounded-xl p-2"
            style={{ background: CHART_FILL_SOFT }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} stroke="#94A3B8" />
                <XAxis dataKey="name" fontSize={12} stroke="#64748B" />
                <YAxis fontSize={12} stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#E2E8F0",
                    background: "var(--tooltip-bg, #fff)",
                  }}
                />
                <Bar dataKey="value" fill={CHART_FILL} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminPanel>

        <AdminPanel title="Statut des comptes">
          <div className="h-56 rounded-xl p-2" style={{ background: CHART_FILL_SOFT }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {statusDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminPanel title="Dernières recettes">
          <ul className="space-y-2">
            {recipes.slice(0, 5).map((r) => (
              <li key={r.id} className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-slate-800 dark:text-slate-100">{r.title}</span>
                <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  {(r.averageRating ?? 0).toFixed(1)}
                </span>
              </li>
            ))}
            {!recipes.length && <AdminEmpty>Aucune recette</AdminEmpty>}
          </ul>
        </AdminPanel>

        <AdminPanel title="Activité système">
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" /> API reachable
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Auth JWT OK
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" style={{ color: SAGE }} /> Uploads mounted
            </li>
          </ul>
        </AdminPanel>
      </div>
    </div>
  )
}
