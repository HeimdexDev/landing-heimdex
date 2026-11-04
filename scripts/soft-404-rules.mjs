// Pure rules behind scripts/check-soft-404.mjs: each takes already-parsed config and
// returns a list of problems, so scripts/soft-404-rules.test.mjs can feed mutated
// configs and prove the rule fires. No fs, no vite.

// A source containing any of these is a pattern; one pattern rewrite can answer every
// unknown URL with 200 (a soft 404 that Google indexes).
const PATTERN = /[:*(?+]/

// Top-level vercel.json keys that cannot change the status of an unknown URL.
// `redirects` is allowed only with literal sources (see lintVercel).
const ALLOWED_VERCEL_KEYS = ['framework', 'buildCommand', 'outputDirectory', 'installCommand', 'rewrites', 'redirects']

// Languages the site is served in: Korean at the root, English under /en.
const LANG_PREFIXES = ['', '/en']

export function lintVercel(vercel, fileExists) {
  const out = []
  if ('routes' in vercel) out.push('vercel.json: "routes" overrides rewrites and redirects; do not use it')
  for (const key of Object.keys(vercel)) {
    if (!ALLOWED_VERCEL_KEYS.includes(key)) out.push(`vercel.json: "${key}" can change the status of unknown URLs; not allowed`)
  }
  for (const { source, destination } of vercel.rewrites ?? []) {
    if (PATTERN.test(source)) out.push(`vercel.json: pattern rewrite ${source} turns unknown URLs into 200 pages`)
    if (!fileExists(destination)) out.push(`vercel.json: ${destination} is not in dist`)
  }
  for (const { source } of vercel.redirects ?? []) {
    if (PATTERN.test(source)) out.push(`vercel.json: pattern redirect ${source} is not allowed; unknown URLs must stay 404`)
  }
  return out
}

// Parses public/_redirects (Netlify mirror) into { source, destination, status } rows.
export function parseRedirects(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [source, destination, status] = l.split(/\s+/)
      return { source, destination, status }
    })
}

export function lintRedirects(text) {
  const out = []
  for (const { source, status } of parseRedirects(text)) {
    if (PATTERN.test(source)) out.push(`public/_redirects: pattern source ${source} answers unknown URLs`)
    if (status?.endsWith('!')) out.push(`public/_redirects: ${source} is forced (${status}) and shadows real files`)
  }
  return out
}

// The mirror must say exactly what vercel.json says, or one host serves a page the other 404s.
export function lintParity(vercel, redirectsText) {
  const key = (r) => `${r.source} -> ${r.destination}`
  const v = new Set((vercel.rewrites ?? []).map(key))
  const n = new Set(parseRedirects(redirectsText).filter((r) => r.status === '200').map(key))
  const out = []
  for (const k of v) if (!n.has(k)) out.push(`public/_redirects lacks "${k}" that vercel.json has`)
  for (const k of n) if (!v.has(k)) out.push(`vercel.json lacks "${k}" that public/_redirects has`)
  return out
}

// App.jsx static route paths (without the language prefix) that have no prerendered
// file: only a literal rewrite keeps them from the 404.
export function clientOnlyRoutes(appSource, prerenderPaths, showCompany) {
  const paths = [...appSource.matchAll(/path=\{`\$\{p\}([^`$]*)`\}/g)].map((m) => m[1])
  return [...new Set(paths)].filter(
    (p) => !p.includes(':') && !prerenderPaths.includes(p) && (showCompany || !p.startsWith('/company')),
  )
}

// Every client-only route must be rewritten with and without a trailing slash, in both
// languages, to that language's shell; no other rewrite may exist.
export function lintReachability(routes, vercel) {
  const dest = new Map((vercel.rewrites ?? []).map((r) => [r.source, r.destination]))
  const expected = new Set()
  const out = []
  for (const route of routes) {
    for (const prefix of LANG_PREFIXES) {
      for (const suffix of ['', '/']) {
        const want = `${prefix}${route}${suffix}`
        expected.add(want)
        if (!dest.has(want)) out.push(`vercel.json: no rewrite for ${want}; the route would be a 404`)
        else if (dest.get(want) !== `${prefix}/_shell.html`) out.push(`vercel.json: ${want} -> ${dest.get(want)}, not ${prefix}/_shell.html`)
      }
    }
  }
  for (const source of dest.keys()) if (!expected.has(source)) out.push(`vercel.json: unexpected rewrite ${source} answers 200 for a URL that is not a route`)
  return out
}

// Junk URLs under a real route family or a legacy prefix; each renders NotFound.
export const JUNK_PATHS = [
  '/nope-t46', '/a/b/c', '/cases/nope', '/request/nope', '/heimlog/nope', '/casesfoo', '/requestfoo',
  '/datafoo', '/heimlogfoo', '/blogfoo', '/blog/x', '/data/a/b', '/ko', '/ko/cases', '/ko/data',
]

// Routes that exist in App.jsx without a prerendered file or with a param.
export const EXTRA_REAL_PATHS = ['/blog', '/heimlog', '/data/some-slug']

// What the client head must say. Real routes (any language, slash or no slash, any
// letter case) must not hit the 404 branch and must give the same head as their canonical
// spelling; junk must stay noindex with no canonical/hreflang. `fns` is the real
// { headFor, isNotFoundPath } or a mutated copy.
export function lintHead({ headFor, isNotFoundPath }, realPaths, junkPaths) {
  const out = []
  for (const prefix of LANG_PREFIXES) {
    for (const path of realPaths) {
      const base = path === '/' ? prefix || '/' : `${prefix}${path}`
      const want = JSON.stringify(headFor(base))
      for (const url of [base, base === '/' ? '/' : `${base}/`, base.toUpperCase()]) {
        if (isNotFoundPath(url)) out.push(`${url}: real route is treated as unknown (noindex, no canonical, no chrome)`)
        else if (JSON.stringify(headFor(url)) !== want) out.push(`${url}: client head differs from ${base}`)
      }
      const h = headFor(base)
      if (h.title.includes('Page not found')) out.push(`${base}: real page has the 404 title`)
      if (h.links.length !== 4 || !h.links.some((l) => l.rel === 'canonical')) out.push(`${base}: real page lost canonical/hreflang`)
    }
    for (const path of junkPaths) {
      for (const url of [`${prefix}${path}`, `${prefix}${path}/`]) {
        const h = headFor(url)
        if (!isNotFoundPath(url)) out.push(`${url}: junk URL is not treated as unknown`)
        if (!h.noindex || h.links.length || !h.title.includes('Page not found')) out.push(`${url}: junk URL is indexable or keeps links after boot`)
      }
    }
  }
  return out
}

// RouteMeta and SeoLinks are the only appliers of the client head; if either stops
// calling headFor (or App stops mounting it) the 404 head is undone after boot.
export function lintHeadWiring({ routeMeta, seoLinks, app }) {
  const out = []
  if (!/\bheadFor\(/.test(routeMeta)) out.push('src/seo/RouteMeta.jsx does not call headFor')
  if (!/\bheadFor\(/.test(seoLinks)) out.push('src/i18n/SeoLinks.jsx does not call headFor')
  if (!/\.remove\(\)/.test(seoLinks)) out.push('src/i18n/SeoLinks.jsx never removes canonical/hreflang on an unknown URL')
  for (const name of ['RouteMeta', 'SeoLinks']) {
    if (!new RegExp(`<${name}\\s*/>`).test(app)) out.push(`src/App.jsx does not mount <${name} />`)
  }
  return out
}

// Route path expressions in App.jsx that clientOnlyRoutes cannot read: an unread route
// could be unreachable on the host without any check noticing.
const READABLE_PATH = [/^\{`\$\{p\}[^`$]*`\}$/, /^\{p \|\| '\/'\}$/, /^"\*"$/, /^\{`\$\{p\}\$\{cs\}`\}$/]
export function unparsedRoutes(appSource) {
  return [...appSource.matchAll(/<Route\s+path=(\{`[^`]*`\}|\{[^}]*\}|"[^"]*")/g)]
    .map((m) => m[1])
    .filter((expr) => !READABLE_PATH.some((re) => re.test(expr)))
}
