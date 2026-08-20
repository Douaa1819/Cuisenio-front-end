import { AnimatePresence, motion } from "framer-motion"
import { Award } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useAchievementsStore } from "../../store/achievements.store"
import { Button } from "../ui/button"

export function AchievementToast() {
  const { t } = useTranslation()
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
          className="fixed inset-x-4 bottom-20 z-50 mx-auto flex max-w-sm items-start gap-3 rounded-2xl border border-primary/25 bg-card p-3 shadow-lg md:bottom-6 md:end-4 md:start-auto dark:bg-slate-900"
          role="status"
          aria-live="polite"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Award className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-sans text-sm font-semibold text-foreground">{t("home.achievementUnlocked")}</p>
            <p className="font-sans text-sm text-foreground">{t(`home.achievement.${toast.id}.title`)}</p>
            <p className="font-sans text-xs text-muted-foreground">{t(`home.achievement.${toast.id}.description`)}</p>
          </div>
          <Button type="button" size="sm" variant="ghost" onClick={dismiss} aria-label={t("common.close")}>
            OK
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
