import { useId } from "react"
import { useTranslation } from "react-i18next"
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
    iconWrap: "bg-muted text-foreground",
    confirm: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
  },
  warning: {
    Icon: AlertTriangle,
    iconWrap: "bg-muted text-foreground",
    confirm: "bg-foreground text-background hover:opacity-90 focus-visible:ring-ring",
  },
  danger: {
    Icon: AlertTriangle,
    iconWrap: "bg-destructive/10 text-destructive",
    confirm: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
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
  confirmLabel,
  cancelLabel,
  severity = "warning",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  const resolvedConfirm = confirmLabel ?? t("common.confirm")
  const resolvedCancel = cancelLabel ?? t("common.cancel")
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
        className="max-w-md border-border bg-card"
        showCloseButton={!isLoading}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <DialogHeader className="sm:text-start">
          <div className="flex items-start gap-3">
            <span
              className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", styles.iconWrap)}
              aria-hidden
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 space-y-1.5">
              <DialogTitle id={titleId} className="text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription id={descriptionId} className="text-muted-foreground">
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
            {resolvedCancel}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            className={styles.confirm}
            onClick={() => void handleConfirm()}
            autoFocus
          >
            {isLoading ? <Loader2 className="me-2 h-4 w-4 animate-spin" aria-hidden /> : null}
            {resolvedConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
