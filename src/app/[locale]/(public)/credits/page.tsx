import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/custom/SectionHeading";
import { imageCredits } from "@/data/imageCredits";
import { TLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale as TLocale, namespace: "Credits" });
  return { title: t("title") };
}

export default async function CreditsPage({ params }: Props) {
  setRequestLocale((await params).locale as TLocale);
  const t = await getTranslations("Credits");
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <SectionHeading
        title={t("title")}
        description={t("description")}
      />
      <ul className="grid gap-4 sm:grid-cols-2">
        {imageCredits.map((c) => (
          <li key={c.file} className="flex gap-4 rounded-md bg-white p-3 ring-1 ring-black/5">
            <div className="relative size-20 shrink-0 overflow-hidden rounded">
              <Image src={c.file} alt="" fill sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0 text-sm">
              <a href={c.source} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-primary">
                {c.title}
              </a>
              <p className="text-muted-foreground">{t("by", { author: c.author })}</p>
              <p>
                {c.licenseUrl ? (
                  <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {c.license}
                  </a>
                ) : (
                  c.license
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
