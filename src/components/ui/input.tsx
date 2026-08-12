"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Eye, EyeOff } from "lucide-react"

const inputVariants = cva("flex w-full transition-colors", {
  variants: {
    variant: {
      default: "border border-input bg-background text-foreground placeholder:text-muted-foreground",
      filled:
        "border border-transparent bg-muted text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-input",
      flushed:
        "border-b border-input rounded-none bg-transparent text-foreground placeholder:text-muted-foreground focus:border-b-2 focus:border-ring px-0",
      outline: "border border-input bg-transparent text-foreground placeholder:text-muted-foreground",
    },
    size: {
      sm: "h-8 text-xs px-3 py-1",
      md: "h-10 text-sm px-3 py-2",
      lg: "h-12 text-base px-4 py-3",
    },
    state: {
      default: "focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20",
      error:
        "border-red-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-red-600 placeholder:text-red-400",
      success: "border-green-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20",
      disabled: "cursor-not-allowed bg-muted opacity-50",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    state: "default",
    rounded: "md",
  },
})

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string
  helperText?: string
  error?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  showPasswordToggle?: boolean
  containerClassName?: string
  labelClassName?: string
  helperTextClassName?: string
  errorClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      state,
      rounded,
      type = "text",
      label,
      helperText,
      error,
      startIcon,
      endIcon,
      showPasswordToggle = false,
      containerClassName,
      labelClassName,
      helperTextClassName,
      errorClassName,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const generatedId = React.useId()
    const inputId = id || generatedId
    const inputType = type === "password" && showPassword ? "text" : type
    const computedState = disabled ? "disabled" : error ? "error" : state

    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-foreground",
              error && "text-red-500",
              labelClassName,
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{startIcon}</div>}
          <input
            id={inputId}
            type={inputType}
            className={cn(
              inputVariants({ variant, size, state: computedState, rounded }),
              startIcon && "pl-10",
              (endIcon || (type === "password" && showPasswordToggle)) && "pr-10",
              className,
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
            {...props}
          />
          {type === "password" && showPasswordToggle && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          {endIcon && !showPasswordToggle && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{endIcon}</div>
          )}
        </div>
        {helperText && !error && (
          <p id={`${inputId}-description`} className={cn("text-xs text-muted-foreground", helperTextClassName)}>
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className={cn("text-xs text-red-500", errorClassName)} role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }

