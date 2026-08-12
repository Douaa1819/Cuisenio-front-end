import type { ReactNode } from "react"
import Nav from "./Nav"
import { BottomNav } from "./BottomNav"
import { SiteFooter } from "./SiteFooter"
import { AchievementToast } from "../gamification/AchievementToast"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="organic-surface flex min-h-screen flex-col text-foreground antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-white"
      >
        Aller au contenu
      </a>
      <Nav />
      <div id="main-content" className="flex-1 pb-20 md:pb-8">
        {children}
      </div>
      <SiteFooter variant="app" />
      <BottomNav />
      <AchievementToast />
    </div>
  )
}
