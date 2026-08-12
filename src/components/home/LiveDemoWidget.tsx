import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link2, Mic, Sparkles, Volume2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { ButtonWithAnimatedIcon } from "../ui/ButtonWithAnimatedIcon"

export function LiveDemoWidget() {
  const { t } = useTranslation()
  const [link, setLink] = useState("")
  const [imported, setImported] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceLine, setVoiceLine] = useState<string | null>(null)

  const runImport = () => {
    if (!link.trim()) {
      setLink("https://exemple.com/recette-facile-poulet")
    }
    setImported(true)
  }

  const runVoice = () => {
    setListening(true)
    setVoiceLine(null)
    window.setTimeout(() => {
      setListening(false)
      setVoiceLine(t("demo.voiceReply"))
    }, 1500)
  }

  return (
    <div className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-card-theme sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient text-primary-foreground shadow-md">
          <Sparkles className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{t("demo.title")}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("demo.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3 rounded-[1.5rem] border border-border bg-muted/60 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Link2 className="h-4 w-4 text-primary" aria-hidden />
            {t("demo.importLabel")}
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-recipe-url" className="sr-only">
              {t("demo.importLabel")}
            </Label>
            <Input
              id="demo-recipe-url"
              value={link}
              onChange={(e) => {
                setLink(e.target.value)
                setImported(false)
              }}
              placeholder={t("demo.linkPlaceholder")}
              className="rounded-xl border-border bg-card"
            />
          </div>
          <ButtonWithAnimatedIcon
            icon={Sparkles}
            iconMotion="sparkle"
            variant="primary"
            className="w-full"
            onClick={runImport}
          >
            {t("demo.import")}
          </ButtonWithAnimatedIcon>
          <AnimatePresence>
            {imported && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-primary/20 bg-secondary p-4 text-sm"
              >
                <p className="font-semibold text-primary">{t("demo.imported")}</p>
                <p className="mt-1 text-foreground">{t("demo.importedDetail")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-3 rounded-[1.5rem] border border-border bg-muted/60 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Mic className="h-4 w-4 text-primary" aria-hidden />
            {t("demo.voiceLabel")}
          </div>
          <div className="flex min-h-[96px] items-center justify-center rounded-2xl border border-dashed border-border bg-card px-4 text-center text-sm text-muted-foreground">
            {listening ? t("demo.listening") : voiceLine ?? t("demo.voiceHint")}
          </div>
          <ButtonWithAnimatedIcon
            icon={Volume2}
            iconMotion="volume"
            variant="outline"
            className="w-full"
            onClick={runVoice}
            disabled={listening}
          >
            {t("demo.voice")}
          </ButtonWithAnimatedIcon>
        </div>
      </div>
    </div>
  )
}
