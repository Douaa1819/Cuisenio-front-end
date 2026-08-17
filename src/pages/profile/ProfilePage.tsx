import { motion } from "framer-motion"
import { Moon, Shield, Sun, User } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { authService } from "../../api/auth.service"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { AppShell } from "../../components/layout/AppShell"
import { useI18n } from "../../context/I18nContext"
import { useTheme } from "../../hooks/use-theme"
import { useAuthStore } from "../../store/auth.store"

type ProfileTab = "overview" | "preferences" | "security"

export default function ProfilePage() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  const { updateUser } = useAuthStore()

  const [activeTab, setActiveTab] = useState<ProfileTab>("overview")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [profile, setProfile] = useState({
    username: "",
    lastName: "",
    email: "",
    profilePicture: "",
    role: "",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const load = async () => {
      try {
        const user = await authService.getProfile()
        setProfile({
          username: user.username || "",
          lastName: user.lastName || "",
          email: user.email || "",
          profilePicture: user.profilePicture || "",
          role: user.role || "",
        })
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const visibleFields = useMemo(
    () =>
      [
        { label: "Username", value: profile.username },
        { label: "Last name", value: profile.lastName },
        { label: "Email", value: profile.email },
        { label: "Role", value: profile.role },
      ].filter((f) => f.value && f.value.trim().length > 0),
    [profile],
  )

  const saveProfile = async () => {
    const form = new FormData()
    form.append("username", profile.username)
    form.append("lastName", profile.lastName)
    form.append("email", profile.email)
    await authService.updateProfile(form)
    updateUser({
      username: profile.username,
      lastName: profile.lastName,
      email: profile.email,
      role: profile.role as never,
    })
    setMessage("Profile saved.")
  }

  const changePassword = async () => {
    setMessage("")
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setMessage("Please fill all password fields.")
      return
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setMessage("New password must be different from current password.")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("Password confirmation does not match.")
      return
    }
    await authService.updatePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setMessage("Password changed successfully.")
  }

  if (loading) {
    return (
      <AppShell>
        <main className="mx-auto max-w-4xl p-4 md:p-6">
          <p className="text-sm text-muted-foreground">Chargement des paramètres…</p>
        </main>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("profileSettings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="overview"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as ProfileTab)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
                <TabsTrigger value="preferences">{t("preferences")}</TabsTrigger>
                <TabsTrigger value="security">{t("security")}</TabsTrigger>
              </TabsList>

              <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <TabsContent value="overview" className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Visible profile data</span>
                  </div>
                  {visibleFields.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No profile fields to display.</p>
                  ) : (
                    <div className="space-y-3">
                      {visibleFields.map((field) => (
                        <div key={field.label} className="rounded-md border border-border p-3">
                          <p className="text-xs text-muted-foreground">{field.label}</p>
                          <p className="text-sm font-medium">{field.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value={profile.username} onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
                    </div>
                  </div>
                  <Button onClick={() => void saveProfile()}>{t("saveChanges")}</Button>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4 pt-4">
                  <div className="rounded-md border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t("darkMode")}</p>
                        <p className="text-sm text-muted-foreground">Use Tailwind dark mode styles across the app.</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="min-w-[100px]"
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun className="mr-2 h-4 w-4" /> Light
                          </>
                        ) : (
                          <>
                            <Moon className="mr-2 h-4 w-4" /> Dark
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-md border border-border p-4">
                    <p className="mb-2 font-medium">{t("language")}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant={locale === "fr" ? "primary" : "outline"} onClick={() => setLocale("fr")}>
                        Français
                      </Button>
                      <Button variant={locale === "en" ? "primary" : "outline"} onClick={() => setLocale("en")}>
                        English
                      </Button>
                      <Button variant={locale === "ar" ? "primary" : "outline"} onClick={() => setLocale("ar")}>
                        العربية
                      </Button>
                      <Button variant={locale === "ar-MA" ? "primary" : "outline"} onClick={() => setLocale("ar-MA")}>
                        الدارجة
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">{t("changePassword")}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">{t("newPassword")}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      />
                    </div>
                    <Button onClick={() => void changePassword()}>{t("changePassword")}</Button>
                    <Link to="/auth/forgot-password" className="block text-sm text-primary hover:underline">
                      {t("forgotPassword")}
                    </Link>
                  </div>
                </TabsContent>
              </motion.div>
            </Tabs>
            {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

