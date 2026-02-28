"use client"

import { useState } from "react"
import { ExternalLink, Globe, Award, TrendingUp } from "lucide-react"

const PARTNERS = [
  { id: 1, name: "Dahl", url: "https://www.dfrse.se", utm: "partner1_cashback", category: "VVS Grossist" },
  { id: 2, name: "Ahlsell", url: "https://www.ahlsell.se", utm: "partner2_se", category: "VVS Grossist" },
  { id: 3, name: "Onninen", url: "https://www.onninen.se", utm: "partner3_cashback", category: "VVS Grossist" },
  { id: 4, name: "Rinkaby Ror", url: "https://www.rinkabyor.se", utm: "partner4_se", category: "VVS Grossist" },
  { id: 5, name: "Lundagrossisten", url: "https://www.lundagrossisten.se", utm: "partner5_cashback", category: "VVS Grossist" },
  { id: 6, name: "LK Systems", url: "https://www.lksystems.se", utm: "partner6_se", category: "Ror & System" },
  { id: 7, name: "Uponor", url: "https://www.uponor.com/sv-se", utm: "partner7_cashback", category: "Ror & System" },
  { id: 8, name: "Wavin", url: "https://www.wavin.com/sv-se", utm: "partner8_se", category: "Ror & System" },
  { id: 9, name: "Geberit", url: "https://www.geberit.se", utm: "partner9_cashback", category: "Sanitar" },
  { id: 10, name: "Ifo", url: "https://www.ifo.se", utm: "partner10_se", category: "Sanitar" },
  { id: 11, name: "IDO", url: "https://www.ido.se", utm: "partner11_cashback", category: "Sanitar" },
  { id: 12, name: "Gustavsberg", url: "https://www.gustavsberg.com/se", utm: "partner12_se", category: "Sanitar" },
  { id: 13, name: "FM Mattsson", url: "https://www.fmmattsson.se", utm: "partner13_cashback", category: "Blandare" },
  { id: 14, name: "Mora Armatur", url: "https://www.moraarmatur.se", utm: "partner14_se", category: "Blandare" },
  { id: 15, name: "Tapwell", url: "https://www.tapwell.se", utm: "partner15_cashback", category: "Blandare" },
  { id: 16, name: "Hansgrohe", url: "https://www.hansgrohe.se", utm: "partner16_se", category: "Blandare" },
  { id: 17, name: "Grohe", url: "https://www.grohe.se", utm: "partner17_cashback", category: "Blandare" },
  { id: 18, name: "Villeroy & Boch", url: "https://www.villeroy-boch.se", utm: "partner18_se", category: "Sanitar" },
  { id: 19, name: "Nibe", url: "https://www.nibe.se", utm: "partner19_cashback", category: "Varme" },
  { id: 20, name: "CTC", url: "https://www.ctc.se", utm: "partner20_se", category: "Varme" },
  { id: 21, name: "IVT", url: "https://www.ivt.se", utm: "partner21_cashback", category: "Varme" },
  { id: 22, name: "Mitsubishi Electric", url: "https://www.mitsubishielectric.se", utm: "partner22_se", category: "Varme" },
  { id: 23, name: "Panasonic", url: "https://www.aircon.panasonic.eu/SE_sv/", utm: "partner23_cashback", category: "Varme" },
  { id: 24, name: "Bosch", url: "https://www.bosch-thermotechnology.com/se/sv/", utm: "partner24_se", category: "Varme" },
  { id: 25, name: "Danfoss", url: "https://www.danfoss.com/sv-se/", utm: "partner25_cashback", category: "Komponenter" },
  { id: 26, name: "Grundfos", url: "https://www.grundfos.com/se", utm: "partner26_se", category: "Komponenter" },
  { id: 27, name: "Wilo", url: "https://wilo.com/se/sv/", utm: "partner27_cashback", category: "Komponenter" },
  { id: 28, name: "ESBE", url: "https://www.esbe.eu/se", utm: "partner28_se", category: "Komponenter" },
  { id: 29, name: "Thermotech", url: "https://www.thermotech.se", utm: "partner29_cashback", category: "Golvvarme" },
  { id: 30, name: "Roth", url: "https://www.roth-nordic.se", utm: "partner30_se", category: "Golvvarme" },
  { id: 31, name: "Purus", url: "https://www.purus.se", utm: "partner31_cashback", category: "Avlopp" },
  { id: 32, name: "Jafo", url: "https://www.jafo.se", utm: "partner32_se", category: "Avlopp" },
]

