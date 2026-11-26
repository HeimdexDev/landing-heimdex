import { useId } from 'react'

// Neon-glass isometric illustrations for the home Security bento. One kit —
// near-black stage, dark glass tiles with glowing rims, glowing circuit lines —
// with a single accent-blue "hero" element per scene and periwinkle for the rest:
//   local   — a storage board: video cells wired into one index tile, nothing leaves
//   onprem  — a sealed platform: servers around a glowing shield core
//   blur    — a stack of video frames; the front one has faces and plate mosaicked
// Scenes fill and bleed off the 3:2 stage on purpose.

const ISO = 'matrix(0.866 0.5 -0.866 0.5 0 0)'
const HI = '#4DA3FF' // accent glow (the one element that matters)
const LO = '#7C8CFF' // periwinkle glow for supporting elements
const GLASS_TOP = 'rgba(40,52,104,0.55)'
const GLASS_SIDE = '#141A3A'

const GLYPHS = {
  film: <><rect x="3" y="4.5" width="18" height="15" rx="2" /><path d="M7.5 4.5v15M16.5 4.5v15M3 12h18" /></>,
  index: <><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /><path d="M8 10.5h5" /></>,
  server: <><rect x="3.5" y="4" width="17" height="7" rx="2" /><rect x="3.5" y="13" width="17" height="7" rx="2" /><path d="M7.5 7.5h.01M7.5 16.5h.01" /></>,
  database: <><ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" /><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13" /><path d="M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8.5 20h7M12 16v4" /></>,
  lock: <><rect x="5" y="11" width="14" height="9.5" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" /></>,
  shield: <><path d="M12 3l7 3v5.2c0 4.4-3 8-7 9.8-4-1.8-7-5.4-7-9.8V6z" /><path d="M9 12l2.2 2.2L15.5 10" /></>,
}

function Glyph({ name, x, y, size, color, sw = 1.7 }) {
  const k = size / 24
  return (
    <g transform={`translate(${x - 12 * k} ${y - 12 * k}) scale(${k})`} fill="none" stroke={color} strokeWidth={sw / k} strokeLinecap="round" strokeLinejoin="round">
      {GLYPHS[name]}
    </g>
  )
}

// Extruded glass tile on the plane; `glow` = HI / LO / null (unlit).
function Tile({ ids, x, y, s, depth, r = 10, glow, glyph }) {
  const rect = (p) => <rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx={r} {...p} />
  const lit = Boolean(glow)
  return (
    <g transform={`translate(0 ${-depth})`}>
      {Array.from({ length: depth }, (_, i) => (
        <g key={i} transform={`translate(0 ${depth - i})`}>
          <g transform={ISO}>{rect({ fill: GLASS_SIDE })}</g>
        </g>
      ))}
      {lit && (
        <g transform={`translate(0 ${depth})`} filter={`url(#${ids.glow})`}>
          <g transform={ISO}>{rect({ stroke: glow, strokeWidth: 2, opacity: 0.95 })}</g>
        </g>
      )}
      <g transform={ISO}>
        {rect({ fill: lit && glow === HI ? `url(#${ids.hiTop})` : GLASS_TOP, stroke: lit ? glow : 'rgba(160,170,255,0.18)', strokeWidth: lit ? 1.2 : 1 })}
        {glyph && <Glyph name={glyph} x={x} y={y} size={s * 0.5} color={lit ? '#EAF3FF' : '#8F9BD6'} />}
      </g>
    </g>
  )
}

const Line = ({ ids, d, color }) => (
  <g transform={ISO}>
    <path d={d} stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" filter={`url(#${ids.glow})`} opacity="0.95" />
  </g>
)

