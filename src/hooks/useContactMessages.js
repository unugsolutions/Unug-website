// Hook that manages contact form messages (list, CRUD, read/unread) with a realtime
// Supabase subscription that keeps the local list in sync with database changes.

import { useCallback, useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import {
  getMessages as getMessagesRequest,
  getMessage as getMessageRequest,
  createMessage as createMessageRequest,
  updateMessage as updateMessageRequest,
  deleteMessage as deleteMessageRequest,
  markAsRead as markAsReadRequest,
  markAsUnread as markAsUnreadRequest,
} from "../services/contactService"

/**
 * Loads contact messages on mount and subscribes to changes on the
 * "contact_messages" table.
 *
 * Returns:
 * - messages: array of contact messages (or null on first load)
 * - loading / error: fetch state
 * - refetch(): reloads all messages from the API
 * - createMessage(payload) / getMessage(id): direct single-record operations
 * - updateMessage(id, payload) / removeMessage(id): mutate then silently refresh the list
 * - markAsRead(id) / markAsUnread(id): toggle read state then silently refresh
 *
 * Side effects: establishes a Supabase realtime channel (cleaned up on unmount);
 * every mutation refetches the list so `messages` always reflects the database.
 */
export function useContactMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const channelRef = useRef(null)

  // Generate a unique channel name once so multiple mounted hooks do not clash.
  if (!channelRef.current) {
    channelRef.current = `contact-messages-changes-${Math.random().toString(36).slice(2, 10)}`
  }

  const fetchMessages = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    try {
      const data = await getMessagesRequest()
      setMessages(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Initial load + realtime subscription; silent refetch on any table change.
  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel(channelRef.current)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => fetchMessages({ silent: true })
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchMessages])

  const createMessage = useCallback(async (payload) => createMessageRequest(payload), [])

  const getMessage = useCallback(async (id) => getMessageRequest(id), [])

  const updateMessage = useCallback(
    async (id, payload) => {
      const updated = await updateMessageRequest(id, payload)
      await fetchMessages({ silent: true })
      return updated
    },
    [fetchMessages]
  )

  const removeMessage = useCallback(
    async (id) => {
      await deleteMessageRequest(id)
      await fetchMessages({ silent: true })
    },
    [fetchMessages]
  )

  const markAsRead = useCallback(
    async (id) => {
      const updated = await markAsReadRequest(id)
      await fetchMessages({ silent: true })
      return updated
    },
    [fetchMessages]
  )

  const markAsUnread = useCallback(
    async (id) => {
      const updated = await markAsUnreadRequest(id)
      await fetchMessages({ silent: true })
      return updated
    },
    [fetchMessages]
  )

  return {
    messages,
    loading,
    error,
    refetch: () => fetchMessages(),
    createMessage,
    getMessage,
    updateMessage,
    removeMessage,
    markAsRead,
    markAsUnread,
  }
}
