import Link from "next/link"
import { IDepartureWithTrip } from "@/domain/interfaces/tripInterface"
import { formatDate, formatDuration, formatUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

export function DepartureRow({ departure }: { departure: IDepartureWithTrip }) {
  const { trip } = departure
  const fewLeft = departure.seatsLeft <= 3
  return (
    <li>
      <Link
        href={`/trips/${trip.slug}#dates`}
        className="group flex items-center gap-4 rounded-md bg-white p-3 ring-1 ring-black/5 transition hover:ring-primary sm:gap-6 sm:p-4"
      >
        <div className="w-14 shrink-0 text-center">
          <p className="font-display text-3xl leading-none text-ink">{formatDate(departure.startDate, { day: "2-digit" })}</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {formatDate(departure.startDate, { month: "short" })}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold group-hover:text-primary">{trip.title}</p>
          <p className="text-sm text-muted-foreground">
            {formatDuration(trip.durationDays)} · {trip.regionName}
          </p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="font-bold">{formatUsd(departure.priceUsd)}</p>
          <p className={cn("text-xs", fewLeft ? "font-bold text-primary" : "text-muted-foreground")}>
            {departure.seatsLeft} {departure.seatsLeft === 1 ? "seat" : "seats"} left
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
