import { IResponseApi } from "@/domain/interfaces/apiResponse";
import {
  IDepartureApi,
  IDestinationApi,
  IInterestApi,
  IRegionApi,
  ITripApi,
  ITripFilters,
  ITripSummaryApi,
} from "@/domain/interfaces/tripInterface";
import type { AxiosResponse } from "axios";
import { authInstance } from "@/lib/axios/authAxiosInstance";

// On the server, identical GETs within a minute share one request. A build
// renders many pages in parallel that all need the same lists (regions,
// interests, all trips); without this the API gets hundreds of duplicate calls.
const TTL_MS = 60_000;
const cache = new Map<string, { at: number; promise: Promise<AxiosResponse> }>();

function cachedGet<T>(url: string, params?: object): Promise<AxiosResponse<T>> {
  if (typeof window !== "undefined") return authInstance.get<T>(url, { params });
  const key = `${url}?${JSON.stringify(params ?? {})}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.promise as Promise<AxiosResponse<T>>;
  const promise = authInstance.get<T>(url, { params });
  cache.set(key, { at: Date.now(), promise });
  promise.catch(() => cache.delete(key)); // never cache failures
  return promise;
}

// Public catalogue endpoints — no auth token needed, so these work in server components.
export const tripApiRepository = {
  getTrips: async (filters: ITripFilters & { page_size?: number } = {}) => {
    try {
      return await cachedGet<IResponseApi<ITripSummaryApi[]>>("trips/", filters);
    } catch (e) {
      throw e;
    }
  },
  getTrip: async (slug: string) => {
    try {
      return await cachedGet<ITripApi>(`trips/${slug}/`);
    } catch (e) {
      throw e;
    }
  },
  getDepartures: async (params: { trip?: string; page_size?: number } = {}) => {
    try {
      return await cachedGet<IResponseApi<IDepartureApi[]>>("departures/", params);
    } catch (e) {
      throw e;
    }
  },
  getDestinations: async () => {
    try {
      return await cachedGet<IDestinationApi[]>("destinations/");
    } catch (e) {
      throw e;
    }
  },
  getRegions: async () => {
    try {
      return await cachedGet<IRegionApi[]>("regions/");
    } catch (e) {
      throw e;
    }
  },
  getInterests: async () => {
    try {
      return await cachedGet<IInterestApi[]>("interests/");
    } catch (e) {
      throw e;
    }
  },
};
