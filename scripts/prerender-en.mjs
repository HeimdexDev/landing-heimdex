// Social crawlers (KakaoTalk, Slack, Facebook, X) don't run JavaScript — they read
// the raw HTML response. Since this is an SPA where every route is served the same
// index.html, /en links would otherwise share the Korean OG tags.
//
// So after the Vite build we emit a second static shell, dist/en/index.html, with
// English metadata. vercel.json routes /en and /en/* to it. The JS bundle is
// referenced by absolute path, so the same app boots from either shell.
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const DIST = new URL('../dist/', import.meta.url)

const KO_TITLE = 'HEIMDEX — 영상 속 원하는 장면, 검색 한 줄로'
const KO_DESC =
  '업로드 없이, 시청 없이. 검색 한 줄로 필요한 장면을 찾고 숏폼까지 자동으로 만들어 드립니다.'

const EN_TITLE = 'HEIMDEX — The scene you need, in a single search'
const EN_DESC =
  'No uploads, no watching. One search finds the scene you need — and even builds the short-form for you.'

// [find, replace, label] — every swap must match at least once, otherwise the
// source template drifted and the English shell would silently ship Korean tags.
const swaps = [
  ['<html lang="ko" translate="no">', '<html lang="en" translate="no">', 'html lang'],
  [KO_TITLE, EN_TITLE, 'title'],
  [KO_DESC, EN_DESC, 'description'],
  ['content="ko_KR"', 'content="en_US"', 'og:locale'],
  [
    '<meta property="og:url" content="https://www.heimdex.co/" />',
    '<meta property="og:url" content="https://www.heimdex.co/en" />',
    'og:url',
  ],
]

const src = await readFile(new URL('index.html', DIST), 'utf8')

let html = src
for (const [find, replace, label] of swaps) {
  if (!html.includes(find)) {
    console.error(`[prerender-en] no match for ${label}: ${find}`)
    process.exit(1)
  }
  html = html.replaceAll(find, replace)
}

await mkdir(new URL('en/', DIST), { recursive: true })
await writeFile(new URL('en/index.html', DIST), html)
console.log('[prerender-en] wrote dist/en/index.html')
