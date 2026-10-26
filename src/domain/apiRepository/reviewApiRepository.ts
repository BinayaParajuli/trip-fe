import { ICreateReviewApi, IReviewApi, IReviewFilters, IReviewListApi } from "@/domain/interfaces/reviewInterface";
import { authInstance } from "@/lib/axios/authAxiosInstance";

// Public endpoints — anyone can read published reviews or submit one for moderation.
export const reviewApiRepository = {
  getReviews: async (params: IReviewFilters & { page_size?: number } = {}) => {
    try {
      return await authInstance.get<IReviewListApi>("reviews/", { params });
    } catch (e) {
      throw e;
    }
  },
  createReview: async (data: ICreateReviewApi) => {
    try {
      return await authInstance.post<IReviewApi>("reviews/", data);
    } catch (e) {
      throw e;
    }
  },
};
