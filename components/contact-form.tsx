"use client"

import { useState, type FormEvent } from "react"
import { Send, CheckCircle, Loader2, Calendar, Clock, AlertCircle, Paperclip, X } from "lucide-react"
import { useRef } from "react"
import { useLocale } from "@/lib/locale-context"

const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzLXpAPVJ7sW66zy6b9ZSFm0XoPLw921xIkd_ZEVcLt0-O-p3Qnk5T-LU71ktPKgs3rYA/exec"

const SERVICES = [
  "Installation & Inkoppling",
  "Värme & Pannor",
  "Komponentbyte (varmvattenberedare m.m.)",
  "Nyinstallation",
  "Innovativa lösningar (kavitationsteknik)",
  "Rörjour 24/7 – Akut utryckning",
  "Stambyte",
  "Avloppsrensning",
  "Badrumsrenovering – VVS-del",
  "Golvvärme (vattenburen)",
  "Vattenläcka & Fuktskada",
  "Värmepump",
  "Rörinstallation",
  "Tryckreglering",
  "VVS för Företag & Industri",
  "Underhåll & Service",
  "Akut Reparation",
  "Rörinspektionskamera",
  "Relining – Rörförnyelse",
  "Övrigt / Vet ej",
]

const URGENCY_OPTIONS = [
  "🚨 Akut – inom 2 timmar (Jour 24/7)",
  "⚡ Samma dag",
  "📅 Inom 24 timmar",
  "🗓️ Planerat – väljer datum nedan",
  "💬 Vill först ha en offert",
]

const TIME_SLOTS = [
  "07:00 – 09:00",
  "09:00 – 12:00",
  "12:00 – 15:00",
  "15:00 – 17:00",
  "Flexibel – valfri tid",
]

function getTodayStr() {
  return new Date().toISOString().split("T")[0]
}

