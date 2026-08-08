import { useState } from "react"
import { Plus, X } from "lucide-react"

const SUGGESTED_SKILLS = [
  "React",
  "Next.js",
  "PHP",
  "Laravel",
  "Node.js",
  "Supabase",
  "PostgreSQL",
  "UI/UX",
  "DevOps",
  "TypeScript",
  "Flutter",
  "Python",
]

export default function SkillsInput({ value = [], onChange }) {
  const [draft, setDraft] = useState("")

  const addSkill = (raw) => {
    const skill = raw.trim().replace(/,$/, "")
    if (!skill) return
    if (value.some((s) => s.toLowerCase() === skill.toLowerCase())) return
    onChange([...value, skill])
  }

  const removeSkill = (skill) => onChange(value.filter((s) => s !== skill))

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (draft.trim()) {
        addSkill(draft)
        setDraft("")
      }
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      removeSkill(value[value.length - 1])
    }
  }

  return (
    <div>
      <span className="block text-sm font-medium text-[#0B1E3D] mb-2">Skills</span>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0057D9] bg-[#0057D9]/10 px-2.5 py-1.5 rounded-lg"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                aria-label={`Remove ${skill}`}
                className="text-[#0057D9]/60 hover:text-red-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (draft.trim()) {
              addSkill(draft)
              setDraft("")
            }
          }}
          placeholder="Type a skill and press Enter"
          className="w-full h-10 px-3.5 pr-10 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"
          aria-label="Add a skill"
        />
        <button
          type="button"
          onClick={() => {
            if (draft.trim()) {
              addSkill(draft)
              setDraft("")
            }
          }}
          disabled={!draft.trim()}
          aria-label="Add skill"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#0057D9] bg-[#0057D9]/10 hover:bg-[#0057D9]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Press <kbd className="px-1 py-0.5 bg-[#F7F9FC] border border-gray-200 rounded text-[10px] font-semibold">Enter</kbd> or{" "}
        <kbd className="px-1 py-0.5 bg-[#F7F9FC] border border-gray-200 rounded text-[10px] font-semibold">,</kbd> to add a skill
      </p>

      {value.length === 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSkill(s)}
                className="text-xs font-medium text-[#1F2937] bg-[#F7F9FC] border border-gray-100 px-2.5 py-1.5 rounded-lg hover:border-[#0057D9]/30 hover:text-[#0057D9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
