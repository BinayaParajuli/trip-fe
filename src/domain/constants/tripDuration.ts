import { ITripSummary, TDurationBucket } from "@/domain/interfaces/tripInterface";

// Keys match the API's ?duration= filter values; labels live under "Durations" in the message files.
export const durationBuckets: { slug: TDurationBucket | "bestsellers" }[] = [
  { slug: "bestsellers" },
  { slug: "day" },
  { slug: "2-3" },
  { slug: "4-7" },
  { slug: "8-14" },
  { slug: "15-plus" },
];

export function matchesDuration(trip: ITripSummary, bucket: string) {
  const d = trip.durationDays;
  switch (bucket) {
    case "bestsellers":
      return trip.bestseller;
    case "day":
      return d === 1;
    case "2-3":
      return d >= 2 && d <= 3;
    case "4-7":
      return d >= 4 && d <= 7;
    case "8-14":
      return d >= 8 && d <= 14;
    case "15-plus":
      return d >= 15;
    default:
      return true;
  }
}
