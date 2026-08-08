import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import { ExternalLink, Save, RefreshCw, RotateCcw, AlertTriangle, Loader2 } from "lucide-react"
import PageHeader from "../../components/dashboard/PageHeader"
import SettingsTabs from "../../components/dashboard/settings/SettingsTabs"
import GeneralSettings from "../../components/dashboard/settings/GeneralSettings"
import BrandingSettings from "../../components/dashboard/settings/BrandingSettings"
import ContactSettings from "../../components/dashboard/settings/ContactSettings"
import SocialSettings from "../../components/dashboard/settings/SocialSettings"
import SEOSettings from "../../components/dashboard/settings/SEOSettings"
import AppearanceSettings from "../../components/dashboard/settings/AppearanceSettings"
import FooterSettings from "../../components/dashboard/settings/FooterSettings"
import AdvancedSettings from "../../components/dashboard/settings/AdvancedSettings"
import WebsitePreview from "../../components/dashboard/settings/WebsitePreview"
import { useWebsiteSettings } from "../../hooks/useWebsiteSettings"
import { DEFAULT_SETTINGS, SETTINGS_FIELDS } from "../../services/settingsService"

// Dashboard page for managing global website settings (general, branding,
// contact, social, SEO, appearance, footer, advanced) with a live preview.
const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Enter a valid hex color like #2563EB")

// Validation rules for every editable setting field
const settingsSchema = z.object({
  company_name: z.string().optional(),
  company_tagline: z.string().optional(),
  company_description: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  google_maps_url: z.string().optional(),
  logo_url: z.string().optional(),
  favicon_url: z.string().optional(),
  primary_color: hexColor,
  secondary_color: hexColor,
  accent_color: hexColor,
  facebook_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  instagram_url: z.string().optional(),
  x_url: z.string().optional(),
  youtube_url: z.string().optional(),
  github_url: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  google_analytics_id: z.string().optional(),
  google_tag_manager_id: z.string().optional(),
  meta_image: z.string().optional(),
  maintenance_mode: z.boolean(),
  footer_text: z.string().optional(),
  copyright_text: z.string().optional(),
  business_hours: z.string().optional(),
  quick_links: z.array(z.object({ label: z.string(), to: z.string() })).optional(),
})

const initialValues = { ...DEFAULT_SETTINGS }

// Merge saved settings over the defaults, mapping nulls to empty values
function mapToForm(settings) {
  const values = { ...initialValues }
  SETTINGS_FIELDS.forEach((field) => {
    const value = settings[field]
    values[field] = value == null ? (Array.isArray(initialValues[field]) ? [] : "") : value
  })
  return values
}

export default function Settings() {
  const { settings, loading, error, update, refresh } = useWebsiteSettings()
  const [activeTab, setActiveTab] = useState("general")
  const [saving, setSaving] = useState(false)
  // Guards the one-time population of the form once settings load
  const loadedRef = useRef(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  })

  // Populate the form with the latest saved settings only once
  useEffect(() => {
    if (settings && !loadedRef.current) {
      loadedRef.current = true
      reset(mapToForm(settings))
    }
  }, [settings, reset])

  // Warn the user before leaving the page with unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isDirty])

  // Save the whole settings object, then reset the form to mark changes as saved
  const onSubmit = async (values) => {
    setSaving(true)
    try {
      await update(values)
      toast.success("Website settings saved successfully")
      reset(values)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Discard unsaved edits and restore the last saved settings
  const handleReset = () => {
    if (!settings) return
    reset(mapToForm(settings))
    toast("Reverted to the last saved settings")
  }

  const tabProps = { register, errors, watch, setValue }

  // Render the settings section for the active tab
  const renderTab = () => {
    switch (activeTab) {
      case "branding":
        return <BrandingSettings {...tabProps} />
      case "contact":
        return <ContactSettings {...tabProps} />
      case "social":
        return <SocialSettings {...tabProps} />
      case "seo":
        return <SEOSettings {...tabProps} />
      case "appearance":
        return <AppearanceSettings {...tabProps} />
      case "footer":
        return <FooterSettings {...tabProps} />
      case "advanced":
        return <AdvancedSettings {...tabProps} />
      default:
        return <GeneralSettings {...tabProps} />
    }
  }

  return (
    <div className="space-y-6 2xl:space-y-8">
      <PageHeader
        title="Website Settings"
        breadcrumbItems={[{ label: "Dashboard", to: "/dashboard" }]}
        breadcrumbCurrent="Website Settings"
        description="Manage your website content, branding, SEO, and global configuration."
        action={{ label: "View Website", icon: ExternalLink, to: "/" }}
      />

      {loading ? (
        <div className="space-y-4">
          <div className="h-12 bg-gray-100/80 rounded-2xl animate-pulse" />
          <div className="h-96 bg-gray-100/80 rounded-2xl animate-pulse" />
        </div>
      ) : error && !settings ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#0057D9] text-white rounded-xl hover:bg-[#004ab8] transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      ) : (
        <>
          <AnimatePresence>
            {isDirty && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                <p className="text-sm text-amber-700 flex-1">
                  You have unsaved changes. Changes are not saved automatically — click Save Changes to apply them.
                </p>
                <button
                  type="button"
                  onClick={() => reset(mapToForm(settings))}
                  className="text-xs font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900"
                >
                  Discard
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <SettingsTabs active={activeTab} onChange={setActiveTab} />

          <div className="grid gap-6 xl:grid-cols-[1fr_320px] 2xl:grid-cols-[1fr_400px] items-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="min-w-0"
              >
                {renderTab()}
              </motion.div>
            </AnimatePresence>

            <aside className="hidden xl:block sticky top-6">
              <WebsitePreview watch={watch} />
            </aside>
          </div>

          <div className="sticky bottom-4 z-10 flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-gray-100 bg-white/95 backdrop-blur p-4 shadow-lg shadow-gray-900/5">
            <p className="flex-1 text-xs text-gray-400 text-center sm:text-left">
              {isDirty
                ? "You have unsaved changes. Changes are not saved automatically."
                : "All changes are saved. They go live on the public website immediately."}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={!isDirty || saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0B1E3D] bg-white border border-gray-200 rounded-xl hover:border-[#0057D9] hover:text-[#0057D9] transition-all duration-200 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Changes
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={!isDirty || saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0057D9] rounded-xl shadow-lg shadow-[#0057D9]/20 hover:bg-[#004ab8] transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
