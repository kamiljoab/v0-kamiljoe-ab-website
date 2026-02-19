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
