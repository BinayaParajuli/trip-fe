import { useTranslations } from "next-intl"
import { ReviewForm } from "@/components/custom/ReviewForm"
import { ReviewList, ReviewSummary } from "@/components/custom/ReviewList"
import { SectionHeading } from "@/components/custom/SectionHeading"
import { IReviewSummary } from "@/domain/interfaces/reviewInterface"

export function ReviewsSection({
  summary,
  trips,
  title,
  showTrip,
}: {
  summary: IReviewSummary
  trips: { slug: string; title: string }[]
  title?: string
  showTrip?: boolean
}) {
  const t = useTranslations("Reviews")
  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow={t("eyebrow")} title={title ?? t("defaultTitle")} className="mb-0" />
        <ReviewSummary count={summary.count} averageRating={summary.averageRating} />
      </div>
      {summary.reviews.length > 0 ? (
        <ReviewList reviews={summary.reviews} showTrip={showTrip} />
      ) : (
        <p className="text-muted-foreground">{t("empty")}</p>
      )}
      {trips.length > 0 && (
        <div className="mt-10 max-w-2xl">
          <ReviewForm trips={trips} />
        </div>
      )}
    </>
  )
}