// ── local: storage board ──────────────────────────────────────────────────
function LocalScene({ ids }) {
  const N = 7
  const S = 34
  const G = 10
  const span = N * S + (N - 1) * G
  const at = (i) => -span / 2 + S / 2 + i * (S + G)
  const lit = { '1,1': 'film', '4,0': 'film', '1,4': 'film' }
  const core = [3, 3]
  const cells = []
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) cells.push([c, r])
  // paint back-to-front (screen depth grows with x + y)
  cells.sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
  const [cx, cy] = [at(core[0]), at(core[1])]
  const gutter = (S + G) / 2
  const board = (p) => <rect x={-span / 2 - 16} y={-span / 2 - 16} width={span + 32} height={span + 32} rx="26" {...p} />
  return (
    <g transform="translate(240 178) scale(1.12)">
      {[8, 5].map((d) => (
        <g key={d} transform={`translate(0 ${d})`}>
          <g transform={ISO}>{board({ fill: '#0B0F26' })}</g>
        </g>
      ))}
      <g transform="translate(0 8)" filter={`url(#${ids.glow})`}>
        <g transform={ISO}>{board({ stroke: LO, strokeWidth: 1.4, opacity: 0.7 })}</g>
      </g>
      <g transform={ISO}>{board({ fill: '#10153A', stroke: 'rgba(160,170,255,0.22)' })}</g>
      {/* circuit lines run in the gutters from each video cell to the index */}
      <Line ids={ids} color={LO} d={`M${at(1)} ${at(1)} H${at(1) + gutter} V${cy} H${cx}`} />
      <Line ids={ids} color={LO} d={`M${at(4)} ${at(0)} V${at(0) + gutter} H${cx + gutter} V${cy}`} />
      <Line ids={ids} color={LO} d={`M${at(1)} ${at(4)} H${at(1) + gutter} V${at(4) - gutter} H${cx} V${cy}`} />
      {cells.map(([c, r]) => {
        const key = `${c},${r}`
        if (c === core[0] && r === core[1]) return <Tile key={key} ids={ids} x={cx} y={cy} s={S + 6} depth={12} glow={HI} glyph="index" />
        if (lit[key]) return <Tile key={key} ids={ids} x={at(c)} y={at(r)} s={S} depth={9} glow={LO} glyph={lit[key]} />
        return <Tile key={key} ids={ids} x={at(c)} y={at(r)} s={S} depth={4} r={8} />
      })}
    </g>
  )
}

// ── onprem: sealed platform ───────────────────────────────────────────────
function OnPremScene({ ids }) {
  const P = 150
  const plate = (p) => <rect x={-P} y={-P} width={P * 2} height={P * 2} rx="34" {...p} />
  const sats = [
    [-92, 0, 'server'],
    [0, -92, 'database'],
    [92, 0, 'monitor'],
    [0, 92, 'lock'],
  ]
  return (
    <g transform="translate(240 158) scale(1.05)">
      {[12, 8, 4].map((d) => (
        <g key={d} transform={`translate(0 ${d})`}>
          <g transform={ISO}>{plate({ fill: '#0B0F26' })}</g>
        </g>
      ))}
      {/* glowing rim: the sealed boundary */}
      <g transform="translate(0 12)" filter={`url(#${ids.glow})`}>
        <g transform={ISO}>{plate({ stroke: HI, strokeWidth: 2, opacity: 0.9 })}</g>
      </g>
      <g transform={ISO}>
        {plate({ fill: `url(#${ids.plat})`, stroke: 'rgba(160,170,255,0.3)', strokeWidth: 1 })}
        {[[-120, -40], [-40, -120], [120, 40], [40, 120], [-110, 80], [80, -110], [118, -30], [-30, 118], [60, 60], [-60, -60]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" fill={LO} opacity="0.7" />
        ))}
      </g>
      {sats.map(([x, y]) => (
        <Line key={`${x}${y}`} ids={ids} color={HI} d={`M0 0 L${x} ${y}`} />
      ))}
      {sats
        .filter(([x, y]) => x + y < 0)
        .map(([x, y, g]) => <Tile key={g} ids={ids} x={x} y={y} s={48} depth={10} glow={LO} glyph={g} />)}
      <g transform={ISO}>
        <circle cx="0" cy="0" r="70" fill={`url(#${ids.halo})`} />
      </g>
      <Tile ids={ids} x={0} y={0} s={60} depth={16} r={14} glow={HI} glyph="shield" />
      {sats
        .filter(([x, y]) => x + y > 0)
        .map(([x, y, g]) => <Tile key={g} ids={ids} x={x} y={y} s={48} depth={10} glow={LO} glyph={g} />)}
    </g>
  )
}

