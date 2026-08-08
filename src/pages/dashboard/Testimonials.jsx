import { useState } from "react"
import toast from "react-hot-toast"
import { Plus } from "lucide-react"
import { useTestimonials } from "../../hooks/useTestimonials"
import PageHeader from "../../components/dashboard/PageHeader"
import Modal from "../../components/dashboard/Modal"
import StatusBadge from "../../components/dashboard/StatusBadge"
import FeaturedBadge from "../../components/dashboard/FeaturedBadge"
import TestimonialsTable from "../../components/dashboard/testimonials/TestimonialsTable"
import TestimonialForm from "../../components/dashboard/testimonials/TestimonialForm"
import DeleteTestimonialModal from "../../components/dashboard/testimonials/DeleteTestimonialModal"
import RatingStars from "../../components/dashboard/testimonials/RatingStars"

// Dashboard page for managing client testimonials (create, edit, view,
// delete with photo cleanup, and rating/status/featured display).
function TestimonialAvatar({ testimonial, className = "w-14 h-14 text-xl" }) {
  // Show the uploaded photo, or fall back to an initials tile
  if (testimonial.photo_url) {
    return (
      <img
        src={testimonial.photo_url}
        alt={testimonial.client_name}
        className={`${className} rounded-2xl object-cover flex-shrink-0`}
      />
    )
  }
  return (
    <span className={`${className} rounded-2xl bg-gradient-to-br from-[#0057D9] to-[#FF8C00] text-white font-heading font-bold flex items-center justify-center flex-shrink-0`}>
      {testimonial.client_name[0]?.toUpperCase()}
    </span>
  )
}

// Read-only details view shown inside the "view" modal
function TestimonialDetails({ testimonial }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <TestimonialAvatar testimonial={testimonial} />
        <div>
          <h4 className="text-lg font-heading font-bold text-[#0B1E3D]">{testimonial.client_name}</h4>
          <p className="text-sm text-gray-400">
            {testimonial.position} · {testimonial.company}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <RatingStars value={testimonial.rating} size="md" />
        <span className="text-sm font-semibold text-[#0B1E3D]">{testimonial.rating} / 5</span>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-400 mb-1">Status</dt>
          <dd><StatusBadge status={testimonial.status} /></dd>
        </div>
        <div>
          <dt className="text-gray-400 mb-1">Featured</dt>
          <dd><FeaturedBadge featured={testimonial.featured} /></dd>
        </div>
        <div>
          <dt className="text-gray-400 mb-1">Display Order</dt>
          <dd className="font-medium text-[#0B1E3D]">{testimonial.display_order}</dd>
        </div>
        <div>
          <dt className="text-gray-400 mb-1">Created</dt>
          <dd className="font-medium text-[#0B1E3D]">
            {new Date(testimonial.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </dd>
        </div>
      </dl>

      {testimonial.email && (
        <div>
          <p className="text-gray-400 text-sm mb-1">Email</p>
          <p className="text-sm text-[#0057D9] font-medium">{testimonial.email}</p>
        </div>
      )}

      <div>
        <p className="text-gray-400 text-sm mb-1">Testimonial</p>
        <blockquote className="text-sm text-[#1F2937] leading-relaxed bg-[#F7F9FC] rounded-xl p-4 border-l-4 border-[#0057D9]/30">
          "{testimonial.testimonial}"
        </blockquote>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { testimonials, loading, error, refetch, createTestimonial, updateTestimonial, removeTestimonial, removePhoto } = useTestimonials()
  // Modal mode is one of: null, "create", "edit", "view"
  const [modal, setModal] = useState({ mode: null, testimonial: null })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const openModal = (mode, testimonial = null) => setModal({ mode, testimonial })
  const closeModal = () => setModal({ mode: null, testimonial: null })

  // Create or update the testimonial depending on the current modal mode
  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal.mode === "edit") {
        await updateTestimonial(modal.testimonial.id, data)
        toast.success("Testimonial updated successfully")
      } else {
        await createTestimonial(data)
        toast.success("Testimonial created successfully")
      }
      closeModal()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Delete the testimonial after removing its uploaded photo
  // (storage cleanup failures are ignored so the record can still be deleted)
  const handleDelete = async () => {
    setDeleting(true)
    try {
      if (deleteTarget.photo_url) {
        await removePhoto(deleteTarget.photo_url).catch(() => {})
      }
      await removeTestimonial(deleteTarget.id)
      toast.success("Testimonial deleted")
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
        title="Testimonials"
        breadcrumbItems={[{ label: "Dashboard", to: "/dashboard" }]}
        breadcrumbCurrent="Testimonials"
        description="Manage client testimonials displayed on your website."
        action={{ label: "Add Testimonial", icon: Plus, onClick: () => openModal("create") }}
      />

      <TestimonialsTable
        testimonials={testimonials}
        loading={loading}
        error={error}
        onRetry={refetch}
        onAdd={() => openModal("create")}
        onView={(testimonial) => openModal("view", testimonial)}
        onEdit={(testimonial) => openModal("edit", testimonial)}
        onDelete={setDeleteTarget}
      />

      <Modal
        open={modal.mode !== null}
        onClose={closeModal}
        title={modal.mode === "create" ? "Add Testimonial" : modal.mode === "edit" ? "Edit Testimonial" : "Testimonial Details"}
        subtitle={
          modal.mode === "create"
            ? "Add a client testimonial to your website."
            : modal.mode === "edit"
              ? "Update the testimonial information below."
              : "Read-only view of this testimonial."
        }
        size={modal.mode === "view" ? "md" : "lg"}
      >
        {modal.mode === "view" ? (
          modal.testimonial && <TestimonialDetails testimonial={modal.testimonial} />
        ) : (
          <TestimonialForm
            key={modal.testimonial?.id ?? "create"}
            defaultValues={modal.mode === "edit" ? modal.testimonial : undefined}
            onSubmit={handleSave}
            onCancel={closeModal}
            loading={saving}
            submitLabel={modal.mode === "edit" ? "Update Testimonial" : "Save Testimonial"}
          />
        )}
      </Modal>

      <DeleteTestimonialModal
        testimonial={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
