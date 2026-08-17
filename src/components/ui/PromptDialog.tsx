import { useEffect, useId, useState } from "react"
import { Flag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import { Button } from "./button"
import { Label } from "./label"
import { Textarea } from "./textarea"

export type PromptDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  label?: string
  placeholder?: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  onConfirm: (value: string) => void | Promise<void>
}

/**
 * In-app text prompt (replaces window.prompt).
 */
export function PromptDialog({
  open,
  onOpenChange,
  title,
  description = "Cette information restera confidentielle.",
  label = "Raison",
  placeholder = "Décrivez brièvement le motif…",
  confirmLabel = "Envoyer",
  cancelLabel = "Annuler",
  isLoading = false,
  onConfirm,
}: PromptDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const fieldId = useId()
  const [value, setValue] = useState("")

  useEffect(() => {
    if (open) setValue("")
  }, [open])

  const handleConfirm = async () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    await onConfirm(trimmed)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isLoading && onOpenChange(next)}>
      <DialogContent
        className="max-w-md border-border bg-card"
        showCloseButton={!isLoading}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <DialogHeader className="sm:text-left">
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground"
              aria-hidden
            >
              <Flag className="h-5 w-5" />
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

        <div className="space-y-2">
          <Label htmlFor={fieldId}>{label}</Label>
          <Textarea
            id={fieldId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            resize="vertical"
            autoFocus
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" disabled={isLoading} onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            disabled={isLoading || !value.trim()}
            onClick={() => void handleConfirm()}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
