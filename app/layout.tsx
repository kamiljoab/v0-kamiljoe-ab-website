import type { Metadata } from "next"
import { Roboto, Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _roboto = Roboto({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "700", "900"] })
const _openSans = Open_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "Kamiljö AB | VVS & Rörmokare i Ludvika, Dalarna",
  description:
    "Professionell rörmokare i Ludvika. VVS-installation, rörjour 24/7, värme & pannor, badrumsrenovering. Auktoriserade VVS-montörer med yrkesbevis. Ring +46 762 124 124.",
  keywords:
    "rörmokare Ludvika, VVS Ludvika, rörjour Dalarna, rörmokare Borlänge, VVS Falun, rörmokare Avesta, VVS Mora, rörmokare Leksand, VVS Hedemora, rörmokare Smedjebacken, VVS Malung, rörmokare Rättvik, installera diskmaskin Dalarna, installera tvättmaskin Ludvika, montera tvättställ, installera toalett, montera duschkabin, byta radiator, installera pannrum, värmepump Dalarna, bergvärme Ludvika, vattenrening, golvvärme, varmvattenberedare, cirkulationspump, expansionskärl, säkerhetsventil, termostat, shuntventil, ROT-avdrag VVS, F-skatt rörmokare, auktoriserad rörmokare Dalarna, certifierad VVS, rörinspektion, VVS-besiktning, akut rörmokare, vattenskada, laga läckage, kavitationsteknik uppvärmning, badrumsrenovering Ludvika, stambyte Dalarna",
  openGraph: {
    title: "Kamiljö AB | VVS & Rörmokare i Ludvika",
    description:
      "Din professionella rörmokare i Ludvika – Installation, värme, rörjour 24/7. Gratis offert inom 24h.",
    type: "website",
    locale: "sv_SE",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sv">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
