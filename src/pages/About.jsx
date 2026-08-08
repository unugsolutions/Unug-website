import { Link } from "react-router-dom"
import {
  ArrowRight,
  Check,
  Target,
  Eye,
  Lightbulb,
  ShieldCheck,
  Handshake,
  BadgeCheck,
  RotateCcw,
  Code2,
  Globe,
  GraduationCap,
  Building2,
  Smartphone,
  Palette,
  Wrench,
  Plug2,
  Database,
  Headset,
  Briefcase,
  HeartHandshake,
  Stethoscope,
  ShoppingCart,
  Truck,
  Landmark,
  Users,
} from "lucide-react"
import { usePublicWebsiteSettings } from "../hooks/useWebsiteSettings"

// About page — company overview: mission/vision, core values, services, approach, industries, and achievements.
function ArrowRightIcon() {
  return <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
}

// Reusable centered section heading (badge pill, title, and optional subtitle).
function SectionHeading({ badge, title, subtitle }) {
  return (
    <div className="mb-12 text-center">
      <div className="inline-flex items-center bg-[#EFF6FF] text-[#2563EB] text-sm font-semibold px-4 py-1.5 rounded-full mb-4 shadow-sm uppercase">
        {badge}
      </div>
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A] mb-4">{title}</h2>
      {subtitle && <p className="text-[#64748B] max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  )
}

const values = [
  { title: "Innovation", desc: "We continuously explore modern technologies and creative ideas to build solutions that solve real business challenges.", icon: Lightbulb },
  { title: "Quality", desc: "Every project is developed with attention to detail, performance, security, and long-term reliability.", icon: ShieldCheck },
  { title: "Integrity", desc: "We believe in honesty, transparency, and building lasting relationships through trust and professionalism.", icon: Handshake },
  { title: "Customer Success", desc: "Our clients' success is our success. We work closely with every client to understand their goals and deliver solutions that create measurable value.", icon: BadgeCheck },
  { title: "Continuous Improvement", desc: "Technology evolves rapidly, and so do we. We continuously improve our skills, processes, and solutions to provide the best possible service.", icon: RotateCcw },
]

const services = [
  { title: "Custom Software Development", desc: "Tailored software built around your business processes and goals.", icon: Code2 },
  { title: "Professional Website Development", desc: "Modern, responsive websites that strengthen your digital presence.", icon: Globe },
  { title: "School Management Systems", desc: "Complete platforms that streamline administration and learning.", icon: GraduationCap },
  { title: "Enterprise Business Systems", desc: "Robust systems that automate and scale your operations.", icon: Building2 },
  { title: "Mobile Application Development", desc: "iOS and Android apps designed around your users.", icon: Smartphone },
  { title: "UI/UX Design", desc: "Clean, intuitive interfaces that people love to use.", icon: Palette },
  { title: "Website Maintenance & Support", desc: "Ongoing care that keeps your platform fast, secure, and current.", icon: Wrench },
  { title: "System Integration", desc: "Connecting your tools and platforms into one seamless workflow.", icon: Plug2 },
  { title: "Database Design & Management", desc: "Reliable data architecture that grows with your organization.", icon: Database },
  { title: "Technical Consulting", desc: "Expert guidance to help you make the right technology decisions.", icon: Headset },
]

const whyChooseUs = [
  "Modern, responsive, and secure digital solutions",
  "Tailored systems built around your business needs",
  "Clean and user-friendly designs",
  "Reliable technical support and maintenance",
  "Scalable solutions designed for future growth",
  "Commitment to quality, transparency, and long-term partnerships",
]

const approach = [
  "Discovery & Consultation",
  "Planning & Strategy",
  "Design & User Experience",
  "Development & Testing",
  "Deployment & Launch",
  "Ongoing Support & Continuous Improvement",
]

const industries = [
  { title: "Businesses & Startups", icon: Briefcase },
  { title: "Schools & Educational Institutions", icon: GraduationCap },
  { title: "NGOs & Non-Profit Organizations", icon: HeartHandshake },
  { title: "Healthcare Providers", icon: Stethoscope },
  { title: "Retail & Commerce", icon: ShoppingCart },
  { title: "Logistics & Transportation", icon: Truck },
  { title: "Government & Public Sector", icon: Landmark },
  { title: "Professional Service Firms", icon: Building2 },
]

const achievements = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "100%", label: "Satisfaction Focus" },
]

const highlights = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "100%", label: "Satisfaction Focus" },
]

/**
 * Public "About Us" page.
 * Renders company narrative sections; content (company name, mission, vision)
 * is driven by public website settings with hardcoded defaults as fallback.
 */
