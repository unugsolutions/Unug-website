// Auth service wrapping Supabase Auth (email/password flow).
// Does not touch any table directly; all calls go through supabase.auth.
import { supabase } from "../lib/supabaseClient"

/**
 * Signs a user in with email and password via Supabase Auth.
 * @param {{ email: string, password: string }} credentials - Email and password pair.
 * @returns {Promise<{user, session}>} The authenticated user and session on success.
 * @throws {Error} If credentials are invalid.
 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/**
 * Signs the current user out and invalidates the Supabase session.
 * @returns {Promise<void>}
 * @throws {Error} If the sign-out call fails.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Returns the currently signed-in user, or null when unauthenticated.
 * @returns {Promise<object|null>} The user object or null.
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

/**
 * Returns the active auth session (contains access/refresh tokens).
 * @returns {Promise<object|null>} The session object or null when signed out.
 */
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

/**
 * Updates the signed-in user's custom metadata (e.g. display name, role).
 * @param {object} metadata - Key/value pairs stored on the user record.
 * @returns {Promise<object>} The updated user object.
 * @throws {Error} If the update fails.
 */
export async function updateProfile(metadata) {
  const { data, error } = await supabase.auth.updateUser({ data: metadata })
  if (error) throw error
  return data.user
}

/**
 * Changes the current user's password.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<object>} The updated user object.
 * @throws {Error} If the change fails.
 */
export async function changePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  return data.user
}
