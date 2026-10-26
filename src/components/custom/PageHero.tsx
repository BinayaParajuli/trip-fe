import Image from "next/image"
import { TravelOverlay } from "@/components/custom/TravelOverlay"
import { cn } from "@/lib/utils"

export function PageHero({
  image,
  title,
  eyebrow,
  children,
  className,
}: {
  image: string
  title: string
  eyebrow?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("relative flex min-h-[clamp(320px,40vh,480px)] items-end overflow-hidden bg-ink", className)}>
      <Image src={image} alt="" fill priority sizes="100vw" className="animate-ken-burns object-cover opacity-85" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <TravelOverlay />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-24">
        {eyebrow && (
          <p className="animate-fade-up mb-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80">{eyebrow}</p>
        )}
        <h1 className="animate-fade-up max-w-4xl text-4xl text-white md:text-6xl" style={{ animationDelay: "120ms" }}>
          {title}
        </h1>
        <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
          {children}
        </div>
      </div>
    </section>
  )
}
