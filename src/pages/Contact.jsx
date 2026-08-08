import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { Loader2, Send } from "lucide-react"
import { createMessage } from "../services/contactService"
import { usePublicWebsiteSettings } from "../hooks/useWebsiteSettings"

// Contact page — contact info cards, WhatsApp CTA, and a validated message form.
// Zod schema for the contact form. Phone allows 7-20 chars of digits and common separators.
const contactSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  company: z.string().optional(),
  email: z.string().min(1, "Email address is required").email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+()\-.\s\d]{7,20}$/, "Enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

const defaults = {
  full_name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
}

// Shared styles for form inputs/selects.
const inputClass =
  "w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder:text-[#94A3B8]"

// Renders an inline validation error message beneath a field, if present.
function FieldError({ message }) {
  return message ? <p className="mt-1.5 text-xs text-red-500">{message}</p> : null
}

/**
 * Public contact page.
 * Combines a validated contact form with contact details pulled from website settings.
 */
function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  // Load public contact details (email, phone, address, WhatsApp) from settings.
  const { settings } = usePublicWebsiteSettings()
  // Wire react-hook-form to the Zod schema for validation on submit.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contactSchema), defaultValues: defaults, mode: "onSubmit" })

  const companyName = settings?.company_name || "UNUG"
  const email = settings?.email || "unugsolutions@gmail.com"
  const phone = settings?.phone || "+252 63 837 4348"
  const address =
    settings?.address || [settings?.city, settings?.country].filter(Boolean).join(", ") || "Hargeisa, Somaliland"
  const whatsapp = settings?.whatsapp || ""

  // Submit handler: persists the message via the contact RPC, then resets the form.
  const onValid = async (values) => {
    setSubmitting(true)
    try {
      await createMessage({
        full_name: values.full_name.trim(),
        company: values.company?.trim() || null,
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
      })
      reset()
      setSubmitted(true)
      toast.success("Message sent successfully")
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
              CONTACT US
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#0F172A] leading-tight mb-4">
              Let's Build Something Great Together
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Have a project in mind? We'd love to hear from you. Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]/60">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-lg">📧</span>
                  <div>
                    <div className="text-sm font-heading font-bold text-[#0F172A]">Email</div>
                    <div className="text-xs text-[#2563EB]">{email}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]/60">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-lg">📞</span>
                  <div>
                    <div className="text-sm font-heading font-bold text-[#0F172A]">Phone</div>
                    <div className="text-xs text-[#2563EB]">{phone}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]/60">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-lg">📍</span>
                  <div>
                    <div className="text-sm font-heading font-bold text-[#0F172A]">Location</div>
                    <div className="text-xs text-[#64748B]">{address}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-xl p-6 text-white">
                <div className="text-sm font-heading font-bold mb-2">Prefer to talk?</div>
                <p className="text-xs text-white/80 leading-relaxed mb-4">Schedule a free consultation call with our team to discuss your project.</p>
                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                ) : (
                  <Link to="/contact" className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                    Book a Call
                  </Link>
                )}
              </div>
            </div>
            <div className="md:col-span-3">
              {submitted ? (
                <div className="bg-white rounded-xl p-10 shadow-sm border border-[#E5E7EB]/60 text-center">
                  <span className="text-4xl mb-4 block">✅</span>
                  <h3 className="text-xl font-heading font-bold text-[#0F172A] mb-2">Message Sent!</h3>
                  <p className="text-sm text-[#64748B] mb-6">
                    Thank you for contacting {companyName}. We will get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      reset()
                    }}
                    className="text-sm font-semibold text-[#2563EB] hover:underline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onValid)} className="bg-white rounded-xl p-8 shadow-sm border border-[#E5E7EB]/60">
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="full_name" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input id="full_name" type="text" placeholder="Your name" {...register("full_name")} className={inputClass} />
                      <FieldError message={errors.full_name?.message} />
                    </div>
                    <div>
                      <label htmlFor="company" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                        Company <span className="text-[#94A3B8] font-normal">(optional)</span>
                      </label>
                      <input id="company" type="text" placeholder="Company name" {...register("company")} className={inputClass} />
                      <FieldError message={errors.company?.message} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
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
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="text-xs font-semibold text-[#0F172A] mb-1.5 block">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea id="message" rows={4} placeholder="Tell us about your project, goals, and timeline..." {...register("message")} className={`${inputClass} resize-none`} />
                    <FieldError message={errors.message?.message} />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-[#0F172A] text-white hover:bg-[#1e293b] shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
