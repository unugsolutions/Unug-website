import { Link } from "react-router-dom"
import { Check, ArrowRight } from "lucide-react"
import { usePublishedServices } from "../hooks/usePublishedServices"
import { getServiceIcon } from "../lib/serviceIcons"

// Services section: displays published services as cards with a featured ("most popular") highlight.

/**
 * Checkmark icon used in each feature list row.
 * @returns {JSX.Element} The check icon.
 */
function CheckIcon() {
  return <Check className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
}

/**
 * Arrow icon that slides right on button hover (via the group-hover/btn variant).
 * @returns {JSX.Element} The arrow icon.
 */
function ArrowRightIcon() {
  return <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
}

/**
 * Renders the services grid with skeletons, featured styling, and an error fallback.
 * @returns {JSX.Element} The services section.
 */
function Services() {
  const { services, loading, error } = usePublishedServices()
  // Only the first 3 services are shown on the landing page.
  const cards = services.slice(0, 3)

  return (
    <section className="relative bg-white py-20 md:py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#2563EB]/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center bg-[#EFF6FF] text-[#2563EB] text-sm font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
            SERVICES
          </div>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-[56px] leading-[1.1] text-[#0F172A]">
            Choose Our Services
          </h2>
          <p className="text-[18px] text-[#94A3B8] mt-4 max-w-2xl mx-auto leading-relaxed">
            Professional technology solutions tailored to help your business grow.
          </p>
        </div>

        {loading && (
          // Placeholder skeleton cards while services load.
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[18px] border border-[#E5E7EB] p-10 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-gray-100 mb-5" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-8" />
                <div className="space-y-2.5 mb-8">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-3.5 bg-gray-100 rounded w-2/3" />
                  ))}
                </div>
                <div className="h-11 bg-gray-100 rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {cards.map((card, i) => {
              const Icon = getServiceIcon(card.icon)
              return (
                <div
                  key={card.id}
                  className={`relative bg-white rounded-[18px] border p-10 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                    card.featured
                      ? "border-[#0F172A] border-2 shadow-xl scale-[1.02] lg:scale-[1.05] z-10 hover:shadow-2xl group"
                      : "border-[#E5E7EB] shadow-sm hover:shadow-xl group"
                  }`}
                  // Cards fade in sequentially with a stagger delay based on their index.
                  style={{ animation: `fadeIn 0.5s ease-out ${i * 0.15}s both` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent rounded-t-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {card.featured && (
                    // "MOST POPULAR" ribbon shown only on the featured card.
                    <div className="self-center -mt-14 mb-4">
                      <span className="inline-block bg-[#0F172A] text-white text-[11px] font-semibold tracking-wider px-4 py-1.5 rounded-full shadow-sm">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="w-14 h-14 rounded-xl bg-[#2563EB]/5 flex items-center justify-center mb-5 group-hover:bg-[#2563EB]/10 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-[#2563EB]" />
                  </div>

                  <h3 className="font-heading font-bold text-sm tracking-[0.15em] text-[#0F172A] mb-3 uppercase">
                    {card.title}
                  </h3>

                  <p className="text-[15px] text-[#94A3B8] leading-relaxed mb-6">
                    {card.short_description}
                  </p>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {(card.features ?? []).map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm text-[#0F172A] group/item hover:text-[#2563EB] transition-colors duration-150">
                        <span className="flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-150">
                          <CheckIcon />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className={`group/btn inline-flex items-center justify-center w-full text-sm font-semibold px-5 py-3 rounded-xl transition-all duration-200 ${
                      card.featured
                        ? "bg-[#0F172A] text-white hover:bg-[#1e293b] shadow-md hover:shadow-lg active:scale-[0.98]"
                        : "bg-white text-[#0F172A] border border-[#E5E7EB] hover:bg-gray-50 hover:border-[#2563EB]/30 active:scale-[0.98]"
                    }`}
                  >
                    Get Started
                    <ArrowRightIcon />
                  </Link>
                </div>
              )
            })}
          </div>
        )}

        {!loading && error && (
          // Friendly message instead of a broken grid when the service fetch fails.
          <div className="text-center py-16 text-sm text-[#94A3B8]">
            Services are temporarily unavailable. Please check back soon.
          </div>
        )}
      </div>
    </section>
  )
}

export default Services
