"use client"

import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="border-t border-border bg-secondary py-12 text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">

          <div className="flex flex-col gap-4">
            <div className="relative h-16 w-full max-w-[180px] sm:h-20 sm:max-w-[200px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.jpeg"
                alt="Kamiljö AB - VVS och Rörmokare i Ludvika, Dalarna"
                width={200}
                height={80}
                className="h-full w-auto rounded-xl object-contain object-left"
                loading="lazy"
              />
            </div>
            <p className="text-sm leading-relaxed text-secondary-foreground/80">
              {t.footer.tagline}
            </p>
            <div className="flex flex-col gap-1 text-sm text-secondary-foreground/70">
              <a
                href="https://www.bolagsfakta.se/5595725366-Kamiljo_AB"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-secondary-foreground/30 underline-offset-2 transition-colors hover:text-secondary-foreground hover:decoration-secondary-foreground"
              >
                {t.footer.orgNr}
              </a>
              <span>{t.footer.fSkatt}</span>
            </div>
          </div>

          <nav className="flex flex-col gap-4" aria-label="Kontaktinformation">
            <h3 className="font-serif text-sm font-bold text-secondary-foreground">
              {t.nav.contact}
            </h3>
            <div className="flex flex-col gap-3 text-sm text-secondary-foreground/80">
              <a href="tel:+46762124124"
                className="flex items-center gap-2 transition-colors hover:text-secondary-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                +46 762 124 124
              </a>
              <a href="mailto:info@kamiljo.se"
                className="flex items-center gap-2 transition-colors hover:text-secondary-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                info@kamiljo.se
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                {t.footer.address}
              </span>
            </div>
          </nav>

          <nav className="flex flex-col gap-4" aria-label="Tjänster">
            <h3 className="font-serif text-sm font-bold text-secondary-foreground">
              {t.nav.services}
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-secondary-foreground/80">
              {t.services.items.map((service, i) => (
                <li key={i}>
                  <a href="#tjanster" className="transition-colors hover:text-secondary-foreground" aria-label="Gå till tjänster">
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

        </div>
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-secondary-foreground/20 pt-6 text-xs text-secondary-foreground/60">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/integritetspolicy" className="transition-colors hover:text-secondary-foreground">
              Integritetspolicy
            </Link>
            <span className="hidden sm:inline">|</span>
            <a href="mailto:info@kamiljo.se" className="transition-colors hover:text-secondary-foreground">
              GDPR-förfrågan
            </a>
          </div>
          <p>&copy; {new Date().getFullYear()} Kamiljö AB. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
