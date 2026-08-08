import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { usePublishedTestimonials } from "../hooks/usePublishedTestimonials"
import TestimonialCard from "./TestimonialCard"

// Testimonials section: shows a curated selection with featured clients first.

/**
 * Renders the client testimonials grid with skeletons, empty/error state, and a "View All" link.
 * @returns {JSX.Element} The testimonials section.
 */
function Testimonials() {
  const { testimonials, loading, error } = usePublishedTestimonials()
  const featured = testimonials.filter((t) => t.featured)
  // Featured testimonials lead the list, then the rest, capped at 3 total.
  const visible = [...featured, ...testimonials.filter((t) => !t.featured)].slice(0, 3)

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">What Our Clients Say</h2>
        <p className="section-subtitle">
          We take pride in the relationships we build and the results we deliver.
        </p>

        {loading ? (
          // Placeholder skeleton cards while testimonials load.
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card p-8 animate-pulse">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="w-4 h-4 rounded-sm bg-gray-100" />
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-3.5 bg-gray-100 rounded w-full" />
                  <div className="h-3.5 bg-gray-100 rounded w-5/6" />
                  <div className="h-3.5 bg-gray-100 rounded w-2/3" />
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-100" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-32" />
                    <div className="h-3 bg-gray-100 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error || testimonials.length === 0 ? (
          <p className="text-center text-sm text-[#94A3B8] mt-16">
            Testimonials are being updated. Please check back soon.
          </p>
        ) : (
          <>
            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/testimonials"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-blue-100 px-6 py-3 rounded-xl transition-all duration-200"
              >
                View All Testimonials
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Testimonials
