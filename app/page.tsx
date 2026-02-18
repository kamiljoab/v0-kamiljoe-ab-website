"use client"

import { LocaleProvider } from "@/lib/locale-context"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { About } from "@/components/about"
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
          <About />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  )
}
