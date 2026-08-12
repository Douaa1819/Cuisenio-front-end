import { useId } from "react"
import { AlertTriangle, Info, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import { Button } from "./button"
import { cn } from "../../lib/utils"

export type ConfirmSeverity = "info" | "warning" | "danger"

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  /** Confirm button label */
  confirmLabel?: string
  cancelLabel?: string
  severity?: ConfirmSeverity
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
}

const severityStyles: Record<
  ConfirmSeverity,
  { iconWrap: string; confirm: string; Icon: typeof Info }
> = {
  info: {
    Icon: Info,
    iconWrap: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    confirm: "bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-600",
  },
  warning: {
    Icon: AlertTriangle,
    iconWrap: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    confirm: "bg-slate-700 text-white hover:bg-slate-600 focus-visible:ring-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500",
  },
  danger: {
    Icon: AlertTriangle,
    iconWrap: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    confirm: "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-600",
  },
}

/**
 * Accessible confirmation dialog (Radix Dialog + WCAG).
 * Use severity="danger" for irreversible / archive / delete flows.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  severity = "warning",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const styles = severityStyles[severity]
  const Icon = styles.Icon

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isLoading && onOpenChange(next)}>
      <DialogContent
        className="max-w-md border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        showCloseButton={!isLoading}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <DialogHeader className="sm:text-left">
          <div className="flex items-start gap-3">
            <span
              className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", styles.iconWrap)}
              aria-hidden
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 space-y-1.5">
              <DialogTitle id={titleId} className="text-slate-900 dark:text-slate-100">
                {title}
              </DialogTitle>
              <DialogDescription id={descriptionId} className="text-slate-500 dark:text-slate-400">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            className={styles.confirm}
            onClick={() => void handleConfirm()}
            autoFocus
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
