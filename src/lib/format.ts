export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function formatDuration(days: number) {
  return days === 1 ? "Day trip" : `${days} days`;
}

export function formatAltitude(m: number) {
  return `${m.toLocaleString("en-US")} m`;
}

// Dates are stored as YYYY-MM-DD; format in UTC so the day never shifts.
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...opts }).format(new Date(`${iso}T00:00:00Z`));
}
