import { useEffect, useRef, useState } from 'react'

// Scroll-motion primitives for the toss.im-style layout.
//
// Scroll-linked effects never re-render React per frame: progress is written to
// a CSS variable (--p, 0→1) on the element and the markup reads it through
// calc(). Only discrete changes (which item is active) go through state.
//
// All of it is desktop-only and off under prefers-reduced-motion — below that the
// pages fall back to plain stacked layouts. On the server (prerender) every hook
// reports "no motion", so the static HTML is the stacked layout too.

export const MOTION_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'

export function useMedia(query) {
  const [match, setMatch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatch(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return match
}

export const useMotion = () => useMedia(MOTION_QUERY)

// Writes scroll progress to `--p` on ref.current.
//   mode 'track': 0 when the element's top reaches the viewport top, 1 when its
//                 bottom reaches the viewport bottom — for tall sections whose
//                 content is position: sticky.
//   mode 'enter': 0 when the element's top enters at the bottom of the viewport,
//                 1 once it has risen to `end` (fraction of viewport height).
export function useScrollProgress(ref, { enabled = true, mode = 'track', end = 0.35, onChange } = {}) {
  const cb = useRef(onChange)
  cb.current = onChange

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!enabled) {
      el.style.removeProperty('--p')
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      let p
      if (mode === 'enter') {
        p = (vh - r.top) / (vh * (1 - end))
      } else {
        const total = r.height - vh
        p = total > 0 ? -r.top / total : 0
      }
      p = Math.min(1, Math.max(0, p))
      el.style.setProperty('--p', p.toFixed(4))
      cb.current?.(p)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, enabled, mode, end])
}

// Active index of an n-step sticky section, driven by its track progress.
export function useStep(ref, n, enabled) {
  const [step, setStep] = useState(0)
  useScrollProgress(ref, {
    enabled,
    onChange: (p) => setStep(Math.min(n - 1, Math.floor(p * n))),
  })
  return step
}

// Scrolls the window so a sticky section shows step i of n.
export function scrollToStep(el, i, n) {
  const total = el.offsetHeight - window.innerHeight
  const top = window.scrollY + el.getBoundingClientRect().top
  window.scrollTo({ top: top + (total * (i + 0.5)) / n, behavior: 'smooth' })
}

function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, shown]
}

// Heading whose lines sharpen in one after another (blur → clear, rising).
export function BlurLines({ lines, as: Tag = 'h2', className = '', lineClassName = '', delay = 0 }) {
  const [ref, shown] = useInView(0.3)
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={`block transition-[opacity,filter,transform] duration-[900ms] ease-out ${lineClassName} ${
            shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-5 opacity-0 blur-[10px]'
          }`}
          style={{ transitionDelay: `${delay + i * 140}ms` }}
        >
          {/* leading space keeps lines apart as words in the raw HTML */}
          {i > 0 && ' '}
          {line}
        </span>
      ))}
    </Tag>
  )
}

// Heading whose words fill in from grey to ink as it scrolls up the screen.
export function FillWords({ text, as: Tag = 'h2', className = '' }) {
  const ref = useRef(null)
  const motion = useMotion()
  useScrollProgress(ref, { enabled: motion, mode: 'enter', end: 0.45 })
  const words = text.split(' ')
  const n = words.length
  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="transition-opacity duration-150"
          style={motion ? { opacity: `clamp(0.16, calc(var(--p) * ${n + 1} - ${i}), 1)` } : undefined}
        >
          {w}
          {i < n - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}

// Left-edge section rail (toss.im's tick column). Each item is { id, label };
// the tick of the section in view grows and its label shows on hover.
export function ScrollRail({ items }) {
  const [active, setActive] = useState(items[0]?.id)
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.01] },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  return (
    <nav
      aria-label="Sections"
      className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2.5 xl:flex"
    >
      {items.map((it) => {
        const on = it.id === active
        return (
          <a key={it.id} href={`#${it.id}`} className="group flex items-center gap-2" aria-current={on || undefined}>
            <span
              className={`h-[2px] rounded-full transition-all duration-300 ${
                on ? 'w-5 bg-ink' : 'w-2.5 bg-ink/25 group-hover:bg-ink/50'
              }`}
            />
            <span className="whitespace-nowrap rounded-md bg-ink px-2 py-0.5 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              {it.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
