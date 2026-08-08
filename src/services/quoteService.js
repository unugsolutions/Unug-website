// Quote service wrapping the "quote_requests" table plus the "quote-attachments"
// storage bucket. Public submissions go through the "submit_quote_request" RPC
// so rows can be inserted without exposing the table to anonymous RLS.
import { supabase } from "../lib/supabaseClient"
import { uploadPublicFile, deleteImage } from "./storageService"

const TABLE = "quote_requests"
const BUCKET = "quote-attachments"
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024

// Attachment MIME types accepted on the public quote form; uploads are validated
// against this list in storageService.uploadPublicFile.
const ALLOWED_ATTACHMENT_TYPES = [
  "image/*",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "text/plain",
  "text/csv",
]

export { deleteImage }

// Fixed enum options used to drive admin UI dropdowns.
export const QUOTE_STATUSES = ["new", "reviewing", "quoted", "negotiation", "approved", "rejected", "completed"]
export const QUOTE_PRIORITIES = ["low", "medium", "high", "urgent"]
export const ASSIGNEE_OPTIONS = ["Administrator", "Sales", "Support"]

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
 * Fetches all quote requests, newest first.
 * @returns {Promise<Array<object>>} List of quote rows.
 */
export async function getQuotes() {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .order("submitted_at", { ascending: false })
  )
}

/**
 * Fetches a single quote request by id.
 * @param {string} id - Quote id (UUID).
 * @returns {Promise<object|null>} The quote row or null.
 */
export async function getQuote(id) {
  return unwrap(await supabase.from(TABLE).select("*").eq("id", id).maybeSingle())
}

/**
 * Submits a new quote request via the "submit_quote_request" RPC.
 * The RPC inserts the row and its attachment records in one transaction.
 * @param {object} payload - Quote form fields incl. an optional `attachments` array.
 * @returns {Promise<object>} The RPC result (typically the created row).
 * @throws {Error} If the RPC rejects the submission.
 */
export async function createQuote(payload) {
  const { data, error } = await supabase.rpc("submit_quote_request", {
    p_full_name: payload.full_name,
    p_company: payload.company ?? "",
    p_email: payload.email,
    p_phone: payload.phone,
    p_country: payload.country ?? "",
    p_service: payload.service,
    p_project_type: payload.project_type,
    p_project_title: payload.project_title,
    p_project_description: payload.project_description,
    p_budget_min: payload.budget_min ?? null,
    p_budget_max: payload.budget_max ?? null,
    p_currency: payload.currency ?? "USD",
    p_timeline: payload.timeline,
    p_preferred_contact: payload.preferred_contact ?? null,
    p_attachments: payload.attachments ?? [],
  })
  if (error) {
    throw new Error(error.message)
  }
  return data
}

/**
 * Updates a quote request (status, priority, assignee, ...).
 * @param {string} id - Quote id (UUID).
 * @param {object} payload - Fields to update.
 * @returns {Promise<object>} The updated row.
 */
export async function updateQuote(id, payload) {
  return unwrap(await supabase.from(TABLE).update(payload).eq("id", id).select().single())
}

/**
 * Deletes a quote request.
 * @param {string} id - Quote id (UUID).
 * @returns {Promise<object>} The deleted rows (empty when none matched).
 */
export async function deleteQuote(id) {
  return unwrap(await supabase.from(TABLE).delete().eq("id", id))
}

// Escapes a single cell for CSV: wraps in quotes and doubles embedded quotes when
// the value contains a comma, quote, or newline.
function escapeCsv(value) {
  const s = value == null ? "" : String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/**
 * Serializes quote rows to a CSV string (admin export).
 * @param {Array<object>} quotes - Quote rows to export.
 * @returns {string} CSV content with header row and one line per quote.
 */
export function exportQuotes(quotes) {
  const header = ["Reference", "Client", "Company", "Email", "Phone", "Service", "Timeline", "Status", "Priority", "Date"]
  const rows = quotes.map((q) => [
    q.reference_number,
    q.full_name,
    q.company,
    q.email,
    q.phone,
    q.service,
    q.timeline,
    q.status.replace("_", " "),
    q.priority,
    new Date(q.submitted_at).toLocaleDateString("en-US"),
  ])
  return [header, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\n")
}

/**
 * Uploads an attachment file to the quote-attachments bucket (public access).
 * @param {File} file - The attachment file (validated against MAX_ATTACHMENT_SIZE and ALLOWED_ATTACHMENT_TYPES).
 * @returns {Promise<{name: string, url: string, size: number, type: string}>} Upload metadata.
 */
export async function uploadAttachment(file, _onProgress) {
  const url = await uploadPublicFile(file, BUCKET, "attachments", MAX_ATTACHMENT_SIZE, ALLOWED_ATTACHMENT_TYPES)
  return {
    name: file.name,
    url,
    size: file.size,
    type: file.type || "",
  }
}

/**
 * Removes an attachment file from the quote-attachments bucket.
 * @param {string} publicUrl - Public URL of the stored attachment.
 * @returns {Promise<void>}
 */
export async function deleteAttachment(publicUrl) {
  return deleteImage(publicUrl, BUCKET)
}
