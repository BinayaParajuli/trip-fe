"use client"

import { useState } from "react"
import { isAxiosError } from "axios"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ReviewSchema, TReviewSchema } from "@/domain/schema/ReviewSchema"
import { reviewService } from "@/domain/services/reviewService"
import { cn } from "@/lib/utils"

type TripOption = { slug: string; title: string }

// Backend validation errors look like { errors: [{ attr, detail }] }.
function errorMessage(e: unknown) {
  if (isAxiosError(e)) {
    if (e.response?.status === 429) return "You've sent a few reviews already — please try again later."
    const detail = e.response?.data?.errors?.[0]?.detail
    if (typeof detail === "string") return detail
  }
  return "Couldn't send your review. Please try again."
}

export function ReviewForm({ trips }: { trips: TripOption[] }) {
  const [sent, setSent] = useState(false)
  const [hover, setHover] = useState(0)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TReviewSchema>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: { trip: trips.length === 1 ? trips[0].slug : "", rating: 0 },
  })

  const onSubmit = async (data: TReviewSchema) => {
    try {
      await reviewService.createReview(data)
      reset()
      setSent(true)
      toast.success("Thanks! Your review will appear once we've checked it.")
    } catch (e) {
      toast.error(errorMessage(e))
    }
  }

  if (sent) {
    return (
      <div className="rounded-md bg-white p-6 ring-1 ring-black/5">
        <p className="font-bold text-ink">Thanks for sharing your trip!</p>
        <p className="mt-1 text-muted-foreground">Your review will appear here once our team has checked it.</p>
        <Button variant="link" className="mt-2 px-0" onClick={() => setSent(false)}>
          Write another review
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md bg-white p-6 ring-1 ring-black/5">
      <h3 className="text-lg">Write a review</h3>

      {trips.length > 1 && (
        <div className="space-y-2">
          <Label htmlFor="review-trip">Trip</Label>
          <select
            {...register("trip")}
            id="review-trip"
            className="h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <option value="">Which trip did you take?</option>
            {trips.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
          {errors.trip && <p className="text-red-500">{errors.trip.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label id="review-rating">Rating</Label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <div role="radiogroup" aria-labelledby="review-rating" className="flex gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={field.value === n}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  onClick={() => field.onChange(n)}
                  onMouseEnter={() => setHover(n)}
                  className="rounded-sm p-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <Star
                    className={cn("size-7 transition-colors", n <= (hover || field.value) ? "fill-primary text-primary" : "text-black/20")}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          )}
        />
        {errors.rating && <p className="text-red-500">{errors.rating.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="review-name">Your name</Label>
          <Input {...register("name")} id="review-name" autoComplete="name" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="review-country">Country (optional)</Label>
          <Input {...register("country")} id="review-country" autoComplete="country-name" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-title">Title</Label>
        <Input {...register("title")} id="review-title" placeholder="Sum up your trip in a line" />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-body">Your review</Label>
        <Textarea {...register("body")} id="review-body" rows={5} placeholder="What stood out? How were the guides, the route, the lodges?" />
        {errors.body && <p className="text-red-500">{errors.body.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="font-display uppercase tracking-widest">
        {isSubmitting ? "Sending..." : "Submit review"}
      </Button>
      <p className="text-xs text-muted-foreground">Reviews are checked by our team before they appear on the site.</p>
    </form>
  )
}
