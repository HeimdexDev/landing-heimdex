import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTE_META } from '../data/routeMeta.js'
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

function setMeta(selector, content) {
  document.head.querySelector(selector)?.setAttribute('content', content)
}

// Tells Google which URL is canonical for this page and where its other-language
// twin lives, and keeps the title, description and share-card tags in step with the
// route after client-side navigation. Without this the /en pages read as duplicates
// of the Korean ones. A URL that is not a route (the 404 shell) gets no canonical or
// hreflang, so it never names itself as the page to index.
export default function SeoLinks() {
  const { pathname } = useLocation()

  useEffect(() => {
    const lang = langFromPath(pathname)
    // /product/ and /product are the same page.
    const bare = stripLangPrefix(pathname).replace(/\/$/, '') || '/'
    const meta = ROUTE_META[bare]?.[lang]

    if (!meta) {
      document.head
        .querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')
        .forEach((el) => el.remove())
      return
    }

    const ko = ORIGIN + bare
    const en = ORIGIN + localizePath(bare, 'en')
    const current = lang === 'en' ? en : ko

    setLink('canonical', current)
    setLink('alternate', ko, 'ko')
    setLink('alternate', en, 'en')
    setLink('alternate', ko, 'x-default')

    document.title = meta.title
    setMeta('meta[name="description"]', meta.description)
    setMeta('meta[property="og:title"]', meta.title)
    setMeta('meta[property="og:description"]', meta.description)
    setMeta('meta[property="og:url"]', current)
    setMeta('meta[property="og:locale"]', lang === 'en' ? 'en_US' : 'ko_KR')
    setMeta('meta[name="twitter:title"]', meta.title)
    setMeta('meta[name="twitter:description"]', meta.description)
  }, [pathname])

  return null
}
