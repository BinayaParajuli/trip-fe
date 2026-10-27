export function formatMoney(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatAltitude(m: number, locale: string) {
  return `${m.toLocaleString(locale)} m`;
}

// Dates are stored as YYYY-MM-DD; format in UTC so the day never shifts.
// English uses British day-month order, as the site always has.
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions, locale: string) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, { timeZone: "UTC", ...opts }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
