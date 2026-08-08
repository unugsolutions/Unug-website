import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Save, X, Loader2, CheckCircle, Circle, BriefcaseBusiness, UserRound, Mail, Phone, Globe, Calendar } from "lucide-react"
import { uploadPhoto } from "../../../services/teamService"
import PhotoUploader from "./PhotoUploader"
import SkillsInput from "./SkillsInput"

const urlOrEmpty = z.string().refine((v) => v === "" || /^https?:\/\//.test(v), "Enter a valid URL starting with http(s)://")

const teamMemberSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string(),
  bio: z.string(),
  email: z.string().email("Enter a valid email address").or(z.literal("")),
  phone: z.string(),
  linkedin_url: urlOrEmpty,
  github_url: urlOrEmpty,
  facebook_url: urlOrEmpty,
  instagram_url: urlOrEmpty,
  x_url: urlOrEmpty,
  website_url: urlOrEmpty,
  years_experience: z.coerce
    .number()
    .int("Years of experience must be a whole number")
    .min(0, "Years of experience cannot be negative")
    .max(60, "Years of experience cannot exceed 60"),
  joined_date: z.string(),
  display_order: z.coerce
    .number()
    .int("Display order must be numeric")
    .min(0, "Display order must be a non-negative number"),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
})

const createDefaults = {
  first_name: "",
  last_name: "",
  position: "",
  department: "",
  bio: "",
  email: "",
  phone: "",
  linkedin_url: "",
  github_url: "",
  facebook_url: "",
  instagram_url: "",
  x_url: "",
  website_url: "",
  years_experience: 0,
  joined_date: "",
  display_order: 0,
  featured: false,
  status: "draft",
}

const inputClass =
  "w-full h-10 px-3.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"

function FieldError({ message }) {
  return message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null
}

