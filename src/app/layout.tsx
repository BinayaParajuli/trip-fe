import type { Metadata } from "next";
import { Oswald, PT_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/custom/AuthProvider";
import { Toaster } from "sonner";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  manifest:"/manifest.json",
  title: {
    default: "Royal Himalaya Experiences | Treks & Tours in Nepal",
    template: "%s | Royal Himalaya Experiences",
  },
  description:
    "Mountain treks, cultural tours, wildlife safaris and heli flights in Nepal, led by local guides.",
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${ptSans.variable} antialiased`}
      >
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>
          <AuthProvider>
            {children}
            <Toaster/>
          </AuthProvider>
      </body>
    </html>
  );
}
