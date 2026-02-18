"use client"

import Image from "next/image"
import { Star, ArrowRight, Phone } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

export function Hero() {
  const { t } = useLocale()

  return (
    <section id="hem" className="relative overflow-hidden bg-card">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.52_0.14_155_/_0.08),transparent_60%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 lg:flex-row lg:gap-12 lg:px-8 lg:py-24">
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-[oklch(0.75_0.18_85)] text-[oklch(0.75_0.18_85)]" />
              ))}
            </div>
            <span>5.0 {t.hero.reviews}</span>
          </div>

          <h1 className="mb-4 font-serif text-3xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-4xl lg:text-5xl">
            {t.hero.h1}
          </h1>

          <p className="mb-8 font-serif text-lg font-medium text-primary md:text-xl">
            {t.hero.h2}
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <a
              href="#kontakt"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              {t.hero.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="tel:+46762124124"
              className="flex items-center gap-2 rounded-lg border-2 border-secondary px-6 py-3 text-sm font-bold text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <Phone className="h-4 w-4" />
              +46 762 124 124
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
            <Image
              src="/images/qr-code.png"
              alt="QR-kod för att kontakta Kamiljö AB"
              width={180}
              height={180}
              className="h-44 w-44 lg:h-52 lg:w-52"
            />
          </div>
          <p className="text-sm font-medium text-muted-foreground">{t.hero.scanQr}</p>
        </div>
      </div>
    </section>
  )
}
