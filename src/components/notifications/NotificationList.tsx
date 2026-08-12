import { Icon } from "../ui/icon"
import type { AppNotification } from "../../api/notification.service"
import { relativeTime, typeIcon } from "./notification-ui"
import { cn } from "../../lib/utils"

type NotificationListProps = {
  items: AppNotification[]
  loading?: boolean
  onSelect: (n: AppNotification) => void
}

export function NotificationList({ items, loading, onSelect }: NotificationListProps) {
  if (loading) {
    return (
      <div className="space-y-2 p-3" aria-busy="true" aria-label="Chargement des notifications">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Aucune notification pour le moment.
      </div>
    )
  }

  return (
    <ul className="max-h-80 overflow-y-auto" role="list">
      {items.map((n) => {
        const meta = typeIcon(n.type)
        return (
          <li key={n.id} role="listitem">
            <button
              type="button"
              onClick={() => onSelect(n)}
              className={cn(
                "flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60",
                !n.read && "bg-[#2E7D32]/5 dark:bg-emerald-500/10",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  meta.className,
                )}
                aria-hidden
              >
                <Icon icon={meta.icon} size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium leading-snug text-slate-900 dark:text-slate-100">
                  {n.message}
                </span>
                <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">
                  {relativeTime(n.createdAt)}
                  {n.actor?.username ? ` · ${n.actor.username}` : null}
                </span>
              </span>
              {!n.read && (
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2E7D32]"
                  aria-label="Non lue"
                />
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
