"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ChevronDown, LogOut, Mail, Menu, MessageCircle, User, X } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InterestIcon } from "@/components/custom/InterestIcon"
import { PreferencesMenu } from "@/components/custom/PreferencesMenu"
import { siteConfig, whatsappLink } from "@/config/site"
import { durationBuckets } from "@/domain/constants/tripDuration"
import { IInterest, IRegion } from "@/domain/interfaces/tripInterface"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type TMenu = "browse" | "regions" | "interests"

type TPanelProps = { onNavigate?: () => void; regions: IRegion[]; interests: IInterest[] }

function BrowsePanel({ onNavigate }: TPanelProps) {
  const t = useTranslations("Header")
  const tc = useTranslations("Common")
  const td = useTranslations("Durations")
  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("byDuration")}</p>
        <div className="flex flex-wrap gap-2">
          {durationBuckets.map((b) => (
            <Link
              key={b.slug}
              href={`/trips?duration=${b.slug}`}
              onClick={onNavigate}
              className="rounded-full border px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              {td(b.slug)}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <Link href="/trips" onClick={onNavigate} className="font-bold hover:text-primary">
          {tc("browseAllTripsArrow")}
        </Link>
        <Link href="/calendar" onClick={onNavigate} className="hover:text-primary">
          {t("fixedDepartureCalendar")}
        </Link>
      </div>
    </div>
  )
}

function RegionsPanel({ onNavigate, regions }: TPanelProps) {
  const t = useTranslations("Header")
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {regions.map((r) => (
          <Link
            key={r.slug}
            href={`/trips?region=${r.slug}`}
            onClick={onNavigate}
            className="group flex items-center gap-3 rounded-md p-2 hover:bg-sand"
          >
            <span className="relative hidden size-12 shrink-0 overflow-hidden rounded md:block">
              <Image src={r.image} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span className="text-sm font-bold group-hover:text-primary">{r.name}</span>
          </Link>
        ))}
      </div>
      <Link href="/destinations/nepal" onClick={onNavigate} className="mt-4 inline-block text-sm font-bold text-primary hover:underline">
        {t("aboutNepal")}
      </Link>
    </div>
  )
}

function InterestsPanel({ onNavigate, interests }: TPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {interests.map((i) => (
        <Link
          key={i.slug}
          href={`/trips?interest=${i.slug}`}
          onClick={onNavigate}
          className="flex items-start gap-3 rounded-md p-3 hover:bg-sand"
        >
          <InterestIcon slug={i.slug} className="mt-0.5 size-5 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-bold">{i.name}</span>
            <span className="hidden text-xs text-muted-foreground md:block">{i.description}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}

const panels: Record<TMenu, (p: TPanelProps) => React.ReactNode> = {
  browse: BrowsePanel,
  regions: RegionsPanel,
  interests: InterestsPanel,
}

export function Header({ regions, interests }: { regions: IRegion[]; interests: IInterest[] }) {
  const t = useTranslations("Header")
  const tc = useTranslations("Common")
  const { data: session } = useSession()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<TMenu | null>(null)

  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const overlay = isHome && !scrolled && !mobileOpen
  const closeMobile = () => {
    setMobileOpen(false)
    setMobileSection(null)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    window.location.reload()
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          overlay ? "bg-gradient-to-b from-black/60 to-transparent text-white" : "bg-white text-ink shadow-sm",
        )}
      >
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:h-20">
          <Link href="/" className="font-display text-xl uppercase leading-none tracking-[0.15em] lg:text-2xl">
            Royal Himalaya <span className={overlay ? "text-white" : "text-primary"}>Experiences</span>
          </Link>

          <nav className="hidden items-center lg:flex" aria-label={t("mainNav")}>
            {(Object.keys(panels) as TMenu[]).map((key) => {
              const Panel = panels[key]
              return (
                <div key={key} className="group">
                  <button
                    type="button"
                    className="flex items-center gap-1 px-4 py-7 font-display text-sm uppercase tracking-widest hover:text-primary"
                    aria-haspopup="true"
                  >
                    {t(key)}
                    <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute inset-x-4 top-full rounded-b-md bg-white p-6 text-ink opacity-0 shadow-xl transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <Panel regions={regions} interests={interests} />
                  </div>
                </div>
              )
            })}
            <Link href="/calendar" className="px-4 py-7 font-display text-sm uppercase tracking-widest hover:text-primary">
              {t("calendar")}
            </Link>
            <Link href="/about" className="px-4 py-7 font-display text-sm uppercase tracking-widest hover:text-primary">
              {t("about")}
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <PreferencesMenu />
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("chatWhatsapp")}
              className="hidden rounded-full p-2 hover:text-primary sm:inline-flex"
            >
              <MessageCircle className="size-5" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label={t("emailUs")}
              className="hidden rounded-full p-2 hover:text-primary sm:inline-flex"
            >
              <Mail className="size-5" />
            </a>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" aria-label={t("account")} className="rounded-full p-2 hover:text-primary">
                    <User className="size-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden px-2 text-sm font-bold hover:text-primary sm:inline">
                {t("signIn")}
              </Link>
            )}

            <Button
              asChild
              size="sm"
              className="ml-2 hidden font-display uppercase tracking-widest md:inline-flex"
            >
              <Link href="/trips">{t("findTrip")}</Link>
            </Button>

            <button
              type="button"
              className="rounded-full p-2 lg:hidden"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t bg-white px-4 pb-8 text-ink lg:hidden">
            {(Object.keys(panels) as TMenu[]).map((key) => {
              const Panel = panels[key]
              const open = mobileSection === key
              return (
                <div key={key} className="border-b">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 font-display uppercase tracking-widest"
                    aria-expanded={open}
                    onClick={() => setMobileSection(open ? null : key)}
                  >
                    {t(key)}
                    <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
                  </button>
                  {open && (
                    <div className="pb-4">
                      <Panel onNavigate={closeMobile} regions={regions} interests={interests} />
                    </div>
                  )}
                </div>
              )
            })}
            {[
              { href: "/calendar", label: t("calendar") },
              { href: "/about", label: t("about") },
              ...(session ? [] : [{ href: "/login", label: t("signIn") }]),
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={closeMobile}
                className="block border-b py-4 font-display uppercase tracking-widest"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-6 flex gap-3">
              <Button asChild className="flex-1">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle /> {tc("whatsapp")}
                </a>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <a href={`mailto:${siteConfig.email}`}>
                  <Mail /> {tc("email")}
                </a>
              </Button>
            </div>
          </div>
        )}
      </header>
      {!isHome && <div className="h-16 lg:h-20" aria-hidden />}
    </>
  )
}
