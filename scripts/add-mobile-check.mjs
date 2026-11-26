// Adds the mobile viewer (mobile-check.html) to an existing dist/ so it can be
// shared from the same host as the site — it loads the pages in same-origin
// iframes, so it only works next to them. `npm run build:check` = build + this.
// A plain `npm run build` leaves it out.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
if (!fs.existsSync(dist)) {
  console.error('dist/가 없어요. 먼저 `npm run build`를 실행해 주세요.')
  process.exit(1)
}
fs.mkdirSync(path.join(dist, 'scripts'), { recursive: true })
fs.copyFileSync(path.join(root, 'mobile-check.html'), path.join(dist, 'mobile-check.html'))
fs.copyFileSync(path.join(root, 'scripts/mobile-overflow.js'), path.join(dist, 'scripts/mobile-overflow.js'))
console.log('[mobile-check] dist/mobile-check.html 추가됨')
