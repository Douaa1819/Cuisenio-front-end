import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { authService } from "../../api/auth.service"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { useI18n } from "../../context/I18nContext"

export default function ResetPassword() {
  const { t } = useI18n()
  const { token = "" } = useParams()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [message, setMessage] = useState("")
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
      setMessage("Passwords do not match.")
      return
    }
    setLoading(true)
    try {
      const res = await authService.resetPassword(token, password)
      setMessage(res.message)
    } catch {
      setMessage("Unable to reset password.")
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
          {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
          <Link to="/login" className="mt-4 block text-sm text-primary hover:underline">
            {t("backToLogin")}
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
