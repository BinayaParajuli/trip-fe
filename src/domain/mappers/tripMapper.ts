import {
  IDepartureApi,
  IDepartureWithTrip,
  IDestination,
  IDestinationApi,
  IInterest,
  IInterestApi,
  IRegion,
  IRegionApi,
  ITrip,
  ITripApi,
  ITripSummary,
  ITripSummaryApi,
} from "@/domain/interfaces/tripInterface";

// Shown when an admin hasn't uploaded a photo yet.
const FALLBACK_IMAGE = "/images/annapurna-range.jpg";

export const mapRegion = (api: IRegionApi): IRegion => ({
  slug: api.slug,
  name: api.name,
  tagline: api.tagline,
  image: api.image ?? FALLBACK_IMAGE,
});

export const mapDestination = (api: IDestinationApi): IDestination => ({
  slug: api.slug,
  name: api.name,
  tagline: api.tagline,
  intro: api.intro,
  image: api.image ?? FALLBACK_IMAGE,
  regions: api.regions.map(mapRegion),
});

export const mapInterest = (api: IInterestApi): IInterest => ({
  slug: api.slug,
  name: api.name,
  description: api.description,
});

export const mapTripSummary = (api: ITripSummaryApi): ITripSummary => ({
  slug: api.slug,
  title: api.title,
  summary: api.summary,
  destination: api.destination,
  region: api.region,
  regionName: api.region_name,
  interests: api.interests,
  durationDays: api.duration_days,
  difficulty: api.difficulty,
  maxAltitudeM: api.max_altitude_m,
  groupSize: api.group_size,
  bestSeason: api.best_season,
  priceFromUsd: Number(api.price_from_usd),
  image: api.image ?? FALLBACK_IMAGE,
  bestseller: api.is_bestseller,
});

export const mapTrip = (api: ITripApi): ITrip => ({
  ...mapTripSummary(api),
  highlights: api.highlights,
  itinerary: api.itinerary.map((d) => ({ day: d.day_label, title: d.title, description: d.description })),
  photos: api.photos.map((p) => ({ id: p.id, image: p.image, caption: p.caption })),
  includes: api.includes,
  excludes: api.excludes,
});

export const mapDeparture = (api: IDepartureApi): IDepartureWithTrip => ({
  id: api.id,
  trip: mapTripSummary(api.trip),
  startDate: api.start_date,
  priceUsd: Number(api.price_usd),
  seatsLeft: api.seats_left,
});
