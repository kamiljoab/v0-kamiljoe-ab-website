"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Send, CheckCircle, Loader2, X } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { useContactModal } from "@/lib/contact-modal-context"

const TELEGRAM_BOT_TOKEN = "8652350468:AAEkQA8n90mL5bq45U3ZjgTyE0R8DU9kx4Q"
const TELEGRAM_CHAT_ID = "7838369609"

async function sendTelegramMessage(payload: Record<string, string>): Promise<boolean> {
  const timestamp = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })
  const message = 
    `<b>Ny förfrågan från kamiljo.se!</b>\n\n` +
    `<b>Förnamn:</b> ${payload.firstName}\n` +
    `<b>Efternamn:</b> ${payload.lastName}\n` +
    `<b>Telefon:</b> ${payload.phone}\n` +
    `<b>Meddelande:</b> ${payload.message || "Inget meddelande"}\n\n` +
    `<i>Skickat: ${timestamp}</i>`
  
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML"
      })
    })
    return true
  } catch {
    return false
  }
}

export function ContactForm() {
  const { t } = useLocale()
  const { isOpen, close } = useContactModal()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) close()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, close])

  function resetForm() {
    setSubmitted(false)
    setLoading(false)
    setError("")
    formRef.current?.reset()
  }

  function handleClose() {
    close()
    setTimeout(resetForm, 300)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const payload = {
      firstName: (formData.get("firstName") as string) || "",
      lastName: (formData.get("lastName") as string) || "",
      phone: (formData.get("phone") as string) || "",
      message: (formData.get("message") as string) || "",
    }

    sendTelegramMessage(payload)
      .catch(() => {})
      .finally(() => {
        setSubmitted(true)
        setLoading(false)
      })
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t.contact.title}
    >
      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-10 rounded-full bg-card p-2 text-muted-foreground shadow-lg transition-colors hover:bg-destructive hover:text-destructive-foreground"
          aria-label="Stäng"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-2xl">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
            <p className="font-serif text-xl font-bold text-foreground">{t.contact.success}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Vi återkommer så snart som möjligt. Vid akuta ärenden ring{" "}
              <a href="tel:+46762124124" className="font-bold text-primary">+46 762 124 124</a>
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={handleClose}
                className="rounded-lg bg-muted px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
              >
                Stäng
              </button>
              <button
                onClick={resetForm}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Skicka ny förfrågan
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-2xl">
            <div className="border-b border-border px-6 py-5 text-center">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                {t.contact.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.contact.subtitle}</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-5">
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="modal-firstName" className="mb-1.5 block text-sm font-medium text-foreground">
                      Förnamn *
                    </label>
                    <input
                      id="modal-firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder="Ditt förnamn"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-lastName" className="mb-1.5 block text-sm font-medium text-foreground">
                      Efternamn *
                    </label>
                    <input
                      id="modal-lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder="Ditt efternamn"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-phone" className="mb-1.5 block text-sm font-medium text-foreground">
                    Telefonnummer *
                  </label>
                  <input
                    id="modal-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="07X XXX XX XX"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                  />
                </div>

                <div>
                  <label htmlFor="modal-message" className="mb-1.5 block text-sm font-medium text-foreground">
                    Meddelande
                  </label>
                  <textarea
                    id="modal-message"
                    name="message"
                    rows={4}
                    placeholder="Beskriv ditt ärende här..."
                    className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Skickar...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Skicka meddelande
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
