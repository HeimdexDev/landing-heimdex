// Finds what sticks out past the right/left edge of a phone-width viewport.
//
// Shared by `npm run check:mobile` (Playwright, scripts/check-mobile.mjs) and the
// dev-only side-by-side viewer (/mobile-check.html). It must stay a single
// self-contained function — Playwright serialises it into the page.
//
// Why not just compare scrollWidth: the app shell (#root > div) has
// `overflow-x: clip`, so the page never scrolls sideways — anything too wide is
// silently cut off instead. So this walks the elements and reports any that
// reach past the viewport, unless an inner scroll/clip container (a carousel, a
// marquee, a card with overflow-hidden) is deliberately holding it. The shell's
// own clip doesn't count as "holding" it.
export function findOverflow(win) {
  const doc = win.document
  const W = doc.documentElement.clientWidth
  const shell = doc.querySelector('#root > div')
  const held = (el) => {
    for (let a = el.parentElement; a && a !== doc.body; a = a.parentElement) {
      if (a === shell) continue
      if (/(hidden|auto|scroll|clip)/.test(win.getComputedStyle(a).overflowX)) return true
    }
    return false
  }
  const label = (el) => {
    const cls = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean).slice(0, 4).join('.')
    const sec = el.closest('section[id], section, header, footer, nav')
    const where = sec ? sec.id || sec.tagName.toLowerCase() : 'page'
    const text = (el.innerText || el.getAttribute('alt') || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 28)
    return `${where} › ${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}${text ? ` "${text}"` : ''}`
  }
  const out = []
  for (const el of doc.body.querySelectorAll('*')) {
    const s = win.getComputedStyle(el)
    if (s.display === 'none' || s.visibility === 'hidden' || s.position === 'fixed') continue
    const r = el.getBoundingClientRect()
    if (!r.width || (r.right <= W + 1 && r.left >= -1)) continue
    if (held(el)) continue
    // Report the outermost offender only, not every descendant of it.
    const p = el.parentElement && el.parentElement.getBoundingClientRect()
    if (p && (p.right > W + 1 || p.left < -1) && !held(el.parentElement)) continue
    out.push({ el, label: label(el), left: Math.round(r.left), right: Math.round(r.right), by: Math.round(Math.max(r.right - W, -r.left)) })
  }
  return { width: W, scrollWidth: doc.documentElement.scrollWidth, offenders: out }
}
