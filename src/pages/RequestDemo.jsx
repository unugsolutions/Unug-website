import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { Loader2, Send, RotateCcw, BadgeCheck } from "lucide-react"
import { createQuote } from "../services/quoteService"

// Dropdown option lists for the demo request form.
const serviceOptions = [
  "Web Development",
  "Software Development",
  "Mobile App",
  "UI/UX Design",
  "IT Consulting",
  "Cloud Solutions",
  "Other",
]

const projectTypeOptions = [
  "New Project",
  "Website Redesign",
  "E-commerce",
  "Mobile App",
  "Custom Software",
  "Integration",
  "Other",
]

const timelineOptions = ["1-2 weeks", "2-4 weeks", "1-2 months", "2-3 months", "3+ months", "Flexible"]

// Zod schema for the demo request form (required fields, email/phone formats, min lengths).
const demoRequestSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  company: z.string().optional(),
  email: z.string().min(1, "Email address is required").email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+()\-.\s\d]{7,20}$/, "Enter a valid phone number"),
  country: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  project_type: z.string().min(1, "Please select a project type"),
  project_title: z.string().min(1, "Project title is required"),
  project_description: z.string().min(20, "Project description must be at least 20 characters"),
  timeline: z.string().min(1, "Please select a timeline"),
})

const defaults = {
  full_name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  service: "",
  project_type: "",
  project_title: "",
  project_description: "",
  timeline: "",
}

const inputClass =
  "w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder:text-[#94A3B8] bg-white"

// Renders an inline validation error message beneath a field, if present.
function FieldError({ message }) {
  return message ? <p className="mt-1.5 text-xs text-red-500">{message}</p> : null
}

// Wraps a logical grouping of form fields with a title and optional subtitle.
function FormSection({ title, subtitle, children }) {
  return (
    <div className="border-t border-[#E5E7EB]/60 pt-6">
      <h3 className="text-base font-heading font-bold text-[#0F172A] mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-[#64748B] mb-4">{subtitle}</p>}
      {children}
    </div>
  )
}

/**
 * Demo request page.
 * Multi-field form validated with Zod + react-hook-form; on success it shows a
 * reference number returned by the quote RPC.
 */
function RequestDemo() {
  const [submitted, setSubmitted] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  // react-hook-form wired to the Zod schema; validation runs on submit.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(demoRequestSchema), defaultValues: defaults, mode: "onSubmit" })

  // Submit handler: creates a quote via the RPC, stores the returned reference number.
  const onValid = async (values) => {
    setSubmitting(true)
    try {
      const reference = await createQuote({
        full_name: values.full_name.trim(),
        company: values.company?.trim() || "",
        email: values.email.trim(),
        phone: values.phone.trim(),
        country: values.country?.trim() || "",
        service: values.service,
        project_type: values.project_type,
        project_title: values.project_title.trim(),
        project_description: values.project_description.trim(),
        timeline: values.timeline,
      })
      reset()
      setSubmitted(reference)
      toast.success("Demo request submitted")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="overflow-hidden">
      <section className="pt-24 pb-20 md:pt-28 md:pb-28 relative overflow-hidden bg-gradient-hero">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-primary/[0.04] via-sky/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center bg-[#EFF6FF] text-[#2563EB] text-sm font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
              REQUEST A DEMO
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#0F172A] leading-tight mb-4">
              Get a Custom Demo
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Tell us about your project and our team will prepare a detailed demo tailored to your requirements.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-xl p-10 shadow-sm border border-[#E5E7EB]/60 text-center">
              <span className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                <BadgeCheck className="w-7 h-7 text-emerald-500" />
              </span>
              <h3 className="text-xl font-heading font-bold text-[#0F172A] mb-2">Request Submitted!</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Thank you for requesting a demo. Our team will review your requirements and contact you within 24–48 hours.
              </p>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] bg-[#EFF6FF] px-4 py-2 rounded-lg mb-8">
                Your reference number: <span className="font-bold">{submitted}</span>
              </p>
              <div>
                <button
                  onClick={() => {
                    setSubmitted(null)
                    reset()
                  }}
                  className="text-sm font-semibold text-[#2563EB] hover:underline"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onValid)} className="bg-white rounded-xl p-8 shadow-sm border border-[#E5E7EB]/60">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="full_name" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input id="full_name" type="text" placeholder="Your name" {...register("full_name")} className={inputClass} />
                  <FieldError message={errors.full_name?.message} />
                </div>
                <div>
                  <label htmlFor="company" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                    Company
                  </label>
                  <input id="company" type="text" placeholder="Company name" {...register("company")} className={inputClass} />
                  <FieldError message={errors.company?.message} />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input id="email" type="email" placeholder="you@example.com" {...register("email")} className={inputClass} />
                  <FieldError message={errors.email?.message} />
                </div>
                <div>
                  <label htmlFor="phone" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input id="phone" type="tel" placeholder="063327****" {...register("phone")} className={inputClass} />
                  <FieldError message={errors.phone?.message} />
                </div>
                <div>
                  <label htmlFor="country" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                    Country
                  </label>
                  <input id="country" type="text" placeholder="Your country" {...register("country")} className={inputClass} />
                  <FieldError message={errors.country?.message} />
                </div>
              </div>

              <FormSection title="Project Information">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="service" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                      Service Required <span className="text-red-500">*</span>
                    </label>
                    <select id="service" {...register("service")} className={inputClass}>
                      <option value="">Select a service</option>
                      {serviceOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <FieldError message={errors.service?.message} />
                  </div>
                  <div>
                    <label htmlFor="project_type" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                      Project Type <span className="text-red-500">*</span>
                    </label>
                    <select id="project_type" {...register("project_type")} className={inputClass}>
                      <option value="">Select a project type</option>
                      {projectTypeOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <FieldError message={errors.project_type?.message} />
                  </div>
                  <div>
                    <label htmlFor="project_title" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input id="project_title" type="text" placeholder="e.g. Company E-commerce Website" {...register("project_title")} className={inputClass} />
                    <FieldError message={errors.project_title?.message} />
                  </div>
                  <div>
                    <label htmlFor="timeline" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                      Timeline <span className="text-red-500">*</span>
                    </label>
                    <select id="timeline" {...register("timeline")} className={inputClass}>
                      <option value="">Select a timeline</option>
                      {timelineOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <FieldError message={errors.timeline?.message} />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="project_description" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="project_description"
                    rows={4}
                    placeholder="Describe your project, goals, features, and any requirements..."
                    {...register("project_description")}
                    className={`${inputClass} resize-none`}
                  />
                  <FieldError message={errors.project_description?.message} />
                </div>
              </FormSection>

              <div className="flex flex-col sm:flex-row gap-3 pt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 flex-1 text-sm font-semibold px-6 py-3 rounded-xl bg-[#0F172A] text-white hover:bg-[#1e293b] shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
                <button
                  type="button"
                  onClick={() => reset()}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 flex-1 text-sm font-semibold px-6 py-3 rounded-xl border border-[#E5E7EB] text-[#0F172A] hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

export default RequestDemo
