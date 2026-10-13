// Browser check of the built output (run after `npm run build`; not part of the
// build because it needs a browser):
//   PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core node scripts/check-browser.mjs
//   BROWSERS=chromium,webkit (default chromium)
// Serves dist/ like the host does (path -> <path>/index.html, otherwise 404.html
// with status 404), then asserts, per browser:
//   - no console error/warning or page error while loading and hydrating each route
//   - client-side navigation keeps the head tags in step with the route
// Exits 1 listing every failed assertion.
import { createRequire } from 'node:module'
import { readFile, stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTE_META } from '../src/data/routeMeta.js'

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const ORIGIN = 'https://www.heimdex.co'
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.json': 'application/json',
}

const core = process.env.PLAYWRIGHT_CORE
const { chromium, webkit } = core
  ? createRequire(import.meta.url)(core)
  : (await import('playwright-core')).default
const engines = { chromium, webkit }

async function serve() {
  const server = http.createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/$/, '')
    let file = path.join(DIST, pathname)
    try {
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
    } catch {
      file = path.join(file, 'index.html')
    }
    let status = 200
    try {
      await stat(file)
    } catch {
      file = path.join(DIST, '404.html')
      status = 404
    }
    res.writeHead(status, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
    res.end(await readFile(file))
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  return server
}

const failures = []
const fail = (browser, where, msg) => failures.push(`${browser} ${where}: ${msg}`)

const koPathOf = (p) => p.replace(/^\/en(?=\/|$)/, '') || '/'
const langOf = (p) => (p === '/en' || p.startsWith('/en/') ? 'en' : 'ko')
const enPathOf = (ko) => (ko === '/' ? '/en' : `/en${ko}`)

const readHead = (page) =>
  page.evaluate(() => {
    const links = (sel) => [...document.querySelectorAll(sel)].map((l) => l.href)
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      share: Object.fromEntries(
        [...document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')].map((m) => [
          m.getAttribute('property') ?? m.getAttribute('name'),
          m.content,
        ]),
      ),
      canonical: links('link[rel="canonical"]'),
      alternates: Object.fromEntries(
        [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [l.hreflang, l.href]),
      ),
    }
  })

function expectHead(browser, where, head, route) {
  const koPath = koPathOf(route)
  const meta = ROUTE_META[koPath][langOf(route)]
  const canonical = ORIGIN + route
  if (head.title !== meta.title) fail(browser, where, `title is ${head.title}`)
  if (head.description !== meta.description) fail(browser, where, `description is ${head.description}`)
  const share = {
    'og:title': meta.title,
    'og:description': meta.description,
    'og:url': canonical,
    'og:locale': langOf(route) === 'en' ? 'en_US' : 'ko_KR',
    'twitter:title': meta.title,
    'twitter:description': meta.description,
  }
  for (const [k, v] of Object.entries(share)) {
    if (head.share[k] !== v) fail(browser, where, `${k} is ${head.share[k]}`)
  }
  if (head.canonical.join() !== canonical) fail(browser, where, `canonical is [${head.canonical}]`)
  const want = { ko: ORIGIN + koPath, en: ORIGIN + enPathOf(koPath), 'x-default': ORIGIN + koPath }
  for (const [k, v] of Object.entries(want)) {
    if (head.alternates[k] !== v) fail(browser, where, `hreflang ${k} is ${head.alternates[k]}`)
  }
}

// Every public route plus ?tab= variants, which render a different tab right after hydration.
const LOAD = [...Object.keys(ROUTE_META).flatMap((k) => [k, enPathOf(k)]), '/product?tab=legal', '/policy?tab=privacy', '/en/product?tab=research']

async function checkLoads(browser, base) {
  for (const url of LOAD) {
    const page = await browser.newPage()
    const logs = []
    page.on('console', (m) => {
      if (['error', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text().slice(0, 200)}`)
    })
    page.on('pageerror', (e) => logs.push(`pageerror: ${e.message.slice(0, 200)}`))
    await page.goto(base + url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    for (const l of logs) fail(browser.browserType().name(), url, l)
    await page.close()
  }
}

async function checkNavigation(browser, base) {
  const name = browser.browserType().name()
  const page = await browser.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  for (const route of ['/product', '/contact', '/policy', '/']) {
    const clicked = await page.evaluate((to) => {
      const a = [...document.querySelectorAll('a')].find((x) => (x.getAttribute('href') || '').split('?')[0] === to)
      a?.click()
      return Boolean(a)
    }, route)
    if (!clicked) fail(name, `nav ${route}`, 'no link to click')
    await page.waitForTimeout(400)
    expectHead(name, `nav -> ${route}`, await readHead(page), route)
  }
  await page.close()
}

// A trailing slash must not change the canonical, and an unknown URL (served as the
// 404 shell) must not get a canonical or hreflang pointing at itself.
async function checkEdgeUrls(browser, base) {
  const name = browser.browserType().name()
  for (const url of ['/product/', '/en/policy/']) {
    const page = await browser.newPage()
    await page.goto(base + url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    expectHead(name, url, await readHead(page), url.replace(/\/$/, ''))
    await page.close()
  }
  for (const url of ['/blog', '/en/foo']) {
    const page = await browser.newPage()
    await page.goto(base + url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    const head = await readHead(page)
    if (head.canonical.length) fail(name, url, `404 page has canonical [${head.canonical}]`)
    if (Object.keys(head.alternates).length) fail(name, url, '404 page has hreflang links')
    await page.close()
  }
}

const server = await serve()
const base = `http://127.0.0.1:${server.address().port}`
for (const name of (process.env.BROWSERS ?? 'chromium').split(',')) {
  const browser = await engines[name].launch()
  await checkLoads(browser, base)
  await checkNavigation(browser, base)
  await checkEdgeUrls(browser, base)
  await browser.close()
}
server.close()

if (failures.length) {
  console.error(`[check-browser] ${failures.length} problem(s):`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}
console.log('[check-browser] OK')
