import { useNotification } from "../context/NotificationContext"

/** Alias of the global Cuisenio notification system — do not add a second toast stack. */
export const useToast = () => {
  const { showToast, success, error, warning, info, dismiss } = useNotification()
  return { showToast, success, error, warning, info, dismiss }
}
