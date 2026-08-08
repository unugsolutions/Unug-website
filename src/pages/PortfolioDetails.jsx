import { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MonitorPlay,
  User,
} from "lucide-react"
import { getProjectBySlug, getPublishedProjects } from "../services/portfolioService"

// Fallback gradient palette used when a project has no cover image.
const gradients = [
  "from-[#2563EB] to-[#0F172A]",
  "from-[#5FA8FF] to-[#2563EB]",
  "from-[#0F172A] to-[#2563EB]",
  "from-[#2563EB] to-[#0F172A]",
]

// Compact project card linking to the project's detail page.
function ProjectCard({ project }) {
  const gradient = gradients[project.title.length % gradients.length]
  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className="group rounded-2xl overflow-hidden shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {project.cover_image_url ? (
        <div className="h-36 overflow-hidden">
          <img
            src={project.cover_image_url}
            alt={project.title}
            className="w-full h-full object-contain bg-[#F7F9FC]"
          />
        </div>
      ) : (
        <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span className="text-white/20 text-4xl font-heading font-bold">{project.title[0]}</span>
        </div>
      )}
      <div className="p-4">
        <span className="text-xs font-medium text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">
          {project.category}
        </span>
        <h3 className="text-base font-heading font-semibold text-[#0F172A] mt-2">{project.title}</h3>
      </div>
    </Link>
  )
}

/**
 * Portfolio detail page.
 * Loads a single published project by URL slug plus up to three related projects,
 * and supports a mouse-drag horizontal scroll for the image gallery.
 */
function PortfolioDetails() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch project by slug; cancelled flag prevents setState after unmount.
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const p = await getProjectBySlug(slug)
        if (!p || p.status !== "published") {
          if (!cancelled) {
            setProject(null)
            setLoading(false)
          }
          return
        }
        const all = await getPublishedProjects()
        if (cancelled) return
        setProject(p)
        setRelated(all.filter((x) => x.slug !== slug).slice(0, 3))
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Mouse-drag scrolling for the gallery: record the pointer start position.
  const handleMouseDown = (e) => {
    const el = scrollRef.current
    if (!el) return
    setIsDragging(true)
    setStartX(e.pageX - el.offsetLeft)
    setScrollLeft(el.scrollLeft)
  }

  // Update scroll position based on pointer movement while dragging.
  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const el = scrollRef.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    const walk = (x - startX) * 1.5
    el.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => setIsDragging(false)

  // Loading skeleton while the project is being fetched.
  if (loading) {
    return (
      <div className="pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-64 bg-gray-100 rounded-3xl" />
            <div className="h-8 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  // Unpublished/missing project (or fetch error) state.
  if (!project) {
    return (
      <div className="pt-24 text-center">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h1 className="text-3xl font-heading font-bold text-[#0F172A]">Project Not Found</h1>
          <p className="text-[#94A3B8] mt-3">{error || "This project may have been removed or is not published yet."}</p>
          <Link to="/solutions" className="text-[#2563EB] hover:underline mt-4 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </div>
    )
  }

  const gradient = gradients[project.title.length % gradients.length]
  const gallery = project.gallery ?? []
  const techs = project.technologies ?? []
  const links = [
    { label: "Visit Project", href: project.project_url, icon: ExternalLink, show: !!project.project_url },
    { label: "View Demo", href: project.demo_url, icon: MonitorPlay, show: !!project.demo_url },
  ].filter((l) => l.show)

  return (
    <div>
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-primary/[0.04] via-sky/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/solutions" className="text-sm text-[#94A3B8] hover:text-[#2563EB] mb-6 inline-flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          {project.cover_image_url ? (
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full max-h-[440px] object-contain rounded-3xl shadow-2xl shadow-[#0F172A]/10 bg-[#F7F9FC]"
            />
          ) : (
            <div className={`w-full h-64 md:h-80 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <span className="text-white/20 text-7xl md:text-8xl font-heading font-bold select-none">
                {project.title[0]}
              </span>
            </div>
          )}

          <div className="mt-8">
            <span className="text-xs font-medium text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full">{project.category}</span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#0F172A] mt-4 mb-4">{project.title}</h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl">{project.short_description}</p>
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="py-8 md:py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {gallery.length > 1 && (
              <>
                <button
                  onClick={() => document.getElementById("portfolio-gallery")?.scrollBy({ left: -320, behavior: "smooth" })}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors hidden md:flex"
                  aria-label="Scroll gallery left"
                >
                  <ChevronLeft className="w-5 h-5 text-[#0F172A]" />
                </button>
                <button
                  onClick={() => document.getElementById("portfolio-gallery")?.scrollBy({ left: 320, behavior: "smooth" })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors hidden md:flex"
                  aria-label="Scroll gallery right"
                >
                  <ChevronRight className="w-5 h-5 text-[#0F172A]" />
                </button>
              </>
            )}
            <div
              id="portfolio-gallery"
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {gallery.map((url, index) => (
                <div key={url} className="flex-shrink-0 w-[280px] md:w-[320px] snap-center rounded-xl overflow-hidden shadow-lg relative">
                  <img src={url} alt={`${project.title} screenshot ${index + 1}`} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-contain bg-[#F7F9FC]" />
                  <span className="absolute bottom-3 right-3 text-xs text-white/60 font-medium bg-black/20 px-2 py-1 rounded">
                    {index + 1}/{gallery.length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-16 md:pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-heading font-bold text-[#0F172A] mb-4">Overview</h2>
              <p className="text-[#64748B] leading-relaxed">{project.description}</p>

              {project.challenge && (
                <>
                  <h2 className="text-2xl font-heading font-bold text-[#0F172A] mt-10 mb-4">The Challenge</h2>
                  <p className="text-[#64748B] leading-relaxed">{project.challenge}</p>
                </>
              )}

              {project.solution && (
                <>
                  <h2 className="text-2xl font-heading font-bold text-[#0F172A] mt-10 mb-4">Our Solution</h2>
                  <p className="text-[#64748B] leading-relaxed">{project.solution}</p>
                </>
              )}

              {project.result && (
                <>
                  <h2 className="text-2xl font-heading font-bold text-[#0F172A] mt-10 mb-4">The Result</h2>
                  <p className="text-[#64748B] leading-relaxed">{project.result}</p>
                </>
              )}

              {techs.length > 0 && (
                <>
                  <h2 className="text-2xl font-heading font-bold text-[#0F172A] mt-10 mb-4">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((t) => (
                      <span key={t} className="text-sm font-semibold text-[#2563EB] bg-[#EFF6FF] px-3 py-1.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-heading font-semibold text-[#0F172A] mb-4">Project Info</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-[#94A3B8]">Category</div>
                    <div className="text-sm font-medium text-[#0F172A]">{project.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#94A3B8]">Client</div>
                    <div className="text-sm font-medium text-[#0F172A] inline-flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                      {project.client || "UNUG Solutions"}
                    </div>
                  </div>
                  {links.length > 0 && (
                    <div className="space-y-2">
                      {links.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center justify-between text-sm font-semibold text-[#2563EB] hover:text-[#1E40AF] transition-colors group"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <l.icon className="w-4 h-4" />
                            {l.label}
                          </span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#2563EB] to-[#0F172A] rounded-xl p-6 text-white">
                <h3 className="text-sm font-heading font-semibold mb-2">Need a Similar Solution?</h3>
                <p className="text-xs text-white/80 mb-4">Let's discuss how we can build something tailored for your business.</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <>
              <h2 className="text-2xl font-heading font-bold text-[#0F172A] mb-8">Other Projects</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default PortfolioDetails
