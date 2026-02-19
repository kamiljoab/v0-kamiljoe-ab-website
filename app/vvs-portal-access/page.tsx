"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Inbox,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { MessagesTab } from "@/components/admin/messages-tab"
import { GalleryTab } from "@/components/admin/gallery-tab"
import { Message } from "@/components/admin/types"

type Tab = "messages" | "gallery"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("messages")
  const [messages, setMessages] = useState<Message[]>([])

  const loadMessages = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("kamiljo_messages") || "[]")
      setMessages(stored)
    } catch {
      setMessages([])
    }
  }, [])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

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
          <MessagesTab
            messages={messages}
            onRefresh={loadMessages}
            onToggleRead={toggleRead}
            onDelete={deleteMessage}
          />
        )}

        {activeTab === "gallery" && (
          <GalleryTab />
        )}
      </div>
    </div>
  )
}
