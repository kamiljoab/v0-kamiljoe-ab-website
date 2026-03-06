"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"

const COOKIE_CONSENT_KEY = "kamiljo-cookie-consent"
const WHATSAPP_NUMBER = "46762124124"

function getDeviceInfo() {
  const ua = navigator.userAgent
  let device = "Okänd enhet"
  let browser = "Okänd webbläsare"
  let os = "Okänt OS"

  if (/iPhone/.test(ua)) device = "iPhone"
  else if (/iPad/.test(ua)) device = "iPad"
  else if (/Android/.test(ua)) device = "Android"
  else if (/Windows/.test(ua)) device = "Windows PC"
  else if (/Mac/.test(ua)) device = "Mac"
  else if (/Linux/.test(ua)) device = "Linux"

  if (/Chrome/.test(ua) && !/Edge/.test(ua)) browser = "Chrome"
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = "Safari"
  else if (/Firefox/.test(ua)) browser = "Firefox"
  else if (/Edge/.test(ua)) browser = "Edge"

  if (/Windows NT 10/.test(ua)) os = "Windows 10/11"
  else if (/Windows NT 6/.test(ua)) os = "Windows 7/8"
  else if (/Mac OS X/.test(ua)) os = "macOS"
  else if (/Android/.test(ua)) os = "Android"
  else if (/iOS|iPhone|iPad/.test(ua)) os = "iOS"

  return { device, browser, os, userAgent: ua }
}

function sendVisitorNotification() {
  const info = getDeviceInfo()
  const now = new Date()
  const timestamp = now.toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })
  
  const message = encodeURIComponent(
    `Ny besökare på kamiljo.se!\n\n` +
    `Tid: ${timestamp}\n` +
    `Enhet: ${info.device}\n` +
    `Webbläsare: ${info.browser}\n` +
    `OS: ${info.os}\n` +
    `Sida: ${window.location.href}\n` +
    `Referrer: ${document.referrer || "Direkt besök"}\n` +
    `Skärmstorlek: ${window.innerWidth}x${window.innerHeight}\n` +
    `User Agent: ${info.userAgent.slice(0, 100)}...`
  )
  
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`
  
  const iframe = document.createElement("iframe")
  iframe.style.display = "none"
  iframe.src = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
  document.body.appendChild(iframe)
  setTimeout(() => iframe.remove(), 3000)
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    sendVisitorNotification()
    setIsVisible(false)
  }

  const declineCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-4 shadow-2xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 pr-8 sm:pr-0">
            <h3 className="mb-2 font-serif text-lg font-bold text-foreground">
              Vi använder cookies
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Vi använder cookies för att förbättra din upplevelse på vår webbplats. Genom att fortsätta använda sidan godkänner du vår{" "}
              <Link href="/integritetspolicy" className="text-primary underline hover:no-underline">
                integritetspolicy
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              onClick={declineCookies}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Avvisa
            </button>
            <button
              onClick={acceptCookies}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
            >
              Acceptera alla
            </button>
          </div>
          <button
            onClick={declineCookies}
            className="absolute right-6 top-4 text-muted-foreground transition-colors hover:text-foreground sm:right-8 sm:top-6"
            aria-label="Stäng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
