"use client"

import { useEffect, useState } from "react"
import { Instagram, ExternalLink } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

interface InstagramPost {
  id: string
  thumbnail: string
  permalink: string
  alt: string
}

const INSTAGRAM_PROFILE = "https://www.instagram.com/kamiljoab/"

export function InstagramFeed() {
  const { t } = useLocale()
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/instagram")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts)
        } else {
          setError(true)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <section id="instagram" className="bg-card py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Instagram className="h-6 w-6 text-primary" />
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
              {t.instagram.title}
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {t.instagram.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : !error && posts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-background transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.thumbnail}
                  alt={post.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/40">
                  <span className="flex items-center gap-2 rounded-lg bg-background/90 px-4 py-2 text-sm font-medium text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ExternalLink className="h-4 w-4" />
                    {t.instagram.viewPost}
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <FallbackGrid />
        )}

        <div className="mt-10 flex justify-center">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Instagram className="h-5 w-5" />
            {t.instagram.followButton}
          </a>
        </div>
      </div>
    </section>
  )
}

function FallbackGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <a
          key={i}
          href={INSTAGRAM_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-border bg-background transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Instagram className="h-8 w-8 text-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            @kamiljoab
          </span>
        </a>
      ))}
    </div>
  )
}
