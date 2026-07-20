import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useLang } from './LanguageContext.jsx'

// Google advises against auto-redirecting by browser language — it can bounce
// Googlebot off the Korean homepage and wreck its indexing. So instead of moving
// people, we offer: non-Korean browsers on a Korean page get a dismissible nudge
// toward /en. Search traffic already lands in the right language via hreflang.
export default function LanguageSuggestion() {
  const { lang, setLang } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (lang !== 'ko') return setShow(false)
    let chosen = null
    try {
      chosen = localStorage.getItem('lang')
    } catch {
      /* storage blocked (private mode) — treat as first visit */
    }
    if (chosen) return // already picked a language before
    const nav = (navigator.language || '').toLowerCase()
    setShow(!nav.startsWith('ko'))
  }, [lang])

  if (!show) return null

  const dismiss = () => {
    try {
      localStorage.setItem('lang', 'ko')
    } catch {
      /* ignore */
    }
    setShow(false)
  }

  return (
    <div className="fixed bottom-10 left-10 z-40 flex items-center gap-3 rounded-full bg-white/95 py-2.5 pl-5 pr-2.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.35)] ring-1 ring-grayscale-200 backdrop-blur max-lg:left-5 max-sm:bottom-5 max-sm:left-4 max-sm:gap-2 max-sm:pl-4">
      <button
        type="button"
        onClick={() => setLang('en')}
        className="text-sm font-semibold text-navy-500 transition-colors hover:text-[#0a2240] max-sm:text-[13px]"
      >
        View this page in English →
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-grayscale-500 transition-colors hover:bg-grayscale-100 hover:text-grayscale-800"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  )
}
