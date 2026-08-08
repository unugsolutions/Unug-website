import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import Projects from "../components/Projects"

function ArrowRightIcon() {
  return <ArrowRight className="w-4 h-4 ml-1" />
}

// Solutions page — hero header plus the full portfolio grid (no section heading).
function Solutions() {
  return (
    <div>
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 relative overflow-hidden bg-gradient-hero">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-primary/[0.04] via-sky/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center bg-[#EFF6FF] text-[#2563EB] text-sm font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
            SOLUTIONS
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-[#0F172A] mb-4">
            Solutions for Growth
          </h1>
          <p className="text-[18px] text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            UNUG delivers custom software, websites, mobile apps, cloud services, and expert consulting to help your business scale.
          </p>
        </div>
      </section>

      <Projects showAll hideHeading />

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

export default Solutions
