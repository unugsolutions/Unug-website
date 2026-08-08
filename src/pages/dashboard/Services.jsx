import { useState } from "react"
import toast from "react-hot-toast"
import { Plus } from "lucide-react"
import { useServices } from "../../hooks/useServices"
import { getServiceIcon } from "../../lib/serviceIcons"
import PageHeader from "../../components/dashboard/PageHeader"
import ServiceTable from "../../components/dashboard/services/ServiceTable"
import ServiceForm from "../../components/dashboard/services/ServiceForm"
import DeleteServiceModal from "../../components/dashboard/services/DeleteServiceModal"
import Modal from "../../components/dashboard/Modal"
import StatusBadge from "../../components/dashboard/StatusBadge"

// Dashboard page for managing website services (create, edit, view,
// delete, and status/featured controls).
function ServiceDetails({ service }) {
  // Map the stored icon key to its Lucide component
  const Icon = getServiceIcon(service.icon)
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <span className="w-14 h-14 rounded-2xl bg-[#0057D9]/10 text-[#0057D9] flex items-center justify-center">
          <Icon className="w-7 h-7" />
        </span>
        <div>
          <h4 className="text-lg font-heading font-bold text-[#0B1E3D]">{service.title}</h4>
          <p className="text-sm text-gray-400 font-mono">/{service.slug}</p>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-400 mb-1">Status</dt>
          <dd><StatusBadge status={service.status} /></dd>
        </div>
        <div>
          <dt className="text-gray-400 mb-1">Featured</dt>
          <dd className="font-medium text-[#0B1E3D]">{service.featured ? "Yes" : "No"}</dd>
        </div>
        <div>
          <dt className="text-gray-400 mb-1">Display Order</dt>
          <dd className="font-medium text-[#0B1E3D]">{service.display_order}</dd>
        </div>
        <div>
          <dt className="text-gray-400 mb-1">Created</dt>
          <dd className="font-medium text-[#0B1E3D]">
            {new Date(service.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </dd>
        </div>
      </dl>

      <div>
        <p className="text-gray-400 text-sm mb-1">Short Description</p>
        <p className="text-sm text-[#1F2937]">{service.short_description}</p>
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-1">Full Description</p>
        <p className="text-sm text-[#1F2937] leading-relaxed">{service.description}</p>
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-2">Features</p>
        <ul className="grid sm:grid-cols-2 gap-2">
          {(service.features ?? []).map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-[#1F2937] bg-[#F7F9FC] rounded-lg px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0057D9]" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {service.image_url && (
        <div>
          <p className="text-gray-400 text-sm mb-2">Image</p>
          <img
            src={service.image_url}
            alt={service.title}
            className="w-full max-h-56 object-cover rounded-xl border border-gray-100"
          />
        </div>
      )}
    </div>
  )
}

export default function Services() {
  const { services, loading, error, refetch, createService, updateService, removeService } = useServices()
  // Modal mode is one of: null, "create", "edit", "view"
  const [modal, setModal] = useState({ mode: null, service: null })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const openModal = (mode, service = null) => setModal({ mode, service })
  const closeModal = () => setModal({ mode: null, service: null })

  // Create or update the service depending on the current modal mode
  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal.mode === "edit") {
        await updateService(modal.service.id, data)
        toast.success("Service updated successfully")
      } else {
        await createService(data)
        toast.success("Service created successfully")
      }
      closeModal()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Confirm service deletion from the modal
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await removeService(deleteTarget.id)
      toast.success("Service deleted")
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
        title="Services"
        breadcrumbItems={[{ label: "Dashboard", to: "/dashboard" }]}
        breadcrumbCurrent="Services"
        description="Manage all website services."
        action={{ label: "Add Service", icon: Plus, onClick: () => openModal("create") }}
      />

      <ServiceTable
        services={services}
        loading={loading}
        error={error}
        onRetry={refetch}
        onAdd={() => openModal("create")}
        onView={(service) => openModal("view", service)}
        onEdit={(service) => openModal("edit", service)}
        onDelete={setDeleteTarget}
      />

      <Modal
        open={modal.mode !== null}
        onClose={closeModal}
        title={modal.mode === "create" ? "Add Service" : modal.mode === "edit" ? "Edit Service" : "Service Details"}
        subtitle={
          modal.mode === "create"
            ? "Create a new service for your website."
            : modal.mode === "edit"
              ? "Update the service information below."
              : "Read-only view of this service."
        }
        size={modal.mode === "view" ? "md" : "lg"}
      >
        {modal.mode === "view" ? (
          modal.service && <ServiceDetails service={modal.service} />
        ) : (
          <ServiceForm
            key={modal.service?.id ?? "create"}
            defaultValues={modal.mode === "edit" ? modal.service : undefined}
            onSubmit={handleSave}
            onCancel={closeModal}
            loading={saving}
            submitLabel={modal.mode === "edit" ? "Update Service" : "Save Service"}
          />
        )}
      </Modal>

      <DeleteServiceModal
        service={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
