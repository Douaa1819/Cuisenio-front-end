import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ChefHat, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

import { authService } from "../../api/auth.service"
import { useNotification } from "../../context/NotificationContext"
import { useAuthStore } from "../../store/auth.store"
import { emailSchema, nameSchema, passwordSchema, usernameSchema } from "../../utils/validation"
import { homePathForRole, normalizeRole } from "../../types/auth.types"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { ThemeToggle } from "../../components/theme/ThemeToggle"
import { usePageMeta } from "../../hooks/usePageMeta"

const registerSchema = z.object({
  username: usernameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, { message: "Vous devez accepter les conditions d'utilisation" }),
})

type RegisterFormValues = z.infer<typeof registerSchema>

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
    console.error("[auth/register] network error — is the API running?", axiosLike.code ?? axiosLike.message, err)
    if (axiosLike.code === "ERR_NETWORK" || axiosLike.message?.includes("Network Error")) {
      return "Impossible de joindre le serveur. Vérifiez que l'API tourne sur le port configuré."
    }
    return "Erreur réseau. Réessayez dans un instant."
  }
  console.error("[auth/register] API error", axiosLike.response.status, axiosLike.response.data)
  return axiosLike.response.data?.message ?? fallback
}

export default function RegisterForm() {
  usePageMeta({
    title: "Inscription — Cuisenio",
    description: "Créez votre compte chef sur Cuisenio.",
    path: "/register",
  })

  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const { success, error: notifyError } = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const submitting = useRef(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", lastName: "", email: "", password: "", termsAccepted: false },
  })

  const termsAccepted = watch("termsAccepted")

  const onSubmit = async (data: RegisterFormValues) => {
    if (submitting.current || isLoading) return
    submitting.current = true
    setIsLoading(true)
    try {
      const response = await authService.register({
        username: data.username,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })

      authService.setToken(response.token)
      const role = normalizeRole(response.role)
      login(response.token, {
        id: response.id,
        username: response.username,
        lastName: response.lastName,
        email: response.email,
        profilePicture: response.profilePicture,
        role,
      })

      success("Compte créé", "Bienvenue dans la communauté Cuisenio.")
      navigate(homePathForRole(role), { replace: true })
    } catch (err: unknown) {
      notifyError("Inscription échouée", resolveAuthError(err, "Veuillez réessayer."))
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
            "radial-gradient(ellipse 70% 50% at 20% 10%, color-mix(in srgb, var(--cu-primary) 20%, transparent), transparent 55%)",
        }}
      />
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <motion.div {...pageMotion} className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card-theme backdrop-blur-sm transition duration-300 hover:shadow-[0_0_40px_-8px_var(--cu-surface-glow)] sm:p-8">
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex rounded-full bg-primary/15 p-3">
              <ChefHat className="h-8 w-8 text-primary" aria-hidden />
            </div>
            <h1 className="font-serif text-2xl tracking-tight text-foreground">Créer un compte</h1>
            <p className="mt-1 px-2 font-sans text-sm text-muted-foreground">
              Rejoignez la communauté et commencez votre aventure culinaire
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Prénom
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Jean"
                  autoComplete="given-name"
                  aria-invalid={Boolean(errors.username)}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/25"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  Nom
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Dupont"
                  autoComplete="family-name"
                  aria-invalid={Boolean(errors.lastName)}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/25"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

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
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/80" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
              <p className="text-xs text-muted-foreground">
                8 caractères min · 1 majuscule · 1 chiffre · 1 caractère spécial
              </p>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="termsAccepted"
                checked={termsAccepted}
                onChange={(e) =>
                  setValue("termsAccepted", e.target.checked, { shouldValidate: true })
                }
                className="mt-0.5 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
              <Label htmlFor="termsAccepted" className="text-sm font-normal leading-snug text-muted-foreground">
                J&apos;accepte les{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  conditions d&apos;utilisation
                </Link>{" "}
                et la{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  politique de confidentialité
                </Link>
              </Label>
            </div>
            {errors.termsAccepted && (
              <p className="-mt-2 text-xs text-destructive" role="alert">
                {errors.termsAccepted.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border-0 bg-primary-gradient font-medium text-primary-foreground shadow-md transition hover:brightness-110 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création du compte...
                </>
              ) : (
                "Créer un compte"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="font-medium text-primary hover:opacity-80">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
