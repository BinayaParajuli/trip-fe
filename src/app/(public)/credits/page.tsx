import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/custom/SectionHeading";
import { imageCredits } from "@/data/imageCredits";

export const metadata: Metadata = {
  title: "Photo credits",
};

export default function CreditsPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <SectionHeading
        title="Photo credits"
        description="Photographs and video on this site come from Wikimedia Commons and are used under the licences listed below."
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
              <p className="text-muted-foreground">by {c.author}</p>
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
