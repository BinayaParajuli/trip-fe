import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/custom/PageHero";
import { ReviewsSection } from "@/components/custom/ReviewsSection";
import { SectionHeading } from "@/components/custom/SectionHeading";
import { TripGrid } from "@/components/custom/TripCard";
import { reviewService } from "@/domain/services/reviewService";
import { tripService } from "@/domain/services/tripService";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const destinations = await tripService.getDestinations();
    return destinations.map((d) => ({ slug: d.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const destination = await tripService.getDestination((await params).slug);
  return destination ? { title: `${destination.name} trips`, description: destination.tagline } : {};
}

export default async function DestinationPage({ params }: Props) {
  const destination = await tripService.getDestination((await params).slug);
  if (!destination) notFound();
  const [trips, reviews] = await Promise.all([
    tripService.getTrips({ destination: destination.slug }),
    reviewService.getReviews({ destination: destination.slug }),
  ]);

  return (
    <>
      <PageHero image={destination.image} eyebrow="Destination" title={destination.name} className="min-h-[clamp(420px,60vh,720px)]">
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
          <SectionHeading eyebrow={`${trips.length} trips`} title={`Trips in ${destination.name}`} />
          <TripGrid trips={trips} />
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16">
        <ReviewsSection
          summary={reviews}
          trips={trips.map(({ slug, title }) => ({ slug, title }))}
          title={`Travellers on ${destination.name}`}
          showTrip
        />
      </section>
    </>
  );
}
