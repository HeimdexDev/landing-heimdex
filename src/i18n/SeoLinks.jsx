import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { headFor } from '../seo/head.js'

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
// Unknown URLs get no links: a canonical on a 404 would name the junk URL.
export default function SeoLinks() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { links } = headFor(pathname)
    if (!links.length) {
      document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach((el) => el.remove())
      return
    }
    for (const { rel, href, hreflang } of links) setLink(rel, href, hreflang)
  }, [pathname])

  return null
}
