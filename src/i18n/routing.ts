import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ne", "hi", "zh", "es"] as const;
export type TLocale = (typeof locales)[number];

// Names shown in the language picker, written in their own language.
export const localeNames: Record<TLocale, string> = {
  en: "English",
  ne: "नेपाली",
  hi: "हिन्दी",
  zh: "中文",
  es: "Español",
};

// English keeps the unprefixed URLs (/trips); other languages live under /ne/trips, /hi/trips, ...
export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});
