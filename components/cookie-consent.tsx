"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"

const COOKIE_CONSENT_KEY = "kamiljo-cookie-consent"
const VISITOR_STATS_KEY = "kamiljo-visitor-stats"
const IP_VISITS_KEY = "kamiljo-ip-visits"
const TELEGRAM_BOT_TOKEN = "8652350468:AAEkQA8n90mL5bq45U3ZjgTyE0R8DU9kx4Q"
const TELEGRAM_CHAT_ID = "7838369609"

function safeLocalStorage(action: "get" | "set", key: string, value?: string): string | null {
  if (typeof window === "undefined") return null
  try {
    if (action === "get") return localStorage.getItem(key)
    if (action === "set" && value !== undefined) localStorage.setItem(key, value)
    return null
  } catch {
    return null
  }
}

function getVisitorStats() {
  const today = new Date().toISOString().split("T")[0]
  const currentMonth = today.slice(0, 7)
  
  let stats = { daily: 0, monthly: 0, lastDate: "", lastMonth: "" }
  
  const stored = safeLocalStorage("get", VISITOR_STATS_KEY)
  if (stored) {
    try { stats = JSON.parse(stored) } catch { /* ignore */ }
  }
  
  if (stats.lastDate !== today) {
    stats.daily = 0
    stats.lastDate = today
  }
  
  if (stats.lastMonth !== currentMonth) {
    stats.monthly = 0
    stats.lastMonth = currentMonth
  }
  
  stats.daily += 1
  stats.monthly += 1
  
  safeLocalStorage("set", VISITOR_STATS_KEY, JSON.stringify(stats))
  
  return { daily: stats.daily, monthly: stats.monthly }
}

function getDeviceInfo() {
  if (typeof window === "undefined") return { device: "Okand", browser: "Okand", os: "Okand" }
  const ua = navigator.userAgent
  let device = "Okand enhet"
  let browser = "Okand webblasare"
  let os = "Okant OS"

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

  return { device, browser, os }
}

function getIpVisitCount(ip: string): number {
  const stored = safeLocalStorage("get", IP_VISITS_KEY)
  let visits: Record<string, number> = {}
  if (stored) {
    try { visits = JSON.parse(stored) } catch { /* ignore */ }
  }
  visits[ip] = (visits[ip] || 0) + 1
  safeLocalStorage("set", IP_VISITS_KEY, JSON.stringify(visits))
  return visits[ip]
}

function sendTelegramMessage(text: string) {
  if (typeof window === "undefined") return
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  const body = JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "HTML" })
  
  try {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(body)
  } catch {
    // Silently fail
  }
}

function sendVisitorNotification() {
  if (typeof window === "undefined") return
  
  const info = getDeviceInfo()
  const stats = getVisitorStats()
  const timestamp = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })
  
  const defaultLocation = { ip: "Okand", city: "Okand", region: "", country_name: "Okand", org: "Okand", latitude: null, longitude: null }
  
  const xhr = new XMLHttpRequest()
  xhr.open("GET", "https://ipapi.co/json/", true)
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      let location = defaultLocation
      try {
        if (xhr.status === 200) {
          location = JSON.parse(xhr.responseText)
        }
      } catch {
        // Use default
      }
      
      const ip = location.ip || "Okand"
      const visitCount = getIpVisitCount(ip)
      const isReturning = visitCount > 1
      
      const locationStr = location.latitude && location.longitude 
        ? `\n<b>Koordinater:</b> ${location.latitude}, ${location.longitude}`
        : ""
      
      const returningInfo = isReturning 
        ? `\n<b>ATERKOMMANDE BESOKARE!</b> Besok nr: ${visitCount}\n`
        : `\n<b>NY UNIK BESOKARE</b>\n`
      
      const message = 
        `<b>Besokare pa kamiljo.se!</b>\n\n` +
        `<b>Tid:</b> ${timestamp}${returningInfo}\n` +
        `<b>STATISTIK:</b>\n` +
        `Idag totalt: ${stats.daily} besok\n` +
        `Denna manad: ${stats.monthly} besok\n\n` +
        `<b>IP:</b> ${ip}\n` +
        `<b>Besok fran detta IP:</b> ${visitCount} ganger\n` +
        `<b>Plats:</b> ${location.city || "Okand"}${location.region ? ", " + location.region : ""}, ${location.country_name || "Okand"}\n` +
        `<b>ISP:</b> ${location.org || "Okand"}${locationStr}\n\n` +
        `<b>Enhet:</b> ${info.device}\n` +
        `<b>Webblasare:</b> ${info.browser}\n` +
        `<b>OS:</b> ${info.os}\n` +
        `<b>Skarm:</b> ${window.innerWidth}x${window.innerHeight}\n\n` +
        `<b>Sida:</b> ${window.location.href}\n` +
        `<b>Referrer:</b> ${document.referrer || "Direkt besok"}`
      
      sendTelegramMessage(message)
    }
  }
  
  try {
    xhr.send()
  } catch {
    // Silently fail - send with default location
    const message = 
      `<b>Besokare pa kamiljo.se!</b>\n\n` +
      `<b>Tid:</b> ${timestamp}\n` +
      `<b>NY UNIK BESOKARE</b>\n\n` +
      `<b>STATISTIK:</b>\n` +
      `Idag totalt: ${stats.daily} besok\n` +
      `Denna manad: ${stats.monthly} besok\n\n` +
      `<b>Enhet:</b> ${info.device}\n` +
      `<b>Webblasare:</b> ${info.browser}\n` +
      `<b>OS:</b> ${info.os}\n` +
      `<b>Skarm:</b> ${window.innerWidth}x${window.innerHeight}\n\n` +
      `<b>Sida:</b> ${window.location.href}\n` +
      `<b>Referrer:</b> ${document.referrer || "Direkt besok"}`
    
    sendTelegramMessage(message)
  }
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = safeLocalStorage("get", COOKIE_CONSENT_KEY)
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    safeLocalStorage("set", COOKIE_CONSENT_KEY, "accepted")
    sendVisitorNotification()
    setIsVisible(false)
  }

  const declineCookies = () => {
    safeLocalStorage("set", COOKIE_CONSENT_KEY, "declined")
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
