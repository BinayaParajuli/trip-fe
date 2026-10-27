import Image from "next/image"
import { Clock, Mountain } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Price } from "@/components/custom/Price"
import { ITripSummary } from "@/domain/interfaces/tripInterface"
import { Link } from "@/i18n/navigation"
import { formatAltitude } from "@/lib/format"

export function TripCard({ trip }: { trip: ITripSummary }) {
  const region = trip.regionName
  const t = useTranslations("Common")
  const locale = useLocale()
  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group flex w-full flex-col overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={trip.image}
          alt={trip.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {trip.bestseller && (
          <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-1 font-display text-xs uppercase tracking-widest text-white">
            {t("bestseller")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          {t("durationShort", { days: trip.durationDays })} | {region}
        </p>
        <h3 className="mt-2 text-lg leading-snug group-hover:text-primary">{trip.title}</h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {t("duration", { days: trip.durationDays })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Mountain className="size-3.5" /> {formatAltitude(trip.maxAltitudeM, locale)}
          </span>
          <span>{trip.difficulty}</span>
        </div>
        <p className="mt-auto pt-4 text-sm">
          {t("from")}{" "}
          <span className="text-lg font-bold text-ink">
            <Price usd={trip.priceFromUsd} />
          </span>
        </p>
      </div>
    </Link>
  )
}

export function TripGrid({ trips }: { trips: ITripSummary[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((t) => (
        <TripCard key={t.slug} trip={t} />
      ))}
    </div>
  )
}
