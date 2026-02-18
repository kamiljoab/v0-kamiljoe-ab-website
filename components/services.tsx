"use client"

import { Wrench, Flame, RefreshCw, Home, Lightbulb } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

const serviceIcons = [Wrench, Flame, RefreshCw, Home, Lightbulb]

export function Services() {
  const { t } = useLocale()

  return (
    <section id="tjanster" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-serif text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            {t.services.title}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((service, index) => {
            const Icon = serviceIcons[index]
            const isInnovation = index === 4

            return (
              <article
                key={index}
                className={`group relative overflow-hidden rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
                  isInnovation
                    ? "border-primary/30 bg-primary/5 sm:col-span-2 lg:col-span-1"
                    : "border-border bg-card"
                }`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                    isInnovation
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-primary"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-bold text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                {isInnovation && (
                  <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    USP
                  </span>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
