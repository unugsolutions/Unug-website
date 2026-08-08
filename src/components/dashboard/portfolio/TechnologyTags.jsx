import { useState } from "react"
import { Plus, X } from "lucide-react"

export default function TechnologyTags({ value = [], onChange, placeholder = "Add a technology and press Enter" }) {
  const [draft, setDraft] = useState("")

  const add = () => {
    const tag = draft.trim()
    if (!tag) return
    if (!value.includes(tag)) onChange([...value, tag])
    setDraft("")
  }

  const remove = (tag) => onChange(value.filter((t) => t !== tag))

  return (
    <div>
      <span className="block text-sm font-medium text-[#0B1E3D] mb-2">
        Technologies
        <span className="text-gray-400 font-normal"> (optional)</span>
      </span>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0057D9] bg-[#0057D9]/10 pl-2.5 pr-1.5 py-1.5 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                aria-label={`Remove ${tag}`}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[#0057D9] hover:text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault()
              add()
            }
            if (e.key === "Backspace" && !draft && value.length > 0) {
              remove(value[value.length - 1])
            }
          }}
          onBlur={add}
          placeholder={placeholder}
          aria-label="Technologies"
          className="flex-1 h-10 px-3.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={add}
          aria-label="Add technology"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#0057D9] hover:bg-[#0057D9]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
