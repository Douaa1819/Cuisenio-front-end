import type { ReactNode } from "react"
import { cn } from "../../lib/utils"

export type AsyncStatus = "idle" | "loading" | "success" | "empty" | "error"

interface AsyncSectionProps {
  status: AsyncStatus
  loadingView: ReactNode
  successView: ReactNode
  emptyView?: ReactNode
  errorView?: ReactNode
  idleView?: ReactNode
  className?: string
}

export function AsyncSection({
  status,
  loadingView,
  successView,
  emptyView = null,
  errorView = null,
  idleView = null,
  className,
}: AsyncSectionProps) {
  if (status === "loading") {
    return <section className={cn("w-full", className)}>{loadingView}</section>
  }

  if (status === "error") {
    return <section className={cn("w-full", className)}>{errorView}</section>
  }

  if (status === "empty") {
    return <section className={cn("w-full", className)}>{emptyView}</section>
  }

  if (status === "idle") {
    return <section className={cn("w-full", className)}>{idleView}</section>
  }

  return <section className={cn("w-full", className)}>{successView}</section>
}
