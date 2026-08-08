import { useState } from "react"
import toast from "react-hot-toast"
import { UserPlus } from "lucide-react"
import { useTeam } from "../../hooks/useTeam"
import PageHeader from "../../components/dashboard/PageHeader"
import Modal from "../../components/dashboard/Modal"
import TeamTable from "../../components/dashboard/team/TeamTable"
import TeamForm from "../../components/dashboard/team/TeamForm"
import TeamModal from "../../components/dashboard/team/TeamModal"
import DeleteTeamMemberModal from "../../components/dashboard/team/DeleteTeamMemberModal"

// Dashboard page for managing team members (create, edit, view, delete,
// including photo cleanup when a member is removed).
export default function Team() {
  const { team, loading, error, refetch, createTeamMember, updateTeamMember, removeTeamMember, removePhoto } = useTeam()
  // Modal mode is one of: null, "create", "edit", "view"
  const [modal, setModal] = useState({ mode: null, member: null })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const openModal = (mode, member = null) => setModal({ mode, member })
  const closeModal = () => setModal({ mode: null, member: null })

  // Create or update the team member depending on the current modal mode
  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal.mode === "edit") {
        await updateTeamMember(modal.member.id, data)
        toast.success("Team member updated successfully")
      } else {
        await createTeamMember(data)
        toast.success("Team member created successfully")
      }
      closeModal()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Delete the member after removing their uploaded photo
  // (storage cleanup failures are ignored so the record can still be deleted)
  const handleDelete = async () => {
    setDeleting(true)
    try {
      if (deleteTarget.photo_url) {
        await removePhoto(deleteTarget.photo_url).catch(() => {})
      }
      await removeTeamMember(deleteTarget.id)
      toast.success("Team member deleted")
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
        title="Team Members"
        breadcrumbItems={[{ label: "Dashboard", to: "/dashboard" }]}
        breadcrumbCurrent="Team"
        description="Manage your company's leadership and staff."
        action={{ label: "Add Team Member", icon: UserPlus, onClick: () => openModal("create") }}
      />

      <TeamTable
        team={team}
        loading={loading}
        error={error}
        onRetry={refetch}
        onAdd={() => openModal("create")}
        onView={(member) => openModal("view", member)}
        onEdit={(member) => openModal("edit", member)}
        onDelete={setDeleteTarget}
      />

      <Modal
        open={modal.mode !== null}
        onClose={closeModal}
        title={modal.mode === "create" ? "Add Team Member" : modal.mode === "edit" ? "Edit Team Member" : "Team Member Details"}
        subtitle={
          modal.mode === "create"
            ? "Add a team member to your website."
            : modal.mode === "edit"
              ? "Update the team member information below."
              : "Read-only view of this team member."
        }
        size={modal.mode === "view" ? "md" : "lg"}
      >
        {modal.mode === "view" ? (
          <TeamModal member={modal.member} />
        ) : (
          <TeamForm
            key={modal.member?.id ?? "create"}
            defaultValues={modal.mode === "edit" ? modal.member : undefined}
            onSubmit={handleSave}
            onCancel={closeModal}
            loading={saving}
            submitLabel={modal.mode === "edit" ? "Update Team Member" : "Save Team Member"}
          />
        )}
      </Modal>

      <DeleteTeamMemberModal
        member={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
