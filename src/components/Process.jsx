// Process section: visualises the 7-step delivery approach as cards.
const steps = [
  { num: "01", title: "Discovery & Consultation" },
  { num: "02", title: "Planning & Strategy" },
  { num: "03", title: "UI/UX Design" },
  { num: "04", title: "Development" },
  { num: "05", title: "Testing & QA" },
  { num: "06", title: "Deployment" },
  { num: "07", title: "Training & Support" },
]

/**
 * Renders the development process steps.
 * @returns {JSX.Element} A section with the step grid.
 */
function Process() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Our Approach</h2>
        <p className="section-subtitle">
          Every successful project begins with understanding the client's goals. We follow a structured development process that ensures quality, efficiency, and long-term success.
        </p>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="relative group">
              <div className="glass-card p-5 text-center hover-lift min-h-[130px] flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-sky text-white font-heading font-bold flex items-center justify-center mx-auto mb-3 text-sm">
                  {s.num}
                </div>
                <h3 className="text-sm font-heading font-semibold text-navy leading-tight">{s.title}</h3>
              </div>
              {i < steps.length - 1 && (
                // Connector line linking each step to the next (xl screens only).
                <div className="hidden xl:block absolute top-1/2 -right-3 w-6 h-0.5 bg-blue-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Process
