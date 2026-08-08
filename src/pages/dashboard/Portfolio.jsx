import { useState } from "react"
import toast from "react-hot-toast"
import { Plus, ExternalLink, MonitorPlay } from "lucide-react"
import { usePortfolio } from "../../hooks/usePortfolio"
import { deleteImage } from "../../services/portfolioService"
import PageHeader from "../../components/dashboard/PageHeader"
import Modal from "../../components/dashboard/Modal"
import StatusBadge from "../../components/dashboard/StatusBadge"
import FeaturedBadge from "../../components/dashboard/FeaturedBadge"
import PortfolioTable from "../../components/dashboard/portfolio/PortfolioTable"
import PortfolioForm from "../../components/dashboard/portfolio/PortfolioForm"
import DeleteProjectModal from "../../components/dashboard/portfolio/DeleteProjectModal"

// Dashboard page for managing portfolio projects (create, edit, view,
// delete with cover/gallery image cleanup, and status/featured controls).
const gradients = [
  "from-[#0B1E3D] to-[#0057D9]",
  "from-[#0057D9] to-[#FF8C00]",
  "from-[#0B1E3D] to-[#FF8C00]",
  "from-[#0057D9] to-[#3B82F6]",
]

// Read-only details view shown inside the "view" modal
function ProjectDetails({ project }) {
  // Pick a gradient deterministically from the project title
  const gradient = gradients[project.title.length % gradients.length]
  // Only render external links that actually exist
  const links = [
    { label: "Visit Project", href: project.project_url, icon: ExternalLink, show: !!project.project_url },
    { label: "View Demo", href: project.demo_url, icon: MonitorPlay, show: !!project.demo_url },
  ].filter((l) => l.show)

  return (
    <div className="space-y-5">
      {project.cover_image_url ? (
        <img
          src={project.cover_image_url}
          alt={project.title}
          className="w-full h-52 object-contain rounded-2xl border border-gray-100 bg-[#F7F9FC]"
        />
      ) : (
        <div className={`w-full h-32 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span className="text-white/30 text-5xl font-heading font-bold">{project.title[0]}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-heading font-bold text-[#0B1E3D]">{project.title}</h4>
          <span className="text-xs font-medium text-[#0057D9] bg-[#0057D9]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
            {project.category}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={project.status} />
          <FeaturedBadge featured={project.featured} />
        </div>
      </div>
      <p className="text-sm text-gray-400 font-mono -mt-3">/{project.slug}</p>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-400 mb-1">Client</dt>
          <dd className="font-medium text-[#0B1E3D]">{project.client || "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-400 mb-1">Display Order</dt>
          <dd className="font-medium text-[#0B1E3D]">{project.display_order}</dd>
        </div>
        <div>
          <dt className="text-gray-400 mb-1">Created</dt>
          <dd className="font-medium text-[#0B1E3D]">
            {new Date(project.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </dd>
        </div>
        <div>
          <dt className="text-gray-400 mb-1">Technologies</dt>
          <dd className="font-medium text-[#0B1E3D]">{(project.technologies ?? []).length || "—"}</dd>
        </div>
      </dl>

      <div>
        <p className="text-gray-400 text-sm mb-1">Short Description</p>
        <p className="text-sm text-[#1F2937]">{project.short_description}</p>
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-1">Full Description</p>
        <p className="text-sm text-[#1F2937] leading-relaxed">{project.description}</p>
      </div>

      {project.challenge && (
        <div>
          <p className="text-gray-400 text-sm mb-1">The Challenge</p>
          <p className="text-sm text-[#1F2937] leading-relaxed">{project.challenge}</p>
        </div>
      )}
      {project.solution && (
        <div>
          <p className="text-gray-400 text-sm mb-1">Our Solution</p>
          <p className="text-sm text-[#1F2937] leading-relaxed">{project.solution}</p>
        </div>
      )}
      {project.result && (
        <div>
          <p className="text-gray-400 text-sm mb-1">The Result</p>
          <p className="text-sm text-[#1F2937] leading-relaxed">{project.result}</p>
        </div>
      )}

      {project.technologies?.length > 0 && (
        <div>
          <p className="text-gray-400 text-sm mb-2">Technologies</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span key={t} className="text-xs font-semibold text-[#0057D9] bg-[#0057D9]/10 px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.gallery?.length > 0 && (
        <div>
          <p className="text-gray-400 text-sm mb-2">Gallery ({project.gallery.length})</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {project.gallery.map((url, index) => (
              <img
                key={url}
                src={url}
                alt={`${project.title} gallery ${index + 1}`}
                className="aspect-[4/3] object-contain rounded-lg border border-gray-100 bg-[#F7F9FC]"
              />
            ))}
          </div>
        </div>
      )}

      {links.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0057D9] bg-[#0057D9]/10 hover:bg-[#0057D9]/15 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Portfolio() {
  const { projects, loading, error, refetch, createProject, updateProject, removeProject } = usePortfolio()
  // Modal mode is one of: null, "create", "edit", "view"
  const [modal, setModal] = useState({ mode: null, project: null })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const openModal = (mode, project = null) => setModal({ mode, project })
  const closeModal = () => setModal({ mode: null, project: null })

  // Create or update the project depending on the current modal mode
  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal.mode === "edit") {
        await updateProject(modal.project.id, data)
        toast.success("Project updated successfully")
      } else {
        await createProject(data)
        toast.success("Project created successfully")
      }
      closeModal()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Delete the project after cleaning up its cover image and gallery uploads
  // (storage cleanup failures are ignored so the DB record can still be removed)
  const handleDelete = async () => {
    setDeleting(true)
    try {
      if (deleteTarget.cover_image_url) {
        await deleteImage(deleteTarget.cover_image_url).catch(() => {})
      }
      for (const url of deleteTarget.gallery ?? []) {
        await deleteImage(url).catch(() => {})
      }
      await removeProject(deleteTarget.id)
      toast.success("Project deleted")
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Portfolio"
        breadcrumbItems={[{ label: "Dashboard", to: "/dashboard" }]}
        breadcrumbCurrent="Portfolio"
        description="Manage your projects and showcase your best work."
        action={{ label: "Add Project", icon: Plus, onClick: () => openModal("create") }}
      />

      <PortfolioTable
        projects={projects}
        loading={loading}
        error={error}
        onRetry={refetch}
        onAdd={() => openModal("create")}
        onView={(project) => openModal("view", project)}
        onEdit={(project) => openModal("edit", project)}
        onDelete={setDeleteTarget}
      />

      <Modal
        open={modal.mode !== null}
        onClose={closeModal}
        title={modal.mode === "create" ? "Add Project" : modal.mode === "edit" ? "Edit Project" : "Project Details"}
        subtitle={
          modal.mode === "create"
            ? "Create a new project for your portfolio."
            : modal.mode === "edit"
              ? "Update the project information below."
              : "Read-only view of this project."
        }
        size={modal.mode === "view" ? "md" : "lg"}
      >
        {modal.mode === "view" ? (
          modal.project && <ProjectDetails project={modal.project} />
        ) : (
          <PortfolioForm
            key={modal.project?.id ?? "create"}
            defaultValues={modal.mode === "edit" ? modal.project : undefined}
            onSubmit={handleSave}
            onCancel={closeModal}
            loading={saving}
            submitLabel={modal.mode === "edit" ? "Update Project" : "Save Project"}
          />
        )}
      </Modal>

      <DeleteProjectModal
        project={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
