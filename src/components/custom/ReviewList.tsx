import { Star } from "lucide-react"
import { IReview, IReviewSummary } from "@/domain/interfaces/reviewInterface"
import { cn } from "@/lib/utils"

export function ReviewStars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("flex gap-0.5", className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn("size-4", n <= Math.round(rating) ? "fill-primary text-primary" : "text-black/15")}
          aria-hidden
        />
      ))}
    </span>
  )
}

export function ReviewSummary({ count, averageRating }: Pick<IReviewSummary, "count" | "averageRating">) {
  if (!count || averageRating === null) return null
  return (
    <div className="flex items-center gap-3">
      <span className="font-display text-4xl text-ink">{averageRating.toFixed(1)}</span>
      <div>
        <ReviewStars rating={averageRating} />
        <p className="text-sm text-muted-foreground">
          from {count} {count === 1 ? "review" : "reviews"}
        </p>
      </div>
    </div>
  )
}

export function ReviewCard({ review, showTrip }: { review: IReview; showTrip?: boolean }) {
  const date = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(review.createdAt))
  return (
    <li className="flex flex-col rounded-md bg-white p-6 ring-1 ring-black/5">
      <ReviewStars rating={review.rating} />
      <h3 className="mt-3 text-lg">{review.title}</h3>
      <p className="mt-2 flex-1 whitespace-pre-line text-muted-foreground">{review.body}</p>
      <p className="mt-4 border-t pt-4 text-sm">
        <span className="font-bold text-ink">{review.name}</span>
        {review.country && <span className="text-muted-foreground">, {review.country}</span>}
        <span className="text-muted-foreground"> · {date}</span>
      </p>
      {showTrip && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-primary">{review.tripTitle}</p>}
    </li>
  )
}

export function ReviewList({ reviews, showTrip }: { reviews: IReview[]; showTrip?: boolean }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} showTrip={showTrip} />
      ))}
    </ul>
  )
}
