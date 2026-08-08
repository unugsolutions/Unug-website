import { User, Building2, Mail, Phone, BriefcaseBusiness, MailOpen, Loader2, Trash2, CheckCircle2, FileText } from "lucide-react"
import StatusBadge from "./StatusBadge"
import PriorityBadge from "../quotes/PriorityBadge"
import NotesPanel from "../NotesPanel"
import InfoRow from "../InfoRow"

const MESSAGE_STATUSES = ["new", "in_progress", "replied", "closed"]
const MESSAGE_PRIORITIES = ["low", "medium", "high"]

const selectClass =
  "w-full h-10 px-3 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 cursor-pointer capitalize"

function Field({ label, children }) {
  return (
    <div>
      <span className="block text-xs font-medium text-gray-400 mb-1.5">{label}</span>
      {children}
    </div>
  )
}

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

export default function MessageDetails({ message, onUpdate, onToggleRead, onAddNote, onDelete, busy, savingNotes }) {
  if (!message) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0057D9] to-[#FF8C00] text-white text-lg font-heading font-bold flex items-center justify-center flex-shrink-0">
            {message.full_name[0]?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <h4 className="text-lg font-heading font-bold text-[#0B1E3D] truncate">{message.full_name}</h4>
            <p className="text-sm text-gray-400 truncate">{message.company || message.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={message.status} />
          <PriorityBadge priority={message.priority} />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Field label="Status">
          <select
            value={message.status}
            onChange={(e) => onUpdate(message, { status: e.target.value })}
            disabled={busy}
            aria-label="Change status"
            className={`${selectClass} w-auto`}
          >
            {MESSAGE_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
        </Field>
        <Field label="Priority">
          <select
            value={message.priority}
            onChange={(e) => onUpdate(message, { priority: e.target.value })}
            disabled={busy}
            aria-label="Change priority"
            className={`${selectClass} w-auto`}
          >
            {MESSAGE_PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
        <button
          type="button"
          onClick={() => onToggleRead(message)}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-3.5 h-10 text-sm font-semibold bg-white text-[#0B1E3D] border border-gray-200 rounded-xl hover:border-[#0057D9] hover:text-[#0057D9] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] disabled:opacity-50 active:scale-[0.98]"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : message.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
          {message.is_read ? "Mark as Unread" : "Mark as Read"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow icon={User} label="Full Name" value={message.full_name} />
        <InfoRow icon={Building2} label="Company" value={message.company} />
        <InfoRow icon={Mail} label="Email" value={message.email} href={`mailto:${message.email}`} />
        <InfoRow icon={Phone} label="Phone" value={message.phone} href={message.phone ? `tel:${message.phone}` : undefined} />
        <InfoRow icon={BriefcaseBusiness} label="Service Interested" value={message.service} />
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Message
        </p>
        <p className="text-sm text-[#1F2937] leading-relaxed bg-[#F7F9FC] rounded-xl p-4 border-l-4 border-[#0057D9]/30 whitespace-pre-wrap break-words">
          {message.message}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <NotesPanel notesValue={message.notes} onAddNote={(text) => onAddNote(message, text)} loading={savingNotes} />
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onDelete(message)}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-500/5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-50 active:scale-[0.98]"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete Message
        </button>
        <p className="text-xs text-gray-400 inline-flex items-center gap-1.5 text-right">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span>
            Submitted {formatDate(message.submitted_at)}
            <br />
            Updated {formatDate(message.updated_at)}
          </span>
        </p>
      </div>
    </div>
  )
}
