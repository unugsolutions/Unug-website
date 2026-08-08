// Portfolio service wrapping the "portfolio" table (projects) and the "portfolio"
// storage bucket (cover-images/ and gallery/ folders).
import { supabase } from "../lib/supabaseClient"
import { slugify } from "./serviceService"
import { uploadImage, deleteImage } from "./storageService"

const TABLE = "portfolio"
const BUCKET = "portfolio"

export { slugify, deleteImage }

/**
 * Shared helper: unwraps a Supabase result, throwing the error message when present.
 * @param {{data: *, error: *}} result - A Supabase query result.
 * @returns {*} The data payload.
 */
function unwrap(result) {
  if (result.error) {
    throw new Error(result.error.message)
  }
  return result.data
}

/**
 * Fetches all portfolio projects ordered by display_order.
 * @returns {Promise<Array<object>>} List of project rows.
 */
export async function getProjects() {
  return unwrap(
    await supabase.from(TABLE).select("*").order("display_order", { ascending: true })
  )
}

/**
 * Fetches only published projects (public site).
 * @returns {Promise<Array<object>>} List of published project rows.
 */
export async function getPublishedProjects() {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true })
  )
}

/**
 * Fetches featured, published projects for the homepage.
 * @param {number} [limit=6] - Maximum number of projects to return.
 * @returns {Promise<Array<object>>} List of featured project rows.
 */
export async function getFeaturedProjects(limit = 6) {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .eq("status", "published")
      .eq("featured", true)
      .order("display_order", { ascending: true })
      .limit(limit)
  )
}

/**
 * Fetches a single project by id.
 * @param {string} id - Project id (UUID).
 * @returns {Promise<object|null>} The project row or null.
 */
export async function getProjectById(id) {
  return unwrap(await supabase.from(TABLE).select("*").eq("id", id).maybeSingle())
}

/**
 * Fetches a single project by its URL slug.
 * @param {string} slug - URL-friendly project slug.
 * @returns {Promise<object|null>} The project row or null.
 */
export async function getProjectBySlug(slug) {
  return unwrap(await supabase.from(TABLE).select("*").eq("slug", slug).maybeSingle())
}

/**
 * Inserts a new portfolio project.
 * @param {object} payload - Project fields (title, description, cover_image, ...).
 * @returns {Promise<object>} The created row.
 */
export async function createProject(payload) {
  return unwrap(await supabase.from(TABLE).insert(payload).select().single())
}

/**
 * Updates a portfolio project.
 * @param {string} id - Project id (UUID).
 * @param {object} payload - Fields to update.
 * @returns {Promise<object>} The updated row.
 */
export async function updateProject(id, payload) {
  return unwrap(await supabase.from(TABLE).update(payload).eq("id", id).select().single())
}

/**
 * Deletes a portfolio project (does not remove its storage images).
 * @param {string} id - Project id (UUID).
 * @returns {Promise<object>} The deleted rows (empty when none matched).
 */
export async function deleteProject(id) {
  return unwrap(await supabase.from(TABLE).delete().eq("id", id))
}

// ------------------------------------------------------------
// Storage helpers (portfolio bucket: cover-images/ and gallery/)
// ------------------------------------------------------------

/**
 * Uploads a project cover image into the portfolio bucket.
 * @param {File} file - The image file.
 * @param {(number) => void} [onProgress] - Optional 0-100 upload progress callback.
 * @returns {Promise<string>} Public URL of the uploaded image.
 */
export async function uploadCoverImage(file, onProgress) {
  return uploadImage(file, BUCKET, "cover-images", onProgress)
}

/**
 * Uploads a project gallery image into the portfolio bucket.
 * @param {File} file - The image file.
 * @param {(number) => void} [onProgress] - Optional 0-100 upload progress callback.
 * @returns {Promise<string>} Public URL of the uploaded image.
 */
export async function uploadGalleryImage(file, onProgress) {
  return uploadImage(file, BUCKET, "gallery", onProgress)
}
