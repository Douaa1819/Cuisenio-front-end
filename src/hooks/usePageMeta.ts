import { useEffect } from "react"

interface PageMetaOptions {
  title: string
  description?: string
  path?: string
  image?: string
  type?: "website" | "article"
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const APP_URL = import.meta.env.VITE_APP_URL ?? "https://cuisenio.app"
const DEFAULT_DESCRIPTION =
  "Cuisenio est la plateforme culinaire pour découvrir, partager et planifier vos recettes préférées."

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement("link")
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Sets document title + Open Graph / Twitter meta for the current route.
 * For portfolio SPAs without SSR this still helps share previews and accessibility.
 */
export function usePageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = `${APP_URL}/pwa-512.png`,
  type = "website",
  jsonLd,
}: PageMetaOptions) {
  useEffect(() => {
    const fullTitle = title.includes("Cuisenio") ? title : `${title} · Cuisenio`
    document.title = fullTitle

    upsertMeta("name", "description", description)
    upsertMeta("property", "og:title", fullTitle)
    upsertMeta("property", "og:description", description)
    upsertMeta("property", "og:type", type)
    upsertMeta("property", "og:url", `${APP_URL}${path}`)
    upsertMeta("property", "og:image", image)
    upsertMeta("name", "twitter:card", "summary_large_image")
    upsertMeta("name", "twitter:title", fullTitle)
    upsertMeta("name", "twitter:description", description)
    upsertMeta("name", "twitter:image", image)
    upsertLink("canonical", `${APP_URL}${path}`)

    const scriptId = "cuisenio-jsonld"
    const existing = document.getElementById(scriptId)
    if (existing) existing.remove()

    if (jsonLd) {
      const script = document.createElement("script")
      script.id = scriptId
      script.type = "application/ld+json"
      script.text = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      document.getElementById(scriptId)?.remove()
    }
    // jsonLd serialized to avoid referential infinite loops
  }, [title, description, path, image, type, JSON.stringify(jsonLd ?? null)]) // eslint-disable-line react-hooks/exhaustive-deps
}
