import { apiClient } from "./unified-client"
import { routes } from "./routes"
import type {
  AdminOverviewMetrics,
  UserArchivePayload,
  UserCountResponse,
  UserDTO,
  UserStatus,
} from "../types/user.types"
import type { PageResponse } from "../types/error-response"

export const userService = {
  listUser: async (): Promise<PageResponse<UserDTO>> => {
    return apiClient.get<PageResponse<UserDTO>>(routes.users.base)
  },

  getCount: async (): Promise<UserCountResponse> => {
    return apiClient.get<UserCountResponse>(routes.users.count)
  },

  getOverviewMetrics: async (): Promise<AdminOverviewMetrics> => {
    return apiClient.get<AdminOverviewMetrics>(routes.users.overview)
  },

  updateStatus: async (userId: number, status: UserStatus): Promise<UserDTO> => {
    return apiClient.patch<UserDTO, { status: UserStatus }>(routes.users.status(userId), { status })
  },

  getUserArchive: async (userId: number): Promise<UserArchivePayload> => {
    return apiClient.get<UserArchivePayload>(routes.users.archive(userId))
  },

  blockUser: async (userId: number): Promise<void> => {
    await apiClient.put<void>(routes.users.block(userId))
  },

  unblockUser: async (userId: number): Promise<void> => {
    await apiClient.put<void>(routes.users.unblock(userId))
  },

  delete: async (userId: number): Promise<void> => {
    await apiClient.delete<void>(routes.users.detail(userId))
  },
}
