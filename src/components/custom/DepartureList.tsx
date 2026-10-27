import { useLocale, useTranslations } from "next-intl"
import { Price } from "@/components/custom/Price"
import { IDepartureWithTrip } from "@/domain/interfaces/tripInterface"
import { Link } from "@/i18n/navigation"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export function DepartureRow({ departure }: { departure: IDepartureWithTrip }) {
  const { trip } = departure
  const fewLeft = departure.seatsLeft <= 3
  const t = useTranslations("Common")
  const locale = useLocale()
  return (
    <li>
      <Link
        href={`/trips/${trip.slug}#dates`}
        className="group flex items-center gap-4 rounded-md bg-white p-3 ring-1 ring-black/5 transition hover:ring-primary sm:gap-6 sm:p-4"
      >
        <div className="w-14 shrink-0 text-center">
          <p className="font-display text-3xl leading-none text-ink">{formatDate(departure.startDate, { day: "2-digit" }, locale)}</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {formatDate(departure.startDate, { month: "short" }, locale)}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold group-hover:text-primary">{trip.title}</p>
          <p className="text-sm text-muted-foreground">
            {t("duration", { days: trip.durationDays })} · {trip.regionName}
          </p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="font-bold">
            <Price usd={departure.priceUsd} />
          </p>
          <p className={cn("text-xs", fewLeft ? "font-bold text-primary" : "text-muted-foreground")}>
            {t("seatsLeft", { count: departure.seatsLeft })}
          </p>
        </div>
      </Link>
    </li>
  )
}

export function DepartureList({ departures }: { departures: IDepartureWithTrip[] }) {
  return (
    <ul className="space-y-3">
      {departures.map((d) => (
        <DepartureRow key={d.id} departure={d} />
      ))}
    </ul>
  )
}
