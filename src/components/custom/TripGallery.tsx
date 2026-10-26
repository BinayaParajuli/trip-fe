"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { ITripPhoto } from "@/domain/interfaces/tripInterface"
import { cn } from "@/lib/utils"

// How many thumbnails show before the "+N more" tile.
const PREVIEW = 5

export function TripGallery({ photos, tripTitle }: { photos: ITripPhoto[]; tripTitle: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const count = photos.length
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + count) % count)),
    [count],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, step])

  const alt = (p: ITripPhoto, i: number) => p.caption || `${tripTitle} — photo ${i + 1}`
  const preview = photos.slice(0, PREVIEW)
  const hidden = count - preview.length
  const current = open === null ? null : photos[open]

  return (
    <>
      <ul className="grid auto-rows-[140px] grid-cols-2 gap-2 sm:auto-rows-[180px] sm:grid-cols-4">
        {preview.map((p, i) => (
          <li key={p.id} className={cn(i === 0 && "col-span-2 row-span-2")}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative size-full overflow-hidden rounded-md focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label={`Open photo ${i + 1} of ${count}`}
            >
              <Image
                src={p.image}
                alt={alt(p, i)}
                fill
                sizes={i === 0 ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 20vw, 50vw"}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {i === preview.length - 1 && hidden > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 font-display text-2xl text-white">
                  +{hidden} more
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] gap-3 border-0 bg-ink p-3 text-white sm:max-w-5xl [&>button]:text-white">
          {current && open !== null && (
            <>
              <DialogTitle className="sr-only">{tripTitle} photos</DialogTitle>
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-black">
                <Image src={current.image} alt={alt(current, open)} fill sizes="(min-width: 1024px) 64rem, 100vw" className="object-contain" />
                {count > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-2 hover:bg-black/70"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="size-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-2 hover:bg-black/70"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="size-6" />
                    </button>
                  </>
                )}
              </div>
              <DialogDescription className="flex justify-between gap-4 px-1 text-sm text-white/80">
                <span>{current.caption}</span>
                <span className="shrink-0">
                  {open + 1} / {count}
                </span>
              </DialogDescription>
              {count > 1 && (
                <ul className="flex gap-2 overflow-x-auto pb-1">
                  {photos.map((p, i) => (
                    <li key={p.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setOpen(i)}
                        className={cn(
                          "relative block h-14 w-20 overflow-hidden rounded-sm opacity-60 transition hover:opacity-100",
                          i === open && "opacity-100 ring-2 ring-primary",
                        )}
                        aria-label={`Show photo ${i + 1}`}
                        aria-current={i === open}
                      >
                        <Image src={p.image} alt="" fill sizes="80px" className="object-cover" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
