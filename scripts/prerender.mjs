// Build-time static rendering. After `vite build` (client, dist/) and
// `vite build --ssr` (dist-ssr/), write one HTML file per public route with the
// rendered app inside #root and route-specific <head> tags, so a crawler that
// does not run JavaScript still gets the body, canonical and hreflang. The same
// client bundle then hydrates the markup (src/main.jsx).
//
// Output: dist/index.html (ko /), dist/en/index.html, dist/<route>/index.html,
// dist/en/<route>/index.html, plus dist/404.html — an empty, noindex shell for
// the host to serve with a 404 status.
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const DIST = new URL('../dist/', import.meta.url)
const SSR_ENTRY = new URL('../dist-ssr/entry-server.js', import.meta.url)
const ORIGIN = 'https://www.heimdex.co'

import { ROUTE_META } from '../src/data/routeMeta.js'

// The home copy is what index.html ships, so it doubles as the find-string when
// the template is cloned per language and per route.
const { title: KO_TITLE, description: KO_DESC } = ROUTE_META['/'].ko
const { title: EN_TITLE, description: EN_DESC } = ROUTE_META['/'].en

// Korean paths; the English twin of each lives under /en.
const KO_PATHS = Object.keys(ROUTE_META)

// [find, replace, label] — every swap must match at least once, otherwise the
// source template drifted and the English pages would silently ship Korean tags.
const EN_SWAPS = [
  ['<html lang="ko" translate="no">', '<html lang="en" translate="no">', 'html lang'],
  [KO_TITLE, EN_TITLE, 'title'],
  [KO_DESC, EN_DESC, 'description'],
  ['content="ko_KR"', 'content="en_US"', 'og:locale'],
]
const OG_URL = '<meta property="og:url" content="https://www.heimdex.co/" />'
const EMPTY_ROOT = '<div id="root"></div>'

function swapAll(html, swaps) {
  let out = html
  for (const [find, replace, label] of swaps) {
    if (!out.includes(find)) {
      console.error(`[prerender] no match for ${label}: ${find}`)
      process.exit(1)
    }
    out = out.replaceAll(find, replace)
  }
  return out
}

const enPath = (koPath) => (koPath === '/' ? '/en' : `/en${koPath}`)
const fileFor = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}/index.html`)

function headTags(koPath) {
  const ko = ORIGIN + koPath
  const en = ORIGIN + enPath(koPath)
  return [
    `<link rel="alternate" hreflang="ko" href="${ko}" />`,
    `<link rel="alternate" hreflang="en" href="${en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${ko}" />`,
  ].join('\n    ')
}

// Swaps the language shell's home title/description (title, og:*, twitter:*) for
// the route's own.
function withRouteMeta(html, koPath, lang) {
  const { title, description } = ROUTE_META[koPath][lang]
  const home = ROUTE_META['/'][lang]
  return html.replaceAll(home.title, () => title).replaceAll(home.description, () => description)
}

async function write(file, html) {
  const url = new URL(file, DIST)
  await mkdir(new URL('./', url), { recursive: true })
  await writeFile(url, html)
}

const { render } = await import(SSR_ENTRY.href)
const template = await readFile(new URL('index.html', DIST), 'utf8')
for (const needle of [EMPTY_ROOT, OG_URL, '</head>']) {
  if (!template.includes(needle)) {
    console.error(`[prerender] template has no ${needle}`)
    process.exit(1)
  }
}
const shells = { ko: template, en: swapAll(template, EN_SWAPS) }

const written = []
for (const koPath of KO_PATHS) {
  for (const lang of ['ko', 'en']) {
    const path = lang === 'ko' ? koPath : enPath(koPath)
    const canonical = ORIGIN + path
    const html = withRouteMeta(shells[lang], koPath, lang)
      .replace(EMPTY_ROOT, () => `<div id="root">${render(path)}</div>`)
      .replace(OG_URL, `<meta property="og:url" content="${canonical}" />`)
      .replace(
        '</head>',
        () => `<link rel="canonical" href="${canonical}" />\n    ${headTags(koPath)}\n  </head>`,
      )
    await write(fileFor(path), html)
    written.push(fileFor(path))
  }
}

await write(
  '404.html',
  template.replace('</head>', '<meta name="robots" content="noindex" />\n  </head>'),
)
written.push('404.html')
console.log(`[prerender] wrote ${written.join(', ')}`)
