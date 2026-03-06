"use client"

import { useState, useEffect } from "react"
import { Star, ExternalLink, MessageSquare, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/NA3Dq7cnDUCExVsy9"
const GOOGLE_MAPS_EMBED = "https://maps.google.com/maps?q=Kamilj%C3%B6+AB+Ludvika+Sweden&t=m&z=12&ie=UTF8&iwloc=&output=embed"

interface Review {
  id: string
  author: string
  rating: number
  date: string
  text: string
  avatar: string
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("sv-SE", { year: "numeric", month: "short", day: "numeric" })
}

export function GoogleReviews() {
  const { t } = useLocale()
  const [reviews, setReviews] = useState<Review[]>([])
  const [totalReviews, setTotalReviews] = useState(11)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews")
        const data = await res.json()
        setReviews(data.reviews || [])
        setTotalReviews(data.total || 11)
      } catch {
        setReviews([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchReviews()
  }, [])

  useEffect(() => {
    if (reviews.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [reviews.length])

  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % reviews.length)

  const getVisibleReviews = () => {
    if (reviews.length === 0) return []
    const visible = []
    for (let i = 0; i < Math.min(3, reviews.length); i++) {
      visible.push(reviews[(currentIndex + i) % reviews.length])
    }
    return visible
  }

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
            <span className="ml-2 text-sm font-medium text-muted-foreground">5.0 ({totalReviews} omdomen)</span>
          </div>
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t.reviews.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {t.reviews.subtitle}
          </p>
        </div>

        {isLoading ? (
          <div className="mx-auto mt-10 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="relative mx-auto mt-10 max-w-5xl">
            <button
              onClick={goToPrev}
              className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-lg transition-all hover:bg-accent hover:scale-110 sm:-left-5"
              aria-label="Foregaende omdome"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={goToNext}
              className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-lg transition-all hover:bg-accent hover:scale-110 sm:-right-5"
              aria-label="Nasta omdome"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getVisibleReviews().map((review) => (
                <div
                  key={review.id}
                  className="relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <Quote className="absolute right-4 top-4 h-6 w-6 text-primary/10" />
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-serif font-bold text-foreground">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                    </div>
                  </div>
                  <div className="mb-2 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                      />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground/60">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google Review
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-1.5">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${idx === currentIndex ? "w-6 bg-primary" : "w-2 bg-border hover:bg-primary/50"}`}
                  aria-label={`Ga till omdome ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <iframe
              src={GOOGLE_MAPS_EMBED}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kamiljo AB - VVS och Rormokare i Ludvika"
              className="w-full sm:h-[350px]"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            <Star className="h-4 w-4" />
            Se alla {totalReviews} omdomen
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
