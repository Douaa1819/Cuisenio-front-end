import { useEffect, useRef, useState } from "react"
import { env } from "../../lib/env"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void
          renderButton: (parent: HTMLElement, config: Record<string, unknown>) => void
          prompt: () => void
        }
      }
    }
  }
}

type GoogleButtonProps = {
  onCredential: (idToken: string) => void | Promise<void>
  label?: string
  disabled?: boolean
}

/**
 * Renders Google Identity Services button when VITE_GOOGLE_CLIENT_ID is configured.
 */
export function GoogleContinueButton({ onCredential, disabled }: GoogleButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!env.googleClientId || disabled) return

    const handleCredential = async (response: { credential?: string }) => {
      if (!response.credential) return
      await onCredential(response.credential)
    }

    const init = () => {
      if (!window.google?.accounts?.id || !hostRef.current) return
      window.google.accounts.id.initialize({
        client_id: env.googleClientId,
        callback: handleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      hostRef.current.innerHTML = ""
      window.google.accounts.id.renderButton(hostRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: 320,
        locale: "fr",
      })
      setReady(true)
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-google-gsi="1"]')
    if (existing) {
      if (window.google?.accounts?.id) init()
      else existing.addEventListener("load", init)
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.dataset.googleGsi = "1"
    script.onload = init
    script.onerror = () => setError("Impossible de charger Google Sign-In.")
    document.head.appendChild(script)
  }, [onCredential, disabled])

  if (!env.googleClientId) {
    return null
  }

  return (
    <div className="w-full space-y-2">
      <div ref={hostRef} className="flex min-h-10 justify-center opacity-100" aria-busy={!ready} />
      {error && <p className="text-center text-xs text-destructive">{error}</p>}
    </div>
  )
}
