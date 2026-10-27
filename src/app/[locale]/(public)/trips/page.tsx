import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/custom/PageHero";
import { TripFilters } from "@/components/custom/TripFilters";
import { TripGrid } from "@/components/custom/TripCard";
import { ITripFilters } from "@/domain/interfaces/tripInterface";
import { tripService } from "@/domain/services/tripService";
import { Link } from "@/i18n/navigation";
import { TLocale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale as TLocale, namespace: "Trips" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function TripsPage({ params: routeParams, searchParams }: Props) {
  setRequestLocale((await routeParams).locale as TLocale);
  const t = await getTranslations("Trips");
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
      <PageHero image="/images/annapurna-range.jpg" eyebrow={t("eyebrow")} title={t("title")} />
      <div className="bg-sand">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[280px_1fr]">
          <Suspense>
            <TripFilters regions={regions} interests={interests} />
          </Suspense>
          <div>
            <p className="mb-6 text-sm text-muted-foreground">
              {t("found", { count: trips.length })}
            </p>
            {trips.length > 0 ? (
              <TripGrid trips={trips} />
            ) : (
              <div className="rounded-md bg-white p-10 text-center">
                <p className="font-display text-xl uppercase text-ink">{t("noMatch")}</p>
                <p className="mt-2 text-muted-foreground">
                  {t.rich("noMatchText", {
                    link: (chunks) => (
                      <Link href="/trips" className="font-bold text-primary hover:underline">
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
