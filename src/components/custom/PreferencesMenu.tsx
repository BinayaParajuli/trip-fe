"use client"

import { useTransition } from "react"
import { Globe } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrency } from "@/components/custom/CurrencyProvider"
import { isCurrency } from "@/config/currency"
import { usePathname, useRouter } from "@/i18n/navigation"
import { localeNames, routing, TLocale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

// Language + currency picker in the header.
export function PreferencesMenu({ className }: { className?: string }) {
  const t = useTranslations("Preferences")
  const locale = useLocale() as TLocale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const { currency, setCurrency, available } = useCurrency()

  const changeLocale = (next: string) =>
    startTransition(() => {
      // Keep filters (?region=...) and the section anchor when switching language.
      router.replace(`${pathname}${window.location.search}${window.location.hash}`, { locale: next as TLocale })
    })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("label")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full p-2 text-sm font-bold hover:text-primary",
            isPending && "opacity-60",
            className,
          )}
        >
          <Globe className="size-5" />
          <span className="uppercase">{locale}</span>
          <span className="hidden sm:inline">· {currency}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale} onValueChange={changeLocale}>
          {routing.locales.map((l) => (
            <DropdownMenuRadioItem key={l} value={l} lang={l}>
              {localeNames[l]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {available.length > 1 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t("currency")}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={currency} onValueChange={(c) => isCurrency(c) && setCurrency(c)}>
              {available.map((c) => (
                <DropdownMenuRadioItem key={c} value={c}>
                  <span className="w-10 font-bold">{c}</span>
                  <span className="text-muted-foreground">{t(`currencies.${c}`)}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
