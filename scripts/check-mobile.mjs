// Mobile layout check — every page at 360 / 390 / 430px, nothing may stick out
// sideways (see scripts/mobile-overflow.js for what counts).
//
//   npm run check:mobile                 # builds nothing; checks the current dist/
//   npm run check:mobile -- --shots      # also saves 390px full-page screenshots
//   npm run check:mobile -- --url http://localhost:5173   # check the dev server
//   npm run check:mobile -- --only /data # just the routes starting with /data
//   npm run check:mobile -- --widths 375,390
//
// Exits 1 if any page overflows, so it can gate a build.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { findOverflow } from './mobile-overflow.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const opt = (name) => {
  const i = args.indexOf(`--${name}`)
  return i < 0 ? null : args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true
}
const WIDTHS = String(opt('widths') || '360,390,430').split(',').map(Number)
const SHOTS = !!opt('shots')
const ONLY = opt('only')
const REPORT = path.join(root, 'mobile-report')

let playwright
try {
  playwright = await import('playwright')
} catch {
  console.error('playwright가 없어요. 한 번만 설치해 주세요:\n  npm i -D playwright && npx playwright install chromium')
  process.exit(2)
}

// Routes = every prerendered page in dist/.
const dist = path.join(root, 'dist')
if (!fs.existsSync(dist)) {
  console.error('dist/가 없어요. 먼저 `npm run build`를 실행해 주세요.')
  process.exit(2)
}
const routes = []
;(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name === 'index.html') routes.push('/' + path.relative(dist, dir).split(path.sep).join('/'))
  }
})(dist)
const list = routes.map((r) => r.replace(/\/$/, '') || '/').filter((r) => !ONLY || r.startsWith(ONLY)).sort()

// Serve dist/ unless a URL was given.
let base = typeof opt('url') === 'string' ? opt('url').replace(/\/$/, '') : null
let server
if (!base) {
  const { preview } = await import('vite')
  server = await preview({ root, preview: { port: 4319, strictPort: false, open: false }, logLevel: 'silent' })
  base = server.resolvedUrls.local[0].replace(/\/$/, '')
}

const launch = async () => {
  try {
    return await playwright.chromium.launch({ channel: 'chrome' })
  } catch {
    return playwright.chromium.launch()
  }
}
const browser = await launch()
if (SHOTS) fs.mkdirSync(REPORT, { recursive: true })

const fails = []
for (const W of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: W, height: 844 }, deviceScaleFactor: SHOTS ? 2 : 1, reducedMotion: 'reduce' })
  for (const r of list) {
    await page.goto(base + r, { waitUntil: 'networkidle' })
    // Scroll through once so lazy images and reveal-on-scroll content settle.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y)
        await new Promise((res) => setTimeout(res, 30))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(250)
    // Elements can't cross back to Node, so drop them in the page.
    const res = await page.evaluate(`(() => { const x = (${findOverflow.toString()})(window); return { ...x, offenders: x.offenders.map(({ el, ...o }) => o) } })()`)
    const bad = res.offenders.length > 0 || res.scrollWidth > W
    console.log(`${bad ? '✗' : '✓'} ${String(W).padEnd(4)} ${r}`)
    if (bad) {
      for (const o of res.offenders.slice(0, 8)) console.log(`      ${o.by}px 넘침  ${o.label}`)
      fails.push({ W, r, res })
    }
    if (SHOTS && W === 390) {
      await page.screenshot({ path: path.join(REPORT, `${(r === '/' ? 'home' : r.slice(1)).replace(/\//g, '_')}.png`), fullPage: true })
    }
  }
  await page.close()
}
await browser.close()
await server?.close()

const total = list.length * WIDTHS.length
console.log(`\n${total - fails.length}/${total} 통과 (${WIDTHS.join(' / ')}px × ${list.length}페이지)`)
if (SHOTS) console.log(`390px 스크린샷: ${path.relative(root, REPORT)}/`)
process.exit(fails.length ? 1 : 0)
