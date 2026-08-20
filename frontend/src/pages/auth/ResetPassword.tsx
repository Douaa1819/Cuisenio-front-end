import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { authService } from "../../api/auth.service"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { useI18n } from "../../context/I18nContext"
import { useNotification } from "../../context/NotificationContext"
import { mapAuthError } from "../../lib/user-facing-error"

export default function ResetPassword() {
  const { t } = useI18n()
  const { success, error: notifyError } = useNotification()
  const { token = "" } = useParams()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [validToken, setValidToken] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await authService.verifyResetToken(token)
        setValidToken(res.valid)
      } catch {
        setValidToken(false)
      }
    }
    void verify()
  }, [token])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      notifyError("Mots de passe différents", "Les deux mots de passe doivent être identiques.")
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(token, password)
      success("Mot de passe mis à jour", "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.")
    } catch (err) {
      notifyError("Réinitialisation impossible", mapAuthError(err, "password"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("resetPassword")}</CardTitle>
        </CardHeader>
        <CardContent>
          {validToken === false ? (
            <p className="text-sm text-destructive">{t("resetTokenInvalid")}</p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("newPassword")} required />
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={t("confirmPassword")} required />
              <Button type="submit" fullWidth isLoading={loading}>
                {t("resetPassword")}
              </Button>
            </form>
          )}
          <Link to="/login" className="mt-4 block text-sm text-primary hover:underline">
            {t("backToLogin")}
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
