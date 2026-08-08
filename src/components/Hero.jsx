import { Link } from "react-router-dom"
import { Bell, TrendingUp, Check, ArrowUpRight, Zap } from "lucide-react"
import { usePublicWebsiteSettings } from "../hooks/useWebsiteSettings"
import { usePublishedTrustedCompanies } from "../hooks/usePublishedTrustedCompanies"

// Landing page hero: headline, animated dashboard mockup, and a trusted-companies strip.

/**
 * Small floating glass badge with an icon, value, and label.
 * @param {object} props - Badge props.
 * @param {JSX.Element} props.icon - Icon element shown on the left.
 * @param {string} props.value - Primary metric value.
 * @param {string} props.label - Caption under the value.
 * @param {string} [props.className] - Extra positioning/visibility classes.
 * @param {string} [props.delay] - Animation delay passed to the float animation.
 * @returns {JSX.Element} The floating badge.
 */
function Badge({ icon, value, label, className, delay = "0s" }) {
  return (
    <div
      className={`glass-card flex items-center gap-2.5 px-4 py-3 animate-float ${className}`}
      style={{ animationDelay: delay }}
    >
      <span className="text-lg">{icon}</span>
      <div>
        <div className="text-lg font-bold text-navy leading-none">{value}</div>
        <div className="text-[11px] text-gray-400 whitespace-nowrap">{label}</div>
      </div>
    </div>
  )
}

/**
 * Floating "growth" badge with a trend arrow and a small CSS bar chart.
 * @param {object} props - GrowthBadge props.
 * @param {string} [props.className] - Extra positioning/visibility classes.
 * @param {string} [props.delay] - Animation delay for the float effect.
 * @returns {JSX.Element} The growth badge.
 */
