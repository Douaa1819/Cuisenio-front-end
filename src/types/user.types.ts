export type UserStatus = "active" | "suspended" | "archived"

export interface UserDTO {
  id: number
  username: string
  lastName: string
  email: string
  registrationDate: string
  role?: string
  status: UserStatus
  isblocked?: boolean
  isShadowBanned?: boolean
  badge?: "Beginner" | "Chef" | "Verified"
}

export interface UserCountResponse {
  count: number
}

export interface AdminOverviewMetrics {
  totalUsers: number
  activeRecipes: number
  engagementRate: number
  likes: number
  comments: number
}

export interface UserActivityLog {
  id: number
  type: "LOGIN" | "RECIPE_CREATED" | "COMMENT_POSTED" | "STATUS_CHANGED" | "USER_ARCHIVED"
  description: string
  createdAt: string
}

export interface UserArchivePayload {
  user: UserDTO
  posts: Array<{
    id: number
    title: string
    createdAt: string
    totalComments: number
    totalRatings: number
  }>
  activityLogs: UserActivityLog[]
}