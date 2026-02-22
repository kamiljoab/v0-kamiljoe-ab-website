"use client"

import { useEffect, useState } from "react"
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
  time: number
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

export function GoogleReviews() {
  const { t } = useLocale()
  const [placeData, setPlaceData] = useState<PlaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError(true)
      setLoading(false)
      return
    }
    fetchReviews()
  }, [])

  async function fetchReviews() {
    try {
      console.log("[v0] Google API Key present:", !!GOOGLE_MAPS_API_KEY, "length:", GOOGLE_MAPS_API_KEY.length)

      // Step 1: Text Search to find Place ID
      const searchRes = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask": "places.id",
          },
          body: JSON.stringify({ textQuery: SEARCH_QUERY }),
        }
      )

      console.log("[v0] Search response status:", searchRes.status)
      if (!searchRes.ok) {
        const errText = await searchRes.text()
        console.log("[v0] Search error body:", errText)
        throw new Error("Search failed: " + errText)
      }
      const searchData = await searchRes.json()
      console.log("[v0] Search data:", JSON.stringify(searchData))
      const placeId = searchData?.places?.[0]?.id
      console.log("[v0] Place ID:", placeId)

      if (!placeId) throw new Error("Place not found")

      // Step 2: Get Place Details with reviews
      const detailsRes = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          headers: {
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask":
              "rating,userRatingCount,reviews.authorAttribution,reviews.rating,reviews.relativePublishTimeDescription,reviews.text,reviews.publishTime",
          },
        }
      )

      console.log("[v0] Details response status:", detailsRes.status)
      if (!detailsRes.ok) {
        const errText = await detailsRes.text()
        console.log("[v0] Details error body:", errText)
        throw new Error("Details failed: " + errText)
      }
      const details = await detailsRes.json()
      console.log("[v0] Details data:", JSON.stringify(details).slice(0, 2000))

      const reviews: GoogleReview[] = (details.reviews || [])
        .slice(0, 6)
        .map((r: Record<string, unknown>) => {
          const authorAttribution = r.authorAttribution as Record<string, string> | undefined
          const textObj = r.text as Record<string, string> | undefined
          return {
            authorName: authorAttribution?.displayName || t.reviews.anonymous,
            profilePhotoUrl: authorAttribution?.photoUri || "",
            rating: (r.rating as number) || 5,
            relativeTimeDescription: (r.relativePublishTimeDescription as string) || "",
            text: textObj?.text || "",
            time: r.publishTime
              ? new Date(r.publishTime as string).getTime() / 1000
              : 0,
          }
        })

      setPlaceData({
        rating: details.rating || 0,
        totalReviews: details.userRatingCount || 0,
        reviews,
      })
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

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

  // Loading state
  if (loading) {
    return (
      <section id="rekommendationer" className="bg-muted py-16 sm:py-20">
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
