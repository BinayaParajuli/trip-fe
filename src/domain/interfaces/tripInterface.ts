// API shapes (IXxxApi, snake_case — match Django exactly) and the camelCase
// frontend shapes they map to (see domain/mappers/tripMapper.ts).

export type TInterestSlug = "mountains" | "culture" | "wildlife" | "overland" | "heli" | "hike";

export type TDifficulty = "Easy" | "Moderate" | "Challenging";

export type TDurationBucket = "day" | "2-3" | "4-7" | "8-14" | "15-plus";

// ---- API ----

export interface IRegionApi {
  slug: string;
  name: string;
  tagline: string;
  image: string | null;
  destination: string;
}

export interface IDestinationApi {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  image: string | null;
  regions: IRegionApi[];
}

export interface IInterestApi {
  slug: TInterestSlug;
  name: string;
  description: string;
}

export interface ITripSummaryApi {
  slug: string;
  title: string;
  summary: string;
  destination: string;
  region: string;
  region_name: string;
  interests: TInterestSlug[];
  duration_days: number;
  difficulty: TDifficulty;
  max_altitude_m: number;
  group_size: string;
  best_season: string;
  price_from_usd: string;
  image: string | null;
  is_bestseller: boolean;
}

export interface ITripPhotoApi {
  id: number;
  image: string;
  caption: string;
}

export interface ITripApi extends ITripSummaryApi {
  highlights: string[];
  itinerary: { day_label: string; title: string; description: string }[];
  photos: ITripPhotoApi[];
  includes: string[];
  excludes: string[];
}

export interface IDepartureApi {
  id: number;
  trip: ITripSummaryApi;
  start_date: string;
  price_usd: string;
  seats_left: number;
}

// ---- Frontend ----

export interface IRegion {
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

export interface IDestination {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  image: string;
  regions: IRegion[];
}

export interface IInterest {
  slug: TInterestSlug;
  name: string;
  description: string;
}

export interface IItineraryDay {
  day: string;
  title: string;
  description: string;
}

export interface ITripSummary {
  slug: string;
  title: string;
  summary: string;
  destination: string;
  region: string;
  regionName: string;
  interests: TInterestSlug[];
  durationDays: number;
  difficulty: TDifficulty;
  maxAltitudeM: number;
  groupSize: string;
  bestSeason: string;
  priceFromUsd: number;
  image: string;
  bestseller: boolean;
}

export interface ITripPhoto {
  id: number;
  image: string;
  caption: string;
}

export interface ITrip extends ITripSummary {
  highlights: string[];
  itinerary: IItineraryDay[];
  photos: ITripPhoto[];
  includes: string[];
  excludes: string[];
}

export interface IDepartureWithTrip {
  id: number;
  trip: ITripSummary;
  startDate: string; // ISO date (YYYY-MM-DD)
  priceUsd: number;
  seatsLeft: number;
}

export interface ITripFilters {
  destination?: string;
  region?: string;
  interest?: string;
  duration?: string;
  sort?: string;
}
