"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const tabsVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      pills: "",
      underline: "",
      enclosed: "",
      soft: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

const tabsListVariants = cva("", {
  variants: {
    variant: {
      default: "flex items-center space-x-2 border-b border-gray-200",
      pills: "flex items-center space-x-2",
      underline: "flex items-center space-x-2 border-b border-gray-200",
      enclosed: "flex items-center space-x-0 border border-gray-200 rounded-lg overflow-hidden",
      soft: "flex items-center space-x-2 p-1 bg-gray-100 rounded-lg",
    },
    orientation: {
      horizontal: "",
      vertical: "flex-col space-y-2 space-x-0 border-r border-gray-200 pr-4",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
    size: "md",
  },
})

const tabsTriggerVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-gray-500 hover:text-gray-900",
        pills: "text-gray-500 hover:text-gray-900",
        underline: "text-gray-500 hover:text-gray-900",
        enclosed: "text-gray-500 hover:text-gray-900 border-r border-gray-200 last:border-r-0",
        soft: "text-gray-500 hover:text-gray-900",
      },
      orientation: {
        horizontal: "",
        vertical: "justify-start text-left",
      },
      size: {
        sm: "text-xs px-2.5 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-5 py-2.5",
      },
      state: {
        active: "",
        inactive: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        orientation: "horizontal",
        state: "active",
        className: "text-rose-500 border-b-2 border-rose-500 -mb-px",
      },
      {
        variant: "default",
        orientation: "vertical",
        state: "active",
        className: "text-rose-500 border-r-2 border-rose-500 -mr-px",
      },
      {
        variant: "pills",
        state: "active",
        className: "text-white bg-rose-500 rounded-full shadow-sm",
      },
      {
        variant: "underline",
        orientation: "horizontal",
        state: "active",
        className: "text-rose-500 border-b-2 border-rose-500 -mb-px",
      },
      {
        variant: "underline",
        orientation: "vertical",
        state: "active",
        className: "text-rose-500 border-r-2 border-rose-500 -mr-px",
      },
      {
        variant: "enclosed",
        state: "active",
        className: "text-rose-500 bg-white",
      },
      {
        variant: "enclosed",
        state: "inactive",
        className: "bg-gray-50",
      },
      {
        variant: "soft",
        state: "active",
        className: "text-rose-700 bg-white rounded-md shadow-sm",
      },
    ],
    defaultVariants: {
      variant: "default",
      orientation: "horizontal",
      size: "md",
      state: "inactive",
    },
  },
)

const tabsContentVariants = cva("focus-visible:outline-none", {
  variants: {
    variant: {
      default: "mt-4",
      pills: "mt-4",
      underline: "mt-4",
      enclosed: "p-4 border border-gray-200 border-t-0 rounded-b-lg",
      soft: "mt-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
  orientation: "horizontal" | "vertical"
  variant: "default" | "pills" | "underline" | "enclosed" | "soft"
  size: "sm" | "md" | "lg"
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabsVariants> {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: "horizontal" | "vertical"
  animated?: boolean
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  variant = "default",
  size = "md",
  orientation = "horizontal",
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selectedValue = value !== undefined ? value : internalValue

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setInternalValue(newValue)
      onValueChange?.(newValue)
    },
    [onValueChange],
  )

  return (
    <TabsContext.Provider
      value={{
        value: selectedValue,
        onValueChange: handleValueChange,
        orientation,
        variant: variant || "default",
        size: size || "md",
      }}
    >
      <div className={cn(tabsVariants({ variant, size }), className)} data-orientation={orientation} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof tabsListVariants>, "orientation"> {}

export function TabsList({ children, className, variant, size, ...props }: TabsListProps) {
  const { orientation, variant: contextVariant, size: contextSize } = useTabsContext()

  return (
    <div
      role="tablist"
      className={cn(
        tabsListVariants({
          variant: variant || contextVariant,
          orientation,
          size: size || contextSize,
        }),
        className,
      )}
      data-orientation={orientation}
      {...props}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  disabled?: boolean
}

export function TabsTrigger({ value, children, className, disabled = false, icon, badge, ...props }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange, orientation, variant, size } = useTabsContext()

  const isActive = selectedValue === value
  const state = isActive ? "active" : "inactive"

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      disabled={disabled}
      className={cn(
        tabsTriggerVariants({
          variant,
          orientation,
          size,
          state,
        }),
        className,
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      {badge && <span className="ml-2">{badge}</span>}

      {isActive && variant === "default" && orientation === "horizontal" && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500"
          layoutId="activeTabIndicator"
          transition={{ duration: 0.3 }}
        />
      )}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  forceMount?: boolean
  animated?: boolean
}

export function TabsContent({
  value,
  children,
  className,
  forceMount = false,
  animated = true,
  ...props
}: TabsContentProps) {
  const { value: selectedValue, variant } = useTabsContext()
  const isSelected = selectedValue === value

  if (!isSelected && !forceMount) {
    return null
  }

  const content = (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isSelected}
      className={cn(tabsContentVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )

  if (!animated) {
    return content
  }

  return (
    <AnimatePresence mode="wait">
      {isSelected && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

