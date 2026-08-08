// Renders a list of uploaded quote attachments with a type-specific icon, file size, and a download link.

import { Paperclip, Download, FileText, Image as ImageIcon, FileArchive, FileSpreadsheet, Loader2 } from "lucide-react"

// Maps an attachment MIME type to the icon component that best represents it (falls back to a generic paperclip).
function fileIcon(type = "") {
  if (type.startsWith("image/")) return ImageIcon
  if (type === "application/pdf" || type === "application/msword" || type.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml")) return FileText
  if (type.includes("spreadsheet") || type.includes("excel") || type === "text/csv") return FileSpreadsheet
  if (type === "application/zip") return FileArchive
  return Paperclip
}

// Formats a raw byte count into a human-readable size string (B / KB / MB).
function formatSize(size) {
  if (!size && size !== 0) return ""
  const bytes = Number(size)
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * Displays the attachments of a quote.
 * @param {{ url: string, name: string, type: string, size: number }[]} attachments - List of file attachments.
 * @param {boolean} downloading - Whether a download is currently in progress (shows a spinner).
 * @param {Function} onDownload - Handler fired when a download link is clicked.
 * @returns {JSX.Element} Attachment list, or a placeholder when there are none.
 */
export default function AttachmentPreview({ attachments = [], downloading, onDownload }) {
  if (attachments.length === 0) {
    return <p className="text-sm text-gray-400">No attachments.</p>
  }

  return (
    <ul className="space-y-2">
      {attachments.map((file, i) => {
        const Icon = fileIcon(file?.type)
        return (
          <li key={file?.url || i} className="flex items-center gap-3 bg-[#F7F9FC] rounded-xl p-3">
            <span className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-[#0057D9]" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0B1E3D] truncate">{file?.name || "Attachment"}</p>
              {formatSize(file?.size) && <p className="text-xs text-gray-400">{formatSize(file?.size)}</p>}
            </div>
            <a
              href={file?.url}
              target="_blank"
              rel="noopener noreferrer"
              download={file?.name}
              onClick={onDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0057D9] bg-[#0057D9]/10 hover:bg-[#0057D9]/20 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
            >
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Download
            </a>
          </li>
        )
      })}
    </ul>
  )
}
