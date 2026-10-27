import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/custom/PageHero";
import { ReviewsSection } from "@/components/custom/ReviewsSection";
import { SectionHeading } from "@/components/custom/SectionHeading";
import { TripGrid } from "@/components/custom/TripCard";
import { reviewService } from "@/domain/services/reviewService";
import { tripService } from "@/domain/services/tripService";
import { Link } from "@/i18n/navigation";
import { TLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const destinations = await tripService.getDestinations();
    return destinations.map((d) => ({ slug: d.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const destination = await tripService.getDestination(slug);
  if (!destination) return {};
  const t = await getTranslations({ locale: locale as TLocale, namespace: "Destination" });
  return { title: t("metaTitle", { name: destination.name }), description: destination.tagline };
}

export default async function DestinationPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale as TLocale);
  const t = await getTranslations("Destination");
  const destination = await tripService.getDestination(slug);
  if (!destination) notFound();
  const [trips, reviews] = await Promise.all([
    tripService.getTrips({ destination: destination.slug }),
    reviewService.getReviews({ destination: destination.slug }),
  ]);

  return (
    <>
      <PageHero image={destination.image} eyebrow={t("eyebrow")} title={destination.name} className="min-h-[clamp(420px,60vh,720px)]">
        <p className="mt-4 max-w-2xl text-lg text-white/90">{destination.tagline}</p>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{destination.intro}</p>
        {destination.regions.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {destination.regions.map((r) => (
              <Link
                key={r.slug}
                href={`/trips?region=${r.slug}`}
                className="rounded-full border bg-white px-4 py-2 text-sm font-bold hover:border-primary hover:text-primary"
              >
                {r.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-sand py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow={t("tripCount", { count: trips.length })} title={t("tripsIn", { name: destination.name })} />
          <TripGrid trips={trips} />
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16">
        <ReviewsSection
          summary={reviews}
          trips={trips.map(({ slug, title }) => ({ slug, title }))}
          title={t("travellersOn", { name: destination.name })}
          showTrip
        />
      </section>
    </>
  );
}
