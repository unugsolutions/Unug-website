import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { FileDown } from "lucide-react"
import { useContactMessages } from "../../hooks/useContactMessages"
import PageHeader from "../../components/dashboard/PageHeader"
import Modal from "../../components/dashboard/Modal"
import MessagesTable from "../../components/dashboard/messages/MessagesTable"
import MessageDetails from "../../components/dashboard/messages/MessageDetails"
import DeleteMessageModal from "../../components/dashboard/messages/DeleteMessageModal"
import { appendNote } from "../../utils/notes"

// Dashboard page for managing contact messages submitted through the website
// (view, read/unread toggle, internal notes, delete, and CSV export).
export default function Messages() {
  const { messages, loading, error, refetch, updateMessage, removeMessage, markAsRead, markAsUnread } =
    useContactMessages()

  // Modal state: which message is being viewed, edited, or deleted
  const [selectedId, setSelectedId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Keep the displayed message in sync with the latest fetched list
  const selectedMessage = useMemo(
    () => messages.find((m) => m.id === selectedId) ?? null,
    [messages, selectedId]
  )

  // Build a CSV (with BOM for Excel) from all messages and trigger a download
  const downloadCsv = () => {
    if (messages.length === 0) {
      toast.error("No messages to export yet")
      return
    }
    const header = ["Full Name", "Company", "Email", "Phone", "Service", "Message", "Status", "Priority", "Submitted"]
    const rows = messages.map((m) => [
      m.full_name,
      m.company || "",
      m.email,
      m.phone || "",
      m.service || "",
      m.message,
      m.status,
      m.priority,
      m.submitted_at,
    ])
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contact-messages-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Exported ${messages.length} message${messages.length === 1 ? "" : "s"}`)
  }

  // Generic update (status/priority) reused by the details modal
  const handleUpdate = async (message, payload) => {
    setUpdating(true)
    try {
      await updateMessage(message.id, payload)
      toast.success("Message updated")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdating(false)
    }
  }

  // Toggle the message between read and unread
  const handleToggleRead = async (message) => {
    setUpdating(true)
    try {
      if (message.is_read) {
        await markAsUnread(message.id)
        toast.success("Marked as unread")
      } else {
        await markAsRead(message.id)
        toast.success("Marked as read")
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdating(false)
    }
  }

  // Append an internal note to the message's existing notes list
  const handleAddNote = async (message, text) => {
    setSavingNotes(true)
    try {
      await updateMessage(message.id, { notes: appendNote(message.notes, text) })
      toast.success("Note added")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingNotes(false)
    }
  }

  // Confirm deletion from the modal, and clear the open viewer if needed
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await removeMessage(deleteTarget.id)
      toast.success("Message deleted")
      if (selectedId === deleteTarget.id) setSelectedId(null)
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
        title="Contact Messages"
        breadcrumbItems={[{ label: "Dashboard", to: "/dashboard" }]}
        breadcrumbCurrent="Contact Messages"
        description="Manage customer inquiries from your website."
        action={{ label: "Export CSV", icon: FileDown, onClick: downloadCsv }}
      />

      <MessagesTable
        messages={messages}
        loading={loading}
        error={error}
        onRetry={refetch}
        onView={(message) => setSelectedId(message.id)}
        onToggleRead={handleToggleRead}
        onDelete={setDeleteTarget}
      />

      <Modal
        open={selectedMessage !== null}
        onClose={() => setSelectedId(null)}
        title="Message Details"
        subtitle={selectedMessage ? selectedMessage.email : ""}
        size="lg"
      >
        {selectedMessage && (
          <MessageDetails
            key={selectedMessage.id}
            message={selectedMessage}
            busy={updating}
            savingNotes={savingNotes}
            onUpdate={handleUpdate}
            onToggleRead={handleToggleRead}
            onAddNote={handleAddNote}
            onDelete={setDeleteTarget}
          />
        )}
      </Modal>

      <DeleteMessageModal
        message={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
