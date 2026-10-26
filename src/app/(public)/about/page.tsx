import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/custom/PageHero";
import { SectionHeading } from "@/components/custom/SectionHeading";

export const metadata: Metadata = {
  title: "About us",
  description: "Who we are and how we travel responsibly in the Himalaya.",
};

const commitments = [
  {
    title: "Porters come first",
    text: "Fair wages paid on time, a 20 kg load limit, proper boots and warm gear, and insurance for every porter we hire.",
  },
  {
    title: "Money stays local",
    text: "We use family-run teahouses and lodges, local drivers and regional guides so your spending supports mountain communities.",
  },
  {
    title: "Leave no trace",
    text: "Refillable bottles and purification on every trek, and we carry our rubbish back out of the national parks.",
  },
  {
    title: "Respect for culture",
    text: "Our guides brief every group on local customs, dress and photography etiquette at temples and monasteries.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero image="/images/durbar-square.jpg" eyebrow="About us" title="Local people, local knowledge" />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Who we are" title="A Kathmandu team that walks every trail" className="mb-6" />
          <div className="space-y-4 text-muted-foreground">
            <p>
              Royal Himalaya Experiences started with a simple idea: the best way to see the Himalaya is with someone who grew up
              there. Our guides come from Solukhumbu, Gorkha, Mustang and the Kathmandu Valley, and each one leads
              trips in the region they know best.
            </p>
            <p>
              We keep the company small on purpose. Every itinerary is designed by our own team, every route is walked
              before we sell it, and when you message us you talk to the people who will plan your trip.
            </p>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-md">
          <Image src="/images/langtang.jpg" alt="The Langtang valley" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section id="responsible-travel" className="scroll-mt-24 bg-sand py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Responsible travel"
            title="Our commitments"
            description="Tourism keeps many mountain villages alive. We want every trip to leave the places we visit a little better off."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {commitments.map((c) => (
              <div key={c.title} className="rounded-md bg-white p-6 ring-1 ring-black/5">
                <h3 className="text-xl">{c.title}</h3>
                <p className="mt-2 text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-3xl">Ready to plan your trip?</h2>
        <Button asChild size="lg" className="mt-6 font-display uppercase tracking-widest">
          <Link href="/trips">Browse all trips</Link>
        </Button>
      </section>
    </>
  );
}
