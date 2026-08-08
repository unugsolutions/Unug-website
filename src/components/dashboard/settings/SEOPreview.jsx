import { Search } from "lucide-react"

function Counter({ label, current, recommended }) {
  const over = current > recommended
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold ${
        over ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"
      }`}
    >
      {label}: {current}/{recommended} {over ? "— too long" : "chars"}
    </span>
  )
}

export default function SEOPreview({ watch }) {
  const website = watch("website") || "unugsolutions.com"
  const title = watch("seo_title") || "UNUG Solutions | Engineering Digital Solutions"
  const description =
    watch("seo_description") ||
    "UNUG Solutions is a software engineering and digital solutions company that builds modern websites, custom software, and digital platforms."

  return (
    <div className="rounded-2xl border border-gray-100 bg-[#F7F9FC] p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-7 h-7 rounded-lg bg-[#0057D9]/10 flex items-center justify-center">
          <Search className="w-4 h-4 text-[#0057D9]" />
        </span>
        <h4 className="text-sm font-heading font-bold text-[#0B1E3D]">Live SEO Preview</h4>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1">
          <span className="w-3 h-3 rounded-full bg-gray-200" />
          {website}
        </div>
        <p className="text-base text-[#1a0dab] leading-snug truncate">{title}</p>
        <p className="text-xs text-[#4d5156] leading-relaxed mt-1 line-clamp-2">
          {new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })} — {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Counter label="Title" current={title.length} recommended={60} />
        <Counter label="Description" current={description.length} recommended={160} />
      </div>
    </div>
  )
}
