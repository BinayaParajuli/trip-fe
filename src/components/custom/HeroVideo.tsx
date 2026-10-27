"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { useTranslations } from "next-intl"

// Muted looping background video. Starts paused for people who prefer reduced
// motion, and always offers a pause control (moving content longer than 5s).
export function HeroVideo({ poster }: { poster: string }) {
  const t = useTranslations("HeroVideo")
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    video.play().then(
      () => setPlaying(true),
      () => setPlaying(false), // autoplay blocked (e.g. low-power mode): poster stays
    )
  }, [])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) {
      video.play().then(() => setPlaying(true), () => setPlaying(false))
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full scale-105 object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? t("pause") : t("play")}
        className="absolute bottom-6 right-4 z-10 flex size-10 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur transition hover:bg-black/40 md:right-8"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
    </>
  )
}
