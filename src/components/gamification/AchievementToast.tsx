import { AnimatePresence, motion } from "framer-motion"
import { Award } from "lucide-react"
import { useAchievementsStore } from "../../store/achievements.store"
import { Button } from "../ui/button"

export function AchievementToast() {
  const toast = useAchievementsStore((s) => s.toastQueue[0])
  const dismiss = useAchievementsStore((s) => s.dismissToast)

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="fixed right-4 bottom-20 left-4 z-50 mx-auto flex max-w-sm items-start gap-3 rounded-2xl border border-primary/25 bg-card p-3 shadow-lg md:bottom-6 dark:bg-slate-900"
          role="status"
          aria-live="polite"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Award className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-sans text-sm font-semibold text-foreground">Succès débloqué</p>
            <p className="font-sans text-sm text-foreground">{toast.title}</p>
            <p className="font-sans text-xs text-muted-foreground">{toast.description}</p>
          </div>
          <Button type="button" size="sm" variant="ghost" onClick={dismiss} aria-label="Fermer">
            OK
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
