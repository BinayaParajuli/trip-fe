import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DepartureList } from "@/components/custom/DepartureList";
import { PageHero } from "@/components/custom/PageHero";
import { IDepartureWithTrip } from "@/domain/interfaces/tripInterface";
import { tripService } from "@/domain/services/tripService";
import { TLocale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale as TLocale, namespace: "Calendar" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export const revalidate = 60;

export default async function CalendarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as TLocale);
  const t = await getTranslations("Calendar");
  const departures = await tripService.getUpcomingDepartures();

  const byMonth = new Map<string, IDepartureWithTrip[]>();
  for (const d of departures) {
    const key = d.startDate.slice(0, 7);
    byMonth.set(key, [...(byMonth.get(key) ?? []), d]);
  }

  return (
    <>
      <PageHero image="/images/pokhara.jpg" eyebrow={t("eyebrow")} title={t("title")}>
        <p className="mt-4 max-w-2xl text-lg text-white/90">
          {t("intro")}
        </p>
      </PageHero>
      <div className="bg-sand">
        <div className="mx-auto max-w-4xl space-y-12 px-4 py-16">
          {[...byMonth.entries()].map(([month, list]) => (
            <section key={month}>
              <h2 className="mb-4 text-2xl">{formatDate(`${month}-01`, { month: "long", year: "numeric" }, locale)}</h2>
              <DepartureList departures={list} />
            </section>
          ))}
          {departures.length === 0 && (
            <p className="text-center text-muted-foreground">{t("empty")}</p>
          )}
        </div>
      </div>
    </>
  );
}
