import { Bell, Check } from "lucide-react"
import { useCallback, useEffect, useId, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { notificationService, type AppNotification } from "../../api/notification.service"
import { Icon } from "../ui/icon"
import { NotificationList } from "./NotificationList"
import { useAuthStore } from "../../store/auth.store"

const POLL_MS = 45_000

export function NotificationBell() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const navigate = useNavigate()
  const panelId = useId()

  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<AppNotification[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)

  const refreshCount = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const { count } = await notificationService.unreadCount()
      setUnread(count)
    } catch {
      // silent
    }
  }, [isAuthenticated])

  const refreshList = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const list = await notificationService.list()
      setItems(list)
      setUnread(list.filter((n) => !n.read).length)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([])
      setUnread(0)
      return
    }
    void refreshCount()
    const id = window.setInterval(() => void refreshCount(), POLL_MS)
    return () => window.clearInterval(id)
  }, [isAuthenticated, refreshCount])

  useEffect(() => {
    if (open) void refreshList()
  }, [open, refreshList])

  if (!isAuthenticated) return null

  const label =
    unread > 0
      ? `Notifications (${unread} non lue${unread > 1 ? "s" : ""})`
      : "Notifications"

  const handleMarkAll = async () => {
    try {
      await notificationService.markAllRead()
      setItems((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnread(0)
    } catch {
      // ignore
    }
  }

  const handleSelect = async (n: AppNotification) => {
    try {
      if (!n.read) {
        await notificationService.markRead(n.id)
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
        setUnread((c) => Math.max(0, c - 1))
      }
    } catch {
      // still navigate
    }
    setOpen(false)
    if (n.targetUrl) navigate(n.targetUrl)
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="relative rounded-full p-2 text-slate-600 transition hover:bg-primary/10 hover:text-primary dark:text-slate-300"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon icon={Bell} size={20} />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2E7D32] px-1 text-[9px] font-bold text-white"
            >
              {unread > 9 ? "9+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 cursor-default bg-transparent"
              aria-label="Fermer les notifications"
              onClick={() => setOpen(false)}
            />
            <motion.div
              id={panelId}
              role="dialog"
              aria-label="Panneau des notifications"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-full z-50 mt-2 w-[22rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <h2 className="font-serif text-base text-slate-900 dark:text-slate-100">Notifications</h2>
                <button
                  type="button"
                  onClick={() => void handleMarkAll()}
                  disabled={unread === 0}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D32] transition hover:underline disabled:cursor-not-allowed disabled:opacity-40 dark:text-emerald-400"
                >
                  <Icon icon={Check} size={14} />
                  Tout marquer comme lu
                </button>
              </div>

              <NotificationList items={items} loading={loading} onSelect={handleSelect} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
