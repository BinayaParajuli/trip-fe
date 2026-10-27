"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { baseCurrency, currencies, detectCurrency, isCurrency, TCurrency } from "@/config/currency"

const STORAGE_KEY = "currency"

type TCurrencyContext = {
  // The currency prices are shown in; falls back to USD when there is no rate for the choice.
  currency: TCurrency
  setCurrency: (c: TCurrency) => void
  // Currencies we have a rate for.
  available: TCurrency[]
  rate: number
}

const CurrencyContext = createContext<TCurrencyContext>({
  currency: baseCurrency,
  setCurrency: () => {},
  available: [baseCurrency],
  rate: 1,
})

export function CurrencyProvider({ rates, children }: { rates: Record<string, number> | null; children: React.ReactNode }) {
  // Server HTML is cached and shared, so it always renders USD; the visitor's currency is applied after hydration.
  const [chosen, setChosen] = useState<TCurrency>(baseCurrency)

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only state once after hydration
    setChosen(isCurrency(saved) ? saved : detectCurrency())
  }, [])

  const setCurrency = useCallback((c: TCurrency) => {
    setChosen(c)
    try {
      localStorage.setItem(STORAGE_KEY, c)
    } catch {}
  }, [])

  const available = currencies.filter((c) => c === baseCurrency || rates?.[c])
  const currency = available.includes(chosen) ? chosen : baseCurrency
  const rate = currency === baseCurrency ? 1 : rates![currency]

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, available, rate }}>{children}</CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
