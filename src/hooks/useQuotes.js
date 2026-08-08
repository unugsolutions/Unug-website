// Hook that manages quote requests (list, CRUD) with a realtime Supabase
// subscription that keeps the local list in sync with database changes.

import { useCallback, useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import {
  getQuotes as getQuotesRequest,
  getQuote as getQuoteRequest,
  createQuote as createQuoteRequest,
  updateQuote as updateQuoteRequest,
  deleteQuote as deleteQuoteRequest,
} from "../services/quoteService"

/**
 * Loads quote requests on mount and subscribes to changes on the
 * "quote_requests" table.
 *
 * Returns:
 * - quotes: array of quote request records
 * - loading / error: fetch state
 * - refetch(): reloads all quotes from the API
 * - createQuote(payload) / getQuote(id): direct single-record operations
 * - updateQuote(id, payload) / removeQuote(id): mutate then silently refresh the list
 *
 * Side effects: establishes a Supabase realtime channel (cleaned up on unmount);
 * every mutation refetches the list so `quotes` always reflects the database.
 */
export function useQuotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const channelRef = useRef(null)

  // Generate a unique channel name once so multiple mounted hooks do not clash.
  if (!channelRef.current) {
    channelRef.current = `quote-requests-changes-${Math.random().toString(36).slice(2, 10)}`
  }

  const fetchQuotes = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    try {
      const data = await getQuotesRequest()
      setQuotes(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Initial load + realtime subscription; silent refetch on any table change.
  useEffect(() => {
    fetchQuotes()

    const channel = supabase
      .channel(channelRef.current)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "quote_requests" },
        () => fetchQuotes({ silent: true })
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchQuotes])

  const createQuote = useCallback(async (payload) => createQuoteRequest(payload), [])

  const getQuote = useCallback(async (id) => getQuoteRequest(id), [])

  const updateQuote = useCallback(
    async (id, payload) => {
      const updated = await updateQuoteRequest(id, payload)
      await fetchQuotes({ silent: true })
      return updated
    },
    [fetchQuotes]
  )

  const removeQuote = useCallback(
    async (id) => {
      await deleteQuoteRequest(id)
      await fetchQuotes({ silent: true })
    },
    [fetchQuotes]
  )

  return {
    quotes,
    loading,
    error,
    refetch: () => fetchQuotes(),
    createQuote,
    getQuote,
    updateQuote,
    removeQuote,
  }
}
