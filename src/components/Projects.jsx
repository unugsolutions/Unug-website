import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { usePublishedProjects } from "../hooks/usePublishedProjects"

// Projects section: renders published portfolio projects, with loading/empty states and a "View All" link.

// Gradient presets used for the placeholder when a project has no cover image.
const gradients = [
  "from-[#2563EB] to-[#0F172A]",
  "from-[#5FA8FF] to-[#2563EB]",
  "from-[#0F172A] to-[#2563EB]",
  "from-[#2563EB] to-[#0F172A]",
]

/**
 * Single project card linking to its portfolio detail page.
 * @param {object} props - ProjectCard props.
 * @param {object} props.project - Project object (title, slug, cover_image_url, category, short_description).
 * @returns {JSX.Element} A clickable card.
 */
function ProjectCard({ project }) {
  // Pick a deterministic gradient from the title so placeholders stay consistent per project.
  const gradient = gradients[project.title.length % gradients.length]
  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className="group relative rounded-2xl overflow-hidden border border-[#E5E7EB]/70 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain bg-[#F7F9FC]"
          />
        ) : (
          // Fallback placeholder: gradient background with the project's first letter.
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-white/20 text-6xl font-heading font-bold select-none">
              {project.title[0]}
            </span>
          </div>
        )}
        <span className="absolute top-3 left-3 text-xs font-medium text-white bg-[#2563EB]/90 backdrop-blur px-3 py-1 rounded-full">
          {project.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-[#0F172A] mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-[#94A3B8] mb-5 line-clamp-2 flex-1">
          {project.short_description}
        </p>
        <span className="text-sm font-semibold text-[#2563EB] inline-flex items-center gap-1.5">
          View Project
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

/**
 * Projects grid with loading skeletons, an empty/error state, and an optional "View All" link.
 * @param {object} props - Projects props.
 * @param {boolean} [props.showAll] - Render every project instead of truncating.
 * @param {number} [props.limit] - Max projects shown when showAll is false.
 * @param {boolean} [props.hideHeading] - Hide the "Our Recent Projects" heading (e.g. on solutions page).
 * @returns {JSX.Element} The projects section.
 */
function Projects({ showAll = false, limit = 6, hideHeading = false }) {
  const { projects, loading, error } = usePublishedProjects()
  const visible = showAll ? projects : projects.slice(0, limit)

  return (
    <section
      id="projects"
      className={`${hideHeading ? "pb-20 md:pb-28" : "py-20 md:py-28"} bg-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!hideHeading && (
          <Link to="/solutions" className="inline-block">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0F172A] text-center hover:text-[#2563EB] transition-colors">
              Our Recent Projects
            </h2>
          </Link>
        )}

        {loading ? (
          // Placeholder skeleton cards while projects load.
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error || projects.length === 0 ? (
          <p className="text-center text-sm text-[#94A3B8] mt-16">
            Portfolio projects are being updated. Please check back soon.
          </p>
        ) : (
          <>
            <div className={`${hideHeading ? "" : "mt-16"} grid sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
              {visible.map((p, i) => (
                // On the homepage (truncated view), items past the 3rd are hidden on mobile for a cleaner layout.
                <div key={p.id} className={!showAll && i >= 3 ? "hidden md:block" : ""}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>

            {!showAll && projects.length > limit && (
              // Show the "View All Projects" link only when there are more projects than the limit.
              <div className="text-center mt-10">
                <Link to="/solutions" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-blue-100 px-6 py-3 rounded-xl transition-all duration-200">
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Projects
