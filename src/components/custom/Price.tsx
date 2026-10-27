"use client"

import { useLocale, useTranslations } from "next-intl"
import { useCurrency } from "@/components/custom/CurrencyProvider"
import { baseCurrency } from "@/config/currency"
import { formatMoney } from "@/lib/format"

// A USD price shown in the visitor's chosen currency; hovering shows the USD amount we actually charge.
export function Price({ usd }: { usd: number }) {
  const { currency, rate } = useCurrency()
  const locale = useLocale()
  const usdText = formatMoney(usd, baseCurrency, locale)
  if (currency === baseCurrency) return <>{usdText}</>
  return <span title={usdText}>≈ {formatMoney(usd * rate, currency, locale)}</span>
}

// One-line disclaimer for converted prices; renders nothing when showing USD.
export function PriceNote({ className }: { className?: string }) {
  const { currency } = useCurrency()
  const t = useTranslations("Currency")
  if (currency === baseCurrency) return null
  return <p className={className}>{t("note")}</p>
}
