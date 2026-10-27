"use client"

import { useState } from "react"
import { isAxiosError } from "axios"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star } from "lucide-react"
import { useTranslations } from "next-intl"
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
function errorMessage(e: unknown, t: ReturnType<typeof useTranslations<"ReviewForm">>) {
  if (isAxiosError(e)) {
    if (e.response?.status === 429) return t("tooMany")
    const detail = e.response?.data?.errors?.[0]?.detail
    if (typeof detail === "string") return detail
  }
  return t("failed")
}

export function ReviewForm({ trips }: { trips: TripOption[] }) {
  const t = useTranslations("ReviewForm")
  const tv = useTranslations("Validation")
  const fieldError = (message?: string) => message && <p className="text-red-500">{tv(message as Parameters<typeof tv>[0])}</p>
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
      toast.success(t("success"))
    } catch (e) {
      toast.error(errorMessage(e, t))
    }
  }

  if (sent) {
    return (
      <div className="rounded-md bg-white p-6 ring-1 ring-black/5">
        <p className="font-bold text-ink">{t("sentTitle")}</p>
        <p className="mt-1 text-muted-foreground">{t("sentText")}</p>
        <Button variant="link" className="mt-2 px-0" onClick={() => setSent(false)}>
          {t("writeAnother")}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md bg-white p-6 ring-1 ring-black/5">
      <h3 className="text-lg">{t("title")}</h3>

      {trips.length > 1 && (
        <div className="space-y-2">
          <Label htmlFor="review-trip">{t("trip")}</Label>
          <select
            {...register("trip")}
            id="review-trip"
            className="h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <option value="">{t("whichTrip")}</option>
            {trips.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
          {fieldError(errors.trip?.message)}
        </div>
      )}

      <div className="space-y-2">
        <Label id="review-rating">{t("rating")}</Label>
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
                  aria-label={t("starLabel", { n })}
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
        {fieldError(errors.rating?.message)}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="review-name">{t("name")}</Label>
          <Input {...register("name")} id="review-name" autoComplete="name" />
          {fieldError(errors.name?.message)}
        </div>
        <div className="space-y-2">
          <Label htmlFor="review-country">{t("country")}</Label>
          <Input {...register("country")} id="review-country" autoComplete="country-name" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-title">{t("reviewTitle")}</Label>
        <Input {...register("title")} id="review-title" placeholder={t("reviewTitlePlaceholder")} />
        {fieldError(errors.title?.message)}
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-body">{t("body")}</Label>
        <Textarea {...register("body")} id="review-body" rows={5} placeholder={t("bodyPlaceholder")} />
        {fieldError(errors.body?.message)}
      </div>

      <Button type="submit" disabled={isSubmitting} className="font-display uppercase tracking-widest">
        {isSubmitting ? t("sending") : t("submit")}
      </Button>
      <p className="text-xs text-muted-foreground">{t("moderated")}</p>
    </form>
  )
}
