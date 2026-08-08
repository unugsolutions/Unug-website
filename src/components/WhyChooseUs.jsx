import { Sparkles, TrendingUp, ShieldCheck, Zap, Users, Heart } from "lucide-react"
import { usePublicWebsiteSettings } from "../hooks/useWebsiteSettings"

// Why Choose Us section: trust points on the left and a decorative "system overview" card on the right.

const points = [
  {
    icon: <Sparkles className="w-3.5 h-3.5 text-primary" />,
    title: "Tailored Solutions",
    desc: "Every project is customized to your unique business needs and goals for maximum impact.",
  },
  {
    icon: <TrendingUp className="w-3.5 h-3.5 text-primary" />,
    title: "Scalable Architecture",
    desc: "Built to grow with you from startup prototypes to enterprise-grade systems serving millions.",
  },
  {
    icon: <ShieldCheck className="w-3.5 h-3.5 text-primary" />,
    title: "Secure Systems",
    desc: "Security-first approach with industry-standard encryption, compliance, and best practices.",
  },
  {
    icon: <Zap className="w-3.5 h-3.5 text-primary" />,
    title: "Modern Technologies",
    desc: "We leverage the latest tools, frameworks, and cloud platforms for optimal performance.",
  },
  {
    icon: <Users className="w-3.5 h-3.5 text-primary" />,
    title: "Long-term Support",
    desc: "Ongoing maintenance, monitoring, and support to keep your digital assets running smoothly.",
  },
]

/**
 * Renders the "Why Choose Us" section with feature points and a live system overview mockup.
 * @returns {JSX.Element} The section with the two-column layout.
 */
function WhyChooseUs() {
  const { settings } = usePublicWebsiteSettings()
  const companyName = settings?.company_name || "UNUG"

  return (
    <section id="about" className="relative py-16 md:py-20 overflow-hidden bg-gradient-blue">
      <div className="absolute top-10 right-0 w-72 h-72 bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-48 bg-sky/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-blue-100 shadow-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Why Trust Us
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy text-left">
              Why Choose <span className="text-gradient">{companyName}</span>
            </h2>
            <p className="text-gray-500 mt-3 mb-8 leading-relaxed max-w-lg text-base">
              We combine technical expertise with creative thinking to deliver solutions that make a real impact for your business.
            </p>

            <div className="space-y-4">
              {points.map((p, i) => (
                <div
                  key={i}
                  className="flex gap-3 group hover:-translate-x-0.5 transition-transform duration-200"
                  // Staggered fade-in so points appear one after another.
                  style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-200">
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-heading font-semibold text-navy">{p.title}</h4>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="glass rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-heading font-bold text-navy flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  System Overview
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-semibold border border-emerald-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Uptime", value: "99.9%", color: "bg-gradient-to-r from-primary to-royal", width: "99%" },
                  { label: "Response Time", value: "42ms", color: "bg-gradient-to-r from-sky to-primary", width: "85%" },
                  { label: "Active Users", value: "2,847", color: "bg-gradient-to-r from-royal to-primary", width: "92%" },
                  { label: "Projects Completed", value: "50+", color: "bg-gradient-to-r from-emerald-500 to-primary", width: "95%" },
                ].map((s, i) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-500 font-medium">{s.label}</span>
                      <span className="font-bold text-navy">{s.value}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      {/* Each progress bar animates in after a delay based on its index. */}
                      <div
                        className={`h-full rounded-full ${s.color} animate-fade-in shadow-sm`}
                        style={{ animationDelay: `${0.5 + i * 0.15}s`, animationDuration: "0.8s", width: s.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:absolute md:-bottom-6 md:-right-6 glass rounded-xl p-4 shadow-lg animate-float hover:shadow-2xl transition-shadow duration-300">
              {/* Floating satisfaction badge anchored to the overview card corner. */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-royal flex items-center justify-center shadow-lg shadow-primary/20">
                  <Heart className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary leading-none">98%</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
