/**
 * Production roles for Cuisenio.
 * Backend returns USER | PREMIUM | ADMIN.
 * USER/PREMIUM map to the Chef product surface; PREMIUM unlocks gated APIs.
 */
export enum Role {
  CHEF = "CHEF",
  PREMIUM = "PREMIUM",
  ADMIN = "ADMIN",
  /** @deprecated Legacy API value — normalize via normalizeRole() */
  USER = "USER",
}

export type SubscriptionTier = "FREE" | "PRO"

export function normalizeRole(role: string | Role | undefined | null): Role {
  if (role === Role.ADMIN || role === "ADMIN") return Role.ADMIN
  if (role === Role.PREMIUM || role === "PREMIUM") return Role.PREMIUM
  // Legacy USER accounts are Chefs in the product model
  return Role.CHEF
}

export function isPremiumUser(role: Role | string | undefined | null, tier?: SubscriptionTier | null): boolean {
  const r = normalizeRole(role)
  return r === Role.PREMIUM || r === Role.ADMIN || tier === "PRO"
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
  subscriptionTier?: SubscriptionTier
  isShadowBanned?: boolean
}
