import type { LucideIcon } from "lucide-react"

export type AdminSection =
  | "overview"
  | "users"
  | "newsletter"
  | "recipes"
  | "chefs"
  | "queue"
  | "settings"

export type AdminNavItem = {
  id: AdminSection
  label: string
  icon: LucideIcon
  hint?: string
}

/** Display labels for Spring-style authorities */
export function roleAuthorityLabel(role: string | undefined | null): "ROLE_USER" | "ROLE_ADMIN" {
  const r = (role ?? "").toUpperCase()
  if (r === "ADMIN" || r === "ROLE_ADMIN") return "ROLE_ADMIN"
  return "ROLE_USER"
}
