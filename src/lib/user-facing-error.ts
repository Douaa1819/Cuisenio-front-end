import axios from "axios"

/**
 * Maps technical failures (Axios, HTTP, Google, JWT) to short French copy.
 * Raw payloads stay in the console only.
 */

const TECHNICAL_PATTERN =
  /axioserror|err_bad_request|err_network|err_canceled|econnaborted|internal server error|status code|java\.|exception|stack trace|jwt|unauthorized|forbidden|bad credentials|token expired|sql|hibernate|at com\.|etag|http_?\d{3}/i

export type UserFacingToast = {
  title: string
  message: string
}

export function isTechnicalMessage(value: unknown): boolean {
  if (typeof value !== "string") return true
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 160) return true
  return TECHNICAL_PATTERN.test(trimmed)
}

function logTechnical(scope: string, err: unknown) {
  console.error(`[cuisenio/${scope}]`, err)
}

export function toUserFacingMessage(err: unknown, fallback: string): string {
  logTechnical("error", err)

  if (axios.isAxiosError(err)) {
    if (!err.response) {
      if (err.code === "ECONNABORTED") {
        return "Le serveur met trop de temps à répondre. Réessayez."
      }
      return "Impossible de joindre le serveur. Vérifiez votre connexion."
    }
    const status = err.response.status
    if (status === 400) return "Vérifiez les informations saisies."
    if (status === 401) return fallback
    if (status === 403) return "Vous n'avez pas l'autorisation d'effectuer cette action."
    if (status === 404) return "Élément introuvable."
    if (status === 409) return "Cette action entre en conflit avec une donnée existante."
    if (status === 422) return fallback
    if (status === 429) return "Trop de tentatives. Réessayez dans un instant."
    if (status >= 500) return "Une erreur est survenue. Réessayez plus tard."
  }

  return fallback
}

export function mapAuthError(err: unknown, context: "login" | "register" | "password"): string {
  logTechnical(`auth/${context}`, err)

  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return toUserFacingMessage(err, "Erreur réseau. Réessayez dans un instant.")
    }
    const status = err.response.status
    if (context === "login" && status === 401) {
      return "Email ou mot de passe incorrect."
    }
    if (context === "register" && (status === 409 || status === 400)) {
      return "Un compte existe déjà avec cet email, ou les informations sont invalides."
    }
    if (context === "password" && status === 400) {
      return "Impossible de réinitialiser le mot de passe. Le lien est peut-être expiré."
    }
  }

  return toUserFacingMessage(err, "Une erreur est survenue. Veuillez réessayer.")
}

export type GoogleAuthIssue = "config" | "cancelled" | "failed"

export function googleAuthToast(kind: GoogleAuthIssue): UserFacingToast {
  if (kind === "config") {
    return {
      title: "Google indisponible",
      message: "La connexion avec Google n'est pas configurée.",
    }
  }
  if (kind === "cancelled") {
    return {
      title: "Connexion annulée",
      message: "Vous avez annulé la connexion avec Google.",
    }
  }
  return {
    title: "Connexion impossible",
    message: "Impossible de vous connecter avec Google. Veuillez réessayer.",
  }
}

export function mapGoogleBackendError(err: unknown): UserFacingToast {
  logTechnical("auth/google", err)
  if (axios.isAxiosError(err) && !err.response) {
    return {
      title: "Connexion impossible",
      message: "Impossible de joindre le serveur. Réessayez dans un instant.",
    }
  }
  return {
    title: "Connexion impossible",
    message: "Une erreur est survenue pendant la connexion.",
  }
}
