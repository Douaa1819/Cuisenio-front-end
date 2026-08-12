import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ChefHat, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { z } from "zod"

import { authService } from "../../api/auth.service"
import { useNotification } from "../../context/NotificationContext"
import { useAuthStore } from "../../store/auth.store"
import { emailSchema } from "../../utils/validation"
import { homePathForRole, normalizeRole } from "../../types/auth.types"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { ThemeToggle } from "../../components/theme/ThemeToggle"
import { usePageMeta } from "../../hooks/usePageMeta"

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 60_000

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis").max(72, "Mot de passe trop long"),
})

type LoginFormValues = z.infer<typeof loginSchema>

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: "easeOut" as const },
}

function resolveAuthError(err: unknown, fallback: string): string {
  const axiosLike = err as {
    code?: string
    message?: string
    response?: { status?: number; data?: { message?: string } }
  }
  if (!axiosLike.response) {
    console.error("[auth/login] network error — is the API running?", axiosLike.code ?? axiosLike.message, err)
    if (axiosLike.code === "ERR_NETWORK" || axiosLike.message?.includes("Network Error")) {
      return "Impossible de joindre le serveur. Vérifiez que l'API tourne sur le port configuré."
    }
    return "Erreur réseau. Réessayez dans un instant."
  }
  console.error("[auth/login] API error", axiosLike.response.status, axiosLike.response.data)
  return axiosLike.response.data?.message ?? fallback
}

export default function LoginForm() {
  usePageMeta({
    title: "Connexion — Cuisenio",
    description: "Connectez-vous à votre compte Cuisenio.",
    path: "/login",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { success, error: notifyError } = useNotification()

  const failedAttempts = useRef(0)
  const lockedUntil = useRef<number | null>(null)
  const submitting = useRef(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (formData: LoginFormValues) => {
    if (submitting.current || isLoading) return

    if (lockedUntil.current && Date.now() < lockedUntil.current) {
      const remaining = Math.ceil((lockedUntil.current - Date.now()) / 1000)
      notifyError("Trop de tentatives", `Réessayez dans ${remaining} secondes.`)
      return
    }

    submitting.current = true
    setIsLoading(true)

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      })

      failedAttempts.current = 0
      lockedUntil.current = null

      const role = normalizeRole(response.role)
      login(response.token, {
        id: response.id,
        username: response.username,
        lastName: response.lastName,
        email: response.email,
        profilePicture: response.profilePicture,
        role,
      })

      success("Connexion réussie", `Bienvenue${response.username ? `, ${response.username}` : ""}`)
      const next = searchParams.get("next")
      const safeNext =
        next && next.startsWith("/") && !next.startsWith("//") ? next : homePathForRole(role)
      navigate(safeNext, { replace: true })
    } catch (err: unknown) {
      failedAttempts.current += 1

      if (failedAttempts.current >= MAX_ATTEMPTS) {
        lockedUntil.current = Date.now() + LOCKOUT_MS
        failedAttempts.current = 0
        notifyError("Compte temporairement bloqué", "Trop de tentatives. Réessayez dans 1 minute.")
      } else {
        notifyError(
          "Connexion échouée",
          resolveAuthError(err, "Vérifiez vos identifiants."),
        )
      }
    } finally {
      setIsLoading(false)
      submitting.current = false
    }
  }

  return (
    <div className="organic-surface relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 font-sans">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 70% 0%, color-mix(in srgb, var(--cu-primary) 22%, transparent), transparent 55%)",
        }}
      />
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <motion.div {...pageMotion} className="w-full max-w-md">
        <div className="group rounded-2xl border border-border bg-card p-6 shadow-card-theme backdrop-blur-sm transition duration-300 hover:shadow-[0_0_40px_-8px_var(--cu-surface-glow)] sm:p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex rounded-full bg-primary/15 p-3">
              <ChefHat className="h-8 w-8 text-primary" aria-hidden />
            </div>
            <h1 className="font-serif text-2xl tracking-tight text-foreground">Bienvenue</h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/80" />
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className="border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/25"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Mot de passe
                </Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-primary transition hover:opacity-80"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/80" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  className="border-border bg-background pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/25"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border-0 bg-primary-gradient font-medium text-primary-foreground shadow-md transition hover:brightness-110 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Vous n&apos;avez pas de compte ?{" "}
            <Link to="/register" className="font-medium text-primary hover:opacity-80">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