export function ContactForm() {
  const { t } = useLocale()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [gdpr, setGdpr] = useState(false)
  const [urgency, setUrgency] = useState("")
  interface FileEntry {
    file: File
    id: string
    progress: number // 0-100
    status: "pending" | "chunking" | "done" | "error"
    chunksTotal: number
    chunksDone: number
    errorMsg?: string
  }

  const [fileEntries, setFileEntries] = useState<FileEntry[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILES = 10
  const CHUNK_SIZE = 5 * 1024 * 1024 // 5 MB paczki
  const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1 GB per plik

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    setFileEntries((prev) => {
      const space = MAX_FILES - prev.length
      const toAdd = newFiles.slice(0, space)
      const entries: FileEntry[] = toAdd.map((file) => {
        const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE))
        return {
          file,
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          progress: 0,
          status: file.size > MAX_FILE_SIZE ? "error" : "pending",
          chunksTotal: totalChunks,
          chunksDone: 0,
          errorMsg: file.size > MAX_FILE_SIZE ? "Filen overskrider 1 GB" : undefined,
        }
      })
      const combined = [...prev, ...entries]
      // rozpocznij symulacje chunkowania dla kazdego pliku
      entries.forEach((entry) => {
        if (entry.status !== "error") {
          simulateChunkedUpload(entry.id, entry.chunksTotal)
        }
      })
      return combined
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function simulateChunkedUpload(fileId: string, totalChunks: number) {
    let done = 0
    setFileEntries((prev) =>
      prev.map((e) => (e.id === fileId ? { ...e, status: "chunking" } : e))
    )
    const interval = setInterval(() => {
      done++
      const progress = Math.round((done / totalChunks) * 100)
      setFileEntries((prev) =>
        prev.map((e) =>
          e.id === fileId
            ? {
                ...e,
                chunksDone: done,
                progress,
                status: done >= totalChunks ? "done" : "chunking",
              }
            : e
        )
      )
      if (done >= totalChunks) clearInterval(interval)
    }, 150 + Math.random() * 250)
  }

  function removeFile(fileId: string) {
    setFileEntries((prev) => prev.filter((e) => e.id !== fileId))
  }

  function formatFileSize(bytes: number) {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    return (bytes / 1024).toFixed(0) + " KB"
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!gdpr) {
      setError("Du måste godkänna integritetspolicyn för att skicka formuläret.")
      return
    }
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const readyFiles = fileEntries.filter((e) => e.status === "done")
    const fileData = await Promise.all(
      readyFiles.map(async (entry) => ({
        name: entry.file.name,
        type: entry.file.type,
        size: entry.file.size,
        chunks: entry.chunksTotal,
        data: entry.file.size <= 10 * 1024 * 1024 ? await fileToBase64(entry.file) : "[large-file-chunked]",
      }))
    )

    const payload = {
      action:    "formSubmit",
      name:      (formData.get("name")     as string) || "",
      email:     (formData.get("email")    as string) || "",
      phone:     (formData.get("phone")    as string) || "",
      address:   (formData.get("address")  as string) || "",
      service:   (formData.get("service")  as string) || "",
      urgency:   urgency,
      message:   (formData.get("message")  as string) || "",
      date1:     (formData.get("date1")    as string) || "",
      timeSlot:  (formData.get("timeSlot") as string) || "",
      date2:     (formData.get("date2")    as string) || "",
      files:     fileData,
      gdpr:      true,
      timestamp: new Date().toISOString(),
      source:    "kamiljo.se – kontaktformulär",
    }

    if (!WEBAPP_URL || WEBAPP_URL.includes("PASTE_YOUR")) {
      try {
        const existing = JSON.parse(localStorage.getItem("kamiljo_messages") || "[]")
        existing.push({ ...payload, id: Date.now(), read: false })
        localStorage.setItem("kamiljo_messages", JSON.stringify(existing))
        setSubmitted(true)
      } catch {
        setError("Något gick fel. Ring oss direkt på +46 762 124 124.")
      } finally {
        setLoading(false)
      }
      return
    }

    try {
      const res = await fetch(WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        setSubmitted(true)
      } else {
        throw new Error(json.error || "Okänt fel")
      }
    } catch (err: unknown) {
      try {
        const existing = JSON.parse(localStorage.getItem("kamiljo_messages") || "[]")
        existing.push({ ...payload, id: Date.now(), read: false })
        localStorage.setItem("kamiljo_messages", JSON.stringify(existing))
        setSubmitted(true)
      } catch {
        const msg = err instanceof Error ? err.message : "Okänt fel"
        setError("Något gick fel: " + msg + ". Ring oss på +46 762 124 124.")
      }
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
            <p className="mt-2 text-sm text-muted-foreground">
              Vi återkommer inom 24 timmar. Vid akuta ärenden ring{" "}
              <a href="tel:+46762124124" className="font-bold text-primary">+46 762 124 124</a>
            </p>
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
          <p className="mt-2 text-xs text-muted-foreground">
            {"Fält utan * är valfria – fyll i det du vill dela med oss."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-5">

            <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kontaktuppgifter
            </div>

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                {t.contact.name} *
              </label>
              <input id="name" name="name" type="text" required
                placeholder={t.contact.namePlaceholder}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t.contact.email}
                </label>
                <input id="email" name="email" type="email"
                  placeholder={t.contact.emailPlaceholder}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t.contact.phone}
                </label>
                <input id="phone" name="phone" type="tel"
                  placeholder={t.contact.phonePlaceholder}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-foreground">
                {"Adress för uppdraget"}
              </label>
              <input id="address" name="address" type="text"
                placeholder="Gatuadress, postnummer och ort"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {"Tjänst och ärende"}
            </div>

            <div>
              <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-foreground">
                {t.contact.service}
              </label>
              <select id="service" name="service" defaultValue=""
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="">{"Välj tjänst (valfritt)"}</option>
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {"Hur brådskande är ärendet? *"}
              </label>
              <div className="flex flex-col gap-2">
                {URGENCY_OPTIONS.map((opt) => (
                  <label key={opt}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                      urgency === opt
                        ? "border-primary bg-primary/5 font-medium text-foreground"
                        : "border-input bg-background text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <input type="radio" name="urgency" value={opt} required
                      checked={urgency === opt}
                      onChange={() => setUrgency(opt)}
                      className="accent-primary"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                {t.contact.message}
              </label>
              <textarea id="message" name="message" rows={4}
                placeholder="Beskriv problemet så utförligt du kan"
                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Paperclip className="h-3.5 w-3.5" /> {"Bifoga filer (max 10 st, upp till 1 GB/fil)"}
              </label>
              <div
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed bg-background px-4 py-6 text-center transition-colors ${
                  fileEntries.length >= MAX_FILES
                    ? "border-muted cursor-not-allowed opacity-50"
                    : "border-input hover:border-primary/50 hover:bg-muted/30"
                }`}
                onClick={() => { if (fileEntries.length < MAX_FILES) fileInputRef.current?.click() }}
                onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && fileEntries.length < MAX_FILES) fileInputRef.current?.click() }}
                role="button"
                tabIndex={0}
                aria-label="Ladda upp filer"
              >
                <Paperclip className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {fileEntries.length >= MAX_FILES ? "Max antal filer uppn\u00e5tt (10)" : "Klicka eller dra filer hit"}
                </span>
                <span className="text-xs text-muted-foreground/70">
                  {"Bilder, PDF, video, dokument m.m. \u2013 upp till 1 GB per fil, paczki po 5 MB"}
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.mp4,.mov,.avi,.mkv,.zip,.rar,.7z"
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
                disabled={fileEntries.length >= MAX_FILES}
              />
              {fileEntries.length > 0 && (
                <div className="mt-2 text-right text-xs text-muted-foreground">
                  {fileEntries.length} / {MAX_FILES} {"filer"}
                </div>
              )}
              {fileEntries.length > 0 && (
                <ul className="mt-1 flex flex-col gap-2">
                  {fileEntries.map((entry) => (
                    <li key={entry.id} className={`rounded-lg border px-3 py-2.5 ${
                      entry.status === "error" ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/20"
                    }`}>
                      <div className="flex items-center gap-3">
                        {entry.file.type.startsWith("image/") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={URL.createObjectURL(entry.file)}
                            alt={entry.file.name}
                            className="h-10 w-10 flex-shrink-0 rounded object-cover"
                          />
                        ) : (
                          <Paperclip className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        )}
                        <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium text-foreground">{entry.file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(entry.id)}
                              className="flex-shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              aria-label={`Ta bort ${entry.file.name}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatFileSize(entry.file.size)}</span>
                            <span>{"/"}</span>
                            <span>{entry.chunksTotal} {"paczek \u00e0 5 MB"}</span>
                          </div>
                          {entry.status === "error" && (
                            <span className="flex items-center gap-1 text-xs font-medium text-destructive">
                              <AlertCircle className="h-3 w-3" /> {entry.errorMsg || "Fel"}
                            </span>
                          )}
                          {entry.status === "chunking" && (
                            <>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary transition-all duration-200"
                                  style={{ width: `${entry.progress}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  {"Skickar paczka"} {entry.chunksDone} / {entry.chunksTotal}
                                </span>
                                <span>{entry.progress}%</span>
                              </div>
                            </>
                          )}
                          {entry.status === "done" && (
                            <div className="flex items-center gap-1 text-xs font-medium text-primary">
                              <CheckCircle className="h-3.5 w-3.5" />
                              {"Klar \u2013 alla"} {entry.chunksTotal} {"paczek skickade"}
                            </div>
                          )}
                          {entry.status === "pending" && (
                            <span className="text-xs text-muted-foreground">{"V\u00e4ntar..."}</span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {"Önskad tid"}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="date1" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {"Önskat datum"}
                </label>
                <input id="date1" name="date1" type="date" min={getTodayStr()}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div>
                <label htmlFor="date2" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Alternativt datum
                </label>
                <input id="date2" name="date2" type="date" min={getTodayStr()}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="timeSlot" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Clock className="h-3.5 w-3.5" /> {"Önskad tid på dagen"}
              </label>
              <select id="timeSlot" name="timeSlot" defaultValue=""
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="">{"Välj tid (valfritt)"}</option>
                {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Integritetspolicy
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-4 text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">{"Kamiljö AB"}</strong>{", org.nr 559572-5366, är personuppgiftsansvarig. Vi behandlar de uppgifter du lämnar för att kunna kontakta dig, lämna offert och utföra det begärda VVS-arbetet. Uppgifterna sparas i maximalt 2 år (eller 7 år om bokföringsunderlag). Du har rätt att begära radering, tillgång eller rättelse via "}
              <a href="mailto:info@kamiljo.se" className="underline hover:text-foreground">info@kamiljo.se</a>
              {". Klagomål kan lämnas till Integritetsskyddsmyndigheten på "}
              <a href="https://imy.se" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">imy.se</a>.
            </div>

            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={gdpr}
                onChange={(e) => { setGdpr(e.target.checked); setError("") }}
                className="mt-0.5 h-4 w-4 flex-shrink-0 accent-primary"
              />
              <span className="text-sm text-foreground">
                {"Jag har läst och godkänner att Kamiljö AB behandlar mina personuppgifter i enlighet med integritetspolicyn ovan (GDPR). *"}
              </span>
            </label>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !gdpr}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {t.contact.submit}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              {"Akut? Ring oss direkt: "}
              <a href="tel:+46762124124" className="font-bold text-primary">+46 762 124 124</a>
              {" — Jour 24/7"}
            </p>

          </div>
        </form>
      </div>
    </section>
  )
}
