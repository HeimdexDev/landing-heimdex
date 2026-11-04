import { langFromPath, localizePath, stripLangPrefix } from '../i18n/LanguageContext.jsx'
import { NOT_FOUND, ORIGIN, metaFor } from './meta.js'
import { isNotFoundPath, normalizePath } from './notFound.js'

// What <head> should say for a client-side location: title/description/robots plus
// the canonical and hreflang links. RouteMeta and SeoLinks both apply this, so an
// unknown URL stays noindex with no canonical after boot (the host serves it 404 with
// the same head in dist/404.html) and a real page gets its tags back on navigation.
export function headFor(rawPath) {
  const pathname = normalizePath(rawPath)
  if (isNotFoundPath(pathname)) return { ...NOT_FOUND, noindex: true, links: [] }

  const bare = stripLangPrefix(pathname)
  const { title, description, noindex } = metaFor(bare, langFromPath(pathname))
  const ko = ORIGIN + bare
  const en = ORIGIN + localizePath(bare, 'en')
  return {
    title,
    description,
    noindex,
    links: [
      { rel: 'canonical', href: langFromPath(pathname) === 'en' ? en : ko },
      { rel: 'alternate', href: ko, hreflang: 'ko' },
      { rel: 'alternate', href: en, hreflang: 'en' },
      { rel: 'alternate', href: ko, hreflang: 'x-default' },
    ],
  }
}
