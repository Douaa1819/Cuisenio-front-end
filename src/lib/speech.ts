export type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((ev: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

/** Keep the last utterance alive — Chrome GC can cancel speech mid-sentence. */
let activeUtterance: SpeechSynthesisUtterance | null = null

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window
}

export function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const prefix = lang.slice(0, 2).toLowerCase()
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix) && v.localService) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
    voices.find((v) => v.default)
  )
}

export type SpeakOptions = {
  lang?: string
  onend?: () => void
  onerror?: () => void
}

/**
 * Speak immediately (must be called from a user gesture on Chrome).
 * Voices are applied when ready; speech still starts without waiting.
 */
export function speak(text: string, options: SpeakOptions = {}): boolean {
  if (!isSpeechSynthesisSupported() || !text.trim()) {
    options.onerror?.()
    return false
  }

  const synth = window.speechSynthesis
  const lang = options.lang ?? "fr-FR"

  synth.cancel()
  if (synth.paused) synth.resume()

  const utterance = new SpeechSynthesisUtterance(text)
  activeUtterance = utterance
  utterance.lang = lang
  utterance.rate = 1
  utterance.pitch = 1
  const voice = pickVoice(lang)
  if (voice) utterance.voice = voice

  utterance.onend = () => {
    if (activeUtterance === utterance) activeUtterance = null
    options.onend?.()
  }
  utterance.onerror = () => {
    if (activeUtterance === utterance) activeUtterance = null
    options.onerror?.()
  }

  synth.speak(utterance)
  synth.resume()

  if (synth.getVoices().length === 0) {
    const applyVoice = () => {
      const next = pickVoice(lang)
      if (next && activeUtterance === utterance) utterance.voice = next
    }
    synth.addEventListener("voiceschanged", applyVoice, { once: true })
  }

  return true
}

export function cancelSpeech(): void {
  activeUtterance = null
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel()
  }
}

export function localeToSpeechLang(locale: string | undefined): string {
  const code = (locale ?? "fr").slice(0, 2).toLowerCase()
  if (code === "en") return "en-US"
  if (code === "ar") return "ar-SA"
  return "fr-FR"
}
