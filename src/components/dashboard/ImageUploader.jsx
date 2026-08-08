// Image uploader field: click-to-browse or drag & drop, upload progress, and preview with replace/remove.
import { useRef, useState } from "react"
import toast from "react-hot-toast"
import { UploadCloud, ImageOff, RefreshCw, X } from "lucide-react"

/**
 * ImageUploader
 * @param {Object} props
 * @param {string} [props.label] - Field label (default "Image").
 * @param {string} [props.value] - Current image URL (empty string when none).
 * @param {Function} props.onChange - Callback receiving the new URL ('' removes the image).
 * @param {Function} props.onUpload - Async fn(file, setProgress) resolving to the uploaded URL.
 * @param {string} [props.hint] - Helper text shown inside the dropzone.
 * @param {string} [props.emptyNote] - Note shown when no image is uploaded.
 */
export default function ImageUploader({
  label = "Image",
  value,
  onChange,
  onUpload,
  hint = "PNG, JPG, WEBP or SVG up to 10 MB",
  emptyNote = "No image uploaded yet.",
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)

  // Upload the selected file, report progress, then hand the resulting URL back to the parent
  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    setProgress(0)
    try {
      const url = await onUpload(file, setProgress)
      onChange(url)
      toast.success(`${label} uploaded`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <span className="block text-sm font-medium text-[#0B1E3D] mb-2">{label}</span>

      {/* Three states: uploading (progress), preview (value set), or empty dropzone */}
      {uploading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#0057D9]/30 bg-[#F7F9FC] p-6">
          <RefreshCw className="w-6 h-6 text-[#0057D9] animate-spin mb-3" />
          <p className="text-sm font-medium text-[#0B1E3D]">Uploading {label.toLowerCase()}...</p>
          <div className="w-full max-w-[240px] mt-3">
            <div className="h-2 rounded-full bg-white overflow-hidden">
              <div
                className="h-full bg-[#0057D9] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center mt-1.5">{progress}%</p>
          </div>
        </div>
      ) : value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-100 group">
          <img src={value} alt={`${label} preview`} className="w-full h-44 object-contain bg-[#F7F9FC]" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-red-500/80 hover:bg-red-500 px-3 py-2 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFile(e.dataTransfer.files?.[0])
          }}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] ${
            dragOver ? "border-[#0057D9] bg-[#0057D9]/5" : "border-gray-200 bg-[#F7F9FC] hover:border-[#0057D9]/40"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-sm">
            <UploadCloud className="w-6 h-6 text-[#0057D9]" />
          </div>
          <p className="text-sm font-medium text-[#0B1E3D]">Drop {label.toLowerCase()} or click to browse</p>
          <p className="text-xs text-gray-400 mt-1">{hint}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ""
        }}
      />

      {!value && !uploading && (
        <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1.5">
          <ImageOff className="w-3.5 h-3.5" />
          {emptyNote}
        </p>
      )}
    </div>
  )
}
