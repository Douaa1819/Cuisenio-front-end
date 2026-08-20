import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

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

export type ShowToastInput = {
  type: NotifType
  title: string
  message?: string
  durationMs?: number
  action?: ToastNotification["action"]
}

interface NotificationContextValue {
  notify: (
    type: NotifType,
    title: string,
    message: string,
    options?: { action?: ToastNotification["action"]; durationMs?: number },
  ) => void
  showToast: (input: ShowToastInput) => void
  dismiss: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string, options?: { action?: ToastNotification["action"]; durationMs?: number }) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const DEFAULT_DURATION: Record<NotifType, number> = {
  success: 3500,
  info: 3800,
  warning: 4500,
  error: 7000,
}

const SESSION_EXPIRED_KEY = "cuisenio:session-expired"

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastNotification & { timer: number })[]>([])
  const timerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const reduceMotion = useReducedMotion()

  const dismiss = useCallback((id: string) => {
    clearTimeout(timerRef.current[id])
    delete timerRef.current[id]
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback((
    type: NotifType,
    title: string,
    message: string,
    options?: { action?: ToastNotification["action"]; durationMs?: number },
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const durationMs = options?.durationMs ?? DEFAULT_DURATION[type]
    const notif: ToastNotification = { id, type, title, message, action: options?.action }

    setToasts((prev) => [...prev.slice(-4), { ...notif, timer: durationMs }])

    timerRef.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      delete timerRef.current[id]
    }, durationMs)
  }, [])

  const showToast = useCallback(
    ({ type, title, message = "", durationMs, action }: ShowToastInput) => {
      notify(type, title, message, { durationMs, action })
    },
    [notify],
  )

  const success = useCallback((title: string, message = "") => notify("success", title, message), [notify])
  const error = useCallback(
    (title: string, message = "", options?: { action?: ToastNotification["action"]; durationMs?: number }) =>
      notify("error", title, message, options),
    [notify],
  )
  const warning = useCallback((title: string, message = "") => notify("warning", title, message), [notify])
  const info = useCallback((title: string, message = "") => notify("info", title, message), [notify])

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_EXPIRED_KEY) === "1") {
        sessionStorage.removeItem(SESSION_EXPIRED_KEY)
        notify("warning", "Session expirée", "Veuillez vous reconnecter.")
      }
    } catch {
      /* ignore storage errors */
    }
  }, [notify])

  const enterTransition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.72 }

  return (
    <NotificationContext.Provider value={{ notify, showToast, dismiss, success, error, warning, info }}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-[100] flex flex-col items-center gap-2 px-4 md:inset-x-auto md:right-4 md:items-end md:px-0"
        aria-live="polite"
        aria-relevant="additions text"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout={!reduceMotion}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{
                opacity: enterTransition,
                y: enterTransition,
                scale: enterTransition,
                layout: enterTransition,
              }}
              className="pointer-events-auto w-full max-w-sm md:w-[22rem]"
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
  success: <CheckCircle className="h-[18px] w-[18px] shrink-0 text-primary" aria-hidden />,
  error: <AlertCircle className="h-[18px] w-[18px] shrink-0 text-destructive" aria-hidden />,
  info: <Info className="h-[18px] w-[18px] shrink-0 text-muted-foreground" aria-hidden />,
  warning: <AlertTriangle className="h-[18px] w-[18px] shrink-0 text-foreground" aria-hidden />,
}

const ACCENT: Record<NotifType, string> = {
  success: "border-l-primary",
  error: "border-l-destructive",
  info: "border-l-border",
  warning: "border-l-foreground/50",
}

function ToastItem({
  notif,
  onDismiss,
}: {
  notif: ToastNotification
  onDismiss: (id: string) => void
  exitMs?: number
}) {
  return (
    <div
      role={notif.type === "error" || notif.type === "warning" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-2xl border border-border border-l-[3px] bg-card/95 px-3.5 py-3 shadow-card-theme backdrop-blur-md ${ACCENT[notif.type]}`}
    >
      {ICONS[notif.type]}
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[13px] leading-tight font-semibold tracking-tight text-foreground">{notif.title}</p>
        {notif.message && (
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{notif.message}</p>
        )}
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
        className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
