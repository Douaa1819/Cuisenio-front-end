"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
  orientation: "horizontal" | "vertical"
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
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
    <TabsContext.Provider value={{ value: selectedValue, onValueChange: handleValueChange, orientation }}>
      <div
        className={cn("w-full", orientation === "vertical" && "flex", className)}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  const { orientation } = useTabsContext()

  return (
    <div
      role="tablist"
      className={cn(
        orientation === "horizontal"
          ? "flex items-center space-x-2 border-b border-gray-200"
          : "flex flex-col space-y-2 border-r border-gray-200 pr-4",
        className,
      )}
      data-orientation={orientation}
      {...props}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
  icon?: React.ReactNode
  badge?: React.ReactNode
}

export function TabsTrigger({ value, children, className, disabled = false, icon, badge, ...props }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange, orientation } = useTabsContext()
  const isActive = selectedValue === value

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        orientation === "horizontal" ? "px-4 py-2 -mb-px" : "px-3 py-2 -mr-px text-left",
        isActive
          ? orientation === "horizontal"
            ? "text-rose-500 border-b-2 border-rose-500"
            : "text-rose-500 border-r-2 border-rose-500"
          : "text-gray-500 hover:text-gray-900",
        className,
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      {badge && <span className="ml-2">{badge}</span>}

      {isActive && orientation === "horizontal" && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500"
          layoutId="activeTabIndicator"
          transition={{ duration: 0.3 }}
        />
      )}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
  forceMount?: boolean
}

export function TabsContent({ value, children, className, forceMount = false, ...props }: TabsContentProps) {
  const { value: selectedValue } = useTabsContext()
  const isSelected = selectedValue === value

  if (!isSelected && !forceMount) {
    return null
  }

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isSelected}
      className={cn(
        "mt-4 focus-visible:outline-none",
        isSelected ? "animate-in fade-in-0 zoom-in-95" : "animate-out fade-out-0 zoom-out-95",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

