import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import client from "../../api/client"
import { routes } from "../../api/routes"
import { LegalPageLayout } from "../../components/legal/LegalPageLayout"

export default function NewsletterUnsubscribePage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const [message, setMessage] = useState(t("newsletter.unsubscribe.loading"))
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const token = params.get("token")
    if (!token) {
      setMessage(t("newsletter.unsubscribe.invalid"))
      return
    }
    void client
      .get<{ message: string }>(`${routes.newsletter.unsubscribe}?token=${encodeURIComponent(token)}`)
      .then(() => {
        setOk(true)
        setMessage(t("newsletter.unsubscribe.successHint"))
      })
      .catch(() => {
        setOk(false)
        setMessage(t("newsletter.unsubscribe.invalid"))
      })
  }, [params, t])

  return (
    <LegalPageLayout
      title={t("newsletter.unsubscribe.title")}
      description={message}
      path="/newsletter/unsubscribe"
      updatedLabel={ok ? t("newsletter.unsubscribe.done") : t("newsletter.unsubscribe.meta")}
      sections={[
        {
          heading: ok ? t("newsletter.unsubscribe.done") : t("newsletter.unsubscribe.meta"),
          paragraphs: [
            ok ? t("newsletter.unsubscribe.successHint") : t("newsletter.unsubscribe.help"),
          ],
        },
      ]}
    />
  )
}
