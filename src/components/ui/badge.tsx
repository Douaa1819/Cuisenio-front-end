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
        default: "bg-rose-500 text-white hover:bg-rose-600",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        success: "bg-green-100 text-green-800 hover:bg-green-200",
        warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        ghost: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900",
        category: "bg-rose-100 text-rose-700 hover:bg-rose-200",
        trending: "bg-gradient-to-r from-rose-500 to-orange-500 text-white",
      },
      size: {
        xs: "h-5 px-1.5 rounded text-xs",
        sm: "h-6 px-2 rounded-md text-xs",
        md: "h-7 px-2.5 rounded-md text-sm",
        lg: "h-8 px-3 rounded-md",
      },
      shape: {
        default: "rounded-md",
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

