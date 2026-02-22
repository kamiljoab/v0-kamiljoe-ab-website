import { NextResponse } from "next/server"

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
const SEARCH_QUERY = "Kamiljö AB Ludvika"

export async function GET() {
  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: "No API key" }, { status: 500 })
  }

  try {
    // Step 1: Text Search to find place
    const searchRes = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask": "places.id,places.displayName",
        },
        body: JSON.stringify({ textQuery: SEARCH_QUERY }),
      }
    )

    if (!searchRes.ok) {
      const errText = await searchRes.text()
      console.log("[v0] Search failed:", searchRes.status, errText)
      return NextResponse.json({ error: "Search failed", details: errText }, { status: 500 })
    }

    const searchData = await searchRes.json()
    console.log("[v0] Search results:", JSON.stringify(searchData).slice(0, 500))
    const placeId = searchData?.places?.[0]?.id

    if (!placeId) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 })
    }

    // Step 2: Get place details with reviews
    const detailsRes = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "rating,userRatingCount,reviews.authorAttribution.displayName,reviews.authorAttribution.photoUri,reviews.rating,reviews.relativePublishTimeDescription,reviews.text.text,reviews.publishTime,reviews.googleMapsUri",
        },
      }
    )

    if (!detailsRes.ok) {
      const errText = await detailsRes.text()
      console.log("[v0] Details failed:", detailsRes.status, errText)
      return NextResponse.json({ error: "Details failed", details: errText }, { status: 500 })
    }

    const details = await detailsRes.json()
    console.log("[v0] Place details keys:", Object.keys(details))
    console.log("[v0] Reviews count:", details.reviews?.length)

    const reviews = (details.reviews || []).slice(0, 6).map((r: Record<string, unknown>) => {
      const authorAttribution = r.authorAttribution as Record<string, string> | undefined
      const text = r.text as Record<string, string> | undefined
      return {
        authorName: authorAttribution?.displayName || "Anonymous",
        profilePhotoUrl: authorAttribution?.photoUri || "",
        rating: r.rating || 5,
        relativeTimeDescription: r.relativePublishTimeDescription || "",
        text: text?.text || "",
        googleMapsUri: r.googleMapsUri || "",
      }
    })

    return NextResponse.json(
      {
        rating: details.rating || 0,
        totalReviews: details.userRatingCount || 0,
        reviews,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    )
  } catch (err) {
    console.log("[v0] Google Reviews API error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
