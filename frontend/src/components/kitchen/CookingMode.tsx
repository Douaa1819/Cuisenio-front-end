import { useEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import type { RecipeResponse } from "../../types/recipe.types"
import { useCookingStore } from "../../store/cooking.store"
import { useAchievementsStore } from "../../store/achievements.store"
import { useShoppingListStore } from "../../store/shopping-list.store"
import { useRecentlyViewedStore } from "../../store/recently-viewed.store"
import { Button } from "../ui/button"
import { KitchenTimer } from "./KitchenTimer"
import {
  cancelSpeech,
  getSpeechRecognitionCtor,
  speak as speakFrench,
  type SpeechRecognitionLike,
} from "../../lib/speech"

interface CookingModeProps {
  recipe: RecipeResponse
  open: boolean
  onClose: () => void
}

/**
 * Hands-free focus mode: XXL typography + SpeechRecognition + SpeechSynthesis.
 */
export function CookingMode({ recipe, open, onClose }: CookingModeProps) {
  const { start, setStep, toggleIngredient, complete, active } = useCookingStore()
  const [voiceOn, setVoiceOn] = useState(false)
  const [listening, setListening] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(Math.max(1, recipe.cookingTime || 10))
  const [timerKey, setTimerKey] = useState(0)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  const steps = recipe.steps ?? []
  const stepIndex = active?.recipeId === recipe.id ? active.stepIndex : 0
  const checked = active?.recipeId === recipe.id ? active.checkedIngredients : []

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mq.matches)
  }, [])

  useEffect(() => {
    if (!open) return
    start({
      recipeId: recipe.id,
      recipePublicId: recipe.publicId,
      title: recipe.title,
      imageUrl: recipe.imageUrl,
      stepIndex: active?.recipeId === recipe.id ? active.stepIndex : 0,
      totalSteps: Math.max(1, steps.length),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, recipe.id])

  const current = steps[stepIndex]
  const progress = steps.length ? ((stepIndex + 1) / steps.length) * 100 : 0

  const speak = (text: string) => {
    speakFrench(text, { lang: "fr-FR" })
  }

  useEffect(() => {
    if (!open || !voiceOn || !current) return
    if (prefersReducedMotion) return
    speak(`Étape ${current.stepNumber}. ${current.description}`)
    return () => cancelSpeech()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, voiceOn, current?.id, prefersReducedMotion])

  const handleVoiceCommand = (transcript: string) => {
    const t = transcript.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "")
    if (t.includes("suivante") || t.includes("suivant") || t.includes("next")) {
      setStep(Math.min(steps.length - 1, stepIndex + 1))
      speak("Étape suivante")
      return
    }
    if (t.includes("precedente") || t.includes("precedent") || t.includes("previous")) {
      setStep(Math.max(0, stepIndex - 1))
      speak("Étape précédente")
      return
    }
    if (t.includes("repete") || t.includes("répète") || t.includes("encore")) {
      if (current) speak(`Étape ${current.stepNumber}. ${current.description}`)
      return
    }
    if (t.includes("minuteur") || t.includes("timer")) {
      const match = t.match(/(\d+)\s*(minute|min)/)
      const mins = match ? Number(match[1]) : Math.max(1, recipe.cookingTime || 10)
      setTimerMinutes(mins)
      setTimerKey((k) => k + 1)
      speak(`Minuteur lancé pour ${mins} minutes`)
    }
  }

  useEffect(() => {
    if (!open || !listening) {
      recognitionRef.current?.stop()
      return
    }
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) return
    const recognition = new Ctor()
    recognition.lang = "fr-FR"
    recognition.continuous = true
    recognition.interimResults = false
    recognition.onresult = (ev) => {
      const last = ev.results[ev.results.length - 1]
      if (last?.[0]?.transcript) handleVoiceCommand(last[0].transcript)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => {
      if (listening) {
        try {
          recognition.start()
        } catch {
          setListening(false)
        }
      }
    }
    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch {
      setListening(false)
    }
    return () => recognition.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, listening, stepIndex])

  const ingredients = useMemo(() => recipe.recipeIngredients ?? [], [recipe.recipeIngredients])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-[#0F0B0A] text-white"
      role="dialog"
      aria-modal="true"
      aria-label={`Mode cuisine — ${recipe.title}`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl hover:bg-white/10"
          aria-label="Quitter le mode cuisine"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-semibold">{recipe.title}</p>
          <p className="text-xs text-white/60">
            Étape {Math.min(stepIndex + 1, steps.length || 1)} / {steps.length || 1}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setListening((v) => !v)}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl hover:bg-white/10 ${
              listening ? "bg-primary/30 text-primary" : ""
            }`}
            aria-pressed={listening}
            aria-label={listening ? "Arrêter l'écoute vocale" : "Écouter les commandes vocales"}
            title='Dites: "étape suivante", "précédente", "répète", "lance le minuteur"'
          >
            {listening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => setVoiceOn((v) => !v)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl hover:bg-white/10"
            aria-pressed={voiceOn}
            aria-label={voiceOn ? "Couper la voix" : "Activer la voix"}
          >
            {voiceOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="h-1.5 bg-white/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {listening && (
        <p className="bg-primary/20 px-4 py-2 text-center text-xs text-primary">
          Écoute active — « étape suivante », « précédente », « répète », « lance le minuteur 5 minutes »
        </p>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">En cours</p>
            <h2 className="mb-6 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              {current?.description ?? "Aucune étape — agrémentez la recette puis continuez."}
            </h2>

            <div className="mb-6 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="min-h-12 border-white/20 bg-transparent text-white hover:bg-white/10"
                disabled={stepIndex <= 0}
                onClick={() => setStep(Math.max(0, stepIndex - 1))}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Précédent
              </Button>
              {stepIndex < steps.length - 1 ? (
                <Button
                  type="button"
                  className="min-h-12 flex-1 bg-primary hover:brightness-110"
                  onClick={() => setStep(stepIndex + 1)}
                >
                  Étape suivante <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  className="min-h-12 flex-1 bg-emerald-600 hover:bg-emerald-500"
                  onClick={() => {
                    complete()
                    useAchievementsStore.getState().evaluate({
                      cookCount: useCookingStore.getState().history.length,
                      streak: useCookingStore.getState().streak,
                      shoppingCount: useShoppingListStore.getState().items.length,
                      viewedCount: useRecentlyViewedStore.getState().items.length,
                    })
                    onClose()
                  }}
                >
                  <Flame className="mr-1 h-4 w-4" /> Terminer & fêter
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="min-h-12 border-white/20 bg-transparent text-white hover:bg-white/10"
                onClick={() => current && speak(`Étape ${current.stepNumber}. ${current.description}`)}
              >
                Répète
              </Button>
            </div>

            <ul className="space-y-2">
              {steps.map((s, i) => (
                <li
                  key={s.id}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    i === stepIndex
                      ? "border-primary bg-primary/15"
                      : i < stepIndex
                        ? "border-white/10 text-white/50"
                        : "border-white/10 text-white/80"
                  }`}
                >
                  <span className="mr-2 font-semibold">{s.stepNumber}.</span>
                  {s.description}
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="mb-2 text-sm font-semibold">Ingrédients</p>
              <ul className="space-y-2">
                {ingredients.map((ri) => {
                  const name = ri.ingredient?.name ?? "Ingrédient"
                  const isChecked = checked.includes(name)
                  return (
                    <li key={ri.id}>
                      <button
                        type="button"
                        onClick={() => toggleIngredient(name)}
                        className="flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-left text-sm hover:bg-white/10"
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            isChecked ? "border-emerald-400 bg-emerald-500" : "border-white/30"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3" />}
                        </span>
                        <span className={isChecked ? "line-through opacity-60" : ""}>
                          {name}
                          <span className="ml-1 text-white/50">
                            {ri.quantity} {ri.unit}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
            <KitchenTimer key={timerKey} defaultMinutes={timerMinutes} label="Minuteur" />
          </aside>
        </div>
      </div>
    </div>
  )
}
