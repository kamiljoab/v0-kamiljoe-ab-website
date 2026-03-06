"use client"

import { Star, ExternalLink, MessageSquare } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/NA3Dq7cnDUCExVsy9"
const GOOGLE_MAPS_EMBED = "https://maps.google.com/maps?q=Kamilj%C3%B6+AB+Ludvika+Sweden&t=m&z=12&ie=UTF8&iwloc=&output=embed"

export function GoogleReviews() {
  const { t } = useLocale()

  return (
    <section id="rekommendationer" className="bg-muted py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-muted-foreground">5.0 (11 omdomen)</span>
          </div>
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t.reviews.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {t.reviews.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <iframe
              src={GOOGLE_MAPS_EMBED}
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kamiljo AB - VVS och Rormokare i Ludvika"
              className="w-full sm:h-[400px] lg:h-[450px]"
            />
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Klicka pa kartan for att se alla 11 omdomen pa Google Maps
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            <Star className="h-4 w-4" />
            Se alla 11 omdomen
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={`${GOOGLE_MAPS_URL}?hl=sv`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-medium text-foreground transition-all hover:bg-accent hover:scale-105"
          >
            <MessageSquare className="h-4 w-4" />
            Lamna ett omdome
          </a>
        </div>
      </div>
    </section>
  )
}
