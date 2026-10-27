"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { useTranslations } from "next-intl"
import { IInterest, IRegion } from "@/domain/interfaces/tripInterface"
import { durationBuckets } from "@/domain/constants/tripDuration"
import { cn } from "@/lib/utils"

const sortOptions = [
  { value: "", label: "recommended" },
  { value: "price-asc", label: "priceAsc" },
  { value: "price-desc", label: "priceDesc" },
  { value: "duration", label: "durationAsc" },
] as const

export function TripFilters({ regions, interests }: { regions: IRegion[]; interests: IInterest[] }) {
  const t = useTranslations("Filters")
  const td = useTranslations("Durations")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const current = (key: string) => searchParams.get(key) ?? ""

  const update = (changes: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    const query = params.toString()
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }))
  }

  const toggle = (key: string, value: string) => update({ [key]: current(key) === value ? "" : value })

  const hasFilters = ["region", "interest", "duration"].some((k) => current(k))

  return (
    <aside className={cn("space-y-8 transition-opacity", isPending && "opacity-60")} aria-label={t("label")}>
      <FilterGroup title={t("region")}>
        {regions.map((r) => (
          <Chip key={r.slug} active={current("region") === r.slug} onClick={() => toggle("region", r.slug)}>
            {r.name}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title={t("interest")}>
        {interests.map((i) => (
          <Chip key={i.slug} active={current("interest") === i.slug} onClick={() => toggle("interest", i.slug)}>
            {i.name}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title={t("duration")}>
        {durationBuckets.map((b) => (
          <Chip key={b.slug} active={current("duration") === b.slug} onClick={() => toggle("duration", b.slug)}>
            {td(b.slug)}
          </Chip>
        ))}
      </FilterGroup>

      <div>
        <label htmlFor="sort" className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("sortBy")}
        </label>
        <select
          id="sort"
          value={current("sort")}
          onChange={(e) => update({ sort: e.target.value })}
          className="h-10 w-full rounded-md border bg-white px-3 text-sm"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {t(o.label)}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => update({ region: "", interest: "", duration: "" })}
          className="text-sm font-bold text-primary hover:underline"
        >
          {t("clearAll")}
        </button>
      )}
    </aside>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition",
        active ? "border-primary bg-primary text-white" : "bg-white hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </button>
  )
}
