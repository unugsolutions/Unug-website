import { Plus, Trash2 } from "lucide-react"

export default function FeatureInput({ fields, register, append, remove }) {
  return (
    <div>
      <span className="block text-sm font-medium text-[#0B1E3D] mb-2">
        Features
        <span className="text-gray-400 font-normal"> (optional)</span>
      </span>

      <div className="space-y-2 mb-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Feature ${index + 1}`}
              aria-label={`Feature ${index + 1}`}
              {...register(`features.${index}`)}
              className="flex-1 h-10 px-3.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`Remove feature ${index + 1}`}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append("")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0057D9] hover:text-[#004ab8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
      >
        <Plus className="w-4 h-4" />
        Add feature
      </button>
    </div>
  )
}
