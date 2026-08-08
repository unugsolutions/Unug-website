import { useState } from "react"
import { Star } from "lucide-react"

const sizeClasses = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-7 h-7",
}

export default function RatingStars({ value = 0, onChange, size = "md", className = "" }) {
  const [hover, setHover] = useState(0)
  const interactive = typeof onChange === "function"
  const current = interactive && hover > 0 ? hover : value

  const starClass = (n) =>
    `${sizeClasses[size]} transition-colors ${n <= current ? "text-amber-400 fill-amber-400" : "text-gray-200"}`

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role={interactive ? "radiogroup" : undefined}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) =>
        interactive ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <Star className={starClass(n)} />
          </button>
        ) : (
          <Star key={n} className={starClass(n)} aria-hidden />
        )
      )}
    </div>
  )
}
