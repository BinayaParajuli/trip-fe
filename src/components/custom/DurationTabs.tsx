"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { durationBuckets, matchesDuration } from "@/domain/constants/tripDuration"
import { ITripSummary } from "@/domain/interfaces/tripInterface"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

// Tabs only switch which pre-rendered card shows, so TripCard stays a server component.
export function DurationTabs({ trips, cards }: { trips: ITripSummary[]; cards: Record<string, React.ReactNode> }) {
  const t = useTranslations("DurationTabs")
  const td = useTranslations("Durations")
  const [active, setActive] = useState<(typeof durationBuckets)[number]["slug"]>(durationBuckets[0].slug)
  const visible = trips.filter((t) => matchesDuration(t, active)).slice(0, 6)

  return (
    <div>
      <div role="tablist" aria-label={t("label")} className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2">
        {durationBuckets.map((b) => (
          <button
            key={b.slug}
            type="button"
            role="tab"
            aria-selected={active === b.slug}
            onClick={() => setActive(b.slug)}
            className={cn(
              "shrink-0 rounded-full border px-5 py-2 text-sm font-bold transition",
              active === b.slug ? "border-primary bg-primary text-white" : "bg-white hover:border-primary hover:text-primary",
            )}
          >
            {td(b.slug)}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((t) => (
          <div key={t.slug} className="flex">
            {cards[t.slug]}
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button asChild size="lg" variant="outline" className="font-display uppercase tracking-widest">
          <Link href={`/trips?duration=${active}`}>{t("seeAll", { bucket: td(active) })}</Link>
        </Button>
      </div>
    </div>
  )
}
