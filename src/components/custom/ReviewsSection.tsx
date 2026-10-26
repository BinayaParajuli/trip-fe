import { ReviewForm } from "@/components/custom/ReviewForm"
import { ReviewList, ReviewSummary } from "@/components/custom/ReviewList"
import { SectionHeading } from "@/components/custom/SectionHeading"
import { IReviewSummary } from "@/domain/interfaces/reviewInterface"

export function ReviewsSection({
  summary,
  trips,
  title = "What travellers say",
  showTrip,
}: {
  summary: IReviewSummary
  trips: { slug: string; title: string }[]
  title?: string
  showTrip?: boolean
}) {
  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Reviews" title={title} className="mb-0" />
        <ReviewSummary count={summary.count} averageRating={summary.averageRating} />
      </div>
      {summary.reviews.length > 0 ? (
        <ReviewList reviews={summary.reviews} showTrip={showTrip} />
      ) : (
        <p className="text-muted-foreground">No reviews yet — be the first to share your experience.</p>
      )}
      {trips.length > 0 && (
        <div className="mt-10 max-w-2xl">
          <ReviewForm trips={trips} />
        </div>
      )}
    </>
  )
}
