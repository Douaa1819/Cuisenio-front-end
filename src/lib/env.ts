/**
 * Centralized environment configuration.
 * All external URLs and feature flags come from here — never hardcoded elsewhere.
 */

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined. Check your .env file.")
}

export const env = {
  apiBaseUrl: API_URL,
  /** Full URL prefix for uploaded media served by the backend */
  uploadsUrl: `${API_URL}/uploads`,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
