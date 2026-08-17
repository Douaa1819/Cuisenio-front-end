import { motion, type Variants } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "../../lib/utils"

export type IconMotion =
  | "sparkle"
  | "arrow"
  | "mic"
  | "cart"
  | "wand"
  | "volume"
  | "user"
  | "scan"
  | "bounce"

type SharedProps = {
  children: React.ReactNode
  icon: LucideIcon
  iconMotion?: IconMotion
  iconPosition?: "left" | "right"
  variant?: "primary" | "warm" | "outline" | "ghost"
  size?: "md" | "lg"
  className?: string
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
}

type ButtonWithAnimatedIconProps =
  | (SharedProps & { as?: "button"; type?: "button" | "submit"; to?: never; href?: never })
  | (SharedProps & { as: "link"; to: string; href?: never })
  | (SharedProps & { as: "a"; href: string; to?: never })

const iconVariants: Record<IconMotion, Variants> = {
  sparkle: { rest: { rotate: 0, scale: 1 }, hover: { rotate: 18, scale: 1.12 } },
  arrow: { rest: { x: 0 }, hover: { x: 5 } },
  mic: { rest: { y: 0, rotate: 0 }, hover: { y: [0, -2, 0, 2, 0], rotate: [-4, 4, -3, 3, 0] } },
  cart: { rest: { y: 0 }, hover: { y: [0, -5, 0], transition: { duration: 0.45 } } },
  wand: { rest: { rotate: 0, scale: 1 }, hover: { rotate: [0, -12, 12, 0], scale: 1.08 } },
  volume: {
    rest: { scale: 1 },
    hover: { scale: [1, 1.15, 1], transition: { repeat: Infinity, duration: 0.9 } },
  },
  user: { rest: { y: 0 }, hover: { y: -2 } },
  scan: { rest: { scaleY: 1, opacity: 1 }, hover: { scaleY: [1, 0.85, 1], opacity: [1, 0.7, 1] } },
  bounce: { rest: { y: 0 }, hover: { y: [0, -4, 0] } },
}

const variantClass = {
  primary:
    "border-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  /** @deprecated Alias of primary — terracotta removed from the design system */
  warm:
    "border-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  outline:
    "border border-border bg-card/80 text-foreground shadow-sm backdrop-blur hover:border-primary/35 hover:bg-secondary/80",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-muted",
} as const

const sizeClass = {
  md: "h-11 rounded-xl px-5 text-sm",
  lg: "min-h-12 rounded-xl px-6 text-base",
} as const

function IconSlot({
  Icon,
  motionKey,
  position,
}: {
  Icon: LucideIcon
  motionKey: IconMotion
  position: "left" | "right"
}) {
  return (
    <motion.span
      variants={iconVariants[motionKey]}
      transition={{ type: "spring", stiffness: 320, damping: 16 }}
      className={cn("inline-flex", position === "left" ? "me-2" : "ms-2")}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </motion.span>
  )
}

export function ButtonWithAnimatedIcon(props: ButtonWithAnimatedIconProps) {
  const {
    children,
    icon: Icon,
    iconMotion = "sparkle",
    iconPosition = "left",
    variant = "primary",
    size = "md",
    className,
    isLoading,
    disabled,
    onClick,
  } = props

  const classes = cn(
    "group inline-flex items-center justify-center font-semibold tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55",
    variantClass[variant],
    sizeClass[size],
    className,
  )

  const content = (
    <>
      {isLoading ? (
        <Loader2 className="me-2 h-4 w-4 animate-spin" />
      ) : (
        iconPosition === "left" && <IconSlot Icon={Icon} motionKey={iconMotion} position="left" />
      )}
      <span>{children}</span>
      {!isLoading && iconPosition === "right" && (
        <IconSlot Icon={Icon} motionKey={iconMotion} position="right" />
      )}
    </>
  )

  if (props.as === "link") {
    return (
      <motion.div initial="rest" whileHover="hover" whileTap={{ scale: 0.985 }} className="inline-flex">
        <Link to={props.to} onClick={onClick} className={classes}>
          {content}
        </Link>
      </motion.div>
    )
  }

  if (props.as === "a") {
    return (
      <motion.div initial="rest" whileHover="hover" whileTap={{ scale: 0.985 }} className="inline-flex">
        <a href={props.href} onClick={onClick} className={classes}>
          {content}
        </a>
      </motion.div>
    )
  }

  return (
    <motion.button
      type={props.type ?? "button"}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.985 }}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {content}
    </motion.button>
  )
}
