import { stripLangPrefix } from '../i18n/LanguageContext.jsx'
import { SHOW_COMPANY_LINKS } from '../data/flags.js'
import { PRERENDER_PATHS } from './meta.js'

// Routes App.jsx renders as pages without a PRERENDER_PATHS entry.
const CLIENT_ONLY = ['/blog', '/heimlog']
// Families whose junk URLs NotFoundRedirect sends to the family page.
const REDIRECT_FAMILIES = ['/contact', '/product', '/policy']
const COMPANY = ['/company', '/company/about', '/company/news', '/company/brand', '/company/careers']

// Lowercase and drop trailing slashes: the router matches /Product and /contact/ to the
// same route as /product, so the head and chrome decisions use this spelling.
export function normalizePath(pathname) {
  return pathname.toLowerCase().replace(/\/+$/, '') || '/'
}

// Family a leftover legacy URL (/ko/..., /product/x) is sent to by NotFoundRedirect, or null.
export function redirectFamily(pathname) {
  const p = stripLangPrefix(normalizePath(pathname)).replace(/^\/ko(?=\/|$)/, '') || '/'
  return REDIRECT_FAMILIES.find((f) => p.startsWith(f)) ?? null
}

// True for any path that renders the full-screen 404 page: no route matches and no
// redirect family claims it. Mirrors App.jsx's routes; shared by the header/footer toggle
// and by headFor (noindex, no canonical).
export function isNotFoundPath(pathname) {
  const p = stripLangPrefix(normalizePath(pathname))
  if (p === '/' || CLIENT_ONLY.includes(p) || PRERENDER_PATHS.includes(p)) return false
  if (SHOW_COMPANY_LINKS && COMPANY.includes(p)) return false
  if (/^\/data\/[^/]+$/.test(p)) return false
  return redirectFamily(pathname) === null
}
