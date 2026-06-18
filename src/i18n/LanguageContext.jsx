import { createContext, useContext, useEffect, useState } from 'react'

const LanguageContext = createContext(null)

// Lightweight i18n: components call t('한국어', 'English') and get the string for
// the current language. Choice persists to localStorage. Default Korean.
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('lang')
      if (saved === 'ko' || saved === 'en') return saved
    }
    return 'ko'
  })

  useEffect(() => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('lang', lang)
    if (typeof document !== 'undefined') document.documentElement.lang = lang
  }, [lang])

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
