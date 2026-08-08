import { useState } from "react"
import {
  User, Building2, Mail, Phone, Globe, CalendarDays, BriefcaseBusiness,
  Paperclip, Save, Trash2, Loader2, CheckCircle2, FileText,
} from "lucide-react"
import QuoteStatusBadge from "./QuoteStatusBadge"
import PriorityBadge from "./PriorityBadge"
import AttachmentPreview from "./AttachmentPreview"
import NotesPanel from "./NotesPanel"
import InfoRow from "../InfoRow"
import { QUOTE_STATUSES, QUOTE_PRIORITIES, ASSIGNEE_OPTIONS } from "../../../services/quoteService"

// Shared Tailwind classes for selects and inputs inside the details view.
const selectClass =
  "w-full h-10 px-3 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 cursor-pointer capitalize"

const inputClass =
  "w-full h-10 px-3 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"

// Tiny labelled-field wrapper used for the inline editor controls.
function Field({ label, children }) {
  return (
    <div>
      <span className="block text-xs font-medium text-gray-400 mb-1.5">{label}</span>
      {children}
    </div>
  )
}

// Formats a timestamp as a long date + time (e.g. "August 5, 2026, 2:30 PM").
function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

// Full demo request details view: header, status/priority/assignment, estimate, info,
// description, attachments, internal notes, and delete action.
export default function QuoteDetails({ quote, onUpdate, onSaveEstimate, onAddNote, onDelete, busy, savingNotes, savingEstimate }) {
  const [price, setPrice] = useState(quote?.estimated_price != null ? String(quote.estimated_price) : "")
  const [duration, setDuration] = useState(quote?.estimated_duration ?? "")

  if (!quote) return null

  const saveEstimate = () => {
    // Persist the estimated price/duration, converting an empty price back to null.
    const parsed = price.trim() === "" ? null : Number(price)
    onSaveEstimate(quote, {
      estimated_price: parsed != null && Number.isFinite(parsed) ? parsed : null,
      estimated_duration: duration.trim() || null,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0057D9] to-[#FF8C00] text-white text-lg font-heading font-bold flex items-center justify-center flex-shrink-0">
            {quote.full_name[0]?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-lg font-heading font-bold text-[#0B1E3D] truncate">{quote.full_name}</h4>
              <span className="text-xs font-semibold text-[#0057D9] bg-[#0057D9]/10 px-2.5 py-0.5 rounded-lg whitespace-nowrap">
                {quote.reference_number}
              </span>
            </div>
            <p className="text-sm text-gray-400 truncate">{quote.company || quote.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <QuoteStatusBadge status={quote.status} />
          <PriorityBadge priority={quote.priority} />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Field label="Status">
          <select
            value={quote.status}
            onChange={(e) => onUpdate(quote, { status: e.target.value })}
            disabled={busy}
            aria-label="Change status"
            className={`${selectClass} w-auto`}
          >
            {QUOTE_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
        </Field>
        <Field label="Priority">
          <select
            value={quote.priority}
            onChange={(e) => onUpdate(quote, { priority: e.target.value })}
            disabled={busy}
            aria-label="Change priority"
            className={`${selectClass} w-auto`}
          >
            {QUOTE_PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Assigned To">
          <select
            value={quote.assigned_to ?? ""}
            onChange={(e) => onUpdate(quote, { assigned_to: e.target.value || null })}
            disabled={busy}
            aria-label="Assign to"
            className={`${selectClass} w-auto`}
          >
            <option value="">Unassigned</option>
            {ASSIGNEE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
        <div className="ml-auto flex flex-wrap items-end gap-2 w-full sm:w-auto">
          <Field label="Estimate ($)">
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Estimated price"
              aria-label="Estimated price"
              className={`${inputClass} w-full sm:w-36`}
            />
          </Field>
          <Field label="Duration">
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 6 weeks"
              aria-label="Estimated duration"
              className={`${inputClass} w-full sm:w-36`}
            />
          </Field>
          <button
            type="button"
            onClick={saveEstimate}
            disabled={busy || savingEstimate}
            className="inline-flex items-center gap-1.5 px-3.5 h-10 text-sm font-semibold bg-[#0057D9] text-white rounded-xl hover:bg-[#004ab8] shadow-lg shadow-[#0057D9]/20 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
          >
            {savingEstimate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Estimate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow icon={User} label="Full Name" value={quote.full_name} />
        <InfoRow icon={Building2} label="Company" value={quote.company} />
        <InfoRow icon={Mail} label="Email" value={quote.email} href={`mailto:${quote.email}`} />
        <InfoRow icon={Phone} label="Phone" value={quote.phone} href={quote.phone ? `tel:${quote.phone}` : undefined} />
        <InfoRow icon={Globe} label="Country" value={quote.country} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow icon={BriefcaseBusiness} label="Service Required" value={quote.service} />
        <InfoRow icon={BriefcaseBusiness} label="Project Type" value={quote.project_type} />
        <InfoRow icon={FileText} label="Project Title" value={quote.project_title} />
        <InfoRow icon={CalendarDays} label="Timeline" value={quote.timeline} />
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
          <BriefcaseBusiness className="w-3.5 h-3.5" />
          Project Description
        </p>
        <p className="text-sm text-[#1F2937] leading-relaxed bg-[#F7F9FC] rounded-xl p-4 border-l-4 border-[#0057D9]/30 whitespace-pre-wrap break-words">
          {quote.project_description}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5" />
          Attachments ({quote.attachments?.length ?? 0})
        </p>
        <AttachmentPreview attachments={quote.attachments ?? []} />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <NotesPanel notesValue={quote.internal_notes} onAddNote={(text) => onAddNote(quote, text)} loading={savingNotes} />
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onDelete(quote)}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-500/5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-50 active:scale-[0.98]"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete Request
        </button>
        <p className="text-xs text-gray-400 inline-flex items-center gap-1.5 text-right">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span>
            Submitted {formatDate(quote.submitted_at)}
            <br />
            Updated {formatDate(quote.updated_at)}
          </span>
        </p>
      </div>
    </div>
  )
}
