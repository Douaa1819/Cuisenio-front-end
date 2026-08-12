import type { LucideIcon, LucideProps } from "lucide-react"
import { cn } from "../../lib/utils"

/** Unified Lucide icon — stroke 1.75, size defaults to 16 (h-4 w-4). */
export function Icon({
  icon: Lucide,
  className,
  size = 16,
  strokeWidth = 1.75,
  ...props
}: LucideProps & { icon: LucideIcon }) {
  return (
    <Lucide
      className={cn("shrink-0", className)}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden={props["aria-label"] || props["aria-labelledby"] ? undefined : true}
      {...props}
    />
  )
}
