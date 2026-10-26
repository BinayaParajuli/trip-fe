import { isAxiosError } from "axios";
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

export const tripService = {
  getTrips: async (filters: ITripFilters = {}): Promise<ITripSummary[]> => {
    const res = await tripApiRepository.getTrips({ ...filters, page_size: ALL });
    return res.data.results.map(mapTripSummary);
  },

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

  getUpcomingDepartures: async (opts: { tripSlug?: string; limit?: number } = {}): Promise<IDepartureWithTrip[]> => {
    const res = await tripApiRepository.getDepartures({ trip: opts.tripSlug, page_size: opts.limit ?? ALL });
    return res.data.results.map(mapDeparture);
  },

  getDestinations: async (): Promise<IDestination[]> => (await tripApiRepository.getDestinations()).data.map(mapDestination),

  getDestination: async (slug: string): Promise<IDestination | undefined> =>
    (await tripService.getDestinations()).find((d) => d.slug === slug),

  getRegions: async (): Promise<IRegion[]> => (await tripApiRepository.getRegions()).data.map(mapRegion),

  getInterests: async (): Promise<IInterest[]> => (await tripApiRepository.getInterests()).data.map(mapInterest),
};
