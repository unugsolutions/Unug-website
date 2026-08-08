// Hook that aggregates recent contact messages and quote requests into an in-memory
// notification feed, tracking read state in localStorage and receiving new items
// in realtime via Supabase.

import { useCallback, useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { getMessages } from "../services/contactService"
import { getQuotes } from "../services/quoteService"

// localStorage key for persisted read-ids, and cap on how many notifications are kept.
const SEEN_KEY = "unug:notifications:seen"
const MAX_ITEMS = 20

// Restore the set of already-read notification ids from localStorage (fail-safe to empty).
function loadSeen() {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

/**
 * Builds a notification feed from contact messages and quote requests.
 *
 * Returns:
 * - notifications: array of { id, type: "message" | "quote", fullName, time, read }
 *   newest first, capped at MAX_ITEMS
 * - loading: true until the initial seed fetch resolves
 * - unreadCount: number of notifications not yet marked read
 * - markRead(id) / markAllRead(): mark items read and persist ids in localStorage
 *
 * Side effects: seeds from the last messages/quotes on mount, then subscribes to
 * INSERT events on "contact_messages" and "quote_requests" to prepend new items.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [seen, setSeen] = useState(loadSeen)
  const [loading, setLoading] = useState(true)
  const channelRef = useRef(null)

  // Unique channel name per hook instance.
  if (!channelRef.current) {
    channelRef.current = `notifications-${Math.random().toString(36).slice(2, 10)}`
  }

  const persistSeen = (next) => {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify([...next]))
    } catch {
      // ignore storage errors
    }
  }

  // Insert an item at the top, de-duplicating by id and trimming to MAX_ITEMS.
  const prepend = useCallback((item) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === item.id)) return prev
      return [item, ...prev].slice(0, MAX_ITEMS)
    })
  }, [])

  useEffect(() => {
    let active = true

    // Seed the feed from the most recent records; best-effort so failures
    // do not block the realtime updates below.
    const seed = async () => {
      try {
        const [messages, quotes] = await Promise.all([getMessages(), getQuotes()])
        if (!active) return
        const items = [
          ...messages.slice(0, 8).map((m) => ({
            id: `msg-${m.id}`,
            type: "message",
            fullName: m.full_name,
            time: m.submitted_at,
          })),
          ...quotes.slice(0, 8).map((q) => ({
            id: `quote-${q.id}`,
            type: "quote",
            fullName: q.full_name,
            time: q.submitted_at,
          })),
        ]
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, MAX_ITEMS)
        setNotifications(items)
      } catch {
        // seeding is best-effort; realtime events keep working
      } finally {
        if (active) setLoading(false)
      }
    }

    seed()

    // Realtime: prepend new messages/quotes as they arrive.
    const channel = supabase
      .channel(channelRef.current)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_messages" },
        (payload) => {
          const row = payload.new
          prepend({ id: `msg-${row.id}`, type: "message", fullName: row.full_name, time: row.submitted_at })
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "quote_requests" },
        (payload) => {
          const row = payload.new
          prepend({ id: `quote-${row.id}`, type: "quote", fullName: row.full_name, time: row.submitted_at })
        }
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [prepend])

  const markRead = useCallback((id) => {
    setSeen((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      persistSeen(next)
      return next
    })
  }, [])

  const markAllRead = useCallback(() => {
    setSeen((prev) => {
      const next = new Set(prev)
      notifications.forEach((n) => next.add(n.id))
      if (next.size === prev.size) return prev
      persistSeen(next)
      return next
    })
  }, [notifications])

  // Derive the "read" flag from the seen set and count unread items.
  const items = notifications.map((n) => ({ ...n, read: seen.has(n.id) }))
  const unreadCount = items.filter((n) => !n.read).length

  return { notifications: items, loading, unreadCount, markRead, markAllRead }
}
