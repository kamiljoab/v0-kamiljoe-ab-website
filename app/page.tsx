"use client"

import { LocaleProvider } from "@/lib/locale-context"
import { ContactModalProvider } from "@/lib/contact-modal-context"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { GoogleReviews } from "@/components/google-reviews"
import { About } from "@/components/about"
import { Partners } from "@/components/partners"
import { InstagramFeed } from "@/components/instagram-feed"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"

export default function HomePage() {
  return (
    <LocaleProvider>
      <ContactModalProvider>
        <JsonLd />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Hero />
            <Services />
            <InstagramFeed />
            <GoogleReviews />
            <About />
            <Partners />
          </main>
          <Footer />
        </div>
        <ContactForm />
      </ContactModalProvider>
    </LocaleProvider>
  )
}
