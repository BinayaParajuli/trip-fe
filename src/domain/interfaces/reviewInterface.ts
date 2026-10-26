import { IResponseApi } from "@/domain/interfaces/apiResponse";

// ---- API ----

export interface IReviewApi {
  id: number;
  trip: string;
  trip_title: string;
  name: string;
  country: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
}

export interface IReviewListApi extends IResponseApi<IReviewApi[]> {
  average_rating: number | null;
}

export interface ICreateReviewApi {
  trip: string;
  name: string;
  country: string;
  rating: number;
  title: string;
  body: string;
}

// ---- Frontend ----

export interface IReview {
  id: number;
  trip: string;
  tripTitle: string;
  name: string;
  country: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string; // ISO datetime
}

export interface IReviewSummary {
  reviews: IReview[];
  count: number;
  averageRating: number | null;
}

export interface IReviewFilters {
  trip?: string;
  destination?: string;
}
