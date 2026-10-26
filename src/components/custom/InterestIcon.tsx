import { Bus, Footprints, Landmark, LucideProps, Mountain, PawPrint, Plane } from "lucide-react"
import { TInterestSlug } from "@/domain/interfaces/tripInterface"

const icons: Record<TInterestSlug, React.ComponentType<LucideProps>> = {
  mountains: Mountain,
  culture: Landmark,
  wildlife: PawPrint,
  overland: Bus,
  heli: Plane,
  hike: Footprints,
}

export function InterestIcon({ slug, ...props }: { slug: TInterestSlug } & LucideProps) {
  const Icon = icons[slug]
  return <Icon aria-hidden {...props} />
}
