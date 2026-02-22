import { NextResponse } from "next/server"

interface InstagramPost {
  id: string
  thumbnail: string
  permalink: string
  alt: string
}

export const revalidate = 3600

export async function GET() {
  const username = "kamiljoab"
  const profileUrl = `https://www.instagram.com/${username}/`

  try {
    const response = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "x-ig-app-id": "936619743392459",
        },
        next: { revalidate: 3600 },
      }
    )

    if (response.ok) {
      const data = await response.json()
      const edges =
        data?.data?.user?.edge_owner_to_timeline_media?.edges ?? []

      const posts: InstagramPost[] = edges.slice(0, 3).map(
        (edge: {
          node: {
            id: string
            shortcode: string
            thumbnail_src?: string
            display_url?: string
            accessibility_caption?: string
          }
        }) => ({
          id: edge.node.id,
          thumbnail: edge.node.thumbnail_src || edge.node.display_url || "",
          permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
          alt:
            edge.node.accessibility_caption ||
            `Instagram post by ${username}`,
        })
      )

      if (posts.length > 0) {
        return NextResponse.json({ posts, profileUrl })
      }
    }

    return NextResponse.json({ posts: [], profileUrl })
  } catch {
    return NextResponse.json({ posts: [], profileUrl })
  }
}
