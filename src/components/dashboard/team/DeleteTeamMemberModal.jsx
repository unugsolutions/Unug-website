import { Trash2, Loader2, X } from "lucide-react"
import Modal from "../Modal"

export default function DeleteTeamMemberModal({ member, onCancel, onConfirm, loading }) {
  return (
    <Modal open={!!member} onClose={onCancel} title="Delete Team Member?" size="sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p className="text-sm text-[#1F2937] leading-relaxed">
            This action cannot be undone. <span className="font-semibold text-[#0B1E3D]">{member?.full_name}</span> will
            be permanently removed from the team. The profile photo will also be deleted from storage.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#1F2937] border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-60 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  )
}
