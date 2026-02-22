"use client"

import { LocaleProvider } from "@/lib/locale-context"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { GoogleReviews } from "@/components/google-reviews"
import { About } from "@/components/about"
import { InstagramFeed } from "@/components/instagram-feed"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"

export default function HomePage() {
  return (
    <LocaleProvider>
      <JsonLd />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <Services />
          <InstagramFeed />
          <GoogleReviews />
          <About />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  )
}
