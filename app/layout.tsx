import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Kamiljö AB | VVS & Rörmokare i Ludvika, Dalarna",
  description:
    "Professionell rörmokare i Ludvika. VVS-installation, rörjour 24/7, värme & pannor, badrumsrenovering. Auktoriserade VVS-montörer med yrkesbevis. Ring +46 762 124 124.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sv">
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>
        {children}
      </body>
    </html>
  )
}
