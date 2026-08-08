// Trusted companies service wrapping the "trusted_companies" table and the
// "trusted-companies" storage bucket (logos/).
import { supabase } from "../lib/supabaseClient"
import { uploadImage, deleteImage as removeImage } from "./storageService"

const TABLE = "trusted_companies"
const BUCKET = "trusted-companies"

/** Deletes a company logo from storage using the same name as the image helpers. */
export function deleteImage(publicUrl) {
  return removeImage(publicUrl, BUCKET)
}

function unwrap(result) {
  if (result.error) {
    throw new Error(result.error.message)
  }
  return result.data
}

/** All companies ordered by display_order (admin view). */
export async function getTrustedCompanies() {
  return unwrap(
    await supabase.from(TABLE).select("*").order("display_order", { ascending: true })
  )
}

/** Only published companies (public website). */
export async function getPublishedTrustedCompanies() {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true })
  )
}

/** Creates a trusted company record. */
export async function createTrustedCompany(payload) {
  return unwrap(await supabase.from(TABLE).insert(payload).select().single())
}

/** Updates a trusted company record. */
export async function updateTrustedCompany(id, payload) {
  return unwrap(await supabase.from(TABLE).update(payload).eq("id", id).select().single())
}

/** Deletes a trusted company record. */
export async function deleteTrustedCompany(id) {
  return unwrap(await supabase.from(TABLE).delete().eq("id", id))
}

/** Uploads a company logo into the "logos/" folder of the trusted-companies bucket. */
export async function uploadCompanyLogo(file, onProgress) {
  return uploadImage(file, BUCKET, "logos", onProgress)
}
