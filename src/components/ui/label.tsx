import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-gray-900 dark:text-gray-100",
        secondary: "text-gray-500 dark:text-gray-400",
        destructive: "text-red-500 dark:text-red-400",
        success: "text-green-600 dark:text-green-400",
        warning: "text-amber-600 dark:text-amber-400",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {
  optional?: boolean
  required?: boolean
  tooltip?: string
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, variant, size, optional, required, tooltip, ...props }, ref) => {
    const id = React.useId()

    return (
      <div className="flex items-center gap-1">
        <label
          ref={ref}
          className={cn(labelVariants({ variant, size }), className)}
          {...props}
          htmlFor={props.htmlFor || id}
        >
          {children}
          {optional && <span className="ml-1 text-xs text-gray-500">(optional)</span>}
          {required && <span className="ml-1 text-xs text-red-500">*</span>}
        </label>

        {tooltip && (
          <div className="group relative">
            <div className="cursor-help rounded-full border border-gray-200 p-0.5 text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {tooltip}
            </div>
          </div>
        )}
      </div>
    )
  },
)
Label.displayName = "Label"

export { Label, labelVariants }

