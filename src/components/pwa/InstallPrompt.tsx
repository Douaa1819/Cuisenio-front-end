import { useEffect, useState } from "react"
import { Download, X } from "lucide-react"
import { Button } from "../ui/button"

/**
 * Lightweight install hint — does NOT call beforeinstallprompt.preventDefault().
 * Intercepting the event without promptly calling prompt() triggers Chromium's
 * "Banner not shown" warning and can feel like the app is hanging.
 *
 * Users can still install via the browser UI (⋮ → Install Cuisenio).
 * This chip only appears as an optional reminder when the app is installable
 * (standalone display mode not active) and the user hasn't dismissed it.
 */
export function InstallPrompt() {
  const [visible, setVisible] = useState(false)
  const [dismissed] = useState(() => localStorage.getItem("cuisenio-pwa-dismissed") === "1")

  useEffect(() => {
    if (dismissed) return
    if (import.meta.env.DEV) return // skip noise during Vite HMR

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)

    if (standalone) return

    // Soft delayed tip — never blocks the event queue / first paint
    const id = window.setTimeout(() => setVisible(true), 4000)
    return () => window.clearTimeout(id)
  }, [dismissed])

  if (!visible || dismissed) return null

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur sm:bottom-6 sm:left-auto md:bottom-6"
      role="status"
      aria-label="Installer Cuisenio"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Download className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">Installer Cuisenio</p>
        <p className="text-xs text-muted-foreground">
          Menu navigateur → « Installer l&apos;application »
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          localStorage.setItem("cuisenio-pwa-dismissed", "1")
          setVisible(false)
        }}
      >
        OK
      </Button>
      <button
        type="button"
        className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
        aria-label="Fermer"
        onClick={() => {
          localStorage.setItem("cuisenio-pwa-dismissed", "1")
          setVisible(false)
        }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
