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
          <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="px-4 py-12 text-center text-sm text-muted-foreground">
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
                "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors duration-150 hover:bg-muted",
                !n.read && "bg-primary/5",
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
                <span className="block text-sm font-medium leading-snug text-foreground">
                  {n.message}
                </span>
                <span className="mt-1 block text-[11px] text-muted-foreground">
                  {relativeTime(n.createdAt)}
                  {n.actor?.username ? ` · ${n.actor.username}` : null}
                </span>
              </span>
              {!n.read && (
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
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
