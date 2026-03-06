"use client"

import { Award, Shield, Clock, MapPin } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1885.7660696366043!2d15.190684977330853!3d60.15053807979934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4660f14d57d7f0c5%3A0x3e8c43bb1c3e7a40!2sLudvika%2C%20Sweden!5e0!3m2!1ssv!2sse!4v1709913600000!5m2!1ssv!2sse"

export function About() {
  const { t } = useLocale()

  const highlights = [
    { icon: Award, label: t.about.experience },
    { icon: Shield, label: t.about.quality },
    { icon: Clock, label: t.about.available },
  ]

  return (
    <section id="om-oss" className="bg-card py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-serif text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            {t.about.title}
          </h2>
          <p className="mb-10 leading-relaxed text-muted-foreground">
            {t.about.description}
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <span className="font-serif text-sm font-bold text-foreground">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="mb-6 flex items-center justify-center gap-2 text-center">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-lg font-bold text-foreground">
              Hitta oss i Ludvika
            </h3>
          </div>
          <div className="overflow-hidden rounded-xl border border-border shadow-lg">
            <iframe
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kamiljo AB - Ludvika, Sverige"
              className="w-full"
            />
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Ludvika, Dalarna - Verksamma i hela regionen
          </p>
        </div>
      </div>
    </section>
  )
}
