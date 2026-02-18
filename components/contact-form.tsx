"use client"

import { useState, type FormEvent } from "react"
import { Send, CheckCircle, Loader2 } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

export function ContactForm() {
  const { t } = useLocale()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string,
      message: formData.get("message") as string,
      timestamp: new Date().toISOString(),
    }

    try {
      const existing = JSON.parse(localStorage.getItem("kamiljo_messages") || "[]")
      existing.push({ ...data, id: Date.now(), read: false })
      localStorage.setItem("kamiljo_messages", JSON.stringify(existing))
      setSubmitted(true)
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section id="kontakt" className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-xl px-4 text-center lg:px-8">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-10">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
            <p className="font-serif text-xl font-bold text-foreground">{t.contact.success}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="kontakt" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-3 font-serif text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            {t.contact.title}
          </h2>
          <p className="text-muted-foreground">{t.contact.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                {t.contact.name}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder={t.contact.namePlaceholder}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t.contact.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t.contact.emailPlaceholder}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t.contact.phone}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t.contact.phonePlaceholder}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-foreground">
                {t.contact.service}
              </label>
              <select
                id="service"
                name="service"
                required
                defaultValue=""
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
              >
                <option value="" disabled>
                  {t.contact.selectService}
                </option>
                {t.contact.serviceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                {t.contact.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                placeholder={t.contact.messagePlaceholder}
                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
              />
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-3 text-center text-xs text-muted-foreground">
              Turnstile CAPTCHA placeholder
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {t.contact.submit}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
