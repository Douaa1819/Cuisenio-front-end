import axios from "axios"
import { env } from "../lib/env"

/**
 * Single Axios instance used by every service.
 *
 * Security notes:
 *  - baseURL comes from an env variable — never hardcoded.
 *  - The JWT token is read from sessionStorage on every request so that
 *    a logout (which clears sessionStorage) is immediately effective.
 *  - On 401 the store is notified via a custom event to avoid a circular
 *    import (client → store → authService → client).
 */
const client = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 12_000,
  headers: {
    "Content-Type": "application/json",
  },
  // Prevent sending cookies cross-origin unless explicitly needed
  withCredentials: false,
})

// ── Request interceptor: attach Bearer token ───────────────────────────────────
client.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor: handle 401 without circular import ──────────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = String(error.config?.url ?? "")

    if (status === 401) {
      if (url.includes("/v1/auth/login") || url.includes("/v1/auth/register")) {
        return Promise.reject(error)
      }
      window.dispatchEvent(new CustomEvent("auth:unauthorized"))
    }

    if (status === 403) {
      const detail =
        error.response?.data?.detail ??
        error.response?.data?.message ??
        "Accès refusé — fonctionnalité Premium."
      window.dispatchEvent(
        new CustomEvent("auth:forbidden", {
          detail: { message: detail, url, upgradeHint: Boolean(error.response?.data?.upgradeHint) },
        }),
      )
    }

    return Promise.reject(error)
  },
)

export default client
