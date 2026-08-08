import Hero from "../components/Hero"
import Projects from "../components/Projects"
import WhyChooseUs from "../components/WhyChooseUs"
import Process from "../components/Process"
import Metrics from "../components/Metrics"
import Services from "../components/Services"
import Testimonials from "../components/Testimonials"
import CTA from "../components/CTA"

// Home page — composes the landing sections in display order.
// Each section is a self-contained component; this page only wires them together.
function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <WhyChooseUs />
      <Process />
      <Metrics />
      <Services />
      <Testimonials />
      <CTA />
    </>
  )
}

export default Home
