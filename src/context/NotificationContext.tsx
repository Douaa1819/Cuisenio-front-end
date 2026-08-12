import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { createContext, useCallback, useContext, useRef, useState } from "react"

// Toast / ephemeral alerts (separate from in-app inbox notifications)

type NotifType = "success" | "error" | "info" | "warning"

interface ToastNotification {
  id: string
  type: NotifType
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextValue {
  notify: (
    type: NotifType,
    title: string,
    message: string,
    options?: { action?: ToastNotification["action"]; durationMs?: number },
  ) => void
  dismiss: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string, options?: { action?: ToastNotification["action"]; durationMs?: number }) => void
  info: (title: string, message?: string) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastNotification & { timer: number })[]>([])
  const timerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const notify = useCallback((
    type: NotifType,
    title: string,
    message: string,
    options?: { action?: ToastNotification["action"]; durationMs?: number },
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const durationMs = options?.durationMs ?? 4000
    const notif: ToastNotification = { id, type, title, message, action: options?.action }

    setToasts((prev) => [...prev, { ...notif, timer: durationMs }])

    timerRef.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      delete timerRef.current[id]
    }, durationMs)
  }, [])

  const dismiss = useCallback((id: string) => {
    clearTimeout(timerRef.current[id])
    delete timerRef.current[id]
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((title: string, message = "") => notify("success", title, message), [notify])
  const error = useCallback(
    (title: string, message = "", options?: { action?: ToastNotification["action"]; durationMs?: number }) =>
      notify("error", title, message, options),
    [notify],
  )
  const info = useCallback((title: string, message = "") => notify("info", title, message), [notify])

  return (
    <NotificationContext.Provider value={{ notify, dismiss, success, error, info }}>
      {children}

      <div className="pointer-events-none fixed right-4 bottom-4 z-[100] flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="pointer-events-auto"
            >
              <ToastItem notif={toast} onDismiss={dismiss} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}

const ICONS: Record<NotifType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />,
  error: <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />,
  info: <Info className="h-5 w-5 shrink-0 text-slate-500" />,
  warning: <AlertCircle className="h-5 w-5 shrink-0 text-slate-500" />,
}

const BORDERS: Record<NotifType, string> = {
  success: "border-l-emerald-500",
  error: "border-l-rose-500",
  info: "border-l-slate-400",
  warning: "border-l-slate-500",
}

function ToastItem({ notif, onDismiss }: { notif: ToastNotification; onDismiss: (id: string) => void }) {
  return (
    <div
      className={`flex min-w-[280px] max-w-sm items-start gap-3 rounded-xl border border-slate-100 border-l-4 bg-white px-4 py-3 shadow-lg dark:border-slate-800 dark:bg-slate-900 ${BORDERS[notif.type]}`}
    >
      {ICONS[notif.type]}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-tight font-semibold text-slate-800 dark:text-slate-100">{notif.title}</p>
        {notif.message && <p className="mt-0.5 text-xs leading-snug text-slate-500 dark:text-slate-400">{notif.message}</p>}
        {notif.action && (
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-primary hover:underline"
            onClick={notif.action.onClick}
          >
            {notif.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(notif.id)}
        className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function useNotification(): NotificationContextValue {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error("useNotification must be used inside <NotificationProvider>")
  return ctx
}

/** @deprecated Use `components/notifications/NotificationBell` */
export { NotificationBell } from "../components/notifications/NotificationBell"
