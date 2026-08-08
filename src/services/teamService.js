// Team service wrapping the "team_members" table and the "team" storage bucket (photos/).
import { supabase } from "../lib/supabaseClient"
import { uploadImage, deleteImage } from "./storageService"

const TABLE = "team_members"
const BUCKET = "team"
const MAX_PHOTO_SIZE = 10 * 1024 * 1024

export { deleteImage }

function unwrap(result) {
  if (result.error) {
    throw new Error(result.error.message)
  }
  return result.data
}

export async function getTeamMembers() {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .order("display_order", { ascending: true })
      .order("full_name", { ascending: true })
  )
}

export async function getPublishedTeamMembers() {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("display_order", { ascending: true })
      .order("full_name", { ascending: true })
  )
}

export async function getFeaturedTeamMembers(limit = 6) {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .eq("status", "published")
      .eq("featured", true)
      .order("display_order", { ascending: true })
      .order("full_name", { ascending: true })
      .limit(limit)
  )
}

export async function getTeamMemberById(id) {
  return unwrap(await supabase.from(TABLE).select("*").eq("id", id).maybeSingle())
}

export async function createTeamMember(payload) {
  return unwrap(await supabase.from(TABLE).insert(payload).select().single())
}

export async function updateTeamMember(id, payload) {
  return unwrap(await supabase.from(TABLE).update(payload).eq("id", id).select().single())
}

export async function deleteTeamMember(id) {
  return unwrap(await supabase.from(TABLE).delete().eq("id", id))
}

// ------------------------------------------------------------
// Storage helpers (team bucket: photos/)
// ------------------------------------------------------------

export async function uploadPhoto(file, onProgress) {
  return uploadImage(file, BUCKET, "photos", onProgress, MAX_PHOTO_SIZE)
}

export async function deletePhoto(publicUrl) {
  return deleteImage(publicUrl, BUCKET)
}
