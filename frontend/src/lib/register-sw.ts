/** Register the Cuisenio service worker (production + preview). */
export async function registerSW() {
  if (!("serviceWorker" in navigator)) return
  if (import.meta.env.DEV) return // avoid SW caching headaches in Vite HMR

  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" })
    reg.addEventListener("updatefound", () => {
      const worker = reg.installing
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          console.info("[Cuisenio PWA] Update available — refresh to apply.")
        }
      })
    })
  } catch (err) {
    console.warn("[Cuisenio PWA] SW registration failed", err)
  }
}
