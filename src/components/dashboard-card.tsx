"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { motion } from "framer-motion"
import { cn } from "../lib/utils"

interface DashboardCardProps {
  title: string
  icon: ReactNode
  value: string | number
  subtitle?: string
  className?: string
  gradient?: string
  trend?: {
    value: number
    label: string
  }
}

export function DashboardCard({ title, icon, value, subtitle, className, gradient, trend }: DashboardCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div
        className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", gradient || "from-primary to-primary-dark")}
      />
      <CardHeader className="flex flex-row items-center justify-between pb-2 z-10">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent className="z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="text-2xl font-bold"
        >
          {value}
        </motion.div>
        {trend && (
          <div className="flex items-center mt-1">
            <div className={cn("text-xs", trend.value >= 0 ? "text-success-light" : "text-danger-light")}>
              {trend.value >= 0 ? "+" : ""}
              {trend.value}%
            </div>
            <div className="text-xs text-muted-foreground ml-1">{trend.label}</div>
          </div>
        )}
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

