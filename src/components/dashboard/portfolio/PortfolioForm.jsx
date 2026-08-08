import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Save, X, Loader2, CheckCircle, Circle, Link2, MonitorPlay } from "lucide-react"
import { slugify, uploadCoverImage, uploadGalleryImage } from "../../../services/portfolioService"
import TechnologyTags from "./TechnologyTags"
import ImageUploader from "../ImageUploader"
import GalleryUploader from "./GalleryUploader"

const categoryOptions = [
  "Web App",
  "Mobile App",
  "E-Commerce",
  "Website",
  "Dashboard",
  "System",
  "API",
  "UI/UX Design",
]

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and dashes"),
  category: z.string().min(1, "Category is required"),
  client: z.string(),
  short_description: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Description is required"),
  challenge: z.string(),
  solution: z.string(),
  result: z.string(),
  project_url: z.string().url("Must be a valid URL").or(z.literal("")),
  demo_url: z.string().url("Must be a valid URL").or(z.literal("")),
  display_order: z.coerce
    .number()
    .int("Display order must be numeric")
    .min(0, "Display order must be a non-negative number"),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
})

const createDefaults = {
  title: "",
  slug: "",
  category: "Web App",
  client: "",
  short_description: "",
  description: "",
  challenge: "",
  solution: "",
  result: "",
  project_url: "",
  demo_url: "",
  display_order: 0,
  featured: false,
  status: "draft",
}

const inputClass =
  "w-full h-10 px-3.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"

const textareaClass = `${inputClass} h-auto py-2.5 resize-none`

function FieldError({ message }) {
  return message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null
}

function SectionLabel({ title }) {
  return (
    <h4 className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h4>
  )
}

export default function PortfolioForm({ defaultValues, onSubmit, onCancel, loading, submitLabel = "Save Project" }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues
      ? {
          ...createDefaults,
          ...defaultValues,
          challenge: defaultValues.challenge ?? "",
          solution: defaultValues.solution ?? "",
          result: defaultValues.result ?? "",
          client: defaultValues.client ?? "",
          project_url: defaultValues.project_url ?? "",
          demo_url: defaultValues.demo_url ?? "",
        }
      : createDefaults,
    mode: "onSubmit",
  })

  const title = watch("title")
  const featured = watch("featured")
  const status = watch("status")
  const cover = watch("cover_image_url") ?? ""
  const gallery = watch("gallery") ?? []
  const technologies = watch("technologies") ?? []

  const prevTitle = useRef(title)
  const slugTouched = useRef(false)

  useEffect(() => {
    if (prevTitle.current === title) return
    prevTitle.current = title
    if (!slugTouched.current) {
      setValue("slug", slugify(title))
    }
  }, [title, setValue])

  const onValid = (values) => {
    onSubmit({
      ...values,
      title: values.title.trim(),
      slug: values.slug.trim(),
      category: values.category.trim(),
      client: values.client?.trim() || null,
      short_description: values.short_description.trim(),
      description: values.description.trim(),
      challenge: values.challenge?.trim() || null,
      solution: values.solution?.trim() || null,
      result: values.result?.trim() || null,
      project_url: values.project_url?.trim() || null,
      demo_url: values.demo_url?.trim() || null,
      cover_image_url: cover.trim() || null,
      gallery,
      technologies: technologies.map((t) => t.trim()).filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-6">
      <div>
        <SectionLabel>Basic Information</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#0B1E3D] mb-2">
              Project Title
            </label>
            <input id="title" type="text" placeholder="e.g. FinFlow Platform" {...register("title")} className={inputClass} />
            <FieldError message={errors.title?.message} />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-[#0B1E3D] mb-2">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              placeholder="e.g. finflow-platform"
              {...register("slug", { onChange: () => (slugTouched.current = true) })}
              className={inputClass}
            />
            <FieldError message={errors.slug?.message} />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#0B1E3D] mb-2">
              Category
            </label>
            <input id="category" list="category-options" placeholder="e.g. Web App" {...register("category")} className={inputClass} />
            <datalist id="category-options">
              {categoryOptions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <FieldError message={errors.category?.message} />
          </div>

          <div>
            <label htmlFor="client" className="block text-sm font-medium text-[#0B1E3D] mb-2">
              Client <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input id="client" type="text" placeholder="e.g. FinFlow Ltd" {...register("client")} className={inputClass} />
            <FieldError message={errors.client?.message} />
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Description</SectionLabel>
        <div className="space-y-5">
          <div>
            <label htmlFor="short_description" className="block text-sm font-medium text-[#0B1E3D] mb-2">
              Short Description
            </label>
            <textarea
              id="short_description"
              rows="2"
              placeholder="A brief summary shown on cards"
              {...register("short_description")}
              className={textareaClass}
            />
            <FieldError message={errors.short_description?.message} />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#0B1E3D] mb-2">
              Full Description
            </label>
            <textarea
              id="description"
              rows="4"
              placeholder="An overview of the project for the detail page"
              {...register("description")}
              className={textareaClass}
            />
            <FieldError message={errors.description?.message} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="challenge" className="block text-sm font-medium text-[#0B1E3D] mb-2">
                The Challenge <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="challenge"
                rows="3"
                placeholder="What problem did the client face?"
                {...register("challenge")}
                className={textareaClass}
              />
              <FieldError message={errors.challenge?.message} />
            </div>
            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-[#0B1E3D] mb-2">
                Our Solution <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="solution"
                rows="3"
                placeholder="How did we solve it?"
                {...register("solution")}
                className={textareaClass}
              />
              <FieldError message={errors.solution?.message} />
            </div>
          </div>

          <div>
            <label htmlFor="result" className="block text-sm font-medium text-[#0B1E3D] mb-2">
              The Result <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="result"
              rows="2"
              placeholder="What outcomes did we deliver?"
              {...register("result")}
              className={textareaClass}
            />
            <FieldError message={errors.result?.message} />
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Media</SectionLabel>
        <div className="space-y-5">
          <ImageUploader
            label="Cover Image"
            value={cover}
            onChange={(url) => setValue("cover_image_url", url)}
            onUpload={uploadCoverImage}
            hint="PNG, JPG, WEBP or SVG up to 10 MB — recommended 1600×900 (16:9)"
            emptyNote="No cover image yet — the public site shows a brand gradient until one is uploaded."
          />
          <GalleryUploader
            value={gallery}
            onChange={(urls) => setValue("gallery", urls)}
            onUpload={uploadGalleryImage}
            hint="PNG, JPG or WEBP up to 10 MB each — recommended 1200×900 (4:3)"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <TechnologyTags value={technologies} onChange={(tags) => setValue("technologies", tags)} />
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

      <div>
        <SectionLabel>Links</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="project_url" className="block text-sm font-medium text-[#0B1E3D] mb-2">
              Project URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="project_url"
                type="url"
                placeholder="https://example.com"
                {...register("project_url")}
                className={`${inputClass} pl-10`}
              />
            </div>
            <FieldError message={errors.project_url?.message} />
          </div>
          <div>
            <label htmlFor="demo_url" className="block text-sm font-medium text-[#0B1E3D] mb-2">
              Demo URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <MonitorPlay className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="demo_url"
                type="url"
                placeholder="https://demo.example.com"
                {...register("demo_url")}
                className={`${inputClass} pl-10`}
              />
            </div>
            <FieldError message={errors.demo_url?.message} />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 items-start">
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
            <span className="text-sm text-gray-500">{featured ? "Shown in homepage highlights" : "Not featured"}</span>
          </div>
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
