// Asserts that every public route ships crawlable HTML in the BUILT output, so a
// crawler that does not run JavaScript still sees the body, a unique title, one
// canonical and the ko/en/x-default hreflang set. Run after `vite build`:
//   node scripts/verify-prerender.mjs
// Exits 1 listing every violated check.
import { existsSync, readFileSync } from 'node:fs'

const DIST = new URL('../dist/', import.meta.url)
const SITEMAP = new URL('../public/sitemap.xml', import.meta.url)
const ORIGIN = 'https://www.heimdex.co'

// Korean path -> a phrase that must appear inside the rendered body, per language.
// The product phrase is the first tab's heading; /product?tab=x renders that tab
// client-side only.
const ROUTES = [
  { ko: '/', phrase: { ko: '영상을 옮기지 않고,', en: 'No moving your video' } },
  { ko: '/product', phrase: { ko: '브이로그 크리에이터', en: 'Vlog Creators' } },
  { ko: '/contact', phrase: { ko: '데모 상담 신청', en: 'Request a Demo' } },
  { ko: '/policy', phrase: { ko: '서비스 이용약관', en: 'Terms of Service' } },
]

const pages = ROUTES.flatMap(({ ko, phrase }) => [
  { lang: 'ko', path: ko, phrase: phrase.ko },
  { lang: 'en', path: ko === '/' ? '/en' : `/en${ko}`, phrase: phrase.en },
])

const failures = []
const fail = (page, msg) => failures.push(`${page.path}: ${msg}`)

const urlOf = (path) => ORIGIN + path
const ownFile = (path) => new URL(path === '/' ? 'index.html' : `${path.slice(1)}/index.html`, DIST)
// What the host serves today when a route has no file of its own (vercel.json rewrites).
const fallbackFile = (path) =>
  new URL(path === '/en' || path.startsWith('/en/') ? 'en/index.html' : 'index.html', DIST)

function attrs(tag) {
  const out = {}
  for (const m of tag.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) out[m[1]] = m[2]
  return out
}

function parse(html) {
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map((m) => attrs(m[0]))
  const root = html.split('<div id="root">')[1] ?? ''
  return {
    lang: html.match(/<html[^>]*\blang="([^"]*)"/)?.[1],
    title: html.match(/<title>([^<]*)<\/title>/)?.[1],
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

const hreflangSets = new Map()
const titles = new Map()

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
  if (paths.length > 1) failures.push(`title "${title}" is shared by ${paths.join(', ')}`)
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
