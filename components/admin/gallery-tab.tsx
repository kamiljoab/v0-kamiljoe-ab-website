"use client"

import { useState, useEffect, useCallback, type ChangeEvent } from "react"
import {
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react"
import { GalleryImage } from "./types"

export function GalleryTab() {
  const [gallery, setGallery] = useState<GalleryImage[]>([])

  const loadGallery = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("kamiljo_gallery") || "[]")
      setGallery(stored)
    } catch {
      setGallery([])
    }
  }, [])

  useEffect(() => {
    loadGallery()
  }, [loadGallery])

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const newImage: GalleryImage = {
          id: Date.now() + Math.random(),
          name: file.name,
          url: reader.result as string,
          addedAt: new Date().toISOString(),
        }
        setGallery((prev) => {
          const updated = [...prev, newImage]
          localStorage.setItem("kamiljo_gallery", JSON.stringify(updated))
          return updated
        })
      }
      reader.readAsDataURL(file)
    })
  }

  function deleteImage(id: number) {
    const updated = gallery.filter((img) => img.id !== id)
    setGallery(updated)
    localStorage.setItem("kamiljo_gallery", JSON.stringify(updated))
  }

  return (
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
  )
}
