import { CashbackPartners } from "@/components/cashback-partners"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kamiljo.se - 32 Partnerzy Cashback 2026",
  description:
    "Totalt 32 cashback-partners for Kamiljo.se VVS & Rormokare. Dahl, Ahlsell, Nibe, Grohe, Geberit och fler. Alla med unika UTM-koder.",
  keywords:
    "cashback, partners, kamiljo, VVS, rormokare, Dahl, Ahlsell, Nibe, Grohe, Geberit, Uponor, Hansgrohe, Danfoss, Grundfos",
  openGraph: {
    title: "Kamiljo.se - 32 Partnerzy Cashback 2026",
    description: "Totalt 32 partner! Nu kommer Kamil att kontakta alla for certifikat!",
    url: "https://www.kamiljo.se/cashback",
    siteName: "Kamiljo.se",
    type: "website",
    locale: "sv_SE",
  },
}

export default function CashbackPage() {
  return <CashbackPartners />
}
