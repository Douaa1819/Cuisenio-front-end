import client from "./client"
import { routes } from "./routes"
import type { Role, SubscriptionTier } from "../types/auth.types"

export interface UpgradePremiumResponse {
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

export const subscriptionService = {
  async upgradePremium(): Promise<UpgradePremiumResponse> {
    const { data } = await client.post<UpgradePremiumResponse>(routes.subscription.upgradePremium)
    return data
  },
}