function Field({ label, htmlFor, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[#0B1E3D] mb-2">
        {label} {hint && <span className="text-gray-400 font-normal">({hint})</span>}
      </label>
      {children}
    </div>
  )
}

export default function TeamForm({ defaultValues, onSubmit, onCancel, loading, submitLabel = "Save Team Member" }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: defaultValues
      ? {
          ...createDefaults,
          ...defaultValues,
          skills: defaultValues.skills ?? [],
          joined_date: defaultValues.joined_date?.slice(0, 10) ?? "",
        }
      : createDefaults,
    mode: "onSubmit",
  })

  const [skills, setSkills] = useState(defaultValues?.skills ?? [])
  const featured = watch("featured")
  const status = watch("status")
  const photo = watch("photo_url") ?? ""

  const trimOrNull = (v) => (typeof v === "string" ? v.trim() || null : v)

  const onValid = (values) => {
    onSubmit({
      ...values,
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      position: values.position.trim(),
      department: trimOrNull(values.department),
      bio: trimOrNull(values.bio),
      email: trimOrNull(values.email),
      phone: trimOrNull(values.phone),
      linkedin_url: trimOrNull(values.linkedin_url),
      github_url: trimOrNull(values.github_url),
      facebook_url: trimOrNull(values.facebook_url),
      instagram_url: trimOrNull(values.instagram_url),
      x_url: trimOrNull(values.x_url),
      website_url: trimOrNull(values.website_url),
      joined_date: trimOrNull(values.joined_date),
      skills,
      photo_url: photo.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <div>
        <span className="block text-sm font-medium text-[#0B1E3D] mb-2">Full Name</span>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <input
              id="first_name"
              type="text"
              placeholder="First name"
              {...register("first_name")}
              className={inputClass}
            />
            <FieldError message={errors.first_name?.message} />
          </div>
          <div>
            <input
              id="last_name"
              type="text"
              placeholder="Last name"
              {...register("last_name")}
              className={inputClass}
            />
            <FieldError message={errors.last_name?.message} />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Position" htmlFor="position">
          <div className="relative">
            <BriefcaseBusiness className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input id="position" type="text" placeholder="e.g. Senior Developer" {...register("position")} className={`${inputClass} pl-10`} />
          </div>
          <FieldError message={errors.position?.message} />
        </Field>

        <Field label="Department" htmlFor="department">
          <div className="relative">
            <UserRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input id="department" type="text" placeholder="e.g. Engineering" {...register("department")} className={`${inputClass} pl-10`} />
          </div>
          <FieldError message={errors.department?.message} />
        </Field>
      </div>

      <Field label="Biography" htmlFor="bio">
        <textarea
          id="bio"
          rows="4"
          placeholder="A short bio shown on the website..."
          {...register("bio")}
          className={`${inputClass} h-auto py-2.5 resize-none`}
        />
        <FieldError message={errors.bio?.message} />
      </Field>

      <PhotoUploader value={photo} onChange={(url) => setValue("photo_url", url)} onUpload={uploadPhoto} />

      <div>
        <span className="block text-sm font-medium text-[#0B1E3D] mb-2">Contact & Social Links</span>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input id="email" type="email" placeholder="member@unug.example" {...register("email")} className={`${inputClass} pl-10`} />
            </div>
            <FieldError message={errors.email?.message} />
          </div>
          <div>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input id="phone" type="tel" placeholder="063327****" {...register("phone")} className={`${inputClass} pl-10`} />
            </div>
            <FieldError message={errors.phone?.message} />
          </div>
          <div>
            <input id="linkedin_url" type="url" placeholder="LinkedIn URL" {...register("linkedin_url")} className={inputClass} />
            <FieldError message={errors.linkedin_url?.message} />
          </div>
          <div>
            <input id="github_url" type="url" placeholder="GitHub URL" {...register("github_url")} className={inputClass} />
            <FieldError message={errors.github_url?.message} />
          </div>
          <div>
            <input id="facebook_url" type="url" placeholder="Facebook URL" {...register("facebook_url")} className={inputClass} />
            <FieldError message={errors.facebook_url?.message} />
          </div>
          <div>
            <input id="instagram_url" type="url" placeholder="Instagram URL" {...register("instagram_url")} className={inputClass} />
            <FieldError message={errors.instagram_url?.message} />
          </div>
          <div>
            <input id="x_url" type="url" placeholder="X (Twitter) URL" {...register("x_url")} className={inputClass} />
            <FieldError message={errors.x_url?.message} />
          </div>
          <div>
            <div className="relative">
              <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input id="website_url" type="url" placeholder="Website URL" {...register("website_url")} className={`${inputClass} pl-10`} />
            </div>
            <FieldError message={errors.website_url?.message} />
          </div>
        </div>
      </div>

      <SkillsInput value={skills} onChange={setSkills} />

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <div className="relative">
            <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input id="joined_date" type="date" {...register("joined_date")} className={`${inputClass} pl-10`} />
          </div>
          <FieldError message={errors.joined_date?.message} />
        </div>

        <div>
          <input
            id="years_experience"
            type="number"
            min="0"
            step="1"
            placeholder="Years of experience"
            {...register("years_experience", { valueAsNumber: true })}
            className={inputClass}
          />
          <FieldError message={errors.years_experience?.message} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <span className="block text-sm font-medium text-[#0B1E3D] mb-2">Display Order</span>
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

        <div>
          <span className="block text-sm font-medium text-[#0B1E3D] mb-2">Featured</span>
          <div className="flex items-center gap-3 h-10">
            <button
              type="button"
              role="switch"
              aria-checked={featured}
              aria-label="Featured"
              onClick={() => setValue("featured", !featured)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] ${
                featured ? "bg-[#0057D9]" : "bg-gray-200"
              }`}
            >
              <motion.span
                animate={{ x: featured ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow"
              />
            </button>
            <span className="text-sm text-gray-500">{featured ? "Shown as leadership on About" : "Not featured"}</span>
          </div>
        </div>
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
                status === s
                  ? "bg-white text-[#0B1E3D] shadow-sm"
                  : "text-gray-400 hover:text-[#0B1E3D]"
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
