// Storage service: shared helpers for public + authenticated Supabase Storage uploads.
import { supabase } from "../lib/supabaseClient"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const MAX_SIZE = 10 * 1024 * 1024

/** Builds the public object URL for a file in a bucket (e.g. bucket/folder/name.ext). */
export function getPublicUrl(bucket, path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}

/** Extracts the bucket-relative path from a public URL, or null if it doesn't belong to this bucket. */
function objectPathFromUrl(bucket, publicUrl) {
  const marker = `/storage/v1/object/public/${bucket}/`
  const index = publicUrl.indexOf(marker)
  return index === -1 ? null : publicUrl.slice(index + marker.length)
}

/** Validates that a selected file is an image and within the size limit; throws otherwise. */
export function assertValidImage(file, maxSize = MAX_SIZE) {
  if (!file) throw new Error("No file selected")
  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed (PNG, JPG, WEBP, GIF, SVG, AVIF)")
  }
  if (file.size > maxSize) {
    throw new Error(`Image must be smaller than ${Math.round(maxSize / 1024 / 1024)} MB`)
  }
}

/** Validates size and an optional allow-list of MIME types (supports wildcards like "image/*"). */
export function assertValidFile(file, maxSize = MAX_SIZE, allowedMimeTypes = null) {
  if (!file) throw new Error("No file selected")
  if (file.size > maxSize) {
    throw new Error(`File must be smaller than ${Math.round(maxSize / 1024 / 1024)} MB`)
  }
  if (!allowedMimeTypes || allowedMimeTypes.length === 0) return
  const type = (file.type || "").toLowerCase()
  const allowed = allowedMimeTypes.some(
    (m) => m === "*/*" || m === type || (m.endsWith("/*") && type.startsWith(m.slice(0, -1)))
  )
  if (!allowed) {
    throw new Error("This file type is not supported")
  }
}

/** Uploads a file as the current (possibly anonymous) user and returns its public URL. */
export async function uploadPublicFile(file, bucket, folder, maxSize = MAX_SIZE, allowedMimeTypes = null) {
  assertValidFile(file, maxSize, allowedMimeTypes)

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin"
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "3600",
    upsert: false,
  })
  if (error) throw new Error(error.message)

  return getPublicUrl(bucket, path)
}

/**
 * Uploads an image using the signed-in user's token with XHR (enables upload progress).
 * Requires an authenticated session.
 */
export async function uploadImage(file, bucket, folder, onProgress, maxSize = MAX_SIZE) {
  assertValidImage(file, maxSize)

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg"
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  if (!token) throw new Error("You must be signed in to upload images.")

  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", uploadUrl)
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream")
    xhr.setRequestHeader("cache-control", "3600")
    xhr.setRequestHeader("x-upsert", "false")

    if (typeof onProgress === "function") {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        let message = `Upload failed (${xhr.status})`
        try {
          const body = JSON.parse(xhr.responseText)
          message = body?.message || body?.error || message
        } catch {
          // keep the generic message
        }
        reject(new Error(message))
      }
    }

    xhr.onerror = () => reject(new Error("Upload failed. Please check your connection and try again."))
    xhr.send(file)
  })

  return getPublicUrl(bucket, path)
}

/** Removes a file by its public URL (no-op if the URL doesn't map to this bucket). */
export async function deleteImage(publicUrl, bucket) {
  const path = objectPathFromUrl(bucket, publicUrl)
  if (!path) return
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw new Error(error.message)
}
