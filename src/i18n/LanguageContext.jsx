import { createContext, useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const LanguageContext = createContext(null)

// Korean lives at the root (/product), English under a prefix (/en/product).
// The URL is the single source of truth so every language version is linkable,
// shareable and crawlable — no localStorage, no auto-redirect.
export function stripLangPrefix(pathname) {
  if (pathname === '/en') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3)
  return pathname
}

export function langFromPath(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ko'
}

// Turn a canonical (Korean) path into the path for `lang`.
export function localizePath(to, lang) {
  if (lang !== 'en' || typeof to !== 'string' || !to.startsWith('/')) return to
  return to === '/' ? '/en' : `/en${to}`
}

export function LanguageProvider({ children }) {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const lang = langFromPath(pathname)

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = lang
  }, [lang])

  // Switching language keeps you on the same page, just under the other prefix.
  // The choice is remembered so the auto-redirect above never overrides it.
  const setLang = (next) => {
    if (next === lang) return
    try {
      localStorage.setItem('lang', next)
    } catch {
      /* ignore */
    }
    const bare = stripLangPrefix(pathname)
    navigate(localizePath(bare, next) + search + hash)
  }

  const t = (ko, en) => (lang === 'en' ? en : ko)

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider')
  return ctx
}
