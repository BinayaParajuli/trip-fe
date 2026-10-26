import type { Metadata } from "next";
import { DepartureList } from "@/components/custom/DepartureList";
import { PageHero } from "@/components/custom/PageHero";
import { IDepartureWithTrip } from "@/domain/interfaces/tripInterface";
import { tripService } from "@/domain/services/tripService";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Departure calendar",
  description: "Upcoming fixed small-group departures in Nepal.",
};

export const revalidate = 3600;

export default async function CalendarPage() {
  const departures = await tripService.getUpcomingDepartures();

  const byMonth = new Map<string, IDepartureWithTrip[]>();
  for (const d of departures) {
    const key = d.startDate.slice(0, 7);
    byMonth.set(key, [...(byMonth.get(key) ?? []), d]);
  }

  return (
    <>
      <PageHero image="/images/pokhara.jpg" eyebrow="Fixed departures" title="Departure calendar">
        <p className="mt-4 max-w-2xl text-lg text-white/90">
          Join a small group on a set date, or ask us to run any trip privately on the dates you choose.
        </p>
      </PageHero>
      <div className="bg-sand">
        <div className="mx-auto max-w-4xl space-y-12 px-4 py-16">
          {[...byMonth.entries()].map(([month, list]) => (
            <section key={month}>
              <h2 className="mb-4 text-2xl">{formatDate(`${month}-01`, { month: "long", year: "numeric" })}</h2>
              <DepartureList departures={list} />
            </section>
          ))}
          {departures.length === 0 && (
            <p className="text-center text-muted-foreground">New departures are coming soon — message us for private dates.</p>
          )}
        </div>
      </div>
    </>
  );
}
