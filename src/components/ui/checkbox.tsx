"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded border focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input text-primary focus:ring-ring",
        primary: "border-input text-primary focus:ring-ring",
        success: "border-input text-primary focus:ring-ring",
        warning: "border-input text-muted-foreground focus:ring-ring",
        danger: "border-input text-destructive focus:ring-destructive",
      },
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof checkboxVariants> {
  label?: string
  description?: string
  error?: string
  animate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, variant, size, label, description, error, animate = false, ...props }, ref) => {
    const id = React.useId()
    const inputId = props.id || id

    return (
      <div className="flex items-start space-x-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={inputId}
            className={cn(checkboxVariants({ variant, size }), className)}
            ref={ref}
            {...props}
          />
          {animate && props.checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute pointer-events-none"
              transition={{ duration: 0.2 }}
            />
          )}
        </div>

        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  error ? "text-destructive" : "text-foreground",
                )}
              >
                {label}
              </label>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )}
      </div>
    )
  },
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

