import { stripLangPrefix } from '../i18n/LanguageContext.jsx'
import { SHOW_COMPANY_LINKS } from '../data/flags.js'

// True for any path that renders the full-screen 404 page (unknown route). Legacy
// /ko prefixes are looked through, as in App's NotFoundRedirect. Shared by the
// header/footer toggle in App and by headFor (noindex, no canonical).
export function isNotFoundPath(pathname) {
  const p = stripLangPrefix(pathname).replace(/^\/ko(?=\/|$)/, '') || '/'
  return (
    p !== '/' &&
    p !== '/blog' &&
    !['/product', '/contact', '/policy', '/cases', '/heimlog', '/data', '/request', ...(SHOW_COMPANY_LINKS ? ['/company'] : [])].some((s) => p.startsWith(s))
  )
}
