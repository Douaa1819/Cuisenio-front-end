import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"
import { Carrot, ChefHat, Leaf, Soup, Wheat } from "lucide-react"
import { useTranslation } from "react-i18next"

/**
 * Organic kitchen hero: floating recipe card + stylized ingredients.
 * Framer Motion parallax tilt (no cyberpunk / neon abstraction).
 */
export function Hero3DScene() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 100, damping: 18 })
  const sy = useSpring(my, { stiffness: 100, damping: 18 })

  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12])
  const layerFarX = useTransform(sx, [-0.5, 0.5], [-10, 10])
  const layerNearX = useTransform(sx, [-0.5, 0.5], [-22, 22])
  const layerNearY = useTransform(sy, [-0.5, 0.5], [-14, 14])

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="relative mx-auto aspect-[5/6] w-full max-w-md perspective-[1400px]"
      aria-hidden
    >
      {/* Soft organic counter surface */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full overflow-hidden rounded-[2rem] border border-border shadow-card-theme"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, color-mix(in srgb, var(--cu-paper) 100%, transparent) 0%, color-mix(in srgb, var(--cu-secondary) 70%, var(--cu-bg)) 55%, color-mix(in srgb, var(--cu-accent) 12%, var(--cu-bg)) 100%)",
          }}
        />
        {/* soft wood grain suggestion */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(95deg, transparent, transparent 12px, rgba(80,60,40,0.35) 12px, rgba(80,60,40,0.35) 13px)",
          }}
        />

        {/* Far layer: leaves */}
        <motion.div style={{ x: layerFarX, transform: "translateZ(24px)" }} className="absolute inset-0">
          <Wheat className="absolute end-10 top-16 h-7 w-7 text-primary/45" />
          <Leaf className="absolute start-8 top-10 h-8 w-8 text-primary/50" />
        </motion.div>

        {/* Recipe card */}
        <motion.div
          style={{ x: layerNearX, y: layerNearY, transform: "translateZ(64px)" }}
          className="absolute inset-x-8 top-16 rounded-[1.35rem] border border-border bg-card/95 p-5 shadow-card-theme backdrop-blur"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-gradient text-primary-foreground">
              <ChefHat className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold leading-tight text-foreground">
                {t("hero.sceneTitle")}
              </p>
              <p className="text-xs text-muted-foreground">{t("hero.sceneSubtitle")}</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="h-2.5 w-[88%] rounded-full bg-muted" />
            <div className="h-2.5 w-[64%] rounded-full bg-muted" />
            <div className="h-2.5 w-[74%] rounded-full bg-primary/25" />
          </div>
          <p className="mt-4 rounded-xl bg-secondary/80 px-3 py-2 text-xs font-medium text-foreground">
            {t("hero.sceneTip")}
          </p>
        </motion.div>

        {/* Near ingredients */}
        <motion.div
          style={{ x: layerNearX, y: layerNearY, transform: "translateZ(96px)" }}
          className="absolute bottom-10 start-8 end-8"
        >
          <div className="flex items-end justify-between gap-3">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-primary-gradient text-primary-foreground shadow-lg"
            >
              <Carrot className="h-7 w-7" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.8, delay: 0.35, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-[1.4rem] border border-border bg-card text-primary shadow-card-theme"
            >
              <Soup className="h-8 w-8" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.1, delay: 0.55, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary"
            >
              <Leaf className="h-6 w-6" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Hero3DScene
