"use client"

import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="border-t border-border bg-secondary py-12 text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">

          <div className="flex flex-col gap-4">
            <div className="relative h-20 w-full max-w-[200px] sm:h-24 sm:max-w-[240px]">
              <Image
                src="/images/logo.jpeg"
                alt="Kamiljö AB logotyp"
                width={240}
                height={96}
                style={{ width: "auto", height: "auto" }}
                className="max-h-full rounded-xl object-contain object-left"
                priority
              />
            </div>
            <p className="text-sm leading-relaxed text-secondary-foreground/80">
              {t.footer.tagline}
            </p>
            <div className="flex flex-col gap-1 text-sm text-secondary-foreground/70">
              <span>{t.footer.orgNr}</span>
              <span>{t.footer.fSkatt}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
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
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-sm font-bold text-secondary-foreground">
              {t.nav.services}
            </h3>
            <div className="flex flex-col gap-2 text-sm text-secondary-foreground/80">
              {t.services.items.map((service, i) => (
                <a key={i} href="#tjanster"
                  className="transition-colors hover:text-secondary-foreground">
                  {service.title}
                </a>
              ))}
            </div>
          </div>

        </div>
        <div className="mt-10 border-t border-secondary-foreground/20 pt-6 text-center text-xs text-secondary-foreground/60">
          &copy; {new Date().getFullYear()} Kamiljö AB. {t.footer.rights}
        </div>
      </div>
    </footer>
  )
}
