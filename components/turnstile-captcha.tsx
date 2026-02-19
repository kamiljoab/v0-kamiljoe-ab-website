"use client"

import { Turnstile } from "@marsidev/react-turnstile"

interface TurnstileCaptchaProps {
  onVerify: (token: string) => void
  lang?: string
}

export function TurnstileCaptcha({ onVerify, lang }: TurnstileCaptchaProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"

  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    console.warn("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set. Using dummy key for testing.")
  }

  return (
    <div className="flex justify-center">
      <Turnstile
        siteKey={siteKey}
        onSuccess={onVerify}
        options={{
          theme: "auto",
          language: lang,
        }}
      />
    </div>
  )
}
