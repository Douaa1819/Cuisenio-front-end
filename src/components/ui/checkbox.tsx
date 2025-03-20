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
        default: "border-gray-300 text-rose-500 focus:ring-rose-500",
        primary: "border-gray-300 text-blue-600 focus:ring-blue-500",
        success: "border-gray-300 text-green-600 focus:ring-green-500",
        warning: "border-gray-300 text-amber-600 focus:ring-amber-500",
        danger: "border-gray-300 text-red-600 focus:ring-red-500",
      },
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
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
                  error ? "text-red-500" : "text-gray-900",
                )}
              >
                {label}
              </label>
            )}
            {description && <p className="text-xs text-gray-500">{description}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )}
      </div>
    )
  },
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

