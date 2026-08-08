// Call-to-action section: closes the landing page with a headline and contact prompts.
import { Link } from "react-router-dom"

/**
 * Renders the closing call-to-action banner.
 * @returns {JSX.Element} A centered section with a headline, subtitle, and two contact links.
 */
function CTA() {
  return (
    <section className="py-20 md:py-28 bg-navy relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
          Ready to build your next digital solution?
        </h2>
        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
          Let's turn your ideas into reality. Get in touch and let's build something great together.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact" className="btn-primary text-base px-8 py-3.5">
            Start Project
          </Link>
          <Link to="/contact" className="btn-outline text-base px-8 py-3.5">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTA
