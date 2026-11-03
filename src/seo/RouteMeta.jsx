import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { langFromPath, stripLangPrefix } from '../i18n/LanguageContext.jsx'
import { metaFor } from './meta.js'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Keeps <title>, description, OG/Twitter text and robots in step with the route
// on client-side navigation. The first load already has them baked in by
// scripts/prerender.mjs; this only matters once the SPA takes over.
export default function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, description, noindex } = metaFor(stripLangPrefix(pathname), langFromPath(pathname))
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
  }, [pathname])

  return null
}
