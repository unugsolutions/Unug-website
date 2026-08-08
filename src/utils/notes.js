// Notes utilities: internal notes are persisted as a JSON array of { text, at } entries.

/** Parses a persisted notes string into an array, tolerating missing/corrupt data. */
export function parseNotes(value) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Appends a timestamped note and returns the updated serialized notes string. */
export function appendNote(value, text) {
  const notes = parseNotes(value)
  return JSON.stringify([
    ...notes,
    { text: text.trim(), at: new Date().toISOString() },
  ])
}
