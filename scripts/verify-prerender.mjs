// Asserts that every public route ships crawlable HTML in the BUILT output, so a
// crawler that does not run JavaScript still sees the body, a unique title, one
// canonical and the ko/en/x-default hreflang set. Run after `vite build`:
//   node scripts/verify-prerender.mjs
// Exits 1 listing every violated check.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { ROUTE_META } from '../src/data/routeMeta.js'

const DIST = new URL('../dist/', import.meta.url)
const SITEMAP = new URL('../public/sitemap.xml', import.meta.url)
const VERCEL = new URL('../vercel.json', import.meta.url)
const ORIGIN = 'https://www.heimdex.co'

// Every route carries its own title and description; a shared one is a failure.
// Set to false only to downgrade the title check to a warning while debugging.
const REQUIRE_UNIQUE_TITLES = true

// Search-result display limits the route copy must stay within (characters).
const MAX_TITLE = 60
const MAX_DESCRIPTION = 155

// The route set is ROUTE_META (the same table prerender writes from). Each route
// needs a phrase that must appear inside its rendered body, per language. The
// product phrase is the first tab's heading; /product?tab=x renders client-side only.
const PHRASES = {
  '/': { ko: '영상을 옮기지 않고,', en: 'No moving your video' },
  '/product': { ko: '브이로그 크리에이터', en: 'Vlog Creators' },
  '/contact': { ko: '데모 상담 신청', en: 'Request a Demo' },
  '/policy': { ko: '서비스 이용약관', en: 'Terms of Service' },
}
const ROUTES = Object.keys(ROUTE_META).map((ko) => ({ ko, phrase: PHRASES[ko] }))

const pages = ROUTES.flatMap(({ ko, phrase }) => [
  { lang: 'ko', ko, path: ko, phrase: phrase?.ko ?? '' },
  { lang: 'en', ko, path: ko === '/' ? '/en' : `/en${ko}`, phrase: phrase?.en ?? '' },
])

const failures = []
for (const { ko, phrase } of ROUTES) {
  if (!phrase) failures.push(`routeMeta: ${ko} has no body phrase in PHRASES`)
}
const fail = (page, msg) => failures.push(`${page.path}: ${msg}`)

const urlOf = (path) => ORIGIN + path
const fileOf = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}/index.html`)
const ownFile = (path) => new URL(fileOf(path), DIST)
// What the host serves today when a route has no file of its own (vercel.json rewrites).
const fallbackFile = (path) =>
  new URL(path === '/en' || path.startsWith('/en/') ? 'en/index.html' : 'index.html', DIST)

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }
const decode = (v) => v.replace(/&(?:amp|lt|gt|quot|#39);/g, (e) => ENTITIES[e])

function attrs(tag) {
  const out = {}
  for (const m of tag.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) out[m[1]] = decode(m[2])
  return out
}

function parse(html) {
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map((m) => attrs(m[0]))
  const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => attrs(m[0]))
  const metaContent = (key, value) => metas.find((m) => m[key] === value)?.content
  const root = html.split('<div id="root">')[1] ?? ''
  return {
    lang: html.match(/<html[^>]*\blang="([^"]*)"/)?.[1],
    title: decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '') || undefined,
    description: metaContent('name', 'description'),
    ogTitle: metaContent('property', 'og:title'),
    ogDescription: metaContent('property', 'og:description'),
    twitterTitle: metaContent('name', 'twitter:title'),
    twitterDescription: metaContent('name', 'twitter:description'),
    canonicals: links.filter((l) => l.rel === 'canonical').map((l) => l.href),
    alternates: links.filter((l) => l.rel === 'alternate' && l.hreflang),
    body: root.replace(/<[^>]*>/g, ' '),
  }
}

const sitemapLocs = new Set(
  [...readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
)
const expectedLocs = new Set(pages.map((p) => urlOf(p.path)))
for (const loc of expectedLocs) {
  if (!sitemapLocs.has(loc)) failures.push(`sitemap.xml: missing ${loc}`)
}
for (const loc of sitemapLocs) {
  if (!expectedLocs.has(loc)) failures.push(`sitemap.xml: ${loc} is not a verified route`)
}

// Every HTML page the build shipped must be a verified route, so a route that is
// prerendered but missing from the sitemap, the rewrites or this script cannot slip by.
if (existsSync(DIST)) {
  const known = new Set(pages.map((p) => fileOf(p.path)))
  for (const rel of readdirSync(DIST, { recursive: true })) {
    const file = String(rel).replaceAll('\\', '/')
    if (file.endsWith('index.html') && !file.startsWith('assets/') && !known.has(file)) {
      failures.push(`dist/${file} is a page that is not a verified route`)
    }
  }
}

// Hosting config: a rewrite whose source is a pattern would answer unknown URLs with
// a 200 page (a soft 404), so every source must be a literal path; each rewrite must
// point at a file the build produced; and every prerendered route except `/` (which
// the host serves from index.html) must have its own rewrite to its own file.
// Whether the host really answers 404 can only be seen on a deployment.
const noRoute = (msg) => failures.push(`vercel.json: ${msg}`)
const rewrites = JSON.parse(readFileSync(VERCEL, 'utf8')).rewrites ?? []
for (const { source, destination } of rewrites) {
  if (source.includes('/blog')) noRoute(`${source} is a removed placeholder route`)
  if (/[:*(]/.test(source)) noRoute(`pattern rewrite ${source} turns unknown URLs into 200 pages`)
  if (!existsSync(new URL(destination.slice(1), DIST))) noRoute(`${destination} is not in dist`)
}
for (const { path } of pages) {
  if (path === '/') continue
  const want = `/${fileOf(path)}`
  const rewrite = rewrites.find((r) => r.source === path)
  if (!rewrite) noRoute(`no rewrite for ${path}`)
  else if (rewrite.destination !== want) noRoute(`${path} rewrites to ${rewrite.destination}, want ${want}`)
}
const notFound = new URL('404.html', DIST)
if (!existsSync(notFound)) failures.push('dist/404.html is missing')
else if (!/<meta[^>]*name="robots"[^>]*noindex/.test(readFileSync(notFound, 'utf8'))) {
  failures.push('dist/404.html is not noindex')
}

const hreflangSets = new Map()
const titles = new Map()
const descriptions = new Map()

for (const page of pages) {
  const own = ownFile(page.path)
  if (!existsSync(own)) fail(page, `no prerendered file of its own (${own.pathname.split('/dist/')[1]})`)
  const file = existsSync(own) ? own : fallbackFile(page.path)
  if (!existsSync(file)) {
    fail(page, 'dist is missing, run `vite build` first')
    continue
  }
  const doc = parse(readFileSync(file, 'utf8'))

  if (doc.lang !== page.lang) fail(page, `html lang is ${doc.lang}, want ${page.lang}`)
  if (!doc.body.includes(page.phrase)) fail(page, `body does not contain "${page.phrase}"`)

  if (!doc.title) fail(page, 'no <title>')
  else titles.set(doc.title, [...(titles.get(doc.title) ?? []), page.path])

  if (!doc.description) fail(page, 'no meta description')
  else descriptions.set(doc.description, [...(descriptions.get(doc.description) ?? []), page.path])
  const copy = ROUTE_META[page.ko][page.lang]
  const tags = [
    ['title', doc.title, copy.title],
    ['description', doc.description, copy.description],
    ['og:title', doc.ogTitle, copy.title],
    ['og:description', doc.ogDescription, copy.description],
    ['twitter:title', doc.twitterTitle, copy.title],
    ['twitter:description', doc.twitterDescription, copy.description],
  ]
  for (const [label, got, expected] of tags) {
    if (got !== expected) fail(page, `${label} is ${JSON.stringify(got)}, want ${JSON.stringify(expected)}`)
  }
  if (doc.title && [...doc.title].length > MAX_TITLE) {
    fail(page, `title is ${[...doc.title].length} chars, max ${MAX_TITLE}`)
  }
  if (doc.description && [...doc.description].length > MAX_DESCRIPTION) {
    fail(page, `description is ${[...doc.description].length} chars, max ${MAX_DESCRIPTION}`)
  }

  const expectedCanonical = urlOf(page.path)
  if (doc.canonicals.length !== 1) fail(page, `${doc.canonicals.length} canonical links, want 1`)
  else if (doc.canonicals[0] !== expectedCanonical) {
    fail(page, `canonical is ${doc.canonicals[0]}, want ${expectedCanonical}`)
  }

  const koPath = page.lang === 'en' ? page.path.replace(/^\/en/, '') || '/' : page.path
  const want = {
    ko: urlOf(koPath),
    en: urlOf(koPath === '/' ? '/en' : `/en${koPath}`),
    'x-default': urlOf(koPath),
  }
  const got = Object.fromEntries(doc.alternates.map((l) => [l.hreflang, l.href]))
  if (doc.alternates.length !== 3) fail(page, `${doc.alternates.length} hreflang links, want 3`)
  for (const [key, href] of Object.entries(want)) {
    if (got[key] !== href) fail(page, `hreflang ${key} is ${got[key]}, want ${href}`)
  }
  hreflangSets.set(page.path, got)
}

for (const [title, paths] of titles) {
  if (paths.length < 2) continue
  const msg = `title "${title}" is shared by ${paths.join(', ')}`
  if (REQUIRE_UNIQUE_TITLES) failures.push(msg)
  else console.warn(`[verify-prerender] warning: ${msg}`)
}

for (const [description, paths] of descriptions) {
  if (paths.length > 1) {
    failures.push(`description "${description}" is shared by ${paths.join(', ')}`)
  }
}

// Reciprocity: the page an alternate points at must point back at this one.
for (const [path, got] of hreflangSets) {
  for (const href of [got.ko, got.en]) {
    if (!href) continue
    const peer = hreflangSets.get(href.slice(ORIGIN.length) || '/')
    if (!peer) continue
    if (peer.ko !== got.ko || peer.en !== got.en) {
      failures.push(`${path}: hreflang is not reciprocal with ${href}`)
    }
  }
}

if (failures.length) {
  console.error(`[verify-prerender] ${failures.length} problem(s):`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}
console.log(`[verify-prerender] ${pages.length} routes OK`)
