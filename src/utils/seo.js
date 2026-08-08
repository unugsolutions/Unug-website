// SEO utilities: apply per-route metadata, canonical URLs, theme colors, and analytics
// scripts from the website settings object.
import { hexToRgbTriplet } from "../services/settingsService"

const DEFAULT_TITLE = "UNUG Solutions | Engineering Digital Solutions"

/** Creates or updates a <meta> tag identified by an attribute (name/property). */
function upsertMeta(attr, value, content) {
  let el = document.head.querySelector(`meta[${attr}="${value}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, value)
    document.head.appendChild(el)
  }
  if (content) el.setAttribute("content", content)
}

// Meta tags, page title, favicon, and Open Graph/Twitter cards.
function applySeo(settings) {
  const companyName = settings.company_name || "UNUG Solutions"
  const tagline = settings.company_tagline || "Engineering Digital Solutions"
  const description =
    settings.seo_description ||
    settings.company_description ||
    "We build modern websites, software, and digital platforms that drive business growth."
  const title = settings.seo_title || `${companyName} | ${tagline}`
  const keywords = settings.seo_keywords || ""
  const image = settings.meta_image || settings.logo_url || ""

  document.title = title

  upsertMeta("name", "description", description)
  upsertMeta("name", "keywords", keywords)
  upsertMeta("property", "og:title", title)
  upsertMeta("property", "og:description", description)
  upsertMeta("property", "og:type", "website")
  upsertMeta("property", "og:site_name", companyName)
  if (image) {
    upsertMeta("property", "og:image", image)
    upsertMeta("name", "twitter:image", image)
  }
  upsertMeta("name", "twitter:card", "summary_large_image")
  upsertMeta("name", "twitter:title", title)
  upsertMeta("name", "twitter:description", description)

  let icon = document.head.querySelector('link[rel="icon"]')
  if (!icon) {
    icon = document.createElement("link")
    icon.setAttribute("rel", "icon")
    document.head.appendChild(icon)
  }
  icon.setAttribute("href", settings.favicon_url || "/mainlogo.svg")
  icon.setAttribute("type", settings.favicon_url ? "" : "image/svg+xml")
}

// Points search engines at the current URL (no query string/hash) as the canonical page.
function applyCanonical() {
  const url = window.location.origin + window.location.pathname
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement("link")
    link.setAttribute("rel", "canonical")
    document.head.appendChild(link)
  }
  link.setAttribute("href", url)
}

// Maps configured hex colors onto CSS custom properties (--color-primary, etc.).
function applyThemeColors(settings) {
  const root = document.documentElement
  const setVar = (name, hex, fallback) => {
    const triplet = hexToRgbTriplet(hex || fallback)
    if (triplet) root.style.setProperty(name, triplet)
  }
  setVar("--color-primary", settings.primary_color, "#2563EB")
  setVar("--color-secondary", settings.secondary_color, "#0F172A")
  setVar("--color-accent", settings.accent_color, "#FF8C00")
}

// Tracks which analytics IDs were already injected so scripts are only (re)added on change.
let lastAnalytics = { ga: null, gtm: null }

/** Removes previously injected analytics scripts for a given id prefix. */
function removeInjected(idPrefix) {
  document.querySelectorAll(`script[data-unug-inject="${idPrefix}"]`).forEach((node) => node.remove())
}

// Injects Google Analytics (gtag) and/or Google Tag Manager scripts when configured.
function injectAnalytics(settings) {
  const gaId = settings.google_analytics_id?.trim()
  const gtmId = settings.google_tag_manager_id?.trim()

  if (gaId !== lastAnalytics.ga) {
    removeInjected("gtag")
    if (gaId) {
      const s1 = document.createElement("script")
      s1.setAttribute("data-unug-inject", "gtag")
      s1.async = true
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
      document.head.appendChild(s1)

      const s2 = document.createElement("script")
      s2.setAttribute("data-unug-inject", "gtag")
      s2.textContent = `window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config","${gaId}");`
      document.head.appendChild(s2)
    }
    lastAnalytics.ga = gaId
  }

  if (gtmId !== lastAnalytics.gtm) {
    removeInjected("gtm")
    if (gtmId) {
      const s1 = document.createElement("script")
      s1.setAttribute("data-unug-inject", "gtm")
      s1.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","${gtmId}");`
      document.head.appendChild(s1)
    }
    lastAnalytics.gtm = gtmId
  }
}

/** Applies all SEO/theme/analytics side effects for the given settings. */
export function applyWebsiteSettings(settings) {
  if (!settings) return
  applySeo(settings)
  applyCanonical()
  applyThemeColors(settings)
  injectAnalytics(settings)
}

export { DEFAULT_TITLE }
