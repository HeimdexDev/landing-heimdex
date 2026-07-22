// Google Analytics 4 - Marketing property (heimdex.co + blog.heimdex.co).
//
// Env-gated: when VITE_GA4_MEASUREMENT_ID is unset, every export is a no-op, so this
// is safe to ship before the GA4 property exists. Cross-domain linking keeps a visitor
// who moves between heimdex.co and blog.heimdex.co inside a single session. SPA page
// views are emitted manually on route change (see useGaPageViews.js), so the automatic
// page_view is disabled to avoid double-counting the initial load.

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID
const LINKED_DOMAINS = ['heimdex.co', 'blog.heimdex.co']

let initialized = false

export function isGaEnabled() {
  return Boolean(MEASUREMENT_ID)
}

export function initGa() {
  if (initialized || !MEASUREMENT_ID || typeof window === 'undefined') return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  // gtag pushes the raw `arguments` object, not an array - required by gtag.js.
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    linker: { domains: LINKED_DOMAINS },
    send_page_view: false,
  })
}

export function trackPageView(path) {
  if (!MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
