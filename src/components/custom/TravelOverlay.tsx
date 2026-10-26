import { cn } from "@/lib/utils"

// Atmosphere layers for photo/video backgrounds: golden-hour warmth, faint
// topographic contours, a dashed flight path with a small plane, film grain
// and a vignette. Purely decorative.
export function TravelOverlay({ flightPath = false, className }: { flightPath?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* golden-hour warmth from the lower left */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_95%,rgba(255,170,90,0.35),transparent_55%)] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/25 via-transparent to-sky-900/20" />

      {/* topographic contour lines */}
      <svg
        className="absolute -right-24 -top-16 h-[120%] w-auto text-white opacity-[0.07]"
        viewBox="0 0 600 600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const s = 1 - i * 0.11
          return (
            <path
              key={i}
              transform={`translate(${300 - 300 * s} ${300 - 300 * s}) scale(${s})`}
              d="M300 40c90 6 170 40 210 110s52 150 20 220-90 140-180 170-190 20-260-30S-6 380 2 290 60 120 130 80 230 34 300 40z"
            />
          )
        })}
      </svg>

      {flightPath && (
        <svg className="motion-path absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none">
          <path
            id="flight-route"
            d="M-40 760 C 300 620, 520 720, 760 520 S 1180 260, 1500 170"
            stroke="white"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            className="animate-dash"
            vectorEffect="non-scaling-stroke"
          />
          <g>
            <circle r="5" fill="white" fillOpacity="0.9" />
            <circle r="12" fill="white" fillOpacity="0.15" />
            <animateMotion dur="18s" repeatCount="indefinite" rotate="auto">
              <mpath href="#flight-route" />
            </animateMotion>
          </g>
        </svg>
      )}

      {/* film grain + vignette */}
      <div className="film-grain" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45))]" />
    </div>
  )
}
