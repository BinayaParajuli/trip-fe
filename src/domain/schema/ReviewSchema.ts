import { z } from "zod"

// Error messages are keys under "Validation" in the message files.

export const ReviewSchema = z.object({
  trip: z.string().min(1, "chooseTrip"),
  name: z.string().trim().min(1, "nameRequired").max(100),
  country: z.string().trim().max(100).optional(),
  rating: z.number().int().min(1, "pickRating").max(5),
  title: z.string().trim().min(1, "titleRequired").max(150),
  body: z.string().trim().min(10, "bodyTooShort"),
})

export type TReviewSchema = z.infer<typeof ReviewSchema>
