import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { usePublishedTestimonials } from "../hooks/usePublishedTestimonials"
import TestimonialCard from "../components/TestimonialCard"

function ArrowRightIcon() {
  return <ArrowRight className="w-4 h-4 ml-1" />
}

// Public testimonials page — lists published client testimonials fetched from the database.
function PublicTestimonials() {
  // Load published testimonials; handles loading/empty/error states in the UI.
  const { testimonials, loading, error } = usePublishedTestimonials()

  return (
    <div>
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 relative overflow-hidden bg-gradient-hero">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-primary/[0.04] via-sky/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center bg-[#EFF6FF] text-[#2563EB] text-sm font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
            TESTIMONIALS
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-[#0F172A] mb-4">
            What Our Clients Say
          </h1>
          <p className="text-[18px] text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Real feedback from the businesses and organizations we have had the pleasure of working with.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
            <p className="text-center text-sm text-[#94A3B8] py-16">
              Testimonials are being updated. Please check back soon.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-[#2563EB]/5 via-white to-[#2563EB]/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A] mb-4">Ready to Start Your Project?</h2>
          <p className="text-lg text-[#94A3B8] mb-8 max-w-xl mx-auto">Let's build a digital solution that helps your business grow.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center text-sm font-semibold px-6 py-3 rounded-xl bg-[#0F172A] text-white hover:bg-[#1e293b] shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
              Get a Free Consultation
              <ArrowRightIcon />
            </Link>
            <Link to="/solutions" className="inline-flex items-center text-sm font-semibold px-6 py-3 rounded-xl border border-[#E5E7EB] text-[#0F172A] hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]">
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PublicTestimonials
