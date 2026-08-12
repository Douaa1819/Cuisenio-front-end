import client from "./client"
import { routes } from "./routes"
import type { Role, SubscriptionTier } from "../types/auth.types"

export interface CheckoutSessionResponse {
  sessionId: string
  checkoutUrl: string
}

export interface ConfirmPaymentResponse {
  token: string
  userId: number
  id: number
  email: string
  username: string
  lastName?: string
  profilePicture?: string | null
  role: Role | string
  subscriptionTier: SubscriptionTier
}

export const paymentService = {
  async createCheckoutSession(): Promise<CheckoutSessionResponse> {
    const { data } = await client.post<CheckoutSessionResponse>(routes.payments.createCheckoutSession)
    return data
  },

  async confirmSession(sessionId: string): Promise<ConfirmPaymentResponse> {
    const { data } = await client.post<ConfirmPaymentResponse>(
      `${routes.payments.confirmSession}?session_id=${encodeURIComponent(sessionId)}`,
    )
    return data
  },
}
