import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/custom/PageHero";
import { SectionHeading } from "@/components/custom/SectionHeading";
import { Link } from "@/i18n/navigation";
import { TLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale as TLocale, namespace: "About" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const commitments = ["porters", "local", "trace", "culture"] as const;

export default async function AboutPage({ params }: Props) {
  setRequestLocale((await params).locale as TLocale);
  const t = await getTranslations("About");
  const tc = await getTranslations("Common");
  return (
    <>
      <PageHero image="/images/durbar-square.jpg" eyebrow={t("eyebrow")} title={t("title")} />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow={t("whoEyebrow")} title={t("whoTitle")} className="mb-6" />
          <div className="space-y-4 text-muted-foreground">
            <p>{t("whoText1")}</p>
            <p>{t("whoText2")}</p>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-md">
          <Image src="/images/langtang.jpg" alt={t("langtangAlt")} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section id="responsible-travel" className="scroll-mt-24 bg-sand py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow={t("responsibleEyebrow")}
            title={t("responsibleTitle")}
            description={t("responsibleText")}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {commitments.map((key) => (
              <div key={key} className="rounded-md bg-white p-6 ring-1 ring-black/5">
                <h3 className="text-xl">{t(`commitments.${key}.title`)}</h3>
                <p className="mt-2 text-muted-foreground">{t(`commitments.${key}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-3xl">{t("readyTitle")}</h2>
        <Button asChild size="lg" className="mt-6 font-display uppercase tracking-widest">
          <Link href="/trips">{tc("browseAllTrips")}</Link>
        </Button>
      </section>
    </>
  );
}
