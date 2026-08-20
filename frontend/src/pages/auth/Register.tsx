import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ChefHat, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { useCallback, useMemo, useRef, useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

import { authService } from "../../api/auth.service"
import { GoogleContinueButton } from "../../components/auth/GoogleContinueButton"
import { ThemeAndLanguageBar } from "../../components/layout/ThemeAndLanguageBar"
import { useNotification } from "../../context/NotificationContext"
import { googleAuthToast, mapAuthError, mapGoogleBackendError, type GoogleAuthIssue } from "../../lib/user-facing-error"
import { useAuthStore } from "../../store/auth.store"
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX, USERNAME_REGEX } from "../../utils/validation"
import { homePathForRole, normalizeRole } from "../../types/auth.types"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { usePageMeta } from "../../hooks/usePageMeta"

type RegisterFormValues = {
  username: string
  lastName: string
  email: string
  password: string
  termsAccepted: boolean
}

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: "easeOut" as const },
}

export default function RegisterForm() {
  const { t, i18n } = useTranslation()
  usePageMeta({
    title: t("auth.registerMetaTitle"),
    description: t("auth.registerMetaDescription"),
    path: "/register",
  })

  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const { success, error: notifyError, warning } = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const submitting = useRef(false)

  const registerSchema = useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(3, t("auth.usernameMin"))
          .max(30, t("auth.usernameMax"))
          .regex(USERNAME_REGEX, t("auth.usernameChars")),
        lastName: z
          .string()
          .min(2, t("auth.lastNameMin"))
          .max(50, t("auth.lastNameMax"))
          .regex(NAME_REGEX, t("auth.lastNameChars")),
        email: z
          .string()
          .max(254, t("auth.emailTooLong"))
          .email(t("auth.emailInvalid"))
          .regex(EMAIL_REGEX, t("auth.emailInvalid")),
        password: z
          .string()
          .min(8, t("auth.passwordMin"))
          .max(72, t("auth.passwordMax"))
          .regex(PASSWORD_REGEX, t("auth.passwordStrength")),
        termsAccepted: z.boolean().refine((val) => val === true, { message: t("auth.termsRequired") }),
      }),
    [t, i18n.language],
  )

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

      success(t("auth.registerSuccessTitle"), t("auth.registerSuccessMessage"))
      navigate(homePathForRole(role), { replace: true })
    } catch (err: unknown) {
      notifyError(t("auth.registerFailed"), mapAuthError(err, "register"))
    } finally {
      setIsLoading(false)
      submitting.current = false
    }
  }

  const handleGoogleCredential = useCallback(
    async (idToken: string) => {
      if (submitting.current || isLoading) return
      if (!termsAccepted) {
        notifyError(t("auth.termsRequiredTitle"), t("auth.termsRequiredGoogle"))
        return
      }
      submitting.current = true
      setIsLoading(true)
      try {
        const response = await authService.loginWithGoogle(idToken)
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
        success(t("auth.registerGoogleSuccessTitle"), t("auth.registerSuccessMessage"))
        navigate(homePathForRole(role), { replace: true })
      } catch (err: unknown) {
        const toast = mapGoogleBackendError(err)
        notifyError(toast.title, toast.message)
      } finally {
        setIsLoading(false)
        submitting.current = false
      }
    },
    [isLoading, login, navigate, notifyError, success, t, termsAccepted],
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
            "radial-gradient(ellipse 70% 50% at 20% 10%, color-mix(in srgb, var(--cu-primary) 20%, transparent), transparent 55%)",
        }}
      />
      <div className="absolute end-4 top-4 z-10">
        <ThemeAndLanguageBar compact={false} />
      </div>

      <motion.div {...pageMotion} className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card-theme sm:p-8">
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex rounded-full bg-primary/15 p-3">
              <ChefHat className="h-8 w-8 text-primary" aria-hidden />
            </div>
            <h1 className="font-serif text-2xl tracking-tight text-foreground">{t("auth.registerTitle")}</h1>
            <p className="mt-1 px-2 font-sans text-sm text-muted-foreground">{t("auth.registerSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  {t("auth.firstName")}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t("auth.firstNamePlaceholder")}
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
                  {t("auth.lastName")}
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder={t("auth.lastNamePlaceholder")}
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
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                {t("auth.password")}
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/80" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
              <p className="text-xs text-muted-foreground">{t("auth.passwordHint")}</p>
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
                <Trans
                  i18nKey="auth.acceptTermsFull"
                  components={{
                    terms: <Link to="/terms" className="text-primary hover:underline" />,
                    privacy: <Link to="/privacy" className="text-primary hover:underline" />,
                  }}
                />
              </Label>
            </div>
            {errors.termsAccepted && (
              <p className="-mt-2 text-xs text-destructive" role="alert">
                {errors.termsAccepted.message}
              </p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t("auth.creatingAccount")}
                </>
              ) : (
                t("auth.createAccount")
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
            {t("auth.hasAccount")}{" "}
            <Link to="/login" className="font-medium text-primary hover:opacity-80">
              {t("auth.signIn")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
