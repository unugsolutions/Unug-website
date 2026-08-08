import { Plus, Trash2, Link } from "lucide-react"
import { SectionCard, SectionTitle, TextField, TextAreaField } from "./fields"

function QuickLinksEditor({ watch, setValue }) {
  const links = Array.isArray(watch("quick_links")) ? watch("quick_links") : []

  const update = (index, patch) => {
    const next = links.map((link, i) => (i === index ? { ...link, ...patch } : link))
    setValue("quick_links", next, { shouldDirty: true })
  }

  const add = () => {
    setValue("quick_links", [...links, { label: "", to: "/" }], { shouldDirty: true })
  }

  const remove = (index) => {
    setValue(
      "quick_links",
      links.filter((_, i) => i !== index),
      { shouldDirty: true }
    )
  }

  return (
    <div>
      {links.length > 0 ? (
        <ul className="space-y-2 mb-3">
          {links.map((link, i) => (
            <li key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_auto] gap-2 items-center">
              <input
                type="text"
                value={link.label || ""}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="Label (e.g. Careers)"
                aria-label={`Quick link ${i + 1} label`}
                className="w-full h-10 px-3.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 transition-all duration-200 placeholder:text-gray-400"
              />
              <input
                type="text"
                value={link.to || ""}
                onChange={(e) => update(i, { to: e.target.value })}
                placeholder="/path"
                aria-label={`Quick link ${i + 1} URL`}
                className="w-full h-10 px-3.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 transition-all duration-200 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label={`Remove quick link ${i + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
          <Link className="w-3.5 h-3.5" />
          No custom quick links. The default footer navigation will be shown.
        </p>
      )}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0057D9] bg-[#0057D9]/10 hover:bg-[#0057D9]/15 rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Quick Link
      </button>
    </div>
  )
}

export default function FooterSettings({ register, errors, watch, setValue }) {
  return (
    <div className="space-y-4">
      <SectionCard>
        <SectionTitle
          title="Footer Content"
          description="Text shown in the website footer."
        />
        <div className="space-y-4">
          <TextAreaField
            register={register}
            name="footer_text"
            label="Footer Text"
            rows={3}
            placeholder="Short company description for the footer..."
            errors={errors}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              register={register}
              name="copyright_text"
              label="Copyright Text"
              placeholder="All rights reserved."
              hint="Appended after the company name and current year."
              errors={errors}
            />
            <TextField
              register={register}
              name="business_hours"
              label="Business Hours"
              placeholder="Monday – Saturday: 9:00 AM – 6:00 PM"
              errors={errors}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle
          title="Quick Links"
          description="Custom footer navigation. Leave empty to keep the default site navigation."
        />
        <QuickLinksEditor watch={watch} setValue={setValue} />
      </SectionCard>
    </div>
  )
}
