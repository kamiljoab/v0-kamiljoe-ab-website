import { CashbackPartners } from "@/components/cashback-partners"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kamiljö.se - 32 Cashback-partners 2026",
  description:
    "Totalt 32 cashback-partners för Kamiljö.se VVS & Rörmokare. Dahl, Ahlsell, Nibe, Grohe, Geberit och fler. Alla med unika UTM-koder.",
  keywords:
    "cashback, partners, kamiljö, VVS, rörmokare, Dahl, Ahlsell, Nibe, Grohe, Geberit, Uponor, Hansgrohe, Danfoss, Grundfos",
  openGraph: {
    title: "Kamiljö.se - 32 Cashback-partners 2026",
    description: "Totalt 32 partners! Nu kommer Kamil att kontakta alla för certifikat!",
    url: "https://www.kamiljo.se/cashback",
    siteName: "Kamiljö.se",
    type: "website",
    locale: "sv_SE",
  },
}

export default function CashbackPage() {
  return <CashbackPartners />
}
