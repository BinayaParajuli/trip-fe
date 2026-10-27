import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Check, Clock, Gauge, Mail, MessageCircle, Mountain, Sun, Users, X } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/custom/PageHero";
import { Price, PriceNote } from "@/components/custom/Price";
import { TripGallery } from "@/components/custom/TripGallery";
import { ReviewsSection } from "@/components/custom/ReviewsSection";
import { SectionHeading } from "@/components/custom/SectionHeading";
import { TripGrid } from "@/components/custom/TripCard";
import { siteConfig, whatsappLink } from "@/config/site";
import { reviewService } from "@/domain/services/reviewService";
import { tripService } from "@/domain/services/tripService";
import { Link } from "@/i18n/navigation";
import { TLocale } from "@/i18n/routing";
import { formatAltitude, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 60;

// Pre-render known trips when the API is reachable at build time; trips added
// later in the Django admin render on first request (then cached for an hour).
export async function generateStaticParams() {
  try {
    const slugs = await tripService.getAllTripSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trip = await tripService.getTrip((await params).slug);
  return trip ? { title: trip.title, description: trip.summary } : {};
}

const allSections = ["overview", "photos", "itinerary", "dates", "details", "reviews"] as const;

export default async function TripPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale as TLocale);
  const t = await getTranslations("Trip");
  const tc = await getTranslations("Common");
  const trip = await tripService.getTrip(slug);
  if (!trip) notFound();

  const [departures, related, reviews] = await Promise.all([
    tripService.getUpcomingDepartures({ tripSlug: trip.slug }),
    tripService.getRelatedTrips(trip),
    reviewService.getReviews({ trip: trip.slug }),
  ]);
  const region = trip.regionName;
  const sections = allSections.filter((id) => id !== "photos" || trip.photos.length > 0);
  const enquiry = whatsappLink(t("enquiryMessage", { trip: trip.title }));

  const facts = [
    { icon: Clock, label: t("facts.duration"), value: tc("duration", { days: trip.durationDays }) },
    { icon: Gauge, label: t("facts.difficulty"), value: trip.difficulty },
    { icon: Mountain, label: t("facts.maxAltitude"), value: formatAltitude(trip.maxAltitudeM, locale) },
    { icon: Users, label: t("facts.groupSize"), value: trip.groupSize },
    { icon: Sun, label: t("facts.bestSeason"), value: trip.bestSeason },
  ];

  return (
    <>
      <PageHero image={trip.image} eyebrow={`${tc("durationShort", { days: trip.durationDays })} | ${region}`} title={trip.title} className="min-h-[clamp(420px,60vh,720px)]">
        <p className="mt-4 max-w-2xl text-lg text-white/90">{trip.summary}</p>
      </PageHero>

      {/* Facts bar */}
      <div className="border-b bg-white">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 md:grid-cols-5">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
                <dd className="font-bold text-ink">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      {/* Section nav */}
      <nav className="sticky top-16 z-30 border-b bg-white/95 backdrop-blur lg:top-20" aria-label={t("sectionsNav")}>
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
          {sections.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 border-b-2 border-transparent px-4 py-4 font-display text-sm uppercase tracking-widest hover:border-primary hover:text-primary"
            >
              {t(`sections.${id}`)}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-16 [&>section]:scroll-mt-40">
          <section id="overview">
            <SectionHeading title={t("sections.overview")} className="mb-6" />
            <p className="text-lg leading-relaxed text-muted-foreground">{trip.summary}</p>
            <h3 className="mt-8 text-xl">{t("highlights")}</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {trip.highlights.map((h) => (
                <li key={h} className="flex gap-3 rounded-md bg-sand p-4">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {trip.photos.length > 0 && (
            <section id="photos">
              <SectionHeading title={t("sections.photos")} className="mb-6" />
              <TripGallery photos={trip.photos} tripTitle={trip.title} />
            </section>
          )}

          <section id="itinerary">
            <SectionHeading title={t("sections.itinerary")} className="mb-6" />
            <ol className="relative space-y-3 border-l-2 border-primary/20 pl-6">
              {trip.itinerary.map((d, idx) => (
                <li key={d.day} className="relative">
                  <span className="absolute -left-[33px] top-5 size-4 rounded-full border-4 border-white bg-primary" aria-hidden />
                  <details className="group rounded-md bg-white ring-1 ring-black/5" open={idx === 0}>
                    <summary className="flex cursor-pointer list-none items-center gap-4 p-4">
                      <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-widest text-primary">{d.day}</span>
                      <span className="flex-1 font-bold text-ink">{d.title}</span>
                      <span className="text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </summary>
                    <p className="px-4 pb-4 text-muted-foreground sm:pl-28">{d.description}</p>
                  </details>
                </li>
              ))}
            </ol>
          </section>

          <section id="dates">
            <SectionHeading
              title={t("sections.dates")}
              description={t("datesText")}
              className="mb-6"
            />
            {departures.length > 0 ? (
              <div className="overflow-hidden rounded-md ring-1 ring-black/5">
                <table className="w-full text-left text-sm">
                  <thead className="bg-ink font-display uppercase tracking-widest text-white">
                    <tr>
                      <th className="px-4 py-3 font-normal">{t("startDate")}</th>
                      <th className="hidden px-4 py-3 font-normal sm:table-cell">{t("availability")}</th>
                      <th className="px-4 py-3 font-normal">{t("price")}</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {departures.map((d) => (
                      <tr key={d.id}>
                        <td className="px-4 py-4 font-bold">
                          {formatDate(d.startDate, { weekday: "short", day: "numeric", month: "short", year: "numeric" }, locale)}
                        </td>
                        <td className={cn("hidden px-4 py-4 sm:table-cell", d.seatsLeft <= 3 && "font-bold text-primary")}>
                          {tc("seatsLeft", { count: d.seatsLeft })}
                        </td>
                        <td className="px-4 py-4">
                          <Price usd={d.priceUsd} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button asChild size="sm">
                            <a
                              href={whatsappLink(
                                t("bookMessage", {
                                  trip: trip.title,
                                  date: formatDate(d.startDate, { day: "numeric", month: "long", year: "numeric" }, locale),
                                }),
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("book")}
                            </a>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-md bg-sand p-6">
                <p className="font-bold text-ink">{t("noDepartures")}</p>
                <p className="mt-1 text-muted-foreground">
                  {t("noDeparturesText")}
                </p>
              </div>
            )}
          </section>

          <section id="details">
            <SectionHeading title={t("sections.details")} className="mb-6" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-md bg-white p-6 ring-1 ring-black/5">
                <h3 className="text-lg">{t("included")}</h3>
                <ul className="mt-4 space-y-3">
                  {trip.includes.map((i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <Check className="size-4 shrink-0 text-green-700" aria-hidden />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-md bg-white p-6 ring-1 ring-black/5">
                <h3 className="text-lg">{t("notIncluded")}</h3>
                <ul className="mt-4 space-y-3">
                  {trip.excludes.map((i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <X className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Booking sidebar */}
        <aside className="lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-md bg-white p-6 shadow-lg ring-1 ring-black/5">
            <p className="text-sm text-muted-foreground">{tc("from")}</p>
            <p className="font-display text-4xl text-ink">
              <Price usd={trip.priceFromUsd} />
              <span className="ml-1 font-sans text-sm text-muted-foreground"> {t("perPerson")}</span>
            </p>
            <PriceNote className="mt-1 text-xs text-muted-foreground" />
            <div className="mt-6 space-y-3">
              <Button asChild size="lg" className="w-full font-display uppercase tracking-widest">
                <a href="#dates">
                  <CalendarDays /> {t("checkDates")}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full">
                <a href={enquiry} target="_blank" rel="noopener noreferrer">
                  <MessageCircle /> {t("enquireWhatsapp")}
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="w-full">
                <a href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(trip.title)}`}>
                  <Mail /> {t("emailUs")}
                </a>
              </Button>
            </div>
            <p className="mt-6 border-t pt-4 text-xs text-muted-foreground">
              {t("privateNote")}
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile booking bar — the sidebar card sits below the content on small screens */}
      <div className="sticky bottom-0 z-40 flex items-center justify-between gap-4 border-t bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
        <p className="text-sm text-muted-foreground">
          {tc("from")}{" "}
          <span className="font-display text-2xl text-ink">
            <Price usd={trip.priceFromUsd} />
          </span>
        </p>
        <Button asChild className="font-display uppercase tracking-widest">
          <a href="#dates">{t("checkDates")}</a>
        </Button>
      </div>

      <section id="reviews" className="mx-auto max-w-7xl scroll-mt-40 px-4 py-16">
        <ReviewsSection summary={reviews} trips={[{ slug: trip.slug, title: trip.title }]} />
      </section>

      {related.length > 0 && (
        <section className="bg-sand py-20">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading eyebrow={t("relatedEyebrow")} title={t("relatedTitle")} />
            <TripGrid trips={related} />
            <div className="mt-10 text-center">
              <Link href="/trips" className="font-bold text-primary hover:underline">
                {tc("browseAllTripsArrow")}
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
