import { useMemo, useState } from "react"
import { Download, MailX, Search, Trash2 } from "lucide-react"
import { Button } from "../../../components/ui/button"
import type { NewsletterSubscriberAdmin } from "../../../api/newsletter.service"
import { AdminEmpty, AdminPanel, StatusPill } from "./AdminShared"

type AdminNewsletterViewProps = {
  subscribers: NewsletterSubscriberAdmin[]
  isLoading?: boolean
  onUnsubscribe: (id: number) => void
  onDelete: (id: number) => void
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function exportCsv(rows: NewsletterSubscriberAdmin[]) {
  const header = ["email", "subscribedAt", "status", "origin", "consentGiven"]
  const lines = rows
    .filter((s) => s.consentGiven !== false)
    .map((s) =>
      [
        s.email,
        s.subscribedAt,
        s.active ? "Actif" : "Désinscrit",
        s.origin ?? "Home Page",
        s.consentGiven ? "true" : "false",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    )
  const csv = [header.join(","), ...lines].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `cuisenio-newsletter-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function AdminNewsletterView({
  subscribers,
  isLoading,
  onUnsubscribe,
  onDelete,
}: AdminNewsletterViewProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return subscribers
    return subscribers.filter((s) => s.email.toLowerCase().includes(q))
  }, [subscribers, query])

  const activeCount = subscribers.filter((s) => s.active).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Newsletter & Contacts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {activeCount} abonné(s) actif(s) · opt-in RGPD
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-500"
          onClick={() => exportCsv(filtered)}
          disabled={!filtered.length}
        >
          <Download className="mr-1.5 h-4 w-4" /> Exporter CSV
        </Button>
      </div>

      <AdminPanel
        title="Abonnés"
        action={
          <div className="relative w-full max-w-xs sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrer par email…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
        }
      >
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Inscription</th>
                  <th className="pb-2 font-medium">Statut</th>
                  <th className="pb-2 font-medium">Origine</th>
                  <th className="pb-2 font-medium">RGPD</th>
                  <th className="pb-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((s) => (
                  <tr key={s.id} className="text-slate-800 dark:text-slate-100">
                    <td className="py-3 font-medium">{s.email}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{formatDate(s.subscribedAt)}</td>
                    <td className="py-3">
                      <StatusPill ok={s.active}>{s.active ? "Actif" : "Désinscrit"}</StatusPill>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{s.origin ?? "Home Page"}</td>
                    <td className="py-3">
                      <StatusPill ok={!!s.consentGiven}>{s.consentGiven ? "Opt-in" : "Non"}</StatusPill>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {s.active && (
                          <Button type="button" size="xs" variant="outline" onClick={() => onUnsubscribe(s.id)}>
                            <MailX className="mr-1 h-3.5 w-3.5" /> Désinscrire
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="xs"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => onDelete(s.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <AdminEmpty>Aucun abonné trouvé</AdminEmpty>}
          </div>
        )}
      </AdminPanel>
    </div>
  )
}