function getLogoUrl(domain: string): string {
  try {
    const hostname = new URL(domain).hostname
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
  } catch {
    return ""
  }
}

function buildUtmUrl(url: string, utm: string): string {
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}utm_source=kamiljo_se&utm_medium=cashback&utm_campaign=${utm}`
}

function PartnerCard({ partner }: { partner: (typeof PARTNERS)[0] }) {
  const logoUrl = getLogoUrl(partner.url)
  const [imgFailed, setImgFailed] = useState(false)
  const utmUrl = buildUtmUrl(partner.url, partner.utm)

  return (
    <a
      href={utmUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-center gap-3 rounded-2xl border border-[oklch(0.7_0.15_270/0.2)] bg-[oklch(1_0_0/0.08)] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[oklch(0.6_0.2_270/0.5)] hover:bg-[oklch(1_0_0/0.15)] hover:shadow-[0_8px_32px_oklch(0.5_0.2_270/0.3)]"
    >
      <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,oklch(0.7_0.15_270/0.05),oklch(0.5_0.2_290/0.08))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-[oklch(1_0_0/0.15)] ring-1 ring-[oklch(0.7_0.15_270/0.2)] transition-all duration-300 group-hover:ring-[oklch(0.6_0.2_270/0.4)]">
        {logoUrl && !imgFailed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={logoUrl}
            alt={`${partner.name} logo`}
            className="h-8 w-8 rounded object-contain transition-all duration-300 group-hover:scale-110"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="text-lg font-bold text-[oklch(0.85_0.1_270)]">
            {partner.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="relative text-center">
        <span className="block text-sm font-semibold text-[oklch(0.95_0.02_270)] transition-colors group-hover:text-[oklch(1_0_0)]">
          {partner.name}
        </span>
        <span className="mt-0.5 block text-xs text-[oklch(0.7_0.08_270)]">
          {partner.category}
        </span>
      </div>
      <ExternalLink className="absolute right-3 top-3 h-3.5 w-3.5 text-[oklch(0.6_0.1_270)] opacity-0 transition-all duration-300 group-hover:opacity-100" />
    </a>
  )
}

export function CashbackPartners() {
  const categories = [...new Set(PARTNERS.map((p) => p.category))]
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? PARTNERS.filter((p) => p.category === activeCategory)
    : PARTNERS

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,oklch(0.2_0.08_270),oklch(0.15_0.12_285),oklch(0.18_0.1_300))]">
      {/* Hero section with thumbnail */}
      <section className="relative overflow-hidden px-4 pb-12 pt-10 md:pt-16 md:pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-[oklch(0.4_0.15_270/0.15)] blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[oklch(0.35_0.18_290/0.15)] blur-[128px]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[oklch(0.6_0.15_270/0.3)] bg-[oklch(1_0_0/0.06)] px-4 py-2 backdrop-blur-sm">
            <Award className="h-4 w-4 text-[oklch(0.75_0.15_270)]" />
            <span className="text-xs font-medium text-[oklch(0.8_0.1_270)]">Cashback Program 2026</span>
          </div>

          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-[oklch(0.95_0.03_270)] md:text-5xl lg:text-6xl">
            Kamiljo.se - 32 Partnerzy Cashback 2026
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-[oklch(0.75_0.08_270)] md:text-lg">
            Totalt 32 partner! Nu kommer Kamil att kontakta alla for certifikat!
          </p>

          {/* Clickable thumbnail of kamiljo.se */}
          <div className="mx-auto mt-10 max-w-2xl">
            <a
              href="https://www.kamiljo.se"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl border border-[oklch(0.6_0.15_270/0.3)] shadow-[0_4px_24px_oklch(0.4_0.2_270/0.2)] transition-all duration-500 hover:border-[oklch(0.6_0.2_270/0.5)] hover:shadow-[0_8px_48px_oklch(0.5_0.2_270/0.3)]"
            >
              <div className="relative aspect-video overflow-hidden bg-[oklch(0.12_0.05_270)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://image.thum.io/get/width/1200/crop/700/https://www.kamiljo.se"
                  alt="Kamiljo.se - live preview of the website"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.15_0.1_270/0.6),transparent_50%)]" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 md:p-6">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[oklch(0.8_0.12_270)]" />
                  <span className="text-sm font-medium text-[oklch(0.9_0.05_270)]">www.kamiljo.se</span>
                </div>
                <span className="rounded-full bg-[oklch(1_0_0/0.12)] px-3 py-1 text-xs font-medium text-[oklch(0.9_0.05_270)] backdrop-blur-md transition-colors group-hover:bg-[oklch(1_0_0/0.2)]">
                  Besok sidan
                </span>
              </div>
            </a>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4">
            {[
              { value: "32", label: "Partners" },
              { value: "2026", label: "Aktiv" },
              { value: "100%", label: "Cashback" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[oklch(0.6_0.12_270/0.15)] bg-[oklch(1_0_0/0.05)] p-3 backdrop-blur-sm"
              >
                <div className="text-xl font-bold text-[oklch(0.9_0.1_270)] md:text-2xl">{stat.value}</div>
                <div className="text-xs text-[oklch(0.6_0.08_270)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner list */}
      <section className="relative px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-[oklch(0.7_0.15_270)]" />
            <h2 className="text-lg font-bold text-[oklch(0.9_0.05_270)] md:text-xl">
              Alla 32 Cashback Partners
            </h2>
          </div>

          {/* Category filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                activeCategory === null
                  ? "bg-[oklch(0.5_0.18_270)] text-[oklch(0.95_0.02_270)] shadow-[0_2px_12px_oklch(0.5_0.2_270/0.3)]"
                  : "border border-[oklch(0.5_0.1_270/0.2)] bg-[oklch(1_0_0/0.05)] text-[oklch(0.7_0.08_270)] hover:bg-[oklch(1_0_0/0.1)]"
              }`}
            >
              Alla ({PARTNERS.length})
            </button>
            {categories.map((cat) => {
              const count = PARTNERS.filter((p) => p.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[oklch(0.5_0.18_270)] text-[oklch(0.95_0.02_270)] shadow-[0_2px_12px_oklch(0.5_0.2_270/0.3)]"
                      : "border border-[oklch(0.5_0.1_270/0.2)] bg-[oklch(1_0_0/0.05)] text-[oklch(0.7_0.08_270)] hover:bg-[oklch(1_0_0/0.1)]"
                  }`}
                >
                  {cat} ({count})
                </button>
              )
            })}
          </div>

          {/* Partner grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
            {filtered.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-12 rounded-2xl border border-[oklch(0.5_0.1_270/0.15)] bg-[oklch(1_0_0/0.04)] p-6 text-center backdrop-blur-sm">
            <p className="text-sm leading-relaxed text-[oklch(0.65_0.08_270)]">
              Alla partnerlankar innehaller unika UTM-koder for sparing. Klicka pa en partner for att oppna deras webbplats med din cashback-kod.
            </p>
          </div>
        </div>
      </section>

      {/* Schema.org PartnerProgram JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Kamiljo.se - 32 Partnerzy Cashback 2026",
            description: "Totalt 32 cashback-partners for Kamiljo.se VVS & Rormokare i Dalarna.",
            url: "https://www.kamiljo.se/cashback",
            mainEntity: {
              "@type": "ItemList",
              name: "Cashback Partner Program",
              numberOfItems: 32,
              itemListElement: PARTNERS.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Organization",
                  name: p.name,
                  url: p.url,
                  description: `${p.name} - ${p.category} partner i Kamiljo cashback-program`,
                },
              })),
            },
            isPartOf: {
              "@type": "WebSite",
              name: "Kamiljo.se",
              url: "https://www.kamiljo.se",
            },
          }),
        }}
      />
    </div>
  )
}
