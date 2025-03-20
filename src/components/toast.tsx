"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react"
import type { ReactNode } from "react"

type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
  type: ToastType
  message: string
  isVisible: boolean
  onClose: () => void
}

export function Toast({ type, message, isVisible, onClose }: ToastProps) {
  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle className="h-5 w-5 text-success" />,
    error: <XCircle className="h-5 w-5 text-danger" />,
    warning: <AlertCircle className="h-5 w-5 text-warning" />,
    info: <Info className="h-5 w-5 text-info" />,
  }

  const bgColors: Record<ToastType, string> = {
    success: "bg-success/10 border-success/20",
    error: "bg-danger/10 border-danger/20",
    warning: "bg-warning/10 border-warning/20",
    info: "bg-info/10 border-info/20",
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-4 right-4 z-50 max-w-md"
        >
          <div className={`border rounded-lg shadow-lg p-4 ${bgColors[type]}`}>
            <div className="flex items-center gap-3">
              {icons[type]}
              <p className="font-medium flex-1">{message}</p>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

