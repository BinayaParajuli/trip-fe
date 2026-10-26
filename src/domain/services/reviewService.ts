import { reviewApiRepository } from "@/domain/apiRepository/reviewApiRepository";
import { IReviewFilters, IReviewSummary } from "@/domain/interfaces/reviewInterface";
import { mapReview } from "@/domain/mappers/reviewMapper";
import { TReviewSchema } from "@/domain/schema/ReviewSchema";

export const reviewService = {
  // Latest published reviews, plus the count and average across all of them.
  getReviews: async (filters: IReviewFilters = {}, limit = 6): Promise<IReviewSummary> => {
    const { data } = await reviewApiRepository.getReviews({ ...filters, page_size: limit });
    return { reviews: data.results.map(mapReview), count: data.count, averageRating: data.average_rating };
  },

  createReview: async (data: TReviewSchema) => {
    const res = await reviewApiRepository.createReview({ ...data, country: data.country ?? "" });
    return mapReview(res.data);
  },
};
