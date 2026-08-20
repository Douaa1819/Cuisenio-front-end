import { useEffect, useRef, useState } from "react"
import { Pause, Play, RotateCcw, Timer } from "lucide-react"
import { Button } from "../ui/button"

interface KitchenTimerProps {
  /** Default duration in minutes (from recipe prep/cook). */
  defaultMinutes?: number
  label?: string
}

function format(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function KitchenTimer({ defaultMinutes = 10, label = "Minuteur cuisine" }: KitchenTimerProps) {
  const [total, setTotal] = useState(Math.max(1, defaultMinutes) * 60)
  const [remaining, setRemaining] = useState(Math.max(1, defaultMinutes) * 60)
  const [running, setRunning] = useState(false)
  const endAt = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    endAt.current = Date.now() + remaining * 1000
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil(((endAt.current ?? Date.now()) - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        setRunning(false)
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Cuisenio", { body: "Le minuteur est terminé !", icon: "/pwa-192.png" })
        } else {
          // Soft fallback
          document.title = "Minuteur terminé · Cuisenio"
        }
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  const progress = total > 0 ? ((total - remaining) / total) * 100 : 0

  return (
    <section
      className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-card p-4 dark:from-slate-900 dark:to-slate-950"
      aria-label={label}
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
        <Timer className="h-4 w-4 text-primary" aria-hidden />
        {label}
      </div>

      <p className="mb-3 font-mono text-4xl tabular-nums tracking-tight text-foreground" aria-live="polite">
        {format(remaining)}
      </p>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {[5, 10, 15, 30].map((m) => (
          <button
            key={m}
            type="button"
            className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
            onClick={() => {
              setRunning(false)
              setTotal(m * 60)
              setRemaining(m * 60)
            }}
          >
            {m} min
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          className="flex-1 bg-primary hover:bg-primary/90"
          onClick={() => {
            if ("Notification" in window && Notification.permission === "default") {
              void Notification.requestPermission()
            }
            setRunning((v) => !v)
          }}
          aria-label={running ? "Pause" : "Démarrer"}
        >
          {running ? <Pause className="mr-1.5 h-4 w-4" /> : <Play className="mr-1.5 h-4 w-4" />}
          {running ? "Pause" : "Démarrer"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setRunning(false)
            setRemaining(total)
          }}
          aria-label="Réinitialiser"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
