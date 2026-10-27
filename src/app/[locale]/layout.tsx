import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Noto_Sans_Devanagari, Oswald, PT_Sans } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { AuthProvider } from "@/components/custom/AuthProvider";
import { Toaster } from "sonner";
import { routing, TLocale } from "@/i18n/routing";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Nepali and Hindi text; Latin characters still use Oswald / PT Sans first.
const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  weight: ["400", "700"],
  subsets: ["devanagari"],
});

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as TLocale, namespace: "Metadata" });
  return {
    manifest: "/manifest.json",
    title: {
      default: t("title"),
      template: "%s | Royal Himalaya Experiences",
    },
    description: t("description"),
    icons: {
      icon: [
        {
          url: "/icon-light-32x32.png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/icon-dark-32x32.png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/icon.svg",
          type: "image/svg+xml",
        },
      ],
      apple: "/apple-icon.png",
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={`${oswald.variable} ${ptSans.variable} ${notoDevanagari.variable} antialiased`}
      >
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>
        <NextIntlClientProvider>
          <AuthProvider>
            {children}
            <Toaster/>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
