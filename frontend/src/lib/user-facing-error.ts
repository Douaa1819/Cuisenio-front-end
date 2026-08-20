import axios from "axios"
import i18n from "../i18n"

/**
 * Maps technical failures (Axios, HTTP, Google, JWT) to short user-facing copy.
 * Raw payloads stay in the console only.
 */

const TECHNICAL_PATTERN =
  /axioserror|err_bad_request|err_network|err_canceled|econnaborted|internal server error|status code|java\.|exception|stack trace|jwt|unauthorized|forbidden|bad credentials|token expired|sql|hibernate|at com\.|etag|http_?\d{3}/i

export type UserFacingToast = {
  title: string
  message: string
}

function tx(key: string): string {
  return i18n.t(key)
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
        return tx("auth.error.timeout")
      }
      return tx("auth.error.network")
    }
    const status = err.response.status
    if (status === 400) return tx("auth.error.checkFields")
    if (status === 401) return fallback
    if (status === 403) return tx("auth.error.forbidden")
    if (status === 404) return tx("auth.error.notFound")
    if (status === 409) return tx("auth.error.conflict")
    if (status === 422) return fallback
    if (status === 429) return tx("auth.error.tooMany")
    if (status >= 500) return tx("auth.error.server")
  }

  return fallback
}

export function mapAuthError(err: unknown, context: "login" | "register" | "password"): string {
  logTechnical(`auth/${context}`, err)

  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return toUserFacingMessage(err, tx("auth.error.generic"))
    }
    const status = err.response.status
    if (context === "login" && status === 401) {
      return tx("auth.error.credentials")
    }
    if (context === "register" && (status === 409 || status === 400)) {
      return tx("auth.error.exists")
    }
    if (context === "password" && status === 400) {
      return tx("auth.error.passwordReset")
    }
  }

  return toUserFacingMessage(err, tx("auth.error.generic"))
}

export type GoogleAuthIssue = "config" | "cancelled" | "failed"

export function googleAuthToast(kind: GoogleAuthIssue): UserFacingToast {
  if (kind === "config") {
    return {
      title: tx("auth.google.config.title"),
      message: tx("auth.google.config.message"),
    }
  }
  if (kind === "cancelled") {
    return {
      title: tx("auth.google.cancelled.title"),
      message: tx("auth.google.cancelled.message"),
    }
  }
  return {
    title: tx("auth.google.failed.title"),
    message: tx("auth.google.failed.message"),
  }
}

export function mapGoogleBackendError(err: unknown): UserFacingToast {
  logTechnical("auth/google", err)
  if (axios.isAxiosError(err) && !err.response) {
    return {
      title: tx("auth.google.failed.title"),
      message: tx("auth.error.network"),
    }
  }
  return {
    title: tx("auth.google.failed.title"),
    message: tx("auth.google.backend.message"),
  }
}
