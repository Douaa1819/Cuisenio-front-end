import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"
import { ChefHat, Leaf, Mic, ShoppingCart } from "lucide-react"
import { useTranslation } from "react-i18next"

/**
 * Lightweight 3D hero mock with Framer Motion parallax tilt.
 * Lazy-loaded so the marketing shell stays Lighthouse-friendly without Three.js.
 */
export function HeroScene() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 120, damping: 18 })
  const springY = useSpring(my, { stiffness: 120, damping: 18 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14])

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto aspect-[4/5] w-full max-w-md perspective-[1200px]"
      aria-hidden
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full rounded-[1.75rem] border border-border glass-panel shadow-card-theme"
      >
        <div
          className="absolute inset-0 rounded-[1.75rem] opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 20%, color-mix(in srgb, var(--cu-primary) 35%, transparent), transparent 55%), linear-gradient(160deg, color-mix(in srgb, var(--cu-primary) 18%, transparent), transparent 60%)",
          }}
        />

        <div
          className="absolute inset-x-6 top-8 rounded-2xl border border-border bg-card/90 p-4 shadow-card-theme"
          style={{ transform: "translateZ(48px)" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-gradient text-primary-foreground">
              <ChefHat className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t("hero.sceneTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("hero.sceneSubtitle")}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-[80%] rounded-full bg-muted" />
            <div className="h-2 w-[60%] rounded-full bg-muted" />
            <div className="h-2 w-[66%] rounded-full bg-primary/25" />
          </div>
        </div>

        <div
          className="absolute bottom-10 start-6 end-6 rounded-2xl border border-border bg-card/85 p-4 backdrop-blur"
          style={{ transform: "translateZ(72px)" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Mic className="h-4 w-4 text-primary" />
              <span>{t("hero.sceneVoice")}</span>
            </div>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
              <Leaf className="h-3 w-3 text-primary" />
              {t("hero.sceneChip")}
            </span>
          </div>
        </div>

        <motion.div
          className="absolute -end-3 top-1/3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-primary-foreground shadow-lg"
          style={{ transform: "translateZ(96px)" }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChefHat className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroScene
