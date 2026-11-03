import { KO } from './dataMarket.ko.js'
import { EN } from './dataMarket.en.js'
import { useLang } from '../i18n/LanguageContext.jsx'

// Fills any gap in `over` with `base`. Arrays of objects merge item by item
// (collections are matched by slug), so a partial translation never blanks a page.
function merge(base, over) {
  // '' is a deliberate blank (e.g. EN hero has no accent line); only absent keys fall back.
  if (over === undefined || over === null) return base
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base
    if (base.length && typeof base[0] === 'object' && base[0] !== null && 'slug' in base[0]) {
      return base.map((b) => merge(b, over.find((o) => o?.slug === b.slug)))
    }
    return base.map((b, i) => merge(b, over[i]))
  }
  if (typeof base === 'object' && base !== null) {
    const out = { ...base }
    for (const k of Object.keys(over)) out[k] = k in base ? merge(base[k], over[k]) : over[k]
    return out
  }
  return over
}

const BY_LANG = { ko: KO, en: merge(KO, EN) }

export const DATA_PATH = '/data'
export const REQUEST_PATH = '/request'
export const REQUEST_DONE_PATH = '/request/done'
export const collectionPath = (slug) => `/data/${slug}`
export const COLLECTION_SLUGS = KO.collections.map((c) => c.slug)

export function useDataCopy() {
  const { lang } = useLang()
  return BY_LANG[lang] ?? KO
}

export const dataCopy = (lang) => BY_LANG[lang] ?? KO
