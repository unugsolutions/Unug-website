import { useState } from "react"
import toast from "react-hot-toast"
import { Plus } from "lucide-react"
import { useTrustedCompanies } from "../../hooks/useTrustedCompanies"
import { deleteImage } from "../../services/trustedCompaniesService"
import PageHeader from "../../components/dashboard/PageHeader"
import Modal from "../../components/dashboard/Modal"
import TrustedCompanyTable from "../../components/dashboard/trustedCompanies/TrustedCompanyTable"
import TrustedCompanyForm from "../../components/dashboard/trustedCompanies/TrustedCompanyForm"
import DeleteTrustedCompanyModal from "../../components/dashboard/trustedCompanies/DeleteTrustedCompanyModal"

// Dashboard page for managing the trusted companies / logos shown on the
// public site (create, edit, delete with logo cleanup).
export default function TrustedCompanies() {
  const { companies, loading, error, refetch, createCompany, updateCompany, removeCompany } = useTrustedCompanies()
  // Modal mode is one of: null, "create", "edit"
  const [modal, setModal] = useState({ mode: null, company: null })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const openModal = (mode, company = null) => setModal({ mode, company })
  const closeModal = () => setModal({ mode: null, company: null })

  // Create or update the company depending on the current modal mode
  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal.mode === "edit") {
        await updateCompany(modal.company.id, data)
        toast.success("Company updated successfully")
      } else {
        await createCompany(data)
        toast.success("Company created successfully")
      }
      closeModal()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Delete the company after removing its uploaded logo
  // (storage cleanup failures are ignored so the record can still be deleted)
  const handleDelete = async () => {
    setDeleting(true)
    try {
      if (deleteTarget.logo_url) {
        await deleteImage(deleteTarget.logo_url).catch(() => {})
      }
      await removeCompany(deleteTarget.id)
      toast.success("Company deleted")
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
        title="Trusted Companies"
        breadcrumbItems={[{ label: "Dashboard", to: "/dashboard" }]}
        breadcrumbCurrent="Trusted Companies"
        description="Manage the companies and logos displayed on your website to build trust."
        action={{ label: "Add Company", icon: Plus, onClick: () => openModal("create") }}
      />

      <TrustedCompanyTable
        companies={companies}
        loading={loading}
        error={error}
        onRetry={refetch}
        onAdd={() => openModal("create")}
        onEdit={(company) => openModal("edit", company)}
        onDelete={setDeleteTarget}
      />

      <Modal
        open={modal.mode !== null}
        onClose={closeModal}
        title={modal.mode === "create" ? "Add Company" : "Edit Company"}
        subtitle={
          modal.mode === "create"
            ? "Add a company whose logo you want to showcase."
            : "Update the company information below."
        }
        size="md"
      >
        <TrustedCompanyForm
          key={modal.company?.id ?? "create"}
          defaultValues={modal.mode === "edit" ? modal.company : undefined}
          onSubmit={handleSave}
          onCancel={closeModal}
          loading={saving}
          submitLabel={modal.mode === "edit" ? "Update Company" : "Save Company"}
        />
      </Modal>

      <DeleteTrustedCompanyModal
        company={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
