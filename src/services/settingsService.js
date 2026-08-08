// Settings service wrapping the singleton "website_settings" row (fixed ROW_ID)
// and the "website-assets" storage bucket (logo / favicon / SEO image).
import { supabase } from "../lib/supabaseClient"
import { uploadImage, deleteImage } from "./storageService"

const TABLE = "website_settings"
const BUCKET = "website-assets"
const ROW_ID = "00000000-0000-0000-0000-000000000001"
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

// Brand color fallbacks used whenever a color is not set in the database.
export const DEFAULT_COLORS = {
  primary_color: "#2563EB",
  secondary_color: "#0F172A",
  accent_color: "#FF8C00",
}

export const DEFAULT_SETTINGS = {
  company_name: "UNUG Solutions",
  company_tagline: "Engineering Digital Solutions",
  company_description:
    "Engineering Digital Solutions for a Smarter Tomorrow. We build modern websites, software, and platforms that drive business growth.",
  mission:
    "To empower businesses and organizations through innovative, reliable, and scalable digital solutions that solve real-world challenges and create lasting value.",
  vision:
    "To become one of the leading software engineering and digital transformation companies in Somaliland and East Africa, recognized for innovation, quality, and customer success.",
  email: "unugsolutions@gmail.com",
  phone: "+252 63 837 4348",
  whatsapp: "https://web.whatsapp.com/",
  website: "",
  address: "",
  city: "Hargeisa",
  country: "Somaliland",
  google_maps_url: "",
  logo_url: "",
  favicon_url: "",
  primary_color: DEFAULT_COLORS.primary_color,
  secondary_color: DEFAULT_COLORS.secondary_color,
  accent_color: DEFAULT_COLORS.accent_color,
  facebook_url: "",
  linkedin_url: "",
  instagram_url: "",
  x_url: "",
  youtube_url: "",
  github_url: "",
  seo_title: "UNUG Solutions | Engineering Digital Solutions",
  seo_description:
    "UNUG Solutions is a software engineering and digital solutions company. We build modern websites, custom software, mobile apps, and digital platforms that drive business growth.",
  seo_keywords: "software development, web development, mobile apps, UI/UX design, digital solutions, UNUG, Somaliland",
  google_analytics_id: "",
  google_tag_manager_id: "",
  meta_image: "",
  maintenance_mode: false,
  footer_text: "Engineering Digital Solutions for a Smarter Tomorrow.",
  copyright_text: "All rights reserved.",
  business_hours: "Monday – Saturday: 9:00 AM – 6:00 PM",
  quick_links: [],
}

function unwrap(result) {
  if (result.error) {
    throw new Error(result.error.message)
  }
  return result.data
}

/** Fetches the single website settings row (falls back to maybeSingle, i.e. null if missing). */
export async function getSettings() {
  return unwrap(await supabase.from(TABLE).select("*").eq("id", ROW_ID).maybeSingle())
}

/** Persists settings changes, stripping empty quick-link entries before saving. */
export async function updateSettings(payload) {
  const clean = { ...payload }
  if (Array.isArray(clean.quick_links)) {
    clean.quick_links = clean.quick_links.filter((l) => l && (l.label || "").trim() !== "")
  }
  return unwrap(await supabase.from(TABLE).update(clean).eq("id", ROW_ID).select().single())
}

export async function uploadLogo(file, onProgress) {
  return uploadImage(file, BUCKET, "logo", onProgress, MAX_IMAGE_SIZE)
}

export async function uploadFavicon(file, onProgress) {
  return uploadImage(file, BUCKET, "favicon", onProgress, MAX_IMAGE_SIZE)
}

export async function uploadSEOImage(file, onProgress) {
  return uploadImage(file, BUCKET, "seo", onProgress, MAX_IMAGE_SIZE)
}

export async function deleteAsset(publicUrl) {
  return deleteImage(publicUrl, BUCKET)
}

/** Converts a hex color like "#2563EB" into "37 99 235" (used for rgba() in SEO/theme). */
export function hexToRgbTriplet(hex) {
  if (!hex) return null
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!match) return null
  return `${parseInt(match[1], 16)} ${parseInt(match[2], 16)} ${parseInt(match[3], 16)}`
}

// Complete list of editable settings keys; drives form generation and update payloads.
export const SETTINGS_FIELDS = [
  "company_name",
  "company_tagline",
  "company_description",
  "mission",
  "vision",
  "email",
  "phone",
  "whatsapp",
  "website",
  "address",
  "city",
  "country",
  "google_maps_url",
  "logo_url",
  "favicon_url",
  "primary_color",
  "secondary_color",
  "accent_color",
  "facebook_url",
  "linkedin_url",
  "instagram_url",
  "x_url",
  "youtube_url",
  "github_url",
  "seo_title",
  "seo_description",
  "seo_keywords",
  "google_analytics_id",
  "google_tag_manager_id",
  "meta_image",
  "maintenance_mode",
  "footer_text",
  "copyright_text",
  "business_hours",
  "quick_links",
]
