// Internal notes panel: parses the persisted notes string and lets admins append private notes.
import { useState } from "react"
import { StickyNote, Plus, Loader2 } from "lucide-react"
import { parseNotes } from "../../utils/notes"

/**
 * Formats a timestamp for display (e.g. "Aug 5, 2026, 2:30 PM").
 * @param {string|number|Date} value - Date value to format.
 * @returns {string} Locale-formatted string, or "" when value is empty.
 */
function formatDate(value) {
  if (!value) return ""
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

/**
 * NotesPanel
 * @param {Object} props
 * @param {string} props.notesValue - Raw notes string parsed by parseNotes.
 * @param {Function} props.onAddNote - Called with the trimmed note text on submit.
 * @param {boolean} [props.loading] - Disables submission while a save is in flight.
 */
export default function NotesPanel({ notesValue, onAddNote, loading }) {
  const [text, setText] = useState("")
  const notes = parseNotes(notesValue)

  const submit = (e) => {
    e.preventDefault()
    // Ignore empty notes and submissions while a save is in flight
    const trimmed = text.trim()
    if (!trimmed || loading) return
    onAddNote(trimmed)
    setText("")
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <StickyNote className="w-4 h-4 text-[#0057D9]" />
        <h4 className="text-sm font-heading font-bold text-[#0B1E3D]">Internal Notes</h4>
        <span className="text-xs text-gray-400">Private — never shown on the website</span>
      </div>

      {notes.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {notes.map((note, i) => (
            <li key={i} className="flex items-start gap-3 bg-[#F7F9FC] rounded-xl p-3">
              <span className="w-6 h-6 rounded-lg bg-[#0057D9]/10 text-[#0057D9] text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-[#1F2937] leading-relaxed">{note.text}</p>
                {note.at && <p className="text-xs text-gray-400 mt-1">{formatDate(note.at)}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 mb-4">No notes yet. Add the first one below.</p>
      )}

      <form onSubmit={submit} className="flex items-start gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Add a private note..."
          aria-label="Add a private note"
          className="flex-1 min-w-0 h-auto px-3.5 py-2.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold bg-[#0057D9] text-white rounded-xl hover:bg-[#004ab8] shadow-lg shadow-[#0057D9]/20 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </form>
    </div>
  )
}
