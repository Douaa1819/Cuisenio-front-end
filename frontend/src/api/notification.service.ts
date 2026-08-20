import { apiClient } from "./unified-client"
import { routes } from "./routes"

export type NotificationType = "LIKE" | "COMMENT" | "RECIPE_APPROVED" | "SYSTEM"

export interface AppNotification {
  id: number
  type: NotificationType
  message: string
  targetUrl: string | null
  read: boolean
  createdAt: string
  actor: { id: number; username: string; lastName: string } | null
}

export interface UnreadCount {
  count: number
}

export const notificationService = {
  list: async (): Promise<AppNotification[]> => {
    return apiClient.get<AppNotification[]>(routes.notifications.base)
  },

  unreadCount: async (): Promise<UnreadCount> => {
    return apiClient.get<UnreadCount>(routes.notifications.unreadCount)
  },

  markRead: async (id: number): Promise<void> => {
    await apiClient.patch<void>(routes.notifications.read(id))
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.patch<void>(routes.notifications.readAll)
  },
}
