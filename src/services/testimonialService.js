// Testimonials service wrapping the "testimonials" table and the "testimonials" bucket (photos/).
import { supabase } from "../lib/supabaseClient"
import { uploadImage, deleteImage } from "./storageService"

const TABLE = "testimonials"
const BUCKET = "testimonials"

export { deleteImage }

function unwrap(result) {
  if (result.error) {
    throw new Error(result.error.message)
  }
  return result.data
}

export async function getTestimonials() {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })
  )
}

export async function getPublishedTestimonials() {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })
  )
}

export async function getFeaturedTestimonials(limit = 3) {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .eq("status", "published")
      .eq("featured", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(limit)
  )
}

export async function getTestimonialById(id) {
  return unwrap(await supabase.from(TABLE).select("*").eq("id", id).maybeSingle())
}

export async function createTestimonial(payload) {
  return unwrap(await supabase.from(TABLE).insert(payload).select().single())
}

export async function updateTestimonial(id, payload) {
  return unwrap(await supabase.from(TABLE).update(payload).eq("id", id).select().single())
}

export async function deleteTestimonial(id) {
  return unwrap(await supabase.from(TABLE).delete().eq("id", id))
}

// ------------------------------------------------------------
// Storage helpers (testimonials bucket: photos/)
// ------------------------------------------------------------

export async function uploadPhoto(file, onProgress) {
  return uploadImage(file, BUCKET, "photos", onProgress, 5 * 1024 * 1024)
}

export async function deletePhoto(publicUrl) {
  return deleteImage(publicUrl, BUCKET)
}
