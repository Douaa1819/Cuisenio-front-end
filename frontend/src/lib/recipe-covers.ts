/**
 * Default category covers + responsive srcset helpers.
 * Uses curated Unsplash food photos (royalty-free) as WebP-friendly CDN URLs.
 */

import { env } from "./env"

export type CoverCategory =
  | "desserts"
  | "plats"
  | "entrees"
  | "soupes"
  | "salades"
  | "boissons"
  | "default"

const UNSPLASH = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75&fm=webp`

const COVERS: Record<CoverCategory, string> = {
  desserts: "photo-1488477181946-6428a0291777",
  plats: "photo-1546069901-ba9599a7e63c",
  entrees: "photo-1512621776951-a57141f2eefd",
  soupes: "photo-1547592166-23ac45744acd",
  salades: "photo-1512621776951-a57141f2eefd",
  boissons: "photo-1544145945-f90425340c7e",
  default: "photo-1495521821757-a1efb672935e",
}

const CATEGORY_ALIASES: Record<string, CoverCategory> = {
  dessert: "desserts",
  desserts: "desserts",
  "plats principaux": "plats",
  plat: "plats",
  plats: "plats",
  main: "plats",
  entrée: "entrees",
  entrees: "entrees",
  entrées: "entrees",
  soupe: "soupes",
  soupes: "soupes",
  salade: "salades",
  salades: "salades",
  boisson: "boissons",
  boissons: "boissons",
  apéritifs: "entrees",
  aperitifs: "entrees",
}

export function categoryKeyFromName(name?: string | null): CoverCategory {
  if (!name) return "default"
  const key = name.trim().toLowerCase()
  return CATEGORY_ALIASES[key] ?? "default"
}

export function defaultCoverForCategory(category?: string | null): string {
  const key = categoryKeyFromName(category)
  return UNSPLASH(COVERS[key], 800)
}

export function resolveRecipeImage(
  imageUrl?: string | null,
  category?: string | null,
): { src: string; srcSet: string } {
  if (imageUrl && !imageUrl.includes("placeholder")) {
    const src =
      imageUrl.startsWith("http") || imageUrl.startsWith("blob:") || imageUrl.startsWith("data:")
        ? imageUrl
        : `${env.uploadsUrl}/${imageUrl.replace(/^\//, "")}`
    return { src, srcSet: `${src} 800w` }
  }
  const id = COVERS[categoryKeyFromName(category)]
  const src = UNSPLASH(id, 800)
  const srcSet = [400, 800, 1200].map((w) => `${UNSPLASH(id, w)} ${w}w`).join(", ")
  return { src, srcSet }
}

/** Dominant palette color for generated book covers (3D library). */
export function coverColorForCategory(category?: string | null): string {
  const key = categoryKeyFromName(category)
  const map: Record<CoverCategory, string> = {
    desserts: "#C93A3A",
    plats: "#2F7A4D",
    entrees: "#4CAF6D",
    soupes: "#B8874B",
    salades: "#5A9E6F",
    boissons: "#3D6B8C",
    default: "#E8615C",
  }
  return map[key]
}
