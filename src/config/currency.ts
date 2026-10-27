// Currencies a visitor can display prices in. Trips are priced and paid in USD;
// the others are converted for display only.
export const currencies = ["USD", "EUR", "GBP", "AUD", "CAD", "INR", "NPR", "CNY", "JPY"] as const;
export type TCurrency = (typeof currencies)[number];

export const baseCurrency: TCurrency = "USD";

const eurozone = ["AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"];

const countryCurrency: Record<string, TCurrency> = {
  US: "USD",
  GB: "GBP",
  AU: "AUD",
  CA: "CAD",
  IN: "INR",
  NP: "NPR",
  CN: "CNY",
  JP: "JPY",
  ...Object.fromEntries(eurozone.map((c) => [c, "EUR" as const])),
};

// Browsers don't expose the visitor's country, but the timezone is a good proxy and needs no IP lookup.
const timeZoneCountry: Record<string, string> = {
  "Asia/Kathmandu": "NP",
  "Asia/Katmandu": "NP",
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Shanghai": "CN",
  "Asia/Chongqing": "CN",
  "Asia/Urumqi": "CN",
  "Asia/Tokyo": "JP",
  "Europe/London": "GB",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Vienna": "AT",
  "Europe/Dublin": "IE",
  "Europe/Lisbon": "PT",
  "Europe/Helsinki": "FI",
  "Europe/Athens": "GR",
};

function countryFromTimeZone(tz: string) {
  if (timeZoneCountry[tz]) return timeZoneCountry[tz];
  if (tz.startsWith("Australia/")) return "AU";
  if (/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Montreal)$/.test(tz)) return "CA";
  if (/^(America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit)|Pacific\/Honolulu)$/.test(tz)) return "US";
  return undefined;
}

// Best guess at the visitor's currency: timezone first, then the region in their browser language (en-IN → IN).
export function detectCurrency(): TCurrency {
  try {
    const country =
      countryFromTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone) ??
      new Intl.Locale(navigator.language).maximize().region;
    return (country && countryCurrency[country]) || baseCurrency;
  } catch {
    return baseCurrency;
  }
}

export function isCurrency(value: unknown): value is TCurrency {
  return currencies.includes(value as TCurrency);
}
