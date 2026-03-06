import type { Metadata, Viewport } from "next"
import { Roboto, Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _roboto = Roboto({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "700", "900"] })
const _openSans = Open_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4338ca",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kamiljo.se"),
  title: {
    default: "Kamiljö AB | VVS & Rörmokare i Ludvika, Dalarna",
    template: "%s | Kamiljö AB",
  },
  description:
    "Professionell rörmokare i Ludvika. VVS-installation, rörjour 24/7, värme & pannor, badrumsrenovering. Auktoriserade VVS-montörer med yrkesbevis. Ring +46 762 124 124.",
  keywords:
    "rörmokare Ludvika, VVS Ludvika, rörjour Dalarna, rörmokare Borlänge, VVS Falun, rörmokare Avesta, VVS Mora, rörmokare Leksand, VVS Hedemora, rörmokare Smedjebacken, VVS Malung, rörmokare Rättvik, installera diskmaskin Dalarna, installera tvättmaskin Ludvika, montera tvättställ, installera toalett, montera duschkabin, byta radiator, installera pannrum, värmepump Dalarna, bergvärme Ludvika, vattenrening, golvvärme, varmvattenberedare, cirkulationspump, expansionskärl, säkerhetsventil, termostat, shuntventil, ROT-avdrag VVS, F-skatt rörmokare, auktoriserad rörmokare Dalarna, certifierad VVS, rörinspektion, VVS-besiktning, akut rörmokare, vattenskada, laga läckage, kavitationsteknik uppvärmning, badrumsrenovering Ludvika, stambyte Dalarna",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.kamiljo.se",
  },
  openGraph: {
    title: "Kamiljö AB | VVS & Rörmokare i Ludvika",
    description:
      "Din professionella rörmokare i Ludvika – Installation, värme, rörjour 24/7. Gratis offert inom 24h.",
    url: "https://www.kamiljo.se",
    siteName: "Kamiljö AB",
    type: "website",
    locale: "sv_SE",
    images: [
      {
        url: "/images/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Kamiljö AB - VVS & Rörmokare i Ludvika",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamiljö AB | VVS & Rörmokare i Ludvika",
    description:
      "Din professionella rörmokare i Ludvika – Installation, värme, rörjour 24/7. Gratis offert inom 24h.",
    images: ["/images/logo.jpeg"],
  },
  verification: {
    google: "Yhp89mD3iTMNlSiXpDs2nCY5OLVVBm2TMOrt2PwHAjI",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sv" className="bg-background">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXX');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
