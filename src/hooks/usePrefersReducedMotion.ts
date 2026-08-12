import { useReducedMotion } from "framer-motion"

/** True when the user prefers reduced motion (WCAG 2.2 / epilepsy-safe). */
export function usePrefersReducedMotion(): boolean {
  return Boolean(useReducedMotion())
}

export function fadeMotion(reduced: boolean) {
  if (reduced) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      whileInView: { opacity: 1 },
      transition: { duration: 0 },
    }
  }
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }
}
