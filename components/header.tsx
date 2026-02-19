"use client"

import { useState } from "react"
import { Phone, Menu, X, Globe } from "lucide-react"
import Image from "next/image"
import { useLocale } from "@/lib/locale-context"
import type { Locale } from "@/lib/i18n"

const LOCALES: Locale[] = ["sv", "en"]

export function Header() {
  const { locale, t, setLocale } = useLocale()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: t.nav.home, href: "#hem" },
    { label: t.nav.services, href: "#tjanster" },
    { label: t.nav.about, href: "#om-oss" },
    { label: t.nav.contact, href: "#kontakt" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <a href="#hem" className="flex shrink-0 items-center gap-3">
          <Image
            src="/images/logo.jpeg"
            alt="Kamiljö AB logotyp"
            width={220}
            height={90}
            className="h-14 w-auto sm:h-16 lg:h-20"
            priority
          />
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Huvudnavigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-md border border-border bg-card p-0.5">
            {LOCALES.map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={`flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium transition-colors ${
                  locale === lang
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={lang === "sv" ? "Byt till svenska" : "Switch to English"}
              >
                <Globe className="h-3 w-3" />
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <a
            href="tel:+46762124124"
            className="animate-pulse-glow flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground transition-transform hover:scale-105"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">{t.nav.emergency}</span>
            <span className="sm:hidden">Jour</span>
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-foreground lg:hidden"
            aria-label="Meny"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-border bg-card px-4 py-4 lg:hidden" aria-label="Mobilnavigation">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
