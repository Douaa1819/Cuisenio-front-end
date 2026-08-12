/** Lightweight polyfill for Node < 19 / Jest */
if (typeof globalThis.crypto === "undefined") {
  // @ts-expect-error test shim
  globalThis.crypto = {}
}
if (typeof globalThis.crypto.randomUUID !== "function") {
  globalThis.crypto.randomUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
}

import "@testing-library/jest-dom"
