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

const DIST = new URL('../dist/', import.meta.url)
const failures = []
const fail = (msg) => failures.push(msg)

const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
if ('routes' in vercel) fail('vercel.json: "routes" overrides rewrites and redirects; do not use it')
for (const { source, destination } of vercel.rewrites ?? []) {
  if (/[:*(?+]/.test(source)) fail(`vercel.json: pattern rewrite ${source} turns unknown URLs into 200 pages`)
  if (!existsSync(new URL(destination.replace(/^\//, ''), DIST))) fail(`vercel.json: ${destination} is not in dist`)
}

// Netlify mirror (public/_redirects): a catch-all with status 200 is the same soft 404.
const redirectsFile = new URL('../public/_redirects', import.meta.url)
if (existsSync(redirectsFile)) {
  for (const line of readFileSync(redirectsFile, 'utf8').split('\n')) {
    const [source, , status] = line.trim().split(/\s+/)
    if (source && !source.startsWith('#') && source.includes('*') && status === '200') {
      fail(`public/_redirects: "${line.trim()}" answers unknown URLs with 200`)
    }
  }
}

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
} finally {
  await vite.close()
}

if (failures.length) {
  console.error(`[check-soft-404] ${failures.length} problem(s):\n- ${failures.join('\n- ')}`)
  process.exit(1)
}
console.log('[check-soft-404] ok')
