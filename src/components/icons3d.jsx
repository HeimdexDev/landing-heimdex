import { useId } from 'react'

// toss.im-style object icons — soft gradients, a white highlight, and a small
// status badge where the meaning needs one. Drawn on a 48×48 grid so they sit
// next to each other at any size. Decorative: always aria-hidden.

function Svg({ size, children, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      {children}
    </svg>
  )
}

// Gradient ids must be unique per instance — the same icon renders many times.
function useIds(...names) {
  const base = useId().replace(/:/g, '')
  return Object.fromEntries(names.map((n) => [n, `${base}-${n}`]))
}

export function IconSearch3d({ size = 48, className }) {
  const id = useIds('ring', 'lens', 'handle')
  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={id.ring} x1="6" y1="6" x2="36" y2="36">
          <stop stopColor="#5F86B0" />
          <stop offset="1" stopColor="#1B3D60" />
        </linearGradient>
        <radialGradient id={id.lens} cx="0.38" cy="0.35" r="0.75">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#B5C9DF" />
        </radialGradient>
        <linearGradient id={id.handle} x1="30" y1="30" x2="42" y2="42">
          <stop stopColor="#4E5968" />
          <stop offset="1" stopColor="#191F28" />
        </linearGradient>
      </defs>
      <rect x="29" y="26" width="7.5" height="18" rx="3.75" transform="rotate(-45 32.75 35)" fill={`url(#${id.handle})`} />
      <circle cx="21" cy="21" r="15" fill={`url(#${id.ring})`} />
      <circle cx="21" cy="21" r="10.5" fill={`url(#${id.lens})`} />
      <path d="M14.5 18.5a7.5 7.5 0 0 1 5-5.2" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  )
}

// The three security icons share one recipe so they read as a set: a light
// silver body, the same brand-blue badge in the bottom-right corner, and a
// white glyph in the badge that carries the meaning.
const SILVER = ['#F4F7FB', '#9DB2CB']
function Badge({ id, children }) {
  return (
    <>
      <circle cx="36" cy="36" r="9" fill={`url(#${id})`} stroke="#fff" strokeWidth="2.5" />
      {children}
    </>
  )
}
function Grad({ id, from, to, x1 = 4, y1 = 4, x2 = 44, y2 = 44 }) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
      <stop stopColor={from} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  )
}
const BADGE = ['#6AAEFF', '#2B7FEA']

// Cloud with a "no" badge — nothing gets uploaded.
export function IconNoCloud3d({ size = 48, className }) {
  const id = useIds('body', 'badge')
  return (
    <Svg size={size} className={className}>
      <defs>
        <Grad id={id.body} from={SILVER[0]} to={SILVER[1]} x1={6} y1={10} x2={40} y2={38} />
        <Grad id={id.badge} from={BADGE[0]} to={BADGE[1]} x1={28} y1={28} x2={44} y2={44} />
      </defs>
      <path d="M13 36h21.5a9 9 0 0 0 1.4-17.9A12 12 0 0 0 12.7 20.3 7.9 7.9 0 0 0 13 36z" fill={`url(#${id.body})`} />
      <ellipse cx="20" cy="20" rx="6" ry="3" transform="rotate(-25 20 20)" fill="#fff" opacity="0.8" />
      <Badge id={id.badge}>
        <circle cx="36" cy="36" r="4.6" stroke="#fff" strokeWidth="2.2" />
        <path d="M32.8 39.2l6.4-6.4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      </Badge>
    </Svg>
  )
}

// Two rack units with a check badge — runs on your own servers.
export function IconServer3d({ size = 48, className }) {
  const id = useIds('body', 'badge')
  return (
    <Svg size={size} className={className}>
      <defs>
        <Grad id={id.body} from={SILVER[0]} to={SILVER[1]} x1={6} y1={6} x2={38} y2={40} />
        <Grad id={id.badge} from={BADGE[0]} to={BADGE[1]} x1={28} y1={28} x2={44} y2={44} />
      </defs>
      {[7, 24].map((y) => (
        <g key={y}>
          <rect x="4" y={y} width="34" height="14" rx="4.5" fill={`url(#${id.body})`} />
          <rect x="6" y={y + 1.5} width="30" height="3" rx="1.5" fill="#fff" opacity="0.7" />
          <circle cx="10.5" cy={y + 8.5} r="2" fill="#3DDC84" />
          <rect x="15.5" y={y + 7.3} width="12" height="2.4" rx="1.2" fill="#5F7A99" opacity="0.45" />
        </g>
      ))}
      <Badge id={id.badge}>
        <path d="M32.3 36.2l2.5 2.5 4.6-4.8" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </Badge>
    </Svg>
  )
}

