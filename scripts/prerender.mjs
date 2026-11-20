// Prerenders every page to static HTML after `vite build`.
//
// This is an SPA: without this step every URL is served the same index.html with
// an empty <div id="root">, so crawlers that don't run JavaScript — social
// previews (KakaoTalk, Slack) and most AI search bots — see no headings, no copy
// and the home page's metadata on every page.
//
// For each page in src/seo/meta.js (Korean at the root, English under /en) we
// render the app at that URL, bake in its <title>/description/OG tags, robots,
// canonical and hreflang links, and write dist/<path>/index.html. The client
// still boots with createRoot and re-renders, so nothing at runtime changes.
//
// Unknown URLs get dist/404.html with a real 404 status: vercel.json must hold no
// catch-all rewrite, or the host answers them 200 (a soft 404). The only fallbacks
// are the literal rewrites for client-only routes (/blog, /heimlog) to _shell.html
// (dist/en/_shell.html under /en): the untouched SPA shell, so they never flash
// the home page. scripts/check-soft-404.mjs gates both.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'

const DIST = new URL('../dist/', import.meta.url)

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

let failed = false
try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
  const { metaFor, NOT_FOUND, PRERENDER_PATHS, ORIGIN } = await vite.ssrLoadModule('/src/seo/meta.js')
  const { localizePath } = await vite.ssrLoadModule('/src/i18n/LanguageContext.jsx')

  const template = await readFile(new URL('index.html', DIST), 'utf8')

  const esc = (v) =>
    v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  // [regex, replacement, label] — every swap must match exactly once, otherwise
  // index.html drifted and pages would silently ship the wrong tags.
  function swap(html, swaps) {
    for (const [re, value, label] of swaps) {
      const hits = html.match(new RegExp(re.source, 'g'))?.length ?? 0
      if (hits !== 1) throw new Error(`[prerender] expected 1 match for ${label}, found ${hits}`)
      html = html.replace(re, value)
    }
    return html
  }

  function page(path, lang, body) {
    const { title, description, noindex } = metaFor(path, lang)
    const url = ORIGIN + localizePath(path, lang)
    const ko = ORIGIN + path
    const en = ORIGIN + localizePath(path, 'en')
    const links = [
      `<link rel="canonical" href="${url}" />`,
      `<link rel="alternate" hreflang="ko" href="${ko}" />`,
      `<link rel="alternate" hreflang="en" href="${en}" />`,
      `<link rel="alternate" hreflang="x-default" href="${ko}" />`,
    ].join('\n    ')
    return swap(template, [
      [/<html lang="ko"/, `<html lang="${lang}"`, 'html lang'],
      [/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`, 'title'],
      [/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`, 'description'],
      [/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`, 'og:title'],
      [/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`, 'og:description'],
      [/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`, 'twitter:title'],
      [/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`, 'twitter:description'],
      [/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, 'og:url'],
      [/content="ko_KR"/, `content="${lang === 'en' ? 'en_US' : 'ko_KR'}"`, 'og:locale'],
      [/<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}" />\n    ${links}`, 'robots'],
      [/<div id="root"><\/div>/, `<div id="root">${body}</div>`, 'root'],
    ])
  }

  // 404.html: the host serves this one file, with status 404, for every unknown URL
  // in either language, so the copy is bilingual and the page is noindex with no
  // canonical/hreflang. The client boots with createRoot and swaps in the app's own
  // NotFound page for the visitor's language.
  const copy404 = `<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;background:#050d1e;color:#cdd9ec;font-family:sans-serif">
      <p style="margin:0;font-size:64px;font-weight:700;color:#fff">404</p>
      <p lang="ko" style="margin:0;font-size:18px">페이지를 찾을 수 없어요.</p>
      <p lang="en" style="margin:0;font-size:18px">We couldn’t find that page.</p>
      <p style="margin:8px 0 0"><a href="/" style="color:#fff">홈으로</a> · <a href="/en" style="color:#fff">Home</a></p>
    </div>`
  await writeFile(
    new URL('404.html', DIST),
    swap(template, [
      [/<title>[^<]*<\/title>/, `<title>${esc(NOT_FOUND.title)}</title>`, 'title'],
      [/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(NOT_FOUND.description)}$2`, 'description'],
      [/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(NOT_FOUND.title)}$2`, 'og:title'],
      [/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(NOT_FOUND.description)}$2`, 'og:description'],
      [/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(NOT_FOUND.title)}$2`, 'twitter:title'],
      [/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${esc(NOT_FOUND.description)}$2`, 'twitter:description'],
      // No og:url: a shared dead link must not name a live page.
      [/\s*<meta property="og:url" content="[^"]*" \/>/, '', 'og:url'],
      [/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, follow" />', 'robots'],
      [/<div id="root"><\/div>/, `<div id="root">${copy404}</div>`, 'root'],
    ]),
  )

  // SPA fallback shells (empty root) for the literal client-only rewrites.
  await writeFile(new URL('_shell.html', DIST), template)
  await mkdir(new URL('en/', DIST), { recursive: true })
  await writeFile(new URL('en/_shell.html', DIST), page('/', 'en', '').replace(/\n    <link rel="(canonical|alternate)"[^>]*>/g, ''))

  let count = 0
  for (const lang of ['ko', 'en']) {
    for (const path of PRERENDER_PATHS) {
      const url = localizePath(path, lang)
      const html = page(path, lang, render(url))
      const dir = new URL(`.${url === '/' ? '' : url}/`, DIST)
      await mkdir(dir, { recursive: true })
      await writeFile(new URL('index.html', dir), html)
      count++
    }
  }
  // sitemap.xml from the same page list, so a new page can't be left out.
  // noindex placeholders are skipped; each URL lists its language twin.
  const entries = PRERENDER_PATHS.filter((p) => !metaFor(p, 'ko').noindex).flatMap((path) => {
    const ko = ORIGIN + path
    const en = ORIGIN + localizePath(path, 'en')
    const priority = path === '/' ? '1.0' : path.includes('/industry/') ? '0.8' : '0.6'
    return [ko, en].map(
      (loc) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="ko" href="${ko}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${ko}"/>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`,
    )
  })
  await writeFile(
    new URL('sitemap.xml', DIST),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`,
  )

  console.log(`[prerender] wrote ${count} pages + 404.html + 2 SPA shells + sitemap.xml (${entries.length} URLs)`)
} catch (err) {
  console.error(err)
  failed = true
} finally {
  await vite.close()
}
if (failed) process.exit(1)
