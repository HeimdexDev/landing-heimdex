import { useEffect, useRef, useState } from 'react'

// Headline that writes itself in: each character fades up out of a blur, a
// beat after the one before (Framer "Stack" title). Words never split across
// lines; '\n' breaks a line. Screen readers get the plain text once, via
// aria-label.
export default function CharReveal({ text, as: Tag = 'h2', className = '', step = 0.02 }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      setOn(true)
      return
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setOn(true)
        io.disconnect()
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  let i = 0
  // '\n' in the text starts a new line (each line its own block).
  return (
    <Tag ref={ref} aria-label={text.replace(/\n/g, ' ')} className={className}>
      {text.split('\n').map((line, l) => (
        <span key={l} className="block">
          {line.split(' ').map((word, w) => (
            <span key={w}>
              {w > 0 && ' '}
              <span aria-hidden className="inline-block whitespace-nowrap">
                {[...word].map((ch) => {
                  const d = (i++ * step).toFixed(2)
                  return (
                    <span
                      key={i}
                      className="inline-block transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        transitionDelay: `${d}s`,
                        opacity: on ? 1 : 0,
                        transform: on ? 'none' : 'translateY(10px)',
                        filter: on ? 'blur(0)' : 'blur(6px)',
                      }}
                    >
                      {ch}
                    </span>
                  )
                })}
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
