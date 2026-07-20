import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { langFromPath, localizePath, stripLangPrefix } from './LanguageContext.jsx'

const ORIGIN = 'https://www.heimdex.co'

// Keep a single <link> per (rel, hreflang) and update it in place, so client-side
// navigation doesn't pile up stale tags.
function setLink(rel, href, hreflang) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

// Tells Google which URL is canonical for this page and where its other-language
// twin lives. Without this the /en pages read as duplicates of the Korean ones.
export default function SeoLinks() {
  const { pathname } = useLocation()

  useEffect(() => {
    const bare = stripLangPrefix(pathname)
    const ko = ORIGIN + bare
    const en = ORIGIN + localizePath(bare, 'en')
    const current = langFromPath(pathname) === 'en' ? en : ko

    setLink('canonical', current)
    setLink('alternate', ko, 'ko')
    setLink('alternate', en, 'en')
    setLink('alternate', ko, 'x-default')
  }, [pathname])

  return null
}
