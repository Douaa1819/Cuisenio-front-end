import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500",
        error: "border-red-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500",
        success: "border-green-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      resize: "vertical",
    },
  },
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, resize, error, helperText, ...props }, ref) => {
    const id = React.useId()
    const computedVariant = error ? "error" : variant

    return (
      <div className="w-full space-y-2">
        <textarea
          id={id}
          className={cn(textareaVariants({ variant: computedVariant, resize }), className)}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-description` : undefined}
          {...props}
        />

        {helperText && !error && (
          <p id={`${id}-description`} className="text-xs text-gray-500">
            {helperText}
          </p>
        )}

        {error && (
          <p id={`${id}-error`} className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }

