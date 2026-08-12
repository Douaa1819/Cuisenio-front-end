import { AxiosError } from "axios"
import type { NavigateFunction } from "react-router-dom"

/**
 * Handles expired / invalid token responses from the API.
 * Clears both token keys used by the application and redirects to login.
 *
 * Note: this helper is kept for components that catch AxiosErrors directly.
 * The global 401 handler in the Axios client covers every other case.
 */
export const tokenExpired = (error: AxiosError, navigate: NavigateFunction): Promise<never> => {
  if (error.response?.status === 401) {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("auth-storage")
    navigate("/login", { replace: true })
  }
  return Promise.reject(error)
}
