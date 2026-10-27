import { setRequestLocale } from "next-intl/server";
import { CurrencyProvider } from "@/components/custom/CurrencyProvider";
import { Header } from "@/components/custom/Header";
import { Footer } from "@/components/custom/Footer";
import { currencyService } from "@/domain/services/currencyService";
import { tripService } from "@/domain/services/tripService";
import { TLocale } from "@/i18n/routing";

export const revalidate = 3600;

export default async function PublicLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  setRequestLocale((await params).locale as TLocale);
  const [regions, interests, exchangeRates] = await Promise.all([
    tripService.getRegions(),
    tripService.getInterests(),
    currencyService.getUsdRates(),
  ]);
  return (
    <CurrencyProvider rates={exchangeRates?.rates ?? null}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header regions={regions} interests={interests} />
        <main className="flex-1">{children}</main>
        <Footer regions={regions} interests={interests} />
      </div>
    </CurrencyProvider>
  );
}
