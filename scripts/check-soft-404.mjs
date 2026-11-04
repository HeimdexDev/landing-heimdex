// Asserts the BUILT output answers unknown URLs with a real 404, not a 200 shell.
// Run after `vite build && node scripts/prerender.mjs`:
//   node scripts/check-soft-404.mjs
// Exits 1 listing every violated check.
//
// Vercel serves dist/404.html with status 404 for any path that has no file and
// no matching rewrite. A catch-all or pattern rewrite (`/(.*)`, `/:path*`) answers
// every unknown URL with 200 instead (a soft 404 that Google indexes), so every
// rewrite source must be a literal path whose destination exists in dist.
// Whether the host really answers 404 can only be seen on a deployment.
import { existsSync, readFileSync } from 'node:fs'
import { createServer } from 'vite'
import {
  EXTRA_REAL_PATHS,
  JUNK_PATHS,
  clientOnlyRoutes,
  lintHead,
  lintHeadWiring,
  lintParity,
  lintReachability,
  lintRedirects,
  lintVercel,
  unparsedRoutes,
} from './soft-404-rules.mjs'

const DIST = new URL('../dist/', import.meta.url)
const failures = []
const fail = (msg) => failures.push(msg)

const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
const redirectsFile = new URL('../public/_redirects', import.meta.url)
const redirectsText = existsSync(redirectsFile) ? readFileSync(redirectsFile, 'utf8') : ''
const inDist = (destination) => existsSync(new URL(destination.replace(/^\//, ''), DIST))
failures.push(...lintVercel(vercel, inDist), ...lintRedirects(redirectsText), ...lintParity(vercel, redirectsText))

const notFound = new URL('404.html', DIST)
if (!existsSync(notFound)) fail('dist/404.html is missing')
else {
  const html = readFileSync(notFound, 'utf8')
  if (!/<meta[^>]*name="robots"[^>]*content="noindex/.test(html)) fail('dist/404.html is not noindex')
  if ((html.match(/<meta[^>]*name="robots"/g) ?? []).length !== 1) fail('dist/404.html must carry exactly one robots meta')
  // One file answers every unknown URL, so it must not name any page as canonical.
  if (/<link[^>]*rel="(canonical|alternate)"/.test(html)) fail('dist/404.html has a canonical or alternate link')
  if (!html.includes('페이지를 찾을 수 없어요')) fail('dist/404.html has no Korean 404 copy')
  if (!html.includes('We couldn’t find that page')) fail('dist/404.html has no English 404 copy')
  // A shared dead link must not preview as the home page.
  if (/property="og:url"/.test(html)) fail('dist/404.html has og:url (a shared dead link would point at a live page)')
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]
  for (const [attr, key] of [['property', 'og:title'], ['name', 'twitter:title']]) {
    const v = html.match(new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`))?.[1]
    if (v !== title) fail(`dist/404.html ${key} is "${v}", not the 404 title`)
  }
  const homeDescription = readFileSync(new URL('index.html', DIST), 'utf8').match(/name="description"\s+content="([^"]*)"/)?.[1]
  if (homeDescription && html.includes(homeDescription)) fail('dist/404.html still carries the home description')
}

// Known routes stay served from their own prerendered files (not from a fallback).
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { PRERENDER_PATHS } = await vite.ssrLoadModule('/src/seo/meta.js')
  const { localizePath } = await vite.ssrLoadModule('/src/i18n/LanguageContext.jsx')
  for (const lang of ['ko', 'en']) {
    for (const path of PRERENDER_PATHS) {
      const url = localizePath(path, lang)
      const rel = url === '/' ? 'index.html' : `${url.slice(1)}/index.html`
      if (!existsSync(new URL(rel, DIST))) fail(`${url}: no prerendered dist/${rel}`)
    }
  }

  // Every static route in App.jsx is either prerendered (checked above) or has a literal
  // rewrite; otherwise the route answers 404 on the host.
  const { SHOW_COMPANY_LINKS } = await vite.ssrLoadModule('/src/data/flags.js')
  const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
  const clientOnly = clientOnlyRoutes(appSource, PRERENDER_PATHS, SHOW_COMPANY_LINKS)
  if (!clientOnly.length) fail('App.jsx: no client-only routes found; the route scan is broken')
  failures.push(...lintReachability(clientOnly, vercel))

  const unread = unparsedRoutes(appSource)
  if (unread.length) fail(`App.jsx: Route path ${unread.join(', ')} is not readable by the route scan; extend clientOnlyRoutes`)

  // The head the client leaves behind after boot: unknown URLs stay noindex with no
  // canonical/hreflang, every real route (both languages, slash or not, any case) keeps
  // its own, and RouteMeta/SeoLinks really apply it.
  const head = await vite.ssrLoadModule('/src/seo/head.js').catch(() => null)
  const nf = await vite.ssrLoadModule('/src/seo/notFound.js').catch(() => null)
  if (!head?.headFor || !nf?.isNotFoundPath) fail('src/seo: headFor/isNotFoundPath missing; noindex cannot survive client boot')
  else {
    const junk = SHOW_COMPANY_LINKS ? JUNK_PATHS : [...JUNK_PATHS, '/company']
    failures.push(...lintHead({ headFor: head.headFor, isNotFoundPath: nf.isNotFoundPath }, [...PRERENDER_PATHS, ...EXTRA_REAL_PATHS], junk))
  }
  const src = (rel) => readFileSync(new URL(rel, import.meta.url), 'utf8')
  failures.push(...lintHeadWiring({ routeMeta: src('../src/seo/RouteMeta.jsx'), seoLinks: src('../src/i18n/SeoLinks.jsx'), app: appSource }))
} finally {
  await vite.close()
}

if (failures.length) {
  console.error(`[check-soft-404] ${failures.length} problem(s):\n- ${failures.join('\n- ')}`)
  process.exit(1)
}
console.log('[check-soft-404] ok')
