/**
 * Production roles for Cuisenio.
 * Backend returns USER | ADMIN (legacy PREMIUM maps to Chef).
 * All authenticated chefs have full free access to product features.
 */
export enum Role {
  CHEF = "CHEF",
  ADMIN = "ADMIN",
  /** @deprecated Legacy API value — normalize via normalizeRole() */
  USER = "USER",
  /** @deprecated Legacy paid role — treated as Chef */
  PREMIUM = "PREMIUM",
}

export function normalizeRole(role: string | Role | undefined | null): Role {
  if (role === Role.ADMIN || role === "ADMIN") return Role.ADMIN
  // USER / PREMIUM / CHEF → Chef product surface
  return Role.CHEF
}

export function homePathForRole(role: Role | string | undefined | null): string {
  return normalizeRole(role) === Role.ADMIN ? "/dashboard" : "/chef"
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  lastName: string
  email: string
  password: string
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UserProfile {
  id?: number
  username: string
  lastName: string
  email: string
  profilePicture?: string
  role?: string
  isShadowBanned?: boolean
}
