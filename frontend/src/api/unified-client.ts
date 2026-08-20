import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { env } from "../lib/env"
import { ApiClientError, type ApiEnvelope, type ApiError, type ApiSuccess } from "./contracts"

const http: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 12_000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
})

http.interceptors.request.use(
  (config) => {
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      const headers = config.headers
      if (headers && typeof headers.delete === "function") {
        headers.delete("Content-Type")
      } else if (headers) {
        delete headers["Content-Type"]
        delete headers["content-type"]
      }
    }
    const token = sessionStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const url = String(error?.config?.url ?? "")
      if (!url.includes("/v1/auth/login") && !url.includes("/v1/auth/register")) {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"))
      }
    }
    return Promise.reject(normalizeError(error))
  },
)

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504])

const isApiSuccess = <T>(value: unknown): value is ApiSuccess<T> => {
  if (!value || typeof value !== "object") return false
  return (value as { success?: unknown }).success === true && "data" in (value as object)
}

const isApiError = (value: unknown): value is ApiError => {
  if (!value || typeof value !== "object") return false
  const candidate = value as { success?: unknown; error?: unknown }
  return candidate.success === false && !!candidate.error
}

const normalizeError = (error: unknown): ApiClientError => {
  if (error instanceof ApiClientError) {
    return error
  }

  const axiosError = error as AxiosError<ApiEnvelope<never>>
  const status = axiosError.response?.status
  const payload = axiosError.response?.data
  const requestId = axiosError.response?.headers?.["x-request-id"] as string | undefined

  if (payload && isApiError(payload)) {
    return new ApiClientError({
      code: payload.error.code || "API_ERROR",
      message: payload.error.message || "An API error occurred.",
      status,
      details: payload.error.details,
      requestId: payload.meta?.requestId ?? requestId,
      isRetryable: status ? RETRYABLE_STATUS.has(status) : false,
    })
  }

  if (axiosError.response) {
    return new ApiClientError({
      code: `HTTP_${axiosError.response.status}`,
      message: axiosError.message || "Request failed.",
      status: axiosError.response.status,
      details: axiosError.response.data,
      requestId,
      isRetryable: RETRYABLE_STATUS.has(axiosError.response.status),
    })
  }

  return new ApiClientError({
    code: "NETWORK_ERROR",
    message: axiosError.message || "Network error. Please retry.",
    details: axiosError.toJSON?.() ?? undefined,
    requestId,
    isRetryable: true,
  })
}

const unwrapData = <T>(response: AxiosResponse<T | ApiEnvelope<T>>): T => {
  const payload = response.data
  if (isApiSuccess<T>(payload)) {
    return payload.data
  }

  if (isApiError(payload)) {
    throw new ApiClientError({
      code: payload.error.code || "API_ERROR",
      message: payload.error.message || "An API error occurred.",
      status: response.status,
      details: payload.error.details,
      requestId: payload.meta?.requestId,
      isRetryable: RETRYABLE_STATUS.has(response.status),
    })
  }

  // Backward-compatible fallback for endpoints that do not yet return envelopes.
  return payload as T
}

export const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await http.get<T | ApiEnvelope<T>>(url, config)
    return unwrapData(response)
  },

  async post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const response = await http.post<T | ApiEnvelope<T>>(url, body, config)
    return unwrapData(response)
  },

  async put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const response = await http.put<T | ApiEnvelope<T>>(url, body, config)
    return unwrapData(response)
  },

  async patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const response = await http.patch<T | ApiEnvelope<T>>(url, body, config)
    return unwrapData(response)
  },

  async delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await http.delete<T | ApiEnvelope<T>>(url, config)
    return unwrapData(response)
  },
}

export { normalizeError }
