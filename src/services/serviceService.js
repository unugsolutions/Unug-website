// Service catalog service wrapping the "services" table (services & featured services).
// Also exports slugify(), shared with portfolio for generating URL slugs.
import { supabase } from "../lib/supabaseClient"

const TABLE = "services"

/**
 * Converts arbitrary text into a URL-safe slug (e.g. "Web Design" -> "web-design").
 * @param {string} [text=""] - The text to slugify.
 * @returns {string} Lowercased, trimmed slug with non-alphanumeric runs replaced by "-".
 */
export function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

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
 * Fetches all services ordered by display_order.
 * @returns {Promise<Array<object>>} List of service rows.
 */
export async function getServices() {
  return unwrap(
    await supabase.from(TABLE).select("*").order("display_order", { ascending: true })
  )
}

/**
 * Fetches only published services (public site).
 * @returns {Promise<Array<object>>} List of published service rows.
 */
export async function getPublishedServices() {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true })
  )
}

/**
 * Fetches a single service by id.
 * @param {string} id - Service id (UUID).
 * @returns {Promise<object|null>} The service row or null.
 */
export async function getServiceById(id) {
  return unwrap(await supabase.from(TABLE).select("*").eq("id", id).maybeSingle())
}

/**
 * Inserts a new service.
 * @param {object} payload - Service fields (title, slug, description, ...).
 * @returns {Promise<object>} The created row.
 */
export async function createService(payload) {
  return unwrap(await supabase.from(TABLE).insert(payload).select().single())
}

/**
 * Updates a service.
 * @param {string} id - Service id (UUID).
 * @param {object} payload - Fields to update.
 * @returns {Promise<object>} The updated row.
 */
export async function updateService(id, payload) {
  return unwrap(await supabase.from(TABLE).update(payload).eq("id", id).select().single())
}

/**
 * Deletes a service.
 * @param {string} id - Service id (UUID).
 * @returns {Promise<object>} The deleted rows (empty when none matched).
 */
export async function deleteService(id) {
  return unwrap(await supabase.from(TABLE).delete().eq("id", id))
}
