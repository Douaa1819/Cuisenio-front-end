import client from "./client"
import { apiClient } from "./unified-client"
import { routes } from "./routes"

export interface NewsletterSubscribeResponse {
  message: string
  alreadySubscribed: boolean
}

export interface NewsletterSubscriberAdmin {
  id: number
  email: string
  subscribedAt: string
  active: boolean
  consentGiven: boolean
  origin?: string
}

export const newsletterService = {
  async subscribe(email: string, consent: boolean): Promise<NewsletterSubscribeResponse> {
    const { data } = await client.post<NewsletterSubscribeResponse>(routes.newsletter.subscribe, {
      email,
      consent,
    })
    return data
  },

  async listSubscribers(): Promise<NewsletterSubscriberAdmin[]> {
    return apiClient.get<NewsletterSubscriberAdmin[]>(routes.newsletter.adminList)
  },

  async adminUnsubscribe(id: number): Promise<void> {
    await apiClient.post<void>(routes.newsletter.adminUnsubscribe(id))
  },

  async adminDelete(id: number): Promise<void> {
    await apiClient.delete<void>(routes.newsletter.adminDetail(id))
  },
}
