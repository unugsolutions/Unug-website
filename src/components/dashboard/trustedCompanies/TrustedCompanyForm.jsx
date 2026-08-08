import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, X, Loader2, CheckCircle, Circle, Link2 } from "lucide-react"
import { uploadCompanyLogo } from "../../../services/trustedCompaniesService"
import ImageUploader from "../ImageUploader"

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website_url: z.string().url("Must be a valid URL").or(z.literal("")),
  display_order: z.coerce
    .number()
    .int("Display order must be numeric")
    .min(0, "Display order must be a non-negative number"),
  status: z.enum(["draft", "published"]),
})

const createDefaults = {
  name: "",
  website_url: "",
  display_order: 0,
  status: "draft",
}

const inputClass =
  "w-full h-10 px-3.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"

function FieldError({ message }) {
  return message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null
}

export default function TrustedCompanyForm({ defaultValues, onSubmit, onCancel, loading, submitLabel = "Save Company" }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: defaultValues
      ? {
          ...createDefaults,
          ...defaultValues,
          website_url: defaultValues.website_url ?? "",
        }
      : createDefaults,
    mode: "onSubmit",
  })

  const status = watch("status")
  const logo = watch("logo_url") ?? ""

  const onValid = (values) => {
    onSubmit({
      ...values,
      name: values.name.trim(),
      website_url: values.website_url?.trim() || null,
      logo_url: logo.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-6">
      <div>
        <span className="block text-sm font-medium text-[#0B1E3D] mb-2">Company Logo</span>
        <ImageUploader
          label="Logo"
          value={logo}
          onChange={(url) => setValue("logo_url", url)}
          onUpload={uploadCompanyLogo}
          hint="PNG, JPG, WEBP or SVG up to 10 MB — recommended 400×160 with transparent background"
          emptyNote="No logo uploaded yet — the company initials are shown until one is uploaded."
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#0B1E3D] mb-2">
            Company Name
          </label>
          <input id="name" type="text" placeholder="e.g. TechCorp" {...register("name")} className={inputClass} />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <label htmlFor="website_url" className="block text-sm font-medium text-[#0B1E3D] mb-2">
            Website <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Link2 className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="website_url"
              type="url"
              placeholder="https://example.com"
              {...register("website_url")}
              className={`${inputClass} pl-10`}
            />
          </div>
          <FieldError message={errors.website_url?.message} />
        </div>

        <div>
          <span className="block text-sm font-medium text-[#0B1E3D] mb-2">Status</span>
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F7F9FC] rounded-xl">
            {["draft", "published"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue("status", s)}
                aria-pressed={status === s}
                className={`flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  status === s ? "bg-white text-[#0B1E3D] shadow-sm" : "text-gray-400 hover:text-[#0B1E3D]"
                }`}
              >
                {s === "published" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300" />
                )}
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="display_order" className="block text-sm font-medium text-[#0B1E3D] mb-2">
            Display Order
          </label>
          <input
            id="display_order"
            type="number"
            min="0"
            step="1"
            {...register("display_order", { valueAsNumber: true })}
            className={inputClass}
          />
          <FieldError message={errors.display_order?.message} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
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
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#0057D9] text-white rounded-xl hover:bg-[#004ab8] shadow-lg shadow-[#0057D9]/20 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] disabled:opacity-60 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  )
}
