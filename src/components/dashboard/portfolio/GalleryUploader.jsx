import { useRef, useState } from "react"
import toast from "react-hot-toast"
import { Images, Loader2, Plus, X } from "lucide-react"

export default function GalleryUploader({ value = [], onChange, onUpload, hint = "PNG, JPG, WEBP or SVG up to 10 MB each" }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = async (files) => {
    const list = Array.from(files ?? [])
    if (list.length === 0) return
    setUploading(true)
    setProgress(0)
    const uploaded = []
    try {
      for (const file of list) {
        const url = await onUpload(file, (p) => setProgress(p))
        uploaded.push(url)
      }
      onChange([...value, ...uploaded])
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  const remove = (url) => onChange(value.filter((v) => v !== url))

  return (
    <div>
      <span className="block text-sm font-medium text-[#0B1E3D] mb-2">
        Gallery Images
        <span className="text-gray-400 font-normal"> (optional)</span>
      </span>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {value.map((url, index) => (
            <div key={url} className="relative group rounded-xl overflow-hidden border border-gray-100 aspect-[4/3]">
              <img src={url} alt={`Gallery image ${index + 1}`} className="w-full h-full object-contain bg-[#F7F9FC]" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
              <button
                type="button"
                onClick={() => remove(url)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-gray-500 hover:text-red-500 shadow opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <span className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold text-white bg-black/50 px-1.5 py-0.5 rounded">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-3 rounded-xl border border-[#0057D9]/20 bg-[#0057D9]/5 p-4 mb-3">
          <Loader2 className="w-4 h-4 text-[#0057D9] animate-spin flex-shrink-0" />
          <div className="flex-1">
            <div className="h-2 rounded-full bg-white overflow-hidden">
              <div className="h-full bg-[#0057D9] transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">Uploading gallery image... {progress}%</p>
          </div>
        </div>
      )}

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
          handleFiles(e.dataTransfer.files)
        }}
        className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border-2 border-dashed p-4 cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] ${
          dragOver ? "border-[#0057D9] bg-[#0057D9]/5" : "border-gray-200 bg-[#F7F9FC] hover:border-[#0057D9]/40"
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Images className="w-5 h-5 text-[#0057D9]" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-[#0B1E3D]">Drop images here or click to browse</p>
          <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0057D9]">
          <Plus className="w-3.5 h-3.5" />
          Add images
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ""
        }}
      />
    </div>
  )
}