function GrowthBadge({ className, delay = "0s" }) {
  return (
    <div
      className={`glass-card px-4 py-3 animate-float ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        </span>
        <div>
          <div className="text-base font-bold text-navy leading-none">+12.5%</div>
          <div className="text-[11px] text-gray-400">This Month</div>
        </div>
      </div>
      <div className="flex items-end gap-1">
        {/* Purely decorative bar chart: each bar's height, gradient, and opacity are hardcoded. */}
        {[35, 45, 40, 60, 55, 75, 70].map((h, i) => (
          <div
            key={i}
            className="w-2 rounded-sm"
            style={{
              height: `${h * 0.5}px`,
              background: `linear-gradient(to top, #005EFD, #5FA8FF)`,
              opacity: 0.4 + i * 0.09,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Static dashboard mockup shown next to the headline. Purely decorative — all data is hardcoded.
 * @returns {JSX.Element} The mockup card with KPI cards, chart bars, and activity rows.
 */
function DashboardMockup() {
  const bars = [45, 58, 40, 65, 52, 72, 60, 78, 66, 84, 74, 92]
  const activity = [
    { name: "Sara Ali", action: "requested a demo", time: "2m ago", color: "bg-[#0057D9]" },
    { name: "Ahmed Haji", action: "sent a message", time: "18m ago", color: "bg-[#FF8C00]" },
    { name: "Hodan Osman", action: "subscribed", time: "1h ago", color: "bg-emerald-500" },
  ]

  return (
    <div className="relative">
      <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-sky/10 blur-3xl" />

      <div className="relative glass-card rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/60 backdrop-blur animate-float" style={{ animationDelay: "-1s" }}>
        {/* Browser-style chrome bar (traffic lights + fake address) */}
        <div className="flex items-center gap-1.5 px-4 py-3 bg-white/70 border-b border-gray-100/70">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <div className="ml-3 flex-1 h-4 rounded-md bg-gray-100 flex items-center px-2.5">
            <span className="text-[10px] text-gray-400 font-medium">app.unugsolutions.com/dashboard</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-heading font-bold text-navy">Good morning, Admin</div>
              <div className="text-[11px] text-gray-400">Here's what's happening today.</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Bell className="w-3.5 h-3.5 text-navy" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF8C00]" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-sky flex items-center justify-center text-[11px] font-bold text-white">
                UA
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[
              { label: "Users", value: "2,847", change: "+12.5%", up: true },
              { label: "Revenue", value: "$48.2k", change: "+8.1%", up: true },
              { label: "Projects", value: "128", change: "Active", up: false },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100/80">
                <div className="text-[10px] text-gray-400 font-medium mb-0.5">{kpi.label}</div>
                <div className="text-base sm:text-lg font-heading font-bold text-navy leading-none">{kpi.value}</div>
                <div className={`text-[10px] font-semibold mt-1 flex items-center gap-0.5 ${kpi.up ? "text-emerald-500" : "text-[#0057D9]"}`}>
                  {kpi.up && <ArrowUpRight className="w-2.5 h-2.5" />}
                  {kpi.change}
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-[1.6fr_1fr] gap-2.5 mb-2.5">
            <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-heading font-semibold text-navy">Analytics Overview</span>
                <span className="text-[10px] font-semibold text-[#0057D9] bg-[#0057D9]/10 px-2 py-0.5 rounded-full">
                  +18.2%
                </span>
              </div>
              <div className="flex items-end gap-1 h-16 sm:h-20">
                {/* Chart bars; the final two bars use a highlighted gradient as a visual "trend up" cue. */}
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm group relative" style={{ height: `${h}%` }}>
                    <div
                      className="absolute inset-0 rounded-t-sm"
                      style={{
                        background:
                          i >= bars.length - 2
                            ? "linear-gradient(to top, #005EFD, #1D5EFF)"
                            : "linear-gradient(to top, #B9D5FF, #DCEBFF)",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100/80">
              <div className="text-xs font-heading font-semibold text-navy mb-3">Performance</div>
              <div className="relative w-20 h-20 mx-auto mb-3">
                {/* Progress ring: strokeDasharray/offset produce the ~80% arc. */}
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#EFF3FB" strokeWidth="9" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#005EFD" strokeWidth="9" strokeLinecap="round" strokeDasharray="213" strokeDashoffset="43" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-heading font-bold text-navy leading-none">80%</span>
                  <span className="text-[9px] text-gray-400">goal met</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005EFD]" /> Completed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200" /> Remaining
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100/80">
            <div className="text-xs font-heading font-semibold text-navy mb-2">Recent Activity</div>
            <div className="space-y-2">
              {activity.map((a) => (
                <div key={a.name} className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-lg ${a.color} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>
                    {a.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <p className="text-[11px] text-gray-500 flex-1 truncate">
                    <span className="font-semibold text-navy">{a.name}</span> {a.action}
                  </p>
                  <span className="text-[10px] text-gray-300 whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Badge icon="🚀" value="50+" label="Projects Delivered" delay="-2.5s" className="hidden md:flex absolute -left-6 -top-7" />
      <GrowthBadge delay="-1.5s" className="hidden md:block absolute -right-5 -bottom-8" />
    </div>
  )
}

/**
 * Hero section: headline, tagline badge, CTAs, trust checkmarks, dashboard mockup, and trusted-company logos.
 * @returns {JSX.Element} The full hero block.
 */
function Hero() {
  const { settings } = usePublicWebsiteSettings()
  const { companies, loading } = usePublishedTrustedCompanies()
  const tagline = settings?.company_tagline || "Driving Digital Growth"

  return (
    <section className="relative pt-24 pb-4 md:pt-28 md:pb-8 overflow-hidden bg-gradient-hero">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-primary/[0.04] via-sky/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-l from-primary/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center min-h-[520px] md:min-h-[620px] lg:min-h-[680px]">
          <div className="relative z-10 text-center lg:text-left max-w-2xl mx-auto lg:mx-0 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-primary text-sm font-medium px-5 py-2 rounded-full border border-blue-100 shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              <span>{tagline}</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-navy leading-tight">
              Empowering Businesses with{" "}
              <span className="text-gradient">Next-Gen IT Solutions</span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Building secure, scalable, and innovative IT solutions for modern businesses, from websites to powerful applications.
            </p>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
              <Link to="/contact" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-primary/20">
                Get Started
              </Link>
              <Link to="/solutions" className="btn-outline-dark text-base px-8 py-3.5">
                Our Work
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-x-7 gap-y-3">
              {[
                "Secure & scalable",
                "Tailored to your business",
                "Ongoing support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-0 lg:pr-6 xl:pr-10">
            <DashboardMockup />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 md:mt-16">
        <p className="text-center text-xs text-gray-400 font-medium mb-6 uppercase tracking-widest">
          Trusted by leading companies worldwide
        </p>

        {loading ? (
          // Show placeholder skeletons while the trusted companies list loads.
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="w-32 h-14 rounded-xl bg-white/60 animate-pulse" />
            ))}
          </div>
        ) : companies.length > 0 ? (
          // Each company is an external link only when it provides a website URL.
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {companies.map((company) => (
              <a
                key={company.id}
                href={company.website_url || undefined}
                target={company.website_url ? "_blank" : undefined}
                rel={company.website_url ? "noreferrer noopener" : undefined}
                title={company.name}
                className="w-32 h-14 rounded-xl bg-white/80 backdrop-blur border border-white/60 shadow-sm flex items-center justify-center px-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="max-h-9 max-w-full object-contain" />
                ) : (
                  <span className="font-heading font-bold text-gray-400">{company.name}</span>
                )}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Hero
