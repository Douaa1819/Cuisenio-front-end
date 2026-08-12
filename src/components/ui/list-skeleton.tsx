import { cn } from "../../lib/utils"

interface ListSkeletonProps {
  count?: number
  className?: string
}

export function ListSkeleton({ count = 6, className }: ListSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-opacity duration-300"
          aria-hidden="true"
        >
          <div className="h-48 w-full animate-pulse bg-muted" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-10 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
