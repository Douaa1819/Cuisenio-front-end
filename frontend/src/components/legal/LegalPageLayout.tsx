import { Link } from "react-router-dom"
import { ChefHat } from "lucide-react"
import { ThemeAndLanguageBar } from "../layout/ThemeAndLanguageBar"
import { SiteFooter } from "../layout/SiteFooter"
import { usePageMeta } from "../../hooks/usePageMeta"

interface LegalSection {
  heading: string
  paragraphs: string[]
}

interface LegalPageLayoutProps {
  title: string
  description: string
  path: string
  updatedLabel: string
  sections: LegalSection[]
}

export function LegalPageLayout({
  title,
  description,
  path,
  updatedLabel,
  sections,
}: LegalPageLayoutProps) {
  usePageMeta({ title: `${title} | Cuisenio`, description, path })

  return (
    <div className="organic-surface flex min-h-screen flex-col text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-gradient text-primary-foreground">
              <ChefHat className="h-4 w-4" aria-hidden />
            </span>
            <span className="font-serif text-lg tracking-tight">Cuisenio</span>
          </Link>
          <ThemeAndLanguageBar />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-sans text-xs font-medium text-muted-foreground">{updatedLabel}</p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight">{title}</h1>
        <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">{description}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading} aria-labelledby={section.heading.replace(/\s+/g, "-").toLowerCase()}>
              <h2
                id={section.heading.replace(/\s+/g, "-").toLowerCase()}
                className="font-serif text-xl"
              >
                {section.heading}
              </h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)} className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-12 font-sans text-sm">
          <Link to="/" className="font-medium text-primary hover:underline">
            ← Cuisenio
          </Link>
        </p>
      </main>
      <SiteFooter variant="marketing" />
    </div>
  )
}
