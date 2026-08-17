"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { motion } from "framer-motion"

const badgeVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:brightness-105",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border text-foreground hover:bg-muted",
        success: "bg-primary/10 text-primary hover:bg-primary/15",
        warning: "bg-secondary text-foreground hover:bg-muted",
        info: "bg-muted text-foreground hover:bg-muted/80",
        ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        category: "bg-secondary text-foreground hover:bg-muted",
        trending: "bg-primary-gradient text-primary-foreground",
      },
      size: {
        xs: "h-5 px-1.5 rounded-md text-xs",
        sm: "h-6 px-2 rounded-lg text-xs",
        md: "h-7 px-2.5 rounded-lg text-sm",
        lg: "h-8 px-3 rounded-lg",
      },
      shape: {
        default: "rounded-lg",
        pill: "rounded-full",
        square: "rounded-none",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "default",
      animation: "none",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
  animate?: boolean
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant, size, shape, animation, icon, removable, onRemove, animate = false, children, ...props },
    ref,
  ) => {
    const BadgeComponent = (animate ? motion.div : "div") as React.ElementType
    const animateProps = animate
      ? {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition: { duration: 0.2 },
        }
      : {}

    return (
      <BadgeComponent
        ref={ref}
        className={cn(badgeVariants({ variant, size, shape, animation }), className)}
        {...animateProps}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {removable && (
          <button
            type="button"
            className="ml-1 -mr-1 h-3.5 w-3.5 rounded-full text-white/70 hover:text-white/90 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.()
            }}
            aria-label="Remove badge"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </BadgeComponent>
    )
  },
)
Badge.displayName = "Badge"

