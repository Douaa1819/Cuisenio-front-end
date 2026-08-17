import type { LucideIcon } from "lucide-react"
import { CheckCircle2, Heart, MessageSquare, Sparkles } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import type { NotificationType } from "../../api/notification.service"

export function typeIcon(type: NotificationType): { icon: LucideIcon; className: string } {
  switch (type) {
    case "LIKE":
      return { icon: Heart, className: "text-[#2E7D32] bg-[#2E7D32]/10" }
    case "COMMENT":
      return { icon: MessageSquare, className: "text-muted-foreground bg-muted" }
    case "RECIPE_APPROVED":
      return { icon: CheckCircle2, className: "text-primary bg-primary/10" }
    default:
      return { icon: Sparkles, className: "text-muted-foreground bg-muted" }
  }
}

export function relativeTime(iso: string) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: fr })
  } catch {
    return iso
  }
}
