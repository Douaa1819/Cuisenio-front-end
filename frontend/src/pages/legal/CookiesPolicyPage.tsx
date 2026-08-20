import { useTranslation } from "react-i18next"
import { LegalPageLayout } from "../../components/legal/LegalPageLayout"

export default function CookiesPolicyPage() {
  const { t } = useTranslation()
  return (
    <LegalPageLayout
      title={t("legal.cookies.title")}
      description={t("legal.cookies.intro")}
      path="/cookies"
      updatedLabel={t("legal.updated")}
      sections={[
        {
          heading: t("legal.cookies.s1.title"),
          paragraphs: [t("legal.cookies.s1.p1")],
        },
        {
          heading: t("legal.cookies.s2.title"),
          paragraphs: [t("legal.cookies.s2.p1")],
        },
        {
          heading: t("legal.cookies.s3.title"),
          paragraphs: [t("legal.cookies.s3.p1")],
        },
      ]}
    />
  )
}
