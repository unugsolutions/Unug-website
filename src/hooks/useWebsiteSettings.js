// Hooks for reading and managing website settings. Includes a module-level cache
// shared across public consumers and a realtime subscription for the admin hook.

import { useCallback, useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { getSettings, updateSettings as updateSettingsService } from "../services/settingsService"

// Module-level cache: settings are fetched once and shared across all consumers
// until invalidated, so public pages avoid repeated network requests.
let cachedSettings = null
let cachedPromise = null

// Drop the module-level cache; call after admin-side updates of settings.
export function invalidateSettingsCache() {
  cachedSettings = null
}

// Return cached settings if present, otherwise start (and memoize) a single fetch.
async function loadCachedSettings() {
  if (cachedSettings) return cachedSettings
  if (!cachedPromise) {
    cachedPromise = getSettings()
      .then((data) => {
        cachedSettings = data
        return data
      })
      .finally(() => {
        cachedPromise = null
      })
  }
  return cachedPromise
}

/**
 * Public-facing settings reader backed by the module-level cache.
 *
 * Returns:
 * - settings: website settings object (null while first load is pending,
 *   or immediately from cache if already fetched)
 * - loading / error: fetch state
 *
 * Side effects: kicks off a single shared fetch on mount (deduped per process);
 * no realtime subscription.
 */
export function usePublicWebsiteSettings() {
  const [settings, setSettings] = useState(cachedSettings)
  const [loading, setLoading] = useState(cachedSettings ? false : true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    loadCachedSettings()
      .then((data) => {
        if (!mounted) return
        setSettings(data)
        setLoading(false)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message)
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return { settings, loading, error }
}

/**
 * Admin-facing settings hook with live updates.
 *
 * Returns:
 * - settings: website settings object (null until loaded)
 * - loading / error: fetch state
 * - update(payload): persists settings, updates local state, and invalidates the
 *   shared public cache so other consumers pick up the new values
 * - refresh(): silently reloads settings from the API
 *
 * Side effects: subscribes to changes on the "website_settings" table and reloads
 * on any event; the realtime channel is removed on unmount.
 */
export function useWebsiteSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const channelRef = useRef(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const data = await getSettings()
      setSettings(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => load(true), [load])

  const update = useCallback(async (payload) => {
    const updated = await updateSettingsService(payload)
    setSettings(updated)
    invalidateSettingsCache()
    return updated
  }, [])

  // Initial load + realtime subscription for live settings updates.
  useEffect(() => {
    load()
    const channel = supabase
      .channel(`settings-live-${Math.random().toString(36).slice(2, 10)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "website_settings" },
        () => {
          load(true)
        }
      )
      .subscribe()
    channelRef.current = channel
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [load])

  return { settings, loading, error, update, refresh }
}
