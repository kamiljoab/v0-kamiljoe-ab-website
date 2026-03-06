"use client"

import { useState } from "react"
import { useLocale } from "@/lib/locale-context"

const PARTNERS = [
  { name: "Dahl", url: "https://www.dfrse.se" },
  { name: "Ahlsell", url: "https://www.ahlsell.se" },
  { name: "Onninen", url: "https://www.onninen.se" },
  { name: "Rinkaby Rör", url: "https://www.rinkabyor.se" },
  { name: "Lundagrossisten", url: "https://www.lundagrossisten.se" },
  { name: "LK Systems", url: "https://www.lksystems.se" },
  { name: "Uponor", url: "https://www.uponor.com/sv-se" },
  { name: "Wavin", url: "https://www.wavin.com/sv-se" },
  { name: "Geberit", url: "https://www.geberit.se" },
  { name: "Ifö", url: "https://www.ifo.se" },
  { name: "IDO", url: "https://www.ido.se" },
  { name: "Gustavsberg", url: "https://www.gustavsberg.com/se" },
  { name: "FM Mattsson", url: "https://www.fmmattsson.se" },
  { name: "Mora Armatur", url: "https://www.moraarmatur.se" },
  { name: "Tapwell", url: "https://www.tapwell.se" },
  { name: "Hansgrohe", url: "https://www.hansgrohe.se" },
  { name: "Grohe", url: "https://www.grohe.se" },
  { name: "Villeroy & Boch", url: "https://www.villeroy-boch.se" },
  { name: "Nibe", url: "https://www.nibe.se" },
  { name: "CTC", url: "https://www.ctc.se" },
  { name: "IVT", url: "https://www.ivt.se" },
  { name: "Mitsubishi Electric", url: "https://www.mitsubishielectric.se" },
  { name: "Panasonic", url: "https://www.aircon.panasonic.eu/SE_sv/" },
  { name: "Bosch", url: "https://www.bosch-thermotechnology.com/se/sv/" },
  { name: "Danfoss", url: "https://www.danfoss.com/sv-se/" },
  { name: "Grundfos", url: "https://www.grundfos.com/se" },
  { name: "Wilo", url: "https://wilo.com/se/sv/" },
  { name: "ESBE", url: "https://www.esbe.eu/se" },
  { name: "Thermotech", url: "https://www.thermotech.se" },
  { name: "Roth", url: "https://www.roth-nordic.se" },
  { name: "Purus", url: "https://www.purus.se" },
  { name: "Jafo", url: "https://www.jafo.se" },
  { name: "Trio Perfekta", url: "https://www.trioperfekta.se" },
  { name: "Flamco", url: "https://www.flamcogroup.com" },
  { name: "Reflex", url: "https://www.reflexwinkelmann.com" },
  { name: "Viega", url: "https://www.viega.se" },
  { name: "Rehau", url: "https://www.rehau.com/se-sv" },
  { name: "Vatette", url: "https://www.vatette.se" },
]

function getLogoUrl(domain: string): string {
  try {
    const hostname = new URL(domain).hostname
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
  } catch {
    return ""
  }
}

function handlePartnerClick(url: string) {
  const width = 1000
  const height = 700
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2
  window.open(
    url,
    "_blank",
    `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=yes,status=no,scrollbars=yes,resizable=yes`
  )
}

export function Partners() {
  const { t } = useLocale()

  const doubledPartners = [...PARTNERS, ...PARTNERS]

  return (
    <section id="partners" className="bg-background py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl lg:text-4xl text-balance">
            {t.partners.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {t.partners.subtitle}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="flex animate-scroll-left gap-6 py-4">
          {doubledPartners.slice(0, PARTNERS.length).map((partner, i) => (
            <PartnerCard key={`row1-${i}`} partner={partner} />
          ))}
          {doubledPartners.slice(0, PARTNERS.length).map((partner, i) => (
            <PartnerCard key={`row1-dup-${i}`} partner={partner} />
          ))}
        </div>
      </div>

      <div className="relative mt-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="flex animate-scroll-right gap-6 py-4">
          {[...PARTNERS].reverse().map((partner, i) => (
            <PartnerCard key={`row2-${i}`} partner={partner} />
          ))}
          {[...PARTNERS].reverse().map((partner, i) => (
            <PartnerCard key={`row2-dup-${i}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnerCard({ partner }: { partner: { name: string; url: string } }) {
  const logoUrl = getLogoUrl(partner.url)
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <button
      onClick={() => handlePartnerClick(partner.url)}
      className="group flex h-20 w-44 shrink-0 cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
      title={partner.name}
    >
      {logoUrl && !imgFailed ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={logoUrl}
          alt={`${partner.name} logo`}
          className="h-8 w-8 shrink-0 rounded object-contain grayscale opacity-50 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          {partner.name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span className="truncate text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
        {partner.name}
      </span>
    </button>
  )
}
