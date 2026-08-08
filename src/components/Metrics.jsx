// Company metrics band showing headline statistics.
const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
]

/**
 * Renders the metrics strip between sections.
 * @returns {JSX.Element} A dark gradient band with three stat columns.
 */
function Metrics() {
  return (
    <section className="py-10 md:py-14 bg-gradient-to-r from-navy via-[#0f1a30] to-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky to-primary">
                {s.value}
              </div>
              <div className="text-xs text-gray-400 mt-1.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Metrics
