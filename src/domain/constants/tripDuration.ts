import { ITripSummary, TDurationBucket } from "@/domain/interfaces/tripInterface";

// Keys match the API's ?duration= filter values.
export const durationBuckets: { slug: TDurationBucket | "bestsellers"; label: string }[] = [
  { slug: "bestsellers", label: "Bestsellers" },
  { slug: "day", label: "Day Trips" },
  { slug: "2-3", label: "2 to 3 Days" },
  { slug: "4-7", label: "4 to 7 Days" },
  { slug: "8-14", label: "8 to 14 Days" },
  { slug: "15-plus", label: "15 Days & Above" },
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
