import Image from "next/image";
import { ArrowRight, ChevronDown, Compass, HeartHandshake, Leaf, MapPin, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { DepartureList } from "@/components/custom/DepartureList";
import { DurationTabs } from "@/components/custom/DurationTabs";
import { HeroVideo } from "@/components/custom/HeroVideo";
import { InterestIcon } from "@/components/custom/InterestIcon";
import { Reveal } from "@/components/custom/Reveal";
import { SectionHeading } from "@/components/custom/SectionHeading";
import { TravelOverlay } from "@/components/custom/TravelOverlay";
import { TripCard } from "@/components/custom/TripCard";
import { tripService } from "@/domain/services/tripService";
import { Link } from "@/i18n/navigation";
import { TLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Re-render hourly so past departures drop off.
export const revalidate = 3600;

const promises = [
  { icon: Users, key: "groups" },
  { icon: Compass, key: "guides" },
  { icon: HeartHandshake, key: "porters" },
  { icon: Leaf, key: "footprint" },
] as const;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale as TLocale);
  const t = await getTranslations("Home");
  const tc = await getTranslations("Common");
  const [trips, regions, interests, departures] = await Promise.all([
    tripService.getTrips(),
    tripService.getRegions(),
    tripService.getInterests(),
    tripService.getUpcomingDepartures({ limit: 6 }),
  ]);
  const cards = Object.fromEntries(trips.map((t) => [t.slug, <TripCard key={t.slug} trip={t} />]));

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[100svh] min-h-[560px] max-h-[1000px] items-center overflow-hidden bg-ink">
        <HeroVideo poster="/images/hero-poster.jpg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/65" />
        <TravelOverlay flightPath />
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-20 text-white">
          <p
            className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-white/90 backdrop-blur-sm"
            style={{ animationDelay: "100ms" }}
          >
            <MapPin className="size-3.5" aria-hidden /> Kathmandu · 27.7° N 85.3° E
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.05] text-white drop-shadow-lg md:text-7xl">
            <span className="animate-fade-up block" style={{ animationDelay: "250ms" }}>
              {t("heroTitle1")}
            </span>
            <span className="animate-fade-up block" style={{ animationDelay: "400ms" }}>
              {t.rich("heroTitle2", {
                em: (chunks) => <span className="font-light italic text-amber-200">{chunks}</span>,
              })}
            </span>
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-lg text-white/90" style={{ animationDelay: "600ms" }}>
            {t("heroText")}
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "750ms" }}>
            <Button asChild size="lg" className="group h-12 px-8 font-display uppercase tracking-widest">
              <Link href="/trips">
                {tc("browseAllTrips")} <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white bg-white/5 px-8 font-display uppercase tracking-widest text-white backdrop-blur-sm hover:bg-white hover:text-ink"
            >
              <Link href="/calendar">{t("upcomingDepartures")}</Link>
            </Button>
          </div>
        </div>
        <a
          href="#promises"
          aria-label={t("scrollToContent")}
          className="animate-fade-up absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs uppercase tracking-[0.3em] text-white/80"
          style={{ animationDelay: "1100ms" }}
        >
          {t("explore")}
          <ChevronDown className="animate-scroll-cue size-5" aria-hidden />
        </a>
      </section>

      {/* Promises strip */}
      <section id="promises" className="scroll-mt-16 border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map(({ icon: Icon, key }, idx) => (
            <Reveal key={key} delay={idx * 100} className="flex items-start gap-3">
              <Icon className="mt-1 size-6 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-display uppercase tracking-wide text-ink">{t(`promises.${key}.title`)}</p>
                <p className="text-sm text-muted-foreground">{t(`promises.${key}.text`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Who we are */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
        <Reveal>
          <SectionHeading eyebrow={t("whoEyebrow")} title={t("whoTitle")} className="mb-6" />
          <div className="space-y-4 text-muted-foreground">
            <p>{t("whoText1")}</p>
            <p>{t("whoText2")}</p>
          </div>
          <Link href="/about" className="mt-6 inline-flex items-center gap-2 font-bold text-primary hover:underline">
            {t("moreAboutUs")} <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <Reveal delay={150} className="relative pb-10 pr-6 md:pb-14 md:pr-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md shadow-xl">
            <Image
              src="/images/boudhanath.jpg"
              alt={t("boudhanathAlt")}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {/* postcard tucked into the corner */}
          <figure className="absolute bottom-0 right-0 w-2/5 rotate-3 bg-white p-2 pb-8 shadow-2xl transition-transform duration-500 hover:rotate-0">
            <div className="relative aspect-square overflow-hidden">
              <Image src="/images/pokhara.jpg" alt={t("pokharaAlt")} fill sizes="20vw" className="object-cover" />
            </div>
            <figcaption className="absolute bottom-2 left-0 right-0 text-center font-display text-xs uppercase tracking-widest text-muted-foreground">
              {t("pokharaCaption")}
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* Regions */}
      <section className="bg-sand py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <SectionHeading eyebrow={t("regionsEyebrow")} title={t("regionsTitle")} />
            </Reveal>
            <Link href="/destinations/nepal" className="mb-10 inline-flex items-center gap-2 font-bold text-primary hover:underline">
              {t("aboutNepal")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {regions.map((r, idx) => {
              // first and last pair span two columns: 2 wide, 4 small, 2 wide
              const wide = idx < 2 || idx >= regions.length - 2;
              return (
              <Reveal key={r.slug} delay={(idx % 4) * 90} className={cn(wide && "lg:col-span-2")}>
              <Link
                href={`/trips?region=${r.slug}`}
                className={cn(
                  "group relative flex h-full items-end overflow-hidden rounded-md bg-ink",
                  wide ? "aspect-[3/4] lg:aspect-[16/10]" : "aspect-[3/4]",
                )}
              >
                <Image
                  src={r.image}
                  alt={r.name}
                  fill
                  sizes={wide ? "(min-width: 1024px) 50vw, 50vw" : "(min-width: 1024px) 25vw, 50vw"}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="relative p-4 text-white md:p-6">
                  <h3 className="text-xl text-white md:text-2xl">{r.name}</h3>
                  <p className="mt-1 hidden text-sm text-white/85 sm:block">{r.tagline}</p>
                </div>
              </Link>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interests */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow={t("interestsEyebrow")}
            title={t("interestsTitle")}
            description={t("interestsText")}
            align="center"
          />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {interests.map((i, idx) => (
            <Reveal key={i.slug} delay={idx * 80}>
            <Link
              href={`/trips?interest=${i.slug}`}
              className="group flex h-full flex-col items-center rounded-md border bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-sand transition duration-300 group-hover:rotate-12 group-hover:bg-primary">
                <InterestIcon slug={i.slug} className="size-6 text-primary transition group-hover:text-white" />
              </span>
              <span className="mt-4 font-display uppercase tracking-wide text-ink">{i.name}</span>
              <span className="mt-1 text-xs text-muted-foreground">{i.description}</span>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Browse by duration */}
      <section className="bg-sand py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <SectionHeading
              eyebrow={t("durationEyebrow")}
              title={t("durationTitle")}
              description={t("durationText")}
            />
          </Reveal>
          <Reveal delay={100}>
            <DurationTabs trips={trips} cards={cards} />
          </Reveal>
        </div>
      </section>

      {/* Departures */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:py-28 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <SectionHeading
            eyebrow={t("departuresEyebrow")}
            title={t("departuresTitle")}
            description={t("departuresText")}
          />
          <Button asChild size="lg" className="font-display uppercase tracking-widest">
            <Link href="/calendar">
              {t("fullCalendar")} <ArrowRight />
            </Link>
          </Button>
        </Reveal>
        <Reveal delay={150}>
          <DepartureList departures={departures} />
        </Reveal>
      </section>

      {/* Closing banner */}
      <section className="relative overflow-hidden bg-ink py-28 text-center md:py-36">
        <Image src="/images/annapurna-range.jpg" alt="" fill sizes="100vw" className="animate-ken-burns object-cover opacity-70" />
        <div className="absolute inset-0 bg-black/30" />
        <TravelOverlay />
        <Reveal className="relative mx-auto max-w-3xl px-4">
          <h2 className="text-4xl text-white md:text-5xl">{t("closingTitle")}</h2>
          <p className="mt-4 text-lg text-white/90">{t("closingText")}</p>
          <Button asChild size="lg" className="mt-8 h-12 px-8 font-display uppercase tracking-widest">
            <Link href="/trips">{tc("browseAllTrips")}</Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
