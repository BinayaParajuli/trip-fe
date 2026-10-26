import { IReview, IReviewApi } from "@/domain/interfaces/reviewInterface";

export const mapReview = (api: IReviewApi): IReview => ({
  id: api.id,
  trip: api.trip,
  tripTitle: api.trip_title,
  name: api.name,
  country: api.country,
  rating: api.rating,
  title: api.title,
  body: api.body,
  createdAt: api.created_at,
});
