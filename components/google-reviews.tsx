"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Star, ExternalLink, MapPin, Quote } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
const SEARCH_QUERY = "Kamiljö AB Ludvika"
const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/NA3Dq7cnDUCExVsy9?g_st=i&utm_campaign=ac-im"

interface GoogleReview {
  authorName: string
  profilePhotoUrl: string
  rating: number
  relativeTimeDescription: string
  text: string
}

interface PlaceData {
  rating: number
  totalReviews: number
  reviews: GoogleReview[]
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-6 w-6" : "h-4 w-4"
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  )
}

// Load Google Maps JS API script dynamically
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("SSR")
    if ((window as unknown as Record<string, unknown>).__googleMapsLoaded) {
      resolve()
      return
    }
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Script tag exists, wait for it
      const check = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(check)
          ;(window as unknown as Record<string, unknown>).__googleMapsLoaded = true
          resolve()
        }
      }, 100)
      setTimeout(() => {
        clearInterval(check)
        reject("Google Maps script load timeout")
      }, 10000)
      return
    }
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      ;(window as unknown as Record<string, unknown>).__googleMapsLoaded = true
      resolve()
    }
    script.onerror = () => reject("Failed to load Google Maps script")
    document.head.appendChild(script)
  })
}

export function GoogleReviews() {
  const { t } = useLocale()
  const [placeData, setPlaceData] = useState<PlaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set())
  const mapRef = useRef<HTMLDivElement>(null)

  const fetchReviews = useCallback(async () => {
    try {
      console.log("[v0] Loading Google Maps script...")
      await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      console.log("[v0] Google Maps script loaded")

      // Need a map div for PlacesService
      const mapDiv = mapRef.current
      if (!mapDiv) throw new Error("Map div not found")

      const map = new google.maps.Map(mapDiv, {
        center: { lat: 60.15, lng: 15.19 },
        zoom: 1,
      })

      const service = new google.maps.places.PlacesService(map)

      // Step 1: Find place
      const placeResult = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
        service.findPlaceFromQuery(
          {
            query: SEARCH_QUERY,
            fields: ["place_id"],
          },
          (results, status) => {
            console.log("[v0] findPlaceFromQuery status:", status, "results:", results?.length)
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
              resolve(results[0])
            } else {
              reject(new Error("Place not found: " + status))
            }
          }
        )
      })

      const placeId = placeResult.place_id
      console.log("[v0] Place ID:", placeId)

      if (!placeId) throw new Error("No place_id")

      // Step 2: Get details with reviews
      const details = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
        service.getDetails(
          {
            placeId,
            fields: ["rating", "user_ratings_total", "reviews"],
          },
          (place, status) => {
            console.log("[v0] getDetails status:", status)
            console.log("[v0] rating:", place?.rating, "total:", place?.user_ratings_total, "reviews count:", place?.reviews?.length)
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              resolve(place)
            } else {
              reject(new Error("Details failed: " + status))
            }
          }
        )
      })

      const reviews: GoogleReview[] = (details.reviews || [])
        .slice(0, 6)
        .map((r) => ({
          authorName: r.author_name || t.reviews.anonymous,
          profilePhotoUrl: r.profile_photo_url || "",
          rating: r.rating || 5,
          relativeTimeDescription: r.relative_time_description || "",
          text: r.text || "",
        }))

      setPlaceData({
        rating: details.rating || 0,
        totalReviews: details.user_ratings_total || 0,
        reviews,
      })
    } catch (err) {
      console.log("[v0] Google Reviews error:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [t.reviews.anonymous])

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.log("[v0] No API key found")
      setError(true)
      setLoading(false)
      return
    }
    fetchReviews()
  }, [fetchReviews])

  function toggleExpand(index: number) {
    setExpandedReviews((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  // Hidden map div needed by PlacesService
  const hiddenMap = (
    <div
      ref={mapRef}
      style={{ width: 0, height: 0, position: "absolute", overflow: "hidden" }}
      aria-hidden="true"
    />
  )

  // Loading state
  if (loading) {
    return (
      <section id="rekommendationer" className="bg-muted py-16 sm:py-20">
        {hiddenMap}
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-8 w-48 animate-pulse rounded-md bg-border" />
            <div className="mx-auto mt-3 h-5 w-72 animate-pulse rounded-md bg-border" />
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-border" />
                  <div className="flex-1">
                    <div className="h-4 w-24 rounded bg-border" />
                    <div className="mt-2 h-3 w-16 rounded bg-border" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded bg-border" />
                  <div className="h-3 w-4/5 rounded bg-border" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error || !placeData) {
    return (
      <section id="rekommendationer" className="bg-muted py-16 sm:py-20">
        {hiddenMap}
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t.reviews.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {t.reviews.error}
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            <MapPin className="h-4 w-4" />
            {t.reviews.viewOnGoogle}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    )
  }

  return (
    <section id="rekommendationer" className="bg-muted py-16 sm:py-20">
      {hiddenMap}
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header with rating summary */}
        <div className="text-center">
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t.reviews.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {t.reviews.subtitle}
          </p>

          {/* Overall rating badge */}
          <div className="mx-auto mt-8 inline-flex items-center gap-4 rounded-2xl border border-border bg-card px-6 py-4 shadow-sm">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-foreground">
                {placeData.rating.toFixed(1)}
              </span>
              <StarRating rating={placeData.rating} size="lg" />
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold text-foreground">
                {placeData.totalReviews}
              </span>
              <span className="text-sm text-muted-foreground">
                {t.reviews.reviewCount}
              </span>
            </div>
            <div className="h-10 w-px bg-border" />
            <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
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
          </div>
        </div>

        {/* Reviews grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeData.reviews.map((review, index) => {
            const isExpanded = expandedReviews.has(index)
            const isLong = review.text.length > 150
            const displayText =
              isLong && !isExpanded
                ? review.text.slice(0, 150) + "..."
                : review.text

            return (
              <article
                key={index}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  {review.profilePhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.profilePhotoUrl}
                      alt={review.authorName}
                      className="h-10 w-10 rounded-full bg-muted object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {review.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {review.authorName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.relativeTimeDescription}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="mt-3">
                  <StarRating rating={review.rating} size="sm" />
                </div>

                {/* Review text */}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">
                  {displayText}
                </p>
                {isLong && (
                  <button
                    onClick={() => toggleExpand(index)}
                    className="mt-1 self-start text-xs font-medium text-primary hover:underline"
                  >
                    {isExpanded ? t.reviews.showLess : t.reviews.readMore}
                  </button>
                )}
              </article>
            )
          })}
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