// ── blur: stacked video frames ───────────────────────────────────────────
// Panels stand in a vertical plane: matrix(0.866 -0.5 0 1 X Y) maps (u, v)
// with u running to the right-back and v straight down.
function BlurScene({ ids }) {
  const W = 190
  const H = 140
  const panel = (X, Y) => `matrix(0.866 -0.5 0 1 ${X} ${Y})`
  const mosaic = (cx, cy, cols, rows, s = 9) =>
    Array.from({ length: cols * rows }, (_, i) => {
      const c = i % cols
      const r = Math.floor(i / cols)
      const o = [0.95, 0.55, 0.8, 0.45, 1, 0.6, 0.85, 0.5, 0.7][i % 9]
      return <rect key={i} x={cx - (cols * s) / 2 + c * s + 0.7} y={cy - (rows * s) / 2 + r * s + 0.7} width={s - 1.4} height={s - 1.4} rx="1.6" fill={HI} opacity={o} />
    })
  const back = [3, 2, 1].map((i) => ({ i, X: 70 + i * 58, Y: 150 - i * 16 }))
  return (
    <g>
      <ellipse cx="240" cy="300" rx="210" ry="30" fill={`url(#${ids.floor})`} />
      {back.map(({ i, X, Y }) => (
        <g key={i} transform={panel(X, Y)} opacity={1 - i * 0.18}>
          <rect width={W} height={H} rx="12" fill="rgba(34,42,96,0.45)" />
          <rect width={W} height={H} rx="12" stroke={LO} strokeWidth="1.6" filter={`url(#${ids.glow})`} />
          {[30, 52, 74].map((v) => (
            <rect key={v} x="18" y={v} width={i === 1 ? 110 : 90} height="5" rx="2.5" fill={LO} opacity="0.35" />
          ))}
          {Array.from({ length: 8 }, (_, k) => (
            <rect key={k} x={120 + k * 7} y={120 - (k % 4) * 9 - 12} width="3" height={(k % 4) * 9 + 12} rx="1.5" fill={LO} opacity="0.45" />
          ))}
        </g>
      ))}
      {/* front frame */}
      <g transform={panel(70, 150)}>
        <rect width={W} height={H} rx="12" fill="#0B1236" />
        <rect width={W} height={H} rx="12" fill={`url(#${ids.panel})`} />
        <rect width={W} height={H} rx="12" stroke={HI} strokeWidth="2" filter={`url(#${ids.glow})`} />
        {[46, 98].map((u) => (
          <g key={u} fill="#2A4596">
            <circle cx={u} cy="54" r="15" />
            <path d={`M${u - 26} 128 v-26 a18 18 0 0 1 18 -18 h16 a18 18 0 0 1 18 18 v26 z`} />
          </g>
        ))}
        <path d="M128 104 l7 -13 h28 l8 13 h2 a5 5 0 0 1 5 5 v13 h-58 v-13 a5 5 0 0 1 5 -5 z" fill="#2A4596" />
        {mosaic(46, 54, 3, 3)}
        {mosaic(98, 54, 3, 3)}
        {mosaic(150, 112, 4, 1, 8)}
        <line x1="122" y1="12" x2="122" y2="128" stroke="#BFE0FF" strokeWidth="1.8" filter={`url(#${ids.glow})`} />
      </g>
    </g>
  )
}

const SCENES = { local: LocalScene, onprem: OnPremScene, blur: BlurScene }

export default function IsoScene({ kind, className = '' }) {
  const base = useId().replace(/:/g, '')
  const ids = Object.fromEntries(['glow', 'hiTop', 'plat', 'halo', 'panel', 'floor'].map((n) => [n, `${base}-${n}`]))
  const Scene = SCENES[kind]
  return (
    <svg viewBox="0 0 480 320" fill="none" aria-hidden className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={ids.glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="wide" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="tight" />
          <feMerge>
            <feMergeNode in="wide" />
            <feMergeNode in="tight" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={ids.hiTop} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#4DA3FF" stopOpacity="0.65" />
          <stop offset="1" stopColor="#1E5BD8" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={ids.plat} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#171D4A" stopOpacity="0.95" />
          <stop offset="1" stopColor="#0C1030" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={ids.panel} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#4DA3FF" stopOpacity="0.24" />
          <stop offset="1" stopColor="#0E1640" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id={ids.halo}>
          <stop stopColor={HI} stopOpacity="0.45" />
          <stop offset="1" stopColor={HI} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.floor}>
          <stop stopColor={HI} stopOpacity="0.28" />
          <stop offset="1" stopColor={HI} stopOpacity="0" />
        </radialGradient>
      </defs>
      {Scene && <Scene ids={ids} />}
    </svg>
  )
}
