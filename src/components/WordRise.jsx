import { useEffect, useRef, useState } from 'react'

// Headline whose words rise out of their own line, one after another.
export default function WordRise({ text, as: Tag = 'h2', className = '', delay = 60 }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return setOn(true)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} aria-label={text} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden>
          {i > 0 && ' '}
          <span className="-my-[0.08em] inline-block overflow-hidden py-[0.08em] align-top">
            <span
              className="inline-block transition-transform duration-[800ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
              style={{ transform: on ? 'none' : 'translateY(110%)', transitionDelay: `${delay + i * 45}ms` }}
            >
              {w}
            </span>
          </span>
        </span>
      ))}
    </Tag>
  )
}
