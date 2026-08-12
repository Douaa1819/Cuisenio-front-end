import { useTranslation } from "react-i18next"
import { LegalPageLayout } from "../../components/legal/LegalPageLayout"

export default function PrivacyPolicyPage() {
  const { t } = useTranslation()
  return (
    <LegalPageLayout
      title={t("legal.privacy.title")}
      description={t("legal.privacy.intro")}
      path="/privacy"
      updatedLabel={t("legal.updated")}
      sections={[
        {
          heading: t("legal.privacy.s1.title"),
          paragraphs: [t("legal.privacy.s1.p1"), t("legal.privacy.s1.p2")],
        },
        {
          heading: t("legal.privacy.s2.title"),
          paragraphs: [t("legal.privacy.s2.p1")],
        },
        {
          heading: t("legal.privacy.s3.title"),
          paragraphs: [t("legal.privacy.s3.p1")],
        },
        {
          heading: t("legal.privacy.s4.title"),
          paragraphs: [t("legal.privacy.s4.p1")],
        },
      ]}
    />
  )
}
