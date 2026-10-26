import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/custom/PageHero";
import { TripFilters } from "@/components/custom/TripFilters";
import { TripGrid } from "@/components/custom/TripCard";
import { ITripFilters } from "@/domain/interfaces/tripInterface";
import { tripService } from "@/domain/services/tripService";

export const metadata: Metadata = {
  title: "All trips",
  description: "Browse treks, tours, safaris and heli flights across Nepal.",
};

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pick = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : undefined);
  const filters: ITripFilters = {
    destination: pick("destination"),
    region: pick("region"),
    interest: pick("interest"),
    duration: pick("duration"),
    sort: pick("sort"),
  };

  const [trips, regions, interests] = await Promise.all([
    tripService.getTrips(filters),
    tripService.getRegions(),
    tripService.getInterests(),
  ]);

  return (
    <>
      <PageHero image="/images/annapurna-range.jpg" eyebrow="Browse" title="Find your trip" />
      <div className="bg-sand">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[280px_1fr]">
          <Suspense>
            <TripFilters regions={regions} interests={interests} />
          </Suspense>
          <div>
            <p className="mb-6 text-sm text-muted-foreground">
              {trips.length} {trips.length === 1 ? "trip" : "trips"} found
            </p>
            {trips.length > 0 ? (
              <TripGrid trips={trips} />
            ) : (
              <div className="rounded-md bg-white p-10 text-center">
                <p className="font-display text-xl uppercase text-ink">No trips match these filters</p>
                <p className="mt-2 text-muted-foreground">
                  Try removing a filter, or{" "}
                  <Link href="/trips" className="font-bold text-primary hover:underline">
                    see all trips
                  </Link>
                  . We also run private trips on request.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
