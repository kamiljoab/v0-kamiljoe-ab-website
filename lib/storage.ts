export interface Message {
  id: number
  name: string
  email: string
  phone: string
  service: string
  message: string
  timestamp: string
  read: boolean
}

export interface GalleryImage {
  id: number
  name: string
  url: string
  addedAt: string
}

export type MessageInput = Omit<Message, "id" | "read">

const MESSAGES_KEY = "kamiljo_messages"
const GALLERY_KEY = "kamiljo_gallery"

export function getMessages(): Message[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]")
  } catch {
    return []
  }
}

export function saveMessages(messages: Message[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
}

export function addMessage(data: MessageInput): void {
  const existing = getMessages()
  const newMessage: Message = {
    ...data,
    id: Date.now(),
    read: false,
  }
  existing.push(newMessage)
  saveMessages(existing)
}

export function getGallery(): GalleryImage[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(GALLERY_KEY) || "[]")
  } catch {
    return []
  }
}

export function saveGallery(gallery: GalleryImage[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery))
}
