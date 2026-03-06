"use client"

import { useState, useEffect } from "react"
import { Star, ExternalLink, MapPin, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/NA3Dq7cnDUCExVsy9?g_st=i&utm_campaign=ac-im"

// Statyczne opinie - mozesz je edytowac bezposrednio tutaj
const REVIEWS = [
  {
    id: 1,
    author: "Magnus Eriksson",
    rating: 5,
    date: "2024-02-15",
    text: "Fantastiskt snabb och professionell service! Hade en akut vattenläcka och Kamiljö var på plats inom en timme. Mycket nöjd med arbetet och priset var rimligt.",
    avatar: "ME",
  },
  {
    id: 2,
    author: "Anna Lindqvist",
    rating: 5,
    date: "2024-01-28",
    text: "Anlitade Kamiljö för installation av ny värmepump. Otroligt kunniga och pedagogiska. De förklarade allt steg för steg och städade efter sig. Rekommenderas varmt!",
    avatar: "AL",
  },
  {
    id: 3,
    author: "Johan Bergström",
    rating: 5,
    date: "2024-01-10",
    text: "Bästa rörmokaren i Dalarna! Har använt dem flera gånger för olika VVS-arbeten och de levererar alltid. Punktliga, proffsiga och prisvärda.",
    avatar: "JB",
  },
  {
    id: 4,
    author: "Kristina Norberg",
    rating: 5,
    date: "2023-12-20",
    text: "Helrenoverade badrummet med Kamiljö. Från start till mål var kommunikationen utmärkt. Slutresultatet överträffade mina förväntningar!",
    avatar: "KN",
  },
  {
    id: 5,
    author: "Erik Johansson",
    rating: 5,
    date: "2023-11-15",
    text: "Snabb jour-service när avloppet krånglade en lördagkväll. Tack för att ni finns tillgängliga dygnet runt! Problemet löstes på under en timme.",
    avatar: "EJ",
  },
  {
    id: 6,
    author: "Maria Andersson",
    rating: 5,
    date: "2023-10-25",
    text: "Installation av diskmaskin och tvättmaskin gick smidigt. Kamil var mycket trevlig och professionell. Kommer definitivt anlita dem igen!",
    avatar: "MA",
  },
]

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })
}

export function GoogleReviews() {
  const { t } = useLocale()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Visa 3 kort pa desktop, 1 pa mobil
  const getVisibleCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3
      if (window.innerWidth >= 640) return 2
    }
    return 1
  }

  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount())
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-rotate
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REVIEWS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const goToPrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % REVIEWS.length)
  }

  const getVisibleReviews = () => {
    const visible = []
    for (let i = 0; i < visibleCount; i++) {
      visible.push(REVIEWS[(currentIndex + i) % REVIEWS.length])
    }
    return visible
  }

  return (
    <section id="rekommendationer" className="bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-amber-400 text-amber-400"
                />
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

        {/* Reviews Carousel */}
        <div className="relative mx-auto mt-10 max-w-5xl">
          {/* Navigation buttons */}
          <button
            onClick={goToPrev}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-lg transition-all hover:bg-accent hover:scale-110 sm:-left-6"
            aria-label="Foregaende omdome"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={goToNext}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-lg transition-all hover:bg-accent hover:scale-110 sm:-right-6"
            aria-label="Nasta omdome"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* Reviews grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getVisibleReviews().map((review) => (
              <div
                key={review.id}
                className="relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />
                
                {/* Author */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-serif font-bold text-foreground">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="mb-3 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {review.text}
                </p>

                {/* Google badge */}
                <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground/60">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Publicerad pa Google
                </div>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="mt-6 flex justify-center gap-2">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentIndex(idx)
                }}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentIndex ? "w-6 bg-primary" : "bg-border hover:bg-primary/50"
                }`}
                aria-label={`Ga till omdome ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA to Google Maps */}
        <div className="mt-10 text-center">
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
