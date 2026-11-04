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

// Every client-only route must be rewritten with and without a trailing slash, in both languages.
export function lintReachability(routes, vercel) {
  const sources = new Set((vercel.rewrites ?? []).map((r) => r.source))
  const out = []
  for (const route of routes) {
    for (const prefix of LANG_PREFIXES) {
      for (const suffix of ['', '/']) {
        const want = `${prefix}${route}${suffix}`
        if (!sources.has(want)) out.push(`vercel.json: no rewrite for ${want}; the route would be a 404`)
      }
    }
  }
  return out
}
