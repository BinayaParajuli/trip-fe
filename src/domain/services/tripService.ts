import { isAxiosError } from "axios";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { tripApiRepository } from "@/domain/apiRepository/tripApiRepository";
import {
  IDepartureWithTrip,
  IDestination,
  IInterest,
  IRegion,
  ITrip,
  ITripFilters,
  ITripSummary,
} from "@/domain/interfaces/tripInterface";
import { mapDeparture, mapDestination, mapInterest, mapRegion, mapTrip, mapTripSummary } from "@/domain/mappers/tripMapper";

// The catalogue is small, so list calls fetch one large page.
const ALL = 100;

// Lets `next build` finish when the API is unreachable: pages are prerendered
// empty and fill in on the next revalidation. At runtime errors still throw, so
// ISR keeps serving the last good page instead of caching an empty one.
const emptyDuringBuild = async <T>(fetch: () => Promise<T[]>): Promise<T[]> => {
  try {
    return await fetch();
  } catch (e) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw e;
    console.warn("API unreachable during build, rendering with empty data:", (e as Error).message);
    return [];
  }
};

export const tripService = {
  getTrips: async (filters: ITripFilters = {}): Promise<ITripSummary[]> =>
    emptyDuringBuild(async () => {
      const res = await tripApiRepository.getTrips({ ...filters, page_size: ALL });
      return res.data.results.map(mapTripSummary);
    }),

  getTrip: async (slug: string): Promise<ITrip | undefined> => {
    try {
      const res = await tripApiRepository.getTrip(slug);
      return mapTrip(res.data);
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 404) return undefined;
      throw e;
    }
  },

  getAllTripSlugs: async (): Promise<string[]> => (await tripService.getTrips()).map((t) => t.slug),

  getRelatedTrips: async (trip: ITripSummary, limit = 3): Promise<ITripSummary[]> => {
    const all = await tripService.getTrips();
    return all
      .filter((t) => t.slug !== trip.slug)
      .map((t) => ({
        t,
        score: (t.region === trip.region ? 2 : 0) + t.interests.filter((i) => trip.interests.includes(i)).length,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ t }) => t);
  },

  getUpcomingDepartures: async (opts: { tripSlug?: string; limit?: number } = {}): Promise<IDepartureWithTrip[]> =>
    emptyDuringBuild(async () => {
      const res = await tripApiRepository.getDepartures({ trip: opts.tripSlug, page_size: opts.limit ?? ALL });
      return res.data.results.map(mapDeparture);
    }),

  getDestinations: async (): Promise<IDestination[]> => (await tripApiRepository.getDestinations()).data.map(mapDestination),

  getDestination: async (slug: string): Promise<IDestination | undefined> =>
    (await tripService.getDestinations()).find((d) => d.slug === slug),

  getRegions: async (): Promise<IRegion[]> =>
    emptyDuringBuild(async () => (await tripApiRepository.getRegions()).data.map(mapRegion)),

  getInterests: async (): Promise<IInterest[]> =>
    emptyDuringBuild(async () => (await tripApiRepository.getInterests()).data.map(mapInterest)),
};
