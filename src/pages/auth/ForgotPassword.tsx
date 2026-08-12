import { useState } from "react"
import { Link } from "react-router-dom"
import { authService } from "../../api/auth.service"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { useI18n } from "../../context/I18nContext"

export default function ForgotPassword() {
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.requestPasswordReset(email)
      setMessage(res.message)
    } catch {
      setMessage("Unable to send reset link.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("requestReset")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
            <Button type="submit" fullWidth isLoading={loading}>
              {t("sendResetLink")}
            </Button>
          </form>
          {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
          <Link to="/login" className="mt-4 block text-sm text-primary hover:underline">
            {t("backToLogin")}
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
