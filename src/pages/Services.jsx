import { Link } from "react-router-dom"
import { Check, ArrowRight, Users, Sparkles, ShieldCheck, Headphones } from "lucide-react"
import { usePublishedServices } from "../hooks/usePublishedServices"
import { getServiceIcon } from "../lib/serviceIcons"

function CheckIcon() {
  return <Check className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
}

function ArrowRightIcon() {
  return <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
}

// Static "Why UNUG" selling points rendered below the dynamic service list.
const whyChoose = [
  {
    icon: <Users className="w-6 h-6 text-[#2563EB]" />,
    title: "Experienced Team",
    desc: "Professional developers with modern technical expertise and industry best practices.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-[#2563EB]" />,
    title: "Tailored Solutions",
    desc: "Every project is designed specifically around your business goals and requirements.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#2563EB]" />,
    title: "Performance & Security",
    desc: "Solutions built with a focus on speed, reliability, security, and scalability.",
  },
  {
    icon: <Headphones className="w-6 h-6 text-[#2563EB]" />,
    title: "Long-Term Support",
    desc: "Reliable maintenance and support to keep your solutions running smoothly.",
  },
]

// Static industry chips shown in the "Industries We Serve" section.
const industries = [
  { name: "Education", icon: "📚" },
  { name: "Healthcare", icon: "🏥" },
  { name: "Government", icon: "🏛️" },
  { name: "NGOs", icon: "🤝" },
  { name: "Retail & Commerce", icon: "🛍️" },
  { name: "Logistics", icon: "🚚" },
  { name: "Construction", icon: "🏗️" },
  { name: "Hospitality", icon: "🏨" },
  { name: "Professional Services", icon: "💼" },
  { name: "SMEs", icon: "🚀" },
]

/**
 * Public services page.
 * Renders published services from the database (with loading/error skeletons),
 * plus static why-choose-us and industries sections.
 */
function ServicesPage() {
  // Fetch published services; loading shows pulse skeletons, errors show a fallback message.
  const { services, loading, error } = usePublishedServices()

  return (
    <div>
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 relative overflow-hidden bg-gradient-hero">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-primary/[0.04] via-sky/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center bg-[#EFF6FF] text-[#2563EB] text-sm font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
            SERVICES
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-[#0F172A] mb-4">
            What We Do
          </h1>
          <p className="text-[18px] text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            UNUG provides comprehensive digital solutions including custom software, website development, mobile applications, cloud services, and technology consulting.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28 bg-white relative overflow-hidden">
        <div className="absolute top-1/3 -left-32 w-72 h-72 rounded-full bg-[#2563EB]/[0.03] blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#5FA8FF]/[0.03] blur-3xl" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[18px] border border-[#E5E7EB] p-8 shadow-sm animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 mb-4" />
                  <div className="h-5 bg-gray-100 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-6" />
                  <div className="space-y-2 mb-6">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-3.5 bg-gray-100 rounded w-1/2" />
                    ))}
                  </div>
                </div>
              ))}

            {!loading &&
              !error &&
              services.map((s, i) => {
                const Icon = getServiceIcon(s.icon)
                return (
                  <div
                    key={s.id}
                    className="group bg-white rounded-[18px] border border-[#E5E7EB] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#2563EB]/5 flex items-center justify-center mb-4 group-hover:bg-[#2563EB]/10 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-7 h-7 text-[#2563EB]" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-[#0F172A] mb-2">{s.title}</h3>
                    <p className="text-sm text-[#94A3B8] mb-5">{s.short_description}</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {(s.features ?? []).map((f) => (
                        <li key={f} className="flex gap-2 text-sm text-[#0F172A]">
                          <CheckIcon />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link to="/contact" className="mt-auto inline-flex items-center text-sm font-semibold text-[#2563EB] hover:text-[#1E40AF] transition-colors group/link">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )
              })}

            {!loading && error && (
              <div className="md:col-span-2 lg:col-span-3 text-center py-16 text-sm text-[#94A3B8]">
                Services are temporarily unavailable. Please check back soon.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-b from-[#2563EB]/[0.01] via-white to-[#2563EB]/[0.01] relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#2563EB]/[0.04] blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#5FA8FF]/[0.03] blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsUnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iIzI1NjNFQiIgZmlsbC1vcGFjaXR5PSIwLjAzIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-[#EFF6FF] text-[#2563EB] text-sm font-semibold px-4 py-1.5 rounded-full mb-4 shadow-sm">WHY UNUG</div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A]">Why Choose UNUG</h2>
            <p className="text-[#94A3B8] mt-3 max-w-2xl mx-auto">Professional and modern development practices with a focus on delivering measurable business value.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((w) => (
              <div key={w.title} className="bg-white rounded-2xl p-7 border border-[#E5E7EB]/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2563EB]/10 transition-colors">
                  {w.icon}
                </div>
                <h3 className="text-base font-heading font-bold text-[#0F172A] mb-2">{w.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-[#EFF6FF] text-[#2563EB] text-sm font-semibold px-4 py-1.5 rounded-full mb-4 shadow-sm">
              INDUSTRIES
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A]">Industries We Serve</h2>
            <p className="text-[#94A3B8] mt-3 max-w-2xl mx-auto">Delivering solutions across diverse industries.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((ind) => (
              <div key={ind.name} className="group bg-white rounded-2xl border border-[#E5E7EB] px-4 sm:px-5 py-2.5 sm:py-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default flex items-center gap-2">
                <span className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-200">{ind.icon}</span>
                <span className="text-xs sm:text-sm font-semibold text-[#0F172A] whitespace-nowrap">{ind.name}</span>
              </div>
            ))}
          </div>
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
            <Link to="/about" className="inline-flex items-center text-sm font-semibold px-6 py-3 rounded-xl border border-[#E5E7EB] text-[#0F172A] hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
