"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

export interface SelectProps extends React.ComponentProps<typeof SelectPrimitive.Root> {
  label?: string
  helperText?: string
  error?: string
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  variant?: "default" | "outline" | "filled" | "ghost"
}

const Select = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      children,
      fullWidth = true,
      ...props
    },
    ref,
  ) => {
    const id = React.useId()

    return (
      <SelectPrimitive.Root {...props}>
        <div className={cn("space-y-2", fullWidth ? "w-full" : "w-auto")}>
          {label && (
            <label
              htmlFor={id}
              className={cn("text-sm font-medium text-gray-900 dark:text-gray-100", error && "text-red-500")}
            >
              {label}
            </label>
          )}
          <SelectPrimitive.Trigger ref={ref} id={id}>
            {children}
          </SelectPrimitive.Trigger>
          {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </SelectPrimitive.Root>
    )
  },
)
Select.displayName = "Select"

const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    error?: boolean
    size?: "sm" | "md" | "lg"
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
    variant?: "default" | "outline" | "filled" | "ghost"
  }
>(({ className, children, error, size = "md", startIcon, endIcon, variant = "default", ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex items-center justify-between rounded-md border bg-white text-gray-900 ring-offset-white",
      "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      {
        // Size variants
        "h-8 px-3 text-xs": size === "sm",
        "h-10 px-3 text-sm": size === "md",
        "h-12 px-4 text-base": size === "lg",

        // Style variants
        "border-gray-300 focus:border-rose-500 focus:ring-rose-500/20": variant === "default" && !error,
        "border-transparent bg-gray-100 focus:bg-white focus:border-rose-500 focus:ring-rose-500/20":
          variant === "filled" && !error,
        "border-gray-300 bg-transparent focus:border-rose-500 focus:ring-rose-500/20": variant === "outline" && !error,
        "border-transparent bg-transparent hover:bg-gray-50 focus:bg-gray-50 focus:ring-rose-500/20":
          variant === "ghost" && !error,

        // Error state
        "border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-600 placeholder:text-red-400": error,
      },
      className,
    )}
    {...props}
  >
    <div className="flex items-center gap-2 w-full">
      {startIcon && <span className="flex-shrink-0 text-gray-500">{startIcon}</span>}
      <span className="flex-grow truncate">{children}</span>
      {endIcon && <span className="flex-shrink-0 text-gray-500">{endIcon}</span>}
    </div>
    <SelectPrimitive.Icon asChild>
      <ChevronDown
        className={cn(
          "h-4 w-4 opacity-50 transition-transform duration-200",
          props["aria-expanded"] && "transform rotate-180",
        )}
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <AnimatePresence>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-md",
          "dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
          position === "popper" && "translate-y-1",
          className,
        )}
        position={position}
        {...props}
        asChild
      >
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <SelectPrimitive.Viewport
            className={cn(
              "p-1",
              position === "popper" &&
                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          {position === "popper" && (
            <>
              <SelectScrollUpButton />
              <SelectScrollDownButton />
            </>
          )}
        </motion.div>
      </SelectPrimitive.Content>
    </AnimatePresence>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold text-gray-900 dark:text-gray-100", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    description?: string
    icon?: React.ReactNode
  }
>(({ className, children, description, icon, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "data-[highlighted]:bg-rose-50 data-[highlighted]:text-rose-700",
      "dark:data-[highlighted]:bg-rose-900/20 dark:data-[highlighted]:text-rose-300",
      "focus:bg-rose-50 focus:text-rose-700 dark:focus:bg-rose-900/20 dark:focus:text-rose-300",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "transition-colors duration-150",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-rose-500" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <div className="flex flex-col">
      <div className="flex items-center">
        {icon && <span className="mr-2 text-gray-500">{icon}</span>}
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </div>
      {description && <span className="text-xs text-gray-500">{description}</span>}
    </div>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

