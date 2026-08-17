import { useEffect, useRef, useState } from "react"
import { env } from "../../lib/env"
import type { GoogleAuthIssue } from "../../lib/user-facing-error"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void
          renderButton: (parent: HTMLElement, config: Record<string, unknown>) => void
        }
      }
    }
  }
}

type GoogleButtonProps = {
  onCredential: (idToken: string) => void | Promise<void>
  onIssue?: (kind: GoogleAuthIssue) => void
  label?: string
  disabled?: boolean
}

/**
 * Renders Google Identity Services button when VITE_GOOGLE_CLIENT_ID is configured.
 * Failures are reported via onIssue — never via native browser dialogs.
 */
export function GoogleContinueButton({ onCredential, onIssue, disabled }: GoogleButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const onCredentialRef = useRef(onCredential)
  const onIssueRef = useRef(onIssue)
  const [ready, setReady] = useState(false)

  onCredentialRef.current = onCredential
  onIssueRef.current = onIssue

  useEffect(() => {
    if (!env.googleClientId || disabled) return

    const handleCredential = async (response: { credential?: string }) => {
      if (!response.credential) {
        onIssueRef.current?.("cancelled")
        return
      }
      await onCredentialRef.current(response.credential)
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
      existing.onerror = () => onIssueRef.current?.("failed")
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.dataset.googleGsi = "1"
    script.onload = init
    script.onerror = () => onIssueRef.current?.("failed")
    document.head.appendChild(script)
  }, [disabled])

  if (!env.googleClientId) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onIssue?.("config")}
        className="flex min-h-11 w-full items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
      >
        Continuer avec Google
      </button>
    )
  }

  return (
    <div className="w-full">
      <div ref={hostRef} className="flex min-h-10 justify-center" aria-busy={!ready} />
    </div>
  )
}
