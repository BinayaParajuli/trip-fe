import { Mail, MapPin, MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { siteConfig, whatsappLink } from "@/config/site"
import { IInterest, IRegion } from "@/domain/interfaces/tripInterface"
import { Link } from "@/i18n/navigation"

export function Footer({ regions, interests }: { regions: IRegion[]; interests: IInterest[] }) {
  const t = useTranslations("Footer")
  const tc = useTranslations("Currency")
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-display text-2xl uppercase tracking-[0.15em] text-white">
            Royal Himalaya <span className="text-primary">Experiences</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            {t("intro")}
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <MessageCircle className="size-4" /> {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail className="size-4" /> {siteConfig.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="size-4" /> {siteConfig.address}
            </li>
          </ul>
        </div>

        <FooterColumn
          title={t("regions")}
          links={regions.map((r) => ({ href: `/trips?region=${r.slug}`, label: r.name }))}
        />
        <FooterColumn
          title={t("interests")}
          links={interests.map((i) => ({ href: `/trips?interest=${i.slug}`, label: i.name }))}
        />
        <FooterColumn
          title={t("company")}
          links={[
            { href: "/about", label: t("aboutUs") },
            { href: "/about#responsible-travel", label: t("responsibleTravel") },
            { href: "/calendar", label: t("departureCalendar") },
            { href: "/trips", label: t("allTrips") },
            { href: "/credits", label: t("photoCredits") },
          ]}
        />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-4 py-6 text-xs">
          <p>{t("rights", { year: new Date().getFullYear(), name: siteConfig.name })}</p>
          <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            {tc("ratesBy")}
          </a>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm text-white">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
