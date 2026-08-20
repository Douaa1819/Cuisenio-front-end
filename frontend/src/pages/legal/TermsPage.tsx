import { useTranslation } from "react-i18next"
import { LegalPageLayout } from "../../components/legal/LegalPageLayout"

export default function TermsPage() {
  const { t } = useTranslation()
  return (
    <LegalPageLayout
      title={t("legal.terms.title")}
      description={t("legal.terms.intro")}
      path="/terms"
      updatedLabel={t("legal.updated")}
      sections={[
        {
          heading: t("legal.terms.s1.title"),
          paragraphs: [t("legal.terms.s1.p1")],
        },
        {
          heading: t("legal.terms.s2.title"),
          paragraphs: [t("legal.terms.s2.p1")],
        },
        {
          heading: t("legal.terms.s3.title"),
          paragraphs: [t("legal.terms.s3.p1")],
        },
      ]}
    />
  )
}
