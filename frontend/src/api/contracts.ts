export type ApiSuccess<T> = {
  success: true
  data: T
  meta?: {
    requestId: string
    timestamp: string
    pagination?: {
      page: number
      size: number
      totalItems: number
      totalPages: number
    }
  }
}

export type ApiError = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  meta?: {
    requestId: string
    timestamp: string
  }
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiError

export interface AppError {
  code: string
  message: string
  status?: number
  details?: unknown
  requestId?: string
  isRetryable: boolean
}

export class ApiClientError extends Error implements AppError {
  code: string
  status?: number
  details?: unknown
  requestId?: string
  isRetryable: boolean

  constructor(params: AppError) {
    super(params.message)
    this.name = "ApiClientError"
    this.code = params.code
    this.status = params.status
    this.details = params.details
    this.requestId = params.requestId
    this.isRetryable = params.isRetryable
  }
}
