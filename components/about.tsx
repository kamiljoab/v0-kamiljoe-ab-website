"use client"

import { Award, Shield, Clock } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

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
      </div>
    </section>
  )
}
