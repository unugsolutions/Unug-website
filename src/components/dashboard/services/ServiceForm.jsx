import { useEffect, useRef } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Save, X, Loader2, CheckCircle, Circle } from "lucide-react"
import { slugify } from "../../../services/serviceService"
import { serviceIconNames } from "../../../lib/serviceIcons"
import FeatureInput from "./FeatureInput"

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and dashes"),
  short_description: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  image_url: z.string().url("Must be a valid URL").or(z.literal("")),
  features: z.array(z.string()),
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
  short_description: "",
  description: "",
  icon: "Globe",
  image_url: "",
  features: [""],
  display_order: 0,
  featured: false,
  status: "draft",
}

const inputClass =
  "w-full h-10 px-3.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"

function FieldError({ message }) {
  return message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null
}

export default function ServiceForm({ defaultValues, onSubmit, onCancel, loading, submitLabel = "Save Service" }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: defaultValues
      ? { ...createDefaults, ...defaultValues, features: defaultValues.features ?? [""] }
      : createDefaults,
    mode: "onSubmit",
  })

  const { fields, append, remove } = useFieldArray({ control, name: "features" })

  const title = watch("title")
  const featured = watch("featured")
  const status = watch("status")

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
      short_description: values.short_description.trim(),
      description: values.description.trim(),
      image_url: values.image_url?.trim() || null,
      features: values.features.map((f) => f.trim()).filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#0B1E3D] mb-2">
            Service Title
          </label>
          <input id="title" type="text" placeholder="e.g. Web Development" {...register("title")} className={inputClass} />
          <FieldError message={errors.title?.message} />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-[#0B1E3D] mb-2">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            placeholder="e.g. web-development"
            {...register("slug", { onChange: () => (slugTouched.current = true) })}
            className={inputClass}
          />
          <FieldError message={errors.slug?.message} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-[#0B1E3D] mb-2">
            Icon
          </label>
          <select id="icon" {...register("icon")} className={inputClass}>
            {serviceIconNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <FieldError message={errors.icon?.message} />
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

      <div>
        <label htmlFor="short_description" className="block text-sm font-medium text-[#0B1E3D] mb-2">
          Short Description
        </label>
        <textarea
          id="short_description"
          rows="3"
          placeholder="A brief summary shown on cards"
          {...register("short_description")}
          className={`${inputClass} h-auto py-2.5 resize-none`}
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
          placeholder="A detailed description of the service"
          {...register("description")}
          className={`${inputClass} h-auto py-2.5 resize-none`}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-[#0B1E3D] mb-2">
          Image URL <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input id="image_url" type="url" placeholder="https://..." {...register("image_url")} className={inputClass} />
        <FieldError message={errors.image_url?.message} />
      </div>

      <FeatureInput fields={fields} register={register} append={append} remove={remove} />

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
            <span className="text-sm text-gray-500">{featured ? "Highlighted on the homepage" : "Not featured"}</span>
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
