"use client"

import { useState } from "react"
import {
  Mail,
  MailOpen,
  Trash2,
  RefreshCw,
  LayoutDashboard,
  Eye,
  EyeOff,
} from "lucide-react"
import { Message } from "./types"

interface MessagesTabProps {
  messages: Message[]
  onRefresh: () => void
  onToggleRead: (id: number) => void
  onDelete: (id: number) => void
}

export function MessagesTab({
  messages,
  onRefresh,
  onToggleRead,
  onDelete,
}: MessagesTabProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null)

  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || null

  function handleDelete(id: number) {
    onDelete(id)
    if (selectedMessageId === id) setSelectedMessageId(null)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="flex flex-col gap-2">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-serif text-sm font-bold text-foreground">
            Lista wiadomosci ({messages.length})
          </h2>
          <button
            onClick={onRefresh}
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
                    setSelectedMessageId(msg.id)
                    if (!msg.read) onToggleRead(msg.id)
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
                  onClick={() => onToggleRead(selectedMessage.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  title={selectedMessage.read ? "Oznacz jako nieprzeczytane" : "Oznacz jako przeczytane"}
                >
                  {selectedMessage.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
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
  )
}
