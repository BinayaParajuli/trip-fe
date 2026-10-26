"use client"

import Link from "next/link"
import { useState } from "react"
import { durationBuckets, matchesDuration } from "@/domain/constants/tripDuration"
import { ITripSummary } from "@/domain/interfaces/tripInterface"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Tabs only switch which pre-rendered card shows, so TripCard stays a server component.
export function DurationTabs({ trips, cards }: { trips: ITripSummary[]; cards: Record<string, React.ReactNode> }) {
  const [active, setActive] = useState<string>(durationBuckets[0].slug)
  const visible = trips.filter((t) => matchesDuration(t, active)).slice(0, 6)

  return (
    <div>
      <div role="tablist" aria-label="Trip duration" className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2">
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
            {b.label}
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
          <Link href={`/trips?duration=${active}`}>See all {durationBuckets.find((b) => b.slug === active)?.label.toLowerCase()}</Link>
        </Button>
      </div>
    </div>
  )
}
