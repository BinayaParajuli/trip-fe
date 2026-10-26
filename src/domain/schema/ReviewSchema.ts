import { z } from "zod"

export const ReviewSchema = z.object({
  trip: z.string().min(1, "Choose the trip you took"),
  name: z.string().trim().min(1, "Name is required").max(100),
  country: z.string().trim().max(100).optional(),
  rating: z.number().int().min(1, "Pick a rating").max(5),
  title: z.string().trim().min(1, "Give your review a title").max(150),
  body: z.string().trim().min(10, "Tell us a little more (at least 10 characters)"),
})

export type TReviewSchema = z.infer<typeof ReviewSchema>
