import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { FileDown } from "lucide-react"
import { useQuotes } from "../../hooks/useQuotes"
import PageHeader from "../../components/dashboard/PageHeader"
import Modal from "../../components/dashboard/Modal"
import QuotesTable from "../../components/dashboard/quotes/QuotesTable"
import QuoteDetails from "../../components/dashboard/quotes/QuoteDetails"
import DeleteQuoteModal from "../../components/dashboard/quotes/DeleteQuoteModal"
import { exportQuotes, deleteAttachment } from "../../services/quoteService"
import { appendNote } from "../../utils/notes"

// Dashboard page for managing demo requests (quotes) from the website,
// including internal notes, cost estimates, attachment cleanup, and CSV export.
export default function Quotes() {
  const { quotes, loading, error, refetch, updateQuote, removeQuote } = useQuotes()

  const [selectedId, setSelectedId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const [savingEstimate, setSavingEstimate] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Keep the displayed request in sync with the latest fetched list
  const selectedQuote = useMemo(
    () => quotes.find((q) => q.id === selectedId) ?? null,
    [quotes, selectedId]
  )

  // Build the CSV via the shared exportQuotes helper and trigger a download
  const downloadCsv = () => {
    if (quotes.length === 0) {
      toast.error("No demo requests to export yet")
      return
    }
    const csv = exportQuotes(quotes)
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `demo-requests-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Exported ${quotes.length} demo request${quotes.length === 1 ? "" : "s"}`)
  }

  // Generic update (status/priority changes) from the details modal
  const handleUpdate = async (quote, payload) => {
    setUpdating(true)
    try {
      await updateQuote(quote.id, payload)
      toast.success("Demo request updated")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdating(false)
    }
  }

  // Persist the cost estimate entered for a request
  const handleSaveEstimate = async (quote, payload) => {
    setSavingEstimate(true)
    try {
      await updateQuote(quote.id, payload)
      toast.success("Estimate saved")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingEstimate(false)
    }
  }

  // Append an internal note to the request's existing notes
  const handleAddNote = async (quote, text) => {
    setSavingNotes(true)
    try {
      await updateQuote(quote.id, { internal_notes: appendNote(quote.internal_notes, text) })
      toast.success("Note added")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingNotes(false)
    }
  }

  // Delete the request after removing any uploaded attachments
  // (storage cleanup failures are ignored so the record can still be deleted)
  const handleDelete = async () => {
    setDeleting(true)
    try {
      for (const file of deleteTarget.attachments ?? []) {
        if (file?.url) await deleteAttachment(file.url).catch(() => {})
      }
      await removeQuote(deleteTarget.id)
      toast.success("Demo request deleted")
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
        title="Demo Requests"
        breadcrumbItems={[{ label: "Dashboard", to: "/dashboard" }]}
        breadcrumbCurrent="Demo Requests"
        description="Manage demo requests and inquiries from your website."
        action={{ label: "Export CSV", icon: FileDown, onClick: downloadCsv }}
      />

      <QuotesTable
        quotes={quotes}
        loading={loading}
        error={error}
        onRetry={refetch}
        onView={(quote) => setSelectedId(quote.id)}
        onDelete={setDeleteTarget}
      />

      <Modal
        open={selectedQuote !== null}
        onClose={() => setSelectedId(null)}
        title="Demo Request Details"
        subtitle={selectedQuote ? selectedQuote.reference_number : ""}
        size="lg"
      >
        {selectedQuote && (
          <QuoteDetails
            key={selectedQuote.id}
            quote={selectedQuote}
            busy={updating}
            savingNotes={savingNotes}
            savingEstimate={savingEstimate}
            onUpdate={handleUpdate}
            onSaveEstimate={handleSaveEstimate}
            onAddNote={handleAddNote}
            onDelete={setDeleteTarget}
          />
        )}
      </Modal>

      <DeleteQuoteModal
        quote={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
