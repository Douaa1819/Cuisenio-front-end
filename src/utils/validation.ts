/**
 * Centralized, secure validation patterns.
 *
 * Rules:
 *  - All regex are anchored (^ … $) to prevent partial-match bypass.
 *  - No ReDoS-prone nested quantifiers.
 *  - Lengths are capped to prevent excessive input.
 *  - All Zod schemas reference these constants — never inline magic values.
 */

import { z } from "zod"

// ── Raw regex constants ────────────────────────────────────────────────────────

/** Only letters (any language, incl. Arabic), digits, hyphens and underscores. */
export const USERNAME_REGEX = /^[\p{L}0-9_-]{3,30}$/u

/** Letters and spaces (names can contain hyphens and apostrophes). */
export const NAME_REGEX = /^[\p{L}\s'-]{2,50}$/u

/**
 * Strong password:
 *  - 8–72 chars (72 = bcrypt max)
 *  - At least one uppercase letter
 *  - At least one lowercase letter
 *  - At least one digit
 *  - At least one special character
 */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,72}$/

/** Standard email — deliberately simple to avoid ReDoS. Max 254 chars (RFC 5321). */
export const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/

/** Recipe / ingredient / category title: letters, digits, spaces, hyphens, apostrophes. */
export const TITLE_REGEX = /^[a-zA-ZÀ-ÿ0-9\s\-']{1,120}$/

/** Plain text content (comments, descriptions, notes): printable chars, max 2000. */
export const TEXT_CONTENT_REGEX = /^[\s\S]{1,2000}$/

/** Quantity: digits and one optional decimal separator. */
export const QUANTITY_REGEX = /^\d{1,6}([.,]\d{1,3})?$/

/** Unit: short string like "g", "ml", "tsp", "c. à soupe". */
export const UNIT_REGEX = /^[a-zA-ZÀ-ÿ.\s]{1,20}$/

// ── Reusable Zod schemas ───────────────────────────────────────────────────────

export const usernameSchema = z
  .string()
  .min(3, "Le prénom doit contenir au moins 3 caractères")
  .max(30, "Le prénom ne peut pas dépasser 30 caractères")
  .regex(USERNAME_REGEX, "Le prénom ne peut contenir que des lettres, chiffres, - et _")

export const nameSchema = z
  .string()
  .min(2, "Le nom doit contenir au moins 2 caractères")
  .max(50, "Le nom ne peut pas dépasser 50 caractères")
  .regex(NAME_REGEX, "Le nom ne peut contenir que des lettres, espaces, - et '")

export const emailSchema = z
  .string()
  .max(254, "L'email est trop long")
  .email("Veuillez entrer une adresse email valide")
  .regex(EMAIL_REGEX, "Format d'email invalide")

export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(72, "Le mot de passe ne peut pas dépasser 72 caractères")
  .regex(
    PASSWORD_REGEX,
    "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
  )

export const commentContentSchema = z
  .string()
  .min(1, "Le commentaire ne peut pas être vide")
  .max(2000, "Le commentaire ne peut pas dépasser 2000 caractères")
  .regex(TEXT_CONTENT_REGEX, "Contenu invalide")

// ── File upload validation ─────────────────────────────────────────────────────

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "Format non supporté. Utilisez JPEG, PNG, WebP ou GIF."
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "L'image ne doit pas dépasser 5 Mo."
  }
  return null
}
