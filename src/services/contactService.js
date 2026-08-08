// Contact service wrapping the "contact_messages" table.
// Read access is admin-only via Supabase RLS; public inserts come from the contact form.
import { supabase } from "../lib/supabaseClient"

const TABLE = "contact_messages"

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
 * Fetches all contact messages, newest first.
 * @returns {Promise<Array<object>>} List of message rows.
 */
export async function getMessages() {
  return unwrap(
    await supabase
      .from(TABLE)
      .select("*")
      .order("submitted_at", { ascending: false })
  )
}

/**
 * Fetches a single contact message by id.
 * @param {string} id - Message id (UUID).
 * @returns {Promise<object|null>} The message row or null.
 */
export async function getMessage(id) {
  return unwrap(await supabase.from(TABLE).select("*").eq("id", id).maybeSingle())
}

/**
 * Inserts a new contact message (used by the public contact form).
 * @param {object} payload - Message fields (name, email, subject, message, ...).
 * @returns {Promise<object>} The inserted payload.
 * @throws {Error} If the insert is rejected (e.g. by RLS).
 */
export async function createMessage(payload) {
  const { error } = await supabase.from(TABLE).insert(payload)
  if (error) {
    throw new Error(error.message)
  }
  return payload
}

/**
 * Updates a message row (e.g. notes, status).
 * @param {string} id - Message id (UUID).
 * @param {object} payload - Fields to update.
 * @returns {Promise<object>} The updated row.
 */
export async function updateMessage(id, payload) {
  return unwrap(await supabase.from(TABLE).update(payload).eq("id", id).select().single())
}

/**
 * Deletes a contact message.
 * @param {string} id - Message id (UUID).
 * @returns {Promise<object>} The deleted rows (empty when none matched).
 */
export async function deleteMessage(id) {
  return unwrap(await supabase.from(TABLE).delete().eq("id", id))
}

/**
 * Marks a message as read.
 * @param {string} id - Message id (UUID).
 * @returns {Promise<object>} The updated row.
 */
export async function markAsRead(id) {
  return updateMessage(id, { is_read: true })
}

/**
 * Marks a message as unread.
 * @param {string} id - Message id (UUID).
 * @returns {Promise<object>} The updated row.
 */
export async function markAsUnread(id) {
  return updateMessage(id, { is_read: false })
}
