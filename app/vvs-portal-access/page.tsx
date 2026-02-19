"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Mail,
  MailOpen,
  Trash2,
  RefreshCw,
  LayoutDashboard,
  Image as ImageIcon,
  Inbox,
  Eye,
  EyeOff,
  ArrowLeft,
  Upload,
  X,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  name: string
  email: string
  phone: string
  service: string
  message: string
  timestamp: string
  read: boolean
}

interface GalleryImage {
  id: number
  name: string
  url: string
  addedAt: string
}

type Tab = "messages" | "gallery"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("messages")
  const [messages, setMessages] = useState<Message[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const loadMessages = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("kamiljo_messages") || "[]")
      setMessages(stored)
    } catch {
      setMessages([])
    }
  }, [])

  const loadGallery = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("kamiljo_gallery") || "[]")
      setGallery(stored)
    } catch {
      setGallery([])
    }
  }, [])

  useEffect(() => {
    loadMessages()
    loadGallery()
  }, [loadMessages, loadGallery])

  function toggleRead(id: number) {
    const updated = messages.map((m) =>
      m.id === id ? { ...m, read: !m.read } : m
    )
    setMessages(updated)
    localStorage.setItem("kamiljo_messages", JSON.stringify(updated))
  }

  function deleteMessage(id: number) {
    const updated = messages.filter((m) => m.id !== id)
    setMessages(updated)
    localStorage.setItem("kamiljo_messages", JSON.stringify(updated))
    if (selectedMessage?.id === id) setSelectedMessage(null)
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return

    const promises = Array.from(files).map((file) => {
      return new Promise<GalleryImage | null>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({
            id: Date.now() + Math.random(),
            name: file.name,
            url: reader.result as string,
            addedAt: new Date().toISOString(),
          })
        }
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(promises).then((results) => {
      const newImages = results.filter((img): img is GalleryImage => img !== null)
      if (newImages.length === 0) return

      setGallery((prev) => {
        const updated = [...prev, ...newImages]
        localStorage.setItem("kamiljo_gallery", JSON.stringify(updated))
        return updated
      })
    })
  }

  function deleteImage(id: number) {
    const updated = gallery.filter((img) => img.id !== id)
    setGallery(updated)
    localStorage.setItem("kamiljo_gallery", JSON.stringify(updated))
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-secondary">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-secondary-foreground/80 transition-colors hover:text-secondary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Strona glowna
            </Link>
            <div className="h-5 w-px bg-secondary-foreground/20" />
            <h1 className="font-serif text-lg font-bold text-secondary-foreground">
              Panel Administracyjny
            </h1>
          </div>
          <span className="text-xs text-secondary-foreground/60">Kamiljo AB</span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "messages"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-accent"
            }`}
          >
            <Inbox className="h-4 w-4" />
            Wiadomosci
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "gallery"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-accent"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Galeria zdjec
          </button>
        </div>

        {activeTab === "messages" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col gap-2">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-serif text-sm font-bold text-foreground">
                  Lista wiadomosci ({messages.length})
                </h2>
                <button
                  onClick={loadMessages}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-3 w-3" />
                  Odswiez
                </button>
              </div>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
                  <LayoutDashboard className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Brak wiadomosci</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {messages
                    .sort((a, b) => b.id - a.id)
                    .map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => {
                          setSelectedMessage(msg)
                          if (!msg.read) toggleRead(msg.id)
                        }}
                        className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                          selectedMessage?.id === msg.id
                            ? "border-primary bg-primary/5"
                            : msg.read
                              ? "border-border bg-card"
                              : "border-primary/30 bg-accent"
                        }`}
                      >
                        {msg.read ? (
                          <MailOpen className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`truncate text-sm ${msg.read ? "text-foreground" : "font-bold text-foreground"}`}>
                              {msg.name}
                            </span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {new Date(msg.timestamp).toLocaleDateString("pl-PL")}
                            </span>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{msg.service}</p>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div>
              {selectedMessage ? (
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-foreground">
                      Szczegoly wiadomosci
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRead(selectedMessage.id)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                        title={selectedMessage.read ? "Oznacz jako nieprzeczytane" : "Oznacz jako przeczytane"}
                      >
                        {selectedMessage.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                        title="Usun"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Imie i nazwisko</span>
                        <p className="text-sm text-foreground">{selectedMessage.name}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">E-mail</span>
                        <p className="text-sm text-foreground">
                          <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                            {selectedMessage.email}
                          </a>
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Telefon</span>
                        <p className="text-sm text-foreground">
                          {selectedMessage.phone || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Usluga</span>
                        <p className="text-sm text-foreground">{selectedMessage.service}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Wiadomosc</span>
                      <p className="mt-1 whitespace-pre-wrap rounded-lg bg-background p-3 text-sm leading-relaxed text-foreground">
                        {selectedMessage.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Data: {new Date(selectedMessage.timestamp).toLocaleString("pl-PL")}</span>
                      <span>|</span>
                      <span className={selectedMessage.read ? "text-primary" : "text-destructive"}>
                        {selectedMessage.read ? "Przeczytane" : "Nieprzeczytane"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center">
                  <Mail className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    Wybierz wiadomosc, aby zobaczyc szczegoly
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-sm font-bold text-foreground">
                Galeria zdjec ({gallery.length})
              </h2>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105">
                <Upload className="h-4 w-4" />
                Dodaj zdjecia
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
            </div>

            {gallery.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card p-16 text-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Brak zdjec w galerii</p>
                <p className="text-xs text-muted-foreground/60">
                  Kliknij &quot;Dodaj zdjecia&quot; aby dodac nowe
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {gallery.map((img) => (
                  <div
                    key={img.id}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <div className="aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-start justify-end bg-foreground/0 p-2 opacity-0 transition-opacity group-hover:bg-foreground/20 group-hover:opacity-100">
                      <button
                        onClick={() => deleteImage(img.id)}
                        className="rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-md"
                        title="Usun zdjecie"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs text-muted-foreground">{img.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
