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

export function IconNoCloud3d({ size = 48, className }) {
  const id = useIds('cloud', 'badge')
  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={id.cloud} x1="6" y1="10" x2="40" y2="38">
          <stop stopColor="#DCE6F1" />
          <stop offset="1" stopColor="#5F86B0" />
        </linearGradient>
        <linearGradient id={id.badge} x1="28" y1="28" x2="44" y2="44">
          <stop stopColor="#FF7B7B" />
          <stop offset="1" stopColor="#F04452" />
        </linearGradient>
      </defs>
      <path
        d="M13 36h21.5a9 9 0 0 0 1.4-17.9A12 12 0 0 0 12.7 20.3 7.9 7.9 0 0 0 13 36z"
        fill={`url(#${id.cloud})`}
      />
      <ellipse cx="20" cy="20" rx="6" ry="3" transform="rotate(-25 20 20)" fill="#fff" opacity="0.7" />
      <circle cx="36" cy="36" r="9" fill={`url(#${id.badge})`} stroke="#fff" strokeWidth="2.5" />
      <path d="M32 40l8-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  )
}

export function IconServer3d({ size = 48, className }) {
  const id = useIds('unit', 'shield')
  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={id.unit} x1="6" y1="6" x2="38" y2="40">
          <stop stopColor="#6B7684" />
          <stop offset="1" stopColor="#333D4B" />
        </linearGradient>
        <linearGradient id={id.shield} x1="28" y1="26" x2="44" y2="46">
          <stop stopColor="#5F86B0" />
          <stop offset="1" stopColor="#1B3D60" />
        </linearGradient>
      </defs>
      {[6, 24].map((y) => (
        <g key={y}>
          <rect x="4" y={y} width="36" height="15" rx="5" fill={`url(#${id.unit})`} />
          <rect x="4" y={y} width="36" height="5" rx="2.5" fill="#fff" opacity="0.12" />
          <circle cx="11" cy={y + 7.5} r="2.2" fill="#3DDC84" />
          <circle cx="17.5" cy={y + 7.5} r="2.2" fill="#8BA9C9" />
          <rect x="24" y={y + 6} width="11" height="3" rx="1.5" fill="#fff" opacity="0.28" />
        </g>
      ))}
      <path
        d="M36 26.5l8 3v5.6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-5.6z"
        fill={`url(#${id.shield})`}
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M32.6 35.6l2.4 2.4 4.4-4.6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// A face reduced to mosaic blocks — "privacy blur".
export function IconBlurFace3d({ size = 48, className }) {
  const id = useIds('tile')
  const blocks = [
    [18, 10, 0.95], [24, 10, 0.75],
    [15, 16, 0.8], [21, 16, 0.55], [27, 16, 0.9],
    [15, 22, 0.65], [21, 22, 0.95], [27, 22, 0.6],
    [18, 28, 0.85], [24, 28, 0.7],
  ]
  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={id.tile} x1="4" y1="4" x2="44" y2="44">
          <stop stopColor="#B7A3FF" />
          <stop offset="1" stopColor="#6B4BFF" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="12" fill={`url(#${id.tile})`} />
      <rect x="4" y="4" width="40" height="12" rx="6" fill="#fff" opacity="0.12" />
      {blocks.map(([x, y, o]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" rx="1.5" fill="#fff" opacity={o} />
      ))}
      <path d="M12 44v-3a8 8 0 0 1 8-8h8a8 8 0 0 1 8 8v3z" fill="#fff" opacity="0.5" />
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
