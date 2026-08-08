import { Star } from "lucide-react"

/**
 * Renders a single testimonial with star rating, quote, and client info.
 * @param {object} props - TestimonialCard props.
 * @param {object} props.testimonial - Testimonial object (rating, testimonial, client_name, photo_url, position, company).
 * @returns {JSX.Element} The testimonial card.
 */
export default function TestimonialCard({ testimonial }) {
  return (
    <div className="glass-card p-8 hover-lift flex flex-col h-full">
      <div className="flex items-center gap-1 mb-5">
        {/* Render 5 stars, filling only those at or below the testimonial's rating. */}
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`w-4 h-4 ${n <= testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-6 italic flex-1">"{testimonial.testimonial}"</p>
      <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
        {testimonial.photo_url ? (
          <img src={testimonial.photo_url} alt={testimonial.client_name} loading="lazy" decoding="async" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        ) : (
          // Initials avatar fallback when the client has no photo.
          <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-royal text-white text-sm font-heading font-bold flex items-center justify-center flex-shrink-0">
            {testimonial.client_name[0]?.toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-heading font-bold text-navy truncate">— {testimonial.client_name}</p>
          <p className="text-xs text-gray-400 truncate">
            {testimonial.position}
            {testimonial.company ? `, ${testimonial.company}` : ""}
          </p>
        </div>
      </div>
    </div>
  )
}
