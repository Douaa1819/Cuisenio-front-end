import * as React from "react"
import { cn } from "../../lib/utils"

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500",
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

