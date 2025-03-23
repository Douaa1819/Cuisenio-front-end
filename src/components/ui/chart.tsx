"use client"

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const chartConfig = cva("", {
  variants: {
    variant: {
      default: "",
      filled: "",
      outline: "",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartConfig> {
  config?: Record<string, { color: string }>
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, variant, size, config, style, ...props }, ref) => {
    // Create CSS variables for chart colors
    const chartVars = React.useMemo(() => {
      if (!config) return {}
      
      const vars: Record<string, string> = {}
      
      Object.entries(config).forEach(([key, value]) => {
        if (value && typeof value === 'object' && 'color' in value) {
          vars[`--color-${key}`] = value.color
        }
      })
      
      return vars
    }, [config])

    return (
      <div
        ref={ref}
        className={cn("chart-container", chartConfig({ variant, size }), className)}
        style={{ ...chartVars, ...style }}
        {...props}
      />
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("chart-tooltip", className)}
        {...props}
      />
    )
  }
)
ChartTooltip.displayName = "ChartTooltip"

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  formatter?: (value: number | string, name: string, props: { payload: { color: string; name: string; value: number | string }[]; label: string }) => React.ReactNode
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ className, formatter, ...props }, ref) => {
    const defaultFormatter = (value: number | string, name: string, props: { payload: { color: string; name: string; value: number | string }[]; label: string }) => {
      const { payload, label } = props
      if (!payload || !payload.length) return null

      return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium mb-1">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: { color: string; name: string; value: number | string }, index: number) => (
              <div key={`item-${index}`} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">{entry.name}:</span>
                <span className="text-xs font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("chart-tooltip-content", className)}
        {...props}
      >
        {(formatter || defaultFormatter)(0, "", { payload: [], label: "" })}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }
