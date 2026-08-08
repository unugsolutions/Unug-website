import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Save, X, Loader2, CheckCircle, Circle } from "lucide-react"
import { uploadPhoto } from "../../../services/testimonialService"
import PhotoUploader from "./PhotoUploader"
import RatingStars from "./RatingStars"

const testimonialSchema = z.object({
  client_name: z.string().min(1, "Client name is required"),
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  email: z.string().email("Enter a valid email address").or(z.literal("")),
  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Select a rating from 1 to 5")
    .max(5, "Rating cannot exceed 5"),
  testimonial: z.string().min(10, "Testimonial must be at least 10 characters"),
  display_order: z.coerce
    .number()
    .int("Display order must be numeric")
    .min(0, "Display order must be a non-negative number"),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
})

const createDefaults = {
  client_name: "",
  position: "",
  company: "",
  email: "",
  rating: 5,
  testimonial: "",
  display_order: 0,
  featured: false,
  status: "draft",
}

const inputClass =
  "w-full h-10 px-3.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"

function FieldError({ message }) {
  return message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null
}

export default function TestimonialForm({ defaultValues, onSubmit, onCancel, loading, submitLabel = "Save Testimonial" }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: defaultValues
      ? { ...createDefaults, ...defaultValues, email: defaultValues.email ?? "", photo_url: defaultValues.photo_url ?? "" }
      : createDefaults,
    mode: "onSubmit",
  })

  const featured = watch("featured")
  const status = watch("status")
  const rating = watch("rating")
  const photo = watch("photo_url") ?? ""

  const onValid = (values) => {
    onSubmit({
      ...values,
      client_name: values.client_name.trim(),
      position: values.position.trim(),
      company: values.company.trim(),
      email: values.email?.trim() || null,
      testimonial: values.testimonial.trim(),
      photo_url: photo.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="client_name" className="block text-sm font-medium text-[#0B1E3D] mb-2">
            Client Name
          </label>
          <input id="client_name" type="text" placeholder="e.g. Amina Hassan" {...register("client_name")} className={inputClass} />
          <FieldError message={errors.client_name?.message} />
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-[#0B1E3D] mb-2">
            Position
          </label>
          <input id="position" type="text" placeholder="e.g. Operations Director" {...register("position")} className={inputClass} />
          <FieldError message={errors.position?.message} />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-[#0B1E3D] mb-2">
            Company
          </label>
          <input id="company" type="text" placeholder="e.g. Barwaaqo Group" {...register("company")} className={inputClass} />
          <FieldError message={errors.company?.message} />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#0B1E3D] mb-2">
            Email <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input id="email" type="email" placeholder="client@company.com" {...register("email")} className={inputClass} />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <PhotoUploader
        value={photo}
        onChange={(url) => setValue("photo_url", url)}
        onUpload={uploadPhoto}
      />

      <div>
        <span className="block text-sm font-medium text-[#0B1E3D] mb-2">
          Rating
        </span>
        <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-xl">
          <RatingStars value={rating} onChange={(r) => setValue("rating", r)} size="lg" />
          <span className="text-sm font-semibold text-[#0B1E3D]">{rating} / 5</span>
        </div>
        <FieldError message={errors.rating?.message} />
      </div>

      <div>
        <label htmlFor="testimonial" className="block text-sm font-medium text-[#0B1E3D] mb-2">
          Testimonial
        </label>
        <textarea
          id="testimonial"
          rows="4"
          placeholder="What did the client say about working with you?"
          {...register("testimonial")}
          className={`${inputClass} h-auto py-2.5 resize-none`}
        />
        <FieldError message={errors.testimonial?.message} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
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
