import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ChefHat, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { useCallback, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { z } from "zod"

import { authService } from "../../api/auth.service"
import { GoogleContinueButton } from "../../components/auth/GoogleContinueButton"
import { ThemeAndLanguageBar } from "../../components/layout/ThemeAndLanguageBar"
import { useNotification } from "../../context/NotificationContext"
import { googleAuthToast, mapAuthError, mapGoogleBackendError, type GoogleAuthIssue } from "../../lib/user-facing-error"
import { useAuthStore } from "../../store/auth.store"
import { EMAIL_REGEX } from "../../utils/validation"
import { homePathForRole, normalizeRole } from "../../types/auth.types"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { usePageMeta } from "../../hooks/usePageMeta"

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 60_000

type LoginFormValues = {
  email: string
  password: string
}

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: "easeOut" as const },
}

export default function LoginForm() {
  const { t, i18n } = useTranslation()
  usePageMeta({
    title: t("auth.loginMetaTitle"),
    description: t("auth.loginMetaDescription"),
    path: "/login",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { success, error: notifyError, warning } = useNotification()

  const failedAttempts = useRef(0)
  const lockedUntil = useRef<number | null>(null)
  const submitting = useRef(false)

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .max(254, t("auth.emailTooLong"))
          .email(t("auth.emailInvalid"))
          .regex(EMAIL_REGEX, t("auth.emailInvalid")),
        password: z.string().min(1, t("auth.passwordRequired")).max(72, t("auth.passwordTooLong")),
      }),
    [t, i18n.language],
  )

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
      notifyError(t("auth.tooManyTitle"), t("auth.tooManyMessage", { seconds: remaining }))
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

      success(
        t("auth.successTitle"),
        response.username ? t("auth.welcomeName", { name: response.username }) : t("auth.welcome"),
      )
      const next = searchParams.get("next")
      const safeNext =
        next && next.startsWith("/") && !next.startsWith("//") ? next : homePathForRole(role)
      navigate(safeNext, { replace: true })
    } catch (err: unknown) {
      failedAttempts.current += 1

      if (failedAttempts.current >= MAX_ATTEMPTS) {
        lockedUntil.current = Date.now() + LOCKOUT_MS
        failedAttempts.current = 0
        notifyError(t("auth.lockedTitle"), t("auth.lockedMessage"))
      } else {
        notifyError(t("auth.loginFailed"), mapAuthError(err, "login"))
      }
    } finally {
      setIsLoading(false)
      submitting.current = false
    }
  }

  const handleGoogleCredential = useCallback(
    async (idToken: string) => {
      if (submitting.current || isLoading) return
      submitting.current = true
      setIsLoading(true)
      try {
        const response = await authService.loginWithGoogle(idToken)
        const role = normalizeRole(response.role)
        login(response.token, {
          id: response.id,
          username: response.username,
          lastName: response.lastName,
          email: response.email,
          profilePicture: response.profilePicture,
          role,
        })
        success(
          t("auth.successTitle"),
          response.username ? t("auth.welcomeName", { name: response.username }) : t("auth.welcome"),
        )
        const next = searchParams.get("next")
        const safeNext =
          next && next.startsWith("/") && !next.startsWith("//") ? next : homePathForRole(role)
        navigate(safeNext, { replace: true })
      } catch (err: unknown) {
        const toast = mapGoogleBackendError(err)
        notifyError(toast.title, toast.message)
      } finally {
        setIsLoading(false)
        submitting.current = false
      }
    },
    [isLoading, login, navigate, notifyError, searchParams, success, t],
  )

  const handleGoogleIssue = useCallback(
    (kind: GoogleAuthIssue) => {
      const toast = googleAuthToast(kind)
      if (kind === "cancelled") {
        warning(toast.title, toast.message)
        return
      }
      notifyError(toast.title, toast.message)
    },
    [notifyError, warning],
  )

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
      <div className="absolute end-4 top-4 z-10">
        <ThemeAndLanguageBar compact={false} />
      </div>

      <motion.div {...pageMotion} className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card-theme sm:p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex rounded-full bg-primary/15 p-3">
              <ChefHat className="h-8 w-8 text-primary" aria-hidden />
            </div>
            <h1 className="font-serif text-2xl tracking-tight text-foreground">{t("auth.loginTitle")}</h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">{t("auth.loginSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                {t("auth.email")}
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/80" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className="border-border bg-background ps-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/25"
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
                  {t("auth.password")}
                </Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-primary transition hover:opacity-80"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/80" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  className="border-border bg-background ps-10 pe-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/25"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
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

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t("auth.signingIn")}
                </>
              ) : (
                t("auth.signIn")
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t("auth.or")}</span>
            </div>
          </div>

          <GoogleContinueButton
            onCredential={handleGoogleCredential}
            onIssue={handleGoogleIssue}
            disabled={isLoading}
          />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="font-medium text-primary hover:opacity-80">
              {t("auth.signUpLink")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