// A portrait whose face is a mosaic, with an AI sparkle badge — automatic blur.
export function IconBlurFace3d({ size = 48, className }) {
  const id = useIds('body', 'badge', 'clip')
  // 3×3 mosaic over the head; varied shades read as a pixelated face.
  const tiles = [0.55, 0.3, 0.5, 0.35, 0.6, 0.3, 0.5, 0.35, 0.55]
  return (
    <Svg size={size} className={className}>
      <defs>
        <Grad id={id.body} from={SILVER[0]} to={SILVER[1]} x1={4} y1={5} x2={36} y2={40} />
        <Grad id={id.badge} from={BADGE[0]} to={BADGE[1]} x1={28} y1={28} x2={44} y2={44} />
        <clipPath id={id.clip}>
          <rect x="4" y="5" width="32" height="34" rx="7" />
        </clipPath>
      </defs>
      <rect x="4" y="5" width="32" height="34" rx="7" fill={`url(#${id.body})`} />
      <rect x="6" y="7" width="28" height="4" rx="2" fill="#fff" opacity="0.6" />
      <g clipPath={`url(#${id.clip})`}>
        <path d="M8.5 40v-2a8.5 8.5 0 0 1 8.5-8.5h6a8.5 8.5 0 0 1 8.5 8.5v2z" fill="#5F7A99" opacity="0.55" />
      </g>
      {tiles.map((o, i) => (
        <rect key={i} x={13.6 + (i % 3) * 4.6} y={12.4 + Math.floor(i / 3) * 4.6} width="4.2" height="4.2" rx="1" fill="#3F5D80" opacity={o} />
      ))}
      <Badge id={id.badge}>
        <path d="M36 31.2c.5 2.6 2.2 4.3 4.8 4.8-2.6.5-4.3 2.2-4.8 4.8-.5-2.6-2.2-4.3-4.8-4.8 2.6-.5 4.3-2.2 4.8-4.8z" fill="#fff" />
      </Badge>
    </Svg>
  )
}

export function IconVideo3d({ size = 48, className }) {
  const id = useIds('tile')
  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={id.tile} x1="4" y1="8" x2="44" y2="40">
          <stop stopColor="#FFC15E" />
          <stop offset="1" stopColor="#FF7A1A" />
        </linearGradient>
      </defs>
      <rect x="4" y="8" width="40" height="32" rx="10" fill={`url(#${id.tile})`} />
      <rect x="4" y="8" width="40" height="10" rx="5" fill="#fff" opacity="0.18" />
      <path d="M20.5 17.8c0-1.2 1.3-1.9 2.3-1.3l9 5.7c.9.6.9 2 0 2.6l-9 5.7c-1 .6-2.3-.1-2.3-1.3z" fill="#fff" />
    </Svg>
  )
}

export function IconLayers3d({ size = 48, className }) {
  const id = useIds('top')
  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={id.top} x1="6" y1="6" x2="42" y2="24">
          <stop stopColor="#B5C9DF" />
          <stop offset="1" stopColor="#3A6694" />
        </linearGradient>
      </defs>
      <path d="M24 22l18 9-18 9-18-9z" fill="#0A2240" />
      <path d="M24 15l18 9-18 9-18-9z" fill="#1B3D60" />
      <path d="M24 8l18 9-18 9-18-9z" fill={`url(#${id.top})`} />
      <path d="M15 15.5l9-4.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
    </Svg>
  )
}

export function IconSparkClip3d({ size = 48, className }) {
  const id = useIds('tile')
  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={id.tile} x1="4" y1="8" x2="44" y2="40">
          <stop stopColor="#5EE0D2" />
          <stop offset="1" stopColor="#13A89E" />
        </linearGradient>
      </defs>
      <rect x="4" y="8" width="40" height="32" rx="10" fill={`url(#${id.tile})`} />
      <rect x="4" y="8" width="40" height="10" rx="5" fill="#fff" opacity="0.18" />
      <path d="M24 14.5l2.7 6.8 6.8 2.7-6.8 2.7-2.7 6.8-2.7-6.8-6.8-2.7 6.8-2.7z" fill="#fff" />
      <circle cx="34" cy="16" r="1.8" fill="#fff" opacity="0.85" />
    </Svg>
  )
}

export function IconAlert3d({ size = 48, className }) {
  const id = useIds('tri')
  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={id.tri} x1="8" y1="6" x2="40" y2="42">
          <stop stopColor="#FFD15C" />
          <stop offset="1" stopColor="#FF9F1A" />
        </linearGradient>
      </defs>
      <path
        d="M20.5 8.3a4 4 0 0 1 7 0l16 27.7a4 4 0 0 1-3.5 6H8a4 4 0 0 1-3.5-6z"
        fill={`url(#${id.tri})`}
      />
      <rect x="21.75" y="17" width="4.5" height="13" rx="2.25" fill="#fff" />
      <circle cx="24" cy="35" r="2.6" fill="#fff" />
    </Svg>
  )
}