function AboutPage() {
  // Fetch public website settings for company branding and mission/vision copy.
  const { settings } = usePublicWebsiteSettings()

  const companyName = settings?.company_name || "UNUG Solutions"
  const mission =
    settings?.mission ||
    "To empower businesses and organizations with innovative, secure, and scalable digital solutions that drive efficiency, growth, and long-term success."
  const vision =
    settings?.vision ||
    "To become one of the most trusted technology companies in Somaliland and the Horn of Africa, recognized for delivering high-quality software, exceptional customer service, and innovative digital solutions."

  return (
    <div className="overflow-hidden">
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 relative overflow-hidden bg-gradient-hero">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-primary/[0.04] via-sky/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-l from-primary/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative animate-fade-in order-1">
              <div className="absolute -inset-3 bg-gradient-to-br from-[#2563EB]/20 via-[#5FA8FF]/10 to-transparent rounded-[2.5rem] blur-2xl" />
              <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full border-[6px] border-[#5FA8FF]/20 hidden md:block" />
              <div className="absolute -bottom-8 -left-8 w-52 h-52 rounded-full bg-[#2563EB]/5 blur-2xl hidden md:block" />
              <div className="relative rounded-3xl overflow-hidden border border-white shadow-2xl shadow-primary/10">
                <img
                  src="/about-hero.jpg"
                  alt={`${companyName} team`}
                  className="w-full h-full object-cover aspect-[4/3] lg:aspect-[5/4] lg:h-[540px]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent" />
              </div>
              <div className="glass-card absolute -bottom-6 left-6 flex items-center gap-3 px-4 py-3 rounded-2xl animate-float">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-sky flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </span>
                <div>
                  <div className="text-sm font-heading font-bold text-navy leading-none">Trusted Partner</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">5+ years of excellence</div>
                </div>
              </div>
            </div>

            <div
              className="text-center lg:text-left animate-fade-in order-2 [animation-fill-mode:backwards]"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="inline-flex items-center gap-2 bg-[#EFF6FF] text-[#2563EB] text-sm font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                About Us
              </div>
              <h1 className="text-3xl md:text-4xl xl:text-[44px] font-heading font-bold text-[#0F172A] leading-tight mb-6">
                {companyName} —{" "}
                <span className="text-gradient">Engineering Digital Solutions for a Smarter Future</span>
              </h1>
              <div className="space-y-4 text-lg text-[#64748B] leading-relaxed mb-8">
                <p>
                  {companyName} is a modern technology company dedicated to helping businesses, schools,
                  NGOs, and organizations embrace digital transformation through innovative software,
                  professional websites, and custom technology solutions.
                </p>
                <p>
                  Our team combines technical expertise with a deep understanding of business needs to
                  deliver reliable, scalable, and user-focused digital products — turning your ideas
                  into impactful digital experiences.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E7EB]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="text-lg md:text-xl font-heading font-bold text-gradient leading-none mb-1">
                      {h.value}
                    </div>
                    <div className="text-xs text-[#64748B]">{h.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-4 pb-16 md:pt-6 md:pb-20 bg-white relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#2563EB]/[0.03] blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#5FA8FF]/[0.03] blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB]/60 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#2563EB]/[0.06] blur-2xl" />
              <div className="flex items-center gap-3 mb-4">
                <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#5FA8FF] flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </span>
                <div>
                  <div className="text-base font-heading font-bold text-[#0F172A]">Our Mission</div>
                  <div className="text-xs text-[#94A3B8]">What drives us every day</div>
                </div>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">{mission}</p>
            </div>
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB]/60 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#5FA8FF]/[0.07] blur-2xl" />
              <div className="flex items-center gap-3 mb-4">
                <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F172A] to-[#334155] flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </span>
                <div>
                  <div className="text-base font-heading font-bold text-[#0F172A]">Our Vision</div>
                  <div className="text-xs text-[#94A3B8]">Where we are heading</div>
                </div>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">{vision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-b from-white via-[#2563EB]/[0.01] to-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-[#2563EB]/[0.03] blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full bg-[#5FA8FF]/[0.03] blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="CORE VALUES"
            title="What We Believe In"
            subtitle="Our core values are the foundation of everything we do. They guide our decisions, shape our culture, and define the way we work with our clients and each other."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]/60 hover:border-[#2563EB]/20 hover:shadow-md transition-all duration-200"
              >
                <span className="w-11 h-11 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5" />
                </span>
                <h3 className="text-base font-heading font-bold text-[#0F172A] mb-1.5">{v.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{v.desc}</p>
              </div>
            ))}
            <div className="bg-gradient-to-br from-[#2563EB] to-[#5FA8FF] rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
              <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </span>
              <h3 className="text-base font-heading font-bold mb-1.5">People First</h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Behind every solution is a dedicated team that listens, collaborates, and genuinely
                cares about the success of the organizations we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-b from-[#2563EB]/[0.01] via-white to-[#2563EB]/[0.01] relative overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-80 h-80 rounded-full bg-[#2563EB]/[0.03] blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-72 h-72 rounded-full bg-[#5FA8FF]/[0.03] blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="WHAT WE DO"
            title="Comprehensive Technology Services"
            subtitle="From concept to launch, we deliver end-to-end digital solutions that help organizations operate smarter and grow faster."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {services.map((s) => (
              <div
                key={s.title}
                className="group bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB]/60 hover:border-[#2563EB]/25 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <span className="w-11 h-11 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
                  <s.icon className="w-5 h-5" />
                </span>
                <h3 className="text-sm font-heading font-bold text-[#0F172A] mb-1 leading-snug">{s.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-b from-white via-[#2563EB]/[0.01] to-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#2563EB]/[0.03] blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#5FA8FF]/[0.03] blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="WHY CHOOSE US"
            title={`Why Choose ${companyName}?`}
            subtitle="We combine technical excellence with a genuine commitment to your success — here is what sets us apart."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyChooseUs.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB]/60 hover:border-[#2563EB]/20 hover:shadow-md transition-all duration-200"
              >
                <span className="w-7 h-7 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                </span>
                <p className="text-sm text-[#475569] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-b from-[#2563EB]/[0.01] via-white to-[#2563EB]/[0.01] relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-[#2563EB]/[0.03] blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="OUR APPROACH"
            title="A Structured Path to Success"
            subtitle="Every successful project begins with understanding the client's goals. We follow a structured development process that ensures quality, transparency, and timely delivery."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {approach.map((step, i) => (
              <div key={step} className="relative group">
                <div className="glass-card p-5 text-center hover-lift min-h-[150px] flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-sky text-white font-heading font-bold flex items-center justify-center mx-auto mb-3 text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-sm font-heading font-semibold text-navy leading-tight">{step}</h3>
                </div>
                {i < approach.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-3 w-6 h-0.5 bg-blue-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-b from-white via-[#2563EB]/[0.01] to-white relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#2563EB]/[0.03] blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#5FA8FF]/[0.03] blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="INDUSTRIES WE SERVE"
            title="Solutions for Every Sector"
            subtitle="We proudly develop digital solutions for organizations of every shape and size across the region."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map((industry) => (
              <div
                key={industry.title}
                className="group flex items-center gap-3 bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB]/60 hover:border-[#2563EB]/25 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="w-11 h-11 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center flex-shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
                  <industry.icon className="w-5 h-5" />
                </span>
                <span className="text-sm font-heading font-semibold text-[#0F172A] leading-snug">
                  {industry.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#2563EB]/[0.04] blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-[#5FA8FF]/[0.03] blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsUnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iIzI1NjNFQiIgZmlsbC1vcGFjaXR5PSIwLjAzIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="ACHIEVEMENTS"
            title="Our Journey in Numbers"
            subtitle="We are proud of the milestones we have achieved and the trust our clients have placed in us. Here is a snapshot of our journey so far."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {achievements.map((a) => (
              <div
                key={a.label}
                className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]/60 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-1">{a.value}</div>
                <div className="text-sm text-[#64748B]">{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1e3a8a] to-[#2563EB] rounded-3xl p-10 md:p-14 text-center shadow-2xl shadow-[#2563EB]/20">
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#5FA8FF]/10 blur-3xl" />
            <div className="relative z-10">
              <div className="inline-flex items-center bg-white/10 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm uppercase tracking-wide">
                Our Promise
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 leading-tight">
                We Don't Just Build Software — We Build Long-Term Partnerships
              </h2>
              <p className="text-lg text-blue-100/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                At {companyName}, we don't just build websites and software — we build long-term
                partnerships. Our goal is to help organizations leverage technology to improve
                operations, enhance customer experiences, and achieve sustainable growth.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center text-sm font-semibold px-7 py-3.5 rounded-xl bg-white text-[#0F172A] hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                >
                  Start Your Project
                  <ArrowRightIcon />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-sm font-semibold px-7 py-3.5 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all duration-200 active:scale-[0.98]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
