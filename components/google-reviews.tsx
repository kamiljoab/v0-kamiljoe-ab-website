"use client"

import { Star, ExternalLink, MapPin } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/NA3Dq7cnDUCExVsy9?g_st=i&utm_campaign=ac-im"

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
            <span className="ml-2 text-sm font-medium text-muted-foreground">5.0</span>
          </div>
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t.reviews.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {t.reviews.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1885.7660696366043!2d15.190684977330853!3d60.15053807979934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4660f14d57d7f0c5%3A0x3e8c43bb1c3e7a40!2sLudvika%2C%20Sweden!5e0!3m2!1ssv!2sse!4v1709913600000!5m2!1ssv!2sse"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kamiljo AB lokalizacja na Google Maps - Ludvika, Dalarna"
              className="w-full sm:h-[300px]"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            <MapPin className="h-4 w-4" />
            {t.reviews.viewOnGoogle}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
