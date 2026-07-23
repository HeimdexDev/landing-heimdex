import { EllipsisVertical, SquareArrowOutUpRight } from 'lucide-react'
import { SOURCES } from './constants.js'

export function SourceChip({ source }) {
  return (
    <span className="inline-flex items-center gap-[6px] rounded-full bg-black/50 py-[2px] pl-[8px] pr-[10px] text-[12px] font-medium tracking-[-0.3px] text-white">
      <span
        className="h-[6px] w-[6px] rounded-full"
        style={{ backgroundColor: SOURCES[source] }}
      />
      {source}
    </span>
  )
}

export function NavItem({ icon: Icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-[10px] rounded-lg py-[10px] pl-[10px] pr-[12px] ${
        active ? 'bg-neutral-100' : ''
      }`}
    >
      <Icon size={20} strokeWidth={1.8} className="text-grayscale-800" />
      <span className="whitespace-nowrap text-[16px] font-semibold tracking-[-0.4px] text-grayscale-800">
        {label}
      </span>
    </div>
  )
}

export function FilterChip({ label, dot }) {
  return (
    <span className="inline-flex items-center gap-[6px] rounded-full border border-navy-500 py-[2px] pl-[8px] pr-[10px] text-[14px] font-medium tracking-[-0.35px] text-navy-500">
      {dot && (
        <span className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: dot }} />
      )}
      {label}
    </span>
  )
}

// h:mm:ss when ≥ 1h, otherwise m:ss.
export function fmtDur(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`
}

export function VideoCard({ source, img, sceneImg, title, hovered, shown, index, cardRef, horizontal, durRange, sceneMode, lang }) {
  const shownImg = sceneMode && sceneImg ? sceneImg : img
  // Both orientations show 4 per row · vertical 9:16, horizontal 16:9.
  const w = horizontal ? 'w-[220px]' : 'w-[200px]'
  const box = horizontal ? 'h-[124px] w-[220px]' : 'h-[337px] w-[200px]'
  // deterministic, varied per-card runtime (range per demo) shown bottom-right;
  // in scene mode the corner shows a random scene count instead.
  const [dmin, dmax] = durRange || [30, 600]
  const dur = fmtDur(dmin + ((index * 2999 + 977) % (dmax - dmin + 1)))
  const sceneN = 3 + ((index * 5 + 2) % 12)
  const badge = sceneMode ? (lang === 'en' ? `${sceneN} scenes` : `${sceneN}개 장면`) : dur
  return (
    <div
      ref={cardRef}
      className={`flex ${w} flex-col gap-[10px] transition-all duration-500 ease-out`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(12px)',
        transitionDelay: `${shown ? index * 45 : 0}ms`,
      }}
    >
      <div
        className={`relative ${box} overflow-hidden rounded-[10px] border border-neutral-100 bg-neutral-300 transition-shadow duration-300 ${
          hovered ? 'shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)]' : ''
        }`}
      >
        {shownImg ? (
          <img src={shownImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(135deg, #2b313d 0%, #12161e 100%)' }}
          />
        )}
        <div className="relative flex h-full items-start justify-between p-[10px]">
          <SourceChip source={source} />
          {hovered && (
            <div className="flex h-full flex-col items-end justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-black/50">
                <EllipsisVertical size={16} className="text-white" />
              </span>
              <SquareArrowOutUpRight size={24} className="text-white" />
            </div>
          )}
        </div>
        {/* default state: runtime (or scene count in scene mode) in the corner */}
        {!hovered && (
          <span className="absolute bottom-[8px] right-[8px] rounded-[4px] bg-black/60 px-[6px] py-[1px] text-[12px] font-medium tabular-nums text-white">
            {badge}
          </span>
        )}
      </div>
      <div
        className={`flex ${w} items-start gap-px text-[14px] font-medium tracking-[-0.35px] transition-colors ${
          hovered ? 'text-navy-500' : 'text-grayscale-800'
        }`}
      >
        {/* default: single-line ellipsis · hover: full title wraps into view */}
        <span className={`min-w-0 ${hovered ? 'whitespace-normal break-words' : 'truncate'}`}>
          {title}
        </span>
        <span className="shrink-0 text-right">.mp4</span>
      </div>
    </div>
  )
}

// Glove-style pointing-hand cursor that glides between cards. `dur` lets each
// move have its own (human-varied) duration with an ease-in-out feel.
export function FakeCursor({ x, y, visible, dur }) {
  return (
    <div
      className="pointer-events-none absolute z-20"
      style={{
        left: x,
        top: y,
        opacity: visible ? 1 : 0,
        // fingertip is near the top-center of the art → nudge so it points at (x, y)
        transform: 'translate(-11px, -2px)',
        transition: `left ${dur}ms cubic-bezier(0.45,0.05,0.35,1), top ${dur}ms cubic-bezier(0.45,0.05,0.35,1), opacity 260ms ease`,
        filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))',
      }}
      aria-hidden="true"
    >
      <svg width="27" height="27" viewBox="0 0 28 28">
        <path
          d="M11 3.2c0-1.05.85-1.9 1.9-1.9s1.9.85 1.9 1.9v6.6c.35-.45.9-.75 1.5-.75 1.05 0 1.9.85 1.9 1.9v.3c.35-.4.85-.65 1.4-.65 1.05 0 1.9.85 1.9 1.9v.4c.3-.25.7-.4 1.1-.4 1 0 1.8.8 1.8 1.8v3.9c0 .5-.08 1-.25 1.47l-1.05 3.05c-.5 1.45-1.86 2.42-3.4 2.42h-4.3c-1.1 0-2.14-.5-2.83-1.36l-4.7-5.9c-.66-.83-.5-2.03.34-2.66.78-.58 1.86-.47 2.5.26L11 16.2V3.2z"
          fill="white"
          stroke="#272833"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
