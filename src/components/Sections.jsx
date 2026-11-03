import { useRef } from 'react'
import Link from '../i18n/Link.jsx'
import { ArrowRight, BookOpenText, Languages, ListTree, MessageSquareText, Play, Scissors } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import Reveal from './Reveal.jsx'
import { BlurLines, scrollToStep, useMotion, useScrollProgress, useStep } from './motion.jsx'

// Eyebrow + h2 (+ optional lead) centered above a section — the pattern every
// wireframe section opens with.
// `title` may be a string or an array of lines; lines blur in one by one.
// align="left" for the sticky / horizontal sections.
export function SectionHead({ eyebrow, title, lead, className = '', align = 'center' }) {
  const left = align === 'left'
  return (
    <div className={`flex flex-col ${left ? 'items-start text-left' : 'items-center text-center'} ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className="hx-eyebrow">{eyebrow}</p>
        </Reveal>
      )}
      <BlurLines lines={Array.isArray(title) ? title : [title]} className="hx-h2 mt-3" />
      {lead && (
        <Reveal delay={250}>
          <p className="mt-6 text-[20px] font-medium leading-[1.6] tracking-[-0.3px] text-ink-sub max-sm:text-[17px]">{lead}</p>
        </Reveal>
      )}
    </div>
  )
}

// Renders an array of lines with <br/> between them.
export function Lines({ lines }) {
  return lines.map((line, i) => (
    <span key={i}>
      {/* the space keeps the words apart for crawlers reading the raw HTML */}
      {i > 0 && <>{' '}<br /></>}
      {line}
    </span>
  ))
}

// Last section on every page — full-screen black like toss.im's closing band,
// the one dark area besides product demos (palette 04).
export function DarkCta({ lines, sub }) {
  const { t } = useLang()
  return (
    <section id="cta" className="hx-section flex min-h-[calc(100vh-4rem)] items-center justify-center bg-hx py-28 text-center max-sm:min-h-0 max-sm:py-24">
      <div className="mx-auto flex max-w-[900px] flex-col items-center">
        <BlurLines
          lines={lines}
          className="text-[56px] font-bold leading-[1.32] tracking-[-0.03em] text-white max-lg:text-[44px] max-md:text-[34px] max-sm:text-[27px]"
        />
        <Reveal delay={350} className="flex flex-col items-center">
          {sub && <p className="mt-6 text-[19px] text-white/60 max-sm:text-[15px]">{sub}</p>}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="hx-btn hx-on-dark">
              {t('도입 문의하기', 'Contact sales')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// Toss-style hero: copy on top, and a media stage that starts as a rounded inset
// card and grows to fill the screen as you scroll, then holds while the demo
// plays. `copy` fades up and away as the stage takes over. Below lg (or with
// reduced motion) it is simply copy above a rounded card.
export function ExpandingStage({ id, copy, children, stageClassName = '' }) {
  const ref = useRef(null)
  const motion = useMotion()
  useScrollProgress(ref, { enabled: motion })
  return (
    <section id={id} ref={ref} className="relative lg:h-[230vh]">
      <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
        <div
          className="relative z-10 px-4 pb-12 pt-[112px] lg:pt-[9vh]"
          style={
            motion
              ? { opacity: 'max(0, calc(1 - var(--p) * 2.6))', transform: 'translateY(calc(var(--p) * -90px))' }
              : undefined
          }
        >
          {copy}
        </div>
        <div className="px-4 pb-16 lg:absolute lg:inset-0 lg:p-0" style={motion ? { zIndex: 20, pointerEvents: 'none' } : undefined}>
          <div
            className={`relative mx-auto h-full w-full overflow-hidden rounded-[28px] max-lg:max-w-[1200px] max-sm:rounded-2xl ${stageClassName}`}
            style={
              motion
                ? {
                    pointerEvents: 'auto',
                    transformOrigin: '50% 0%',
                    transform:
                      'translateY(max(0px, calc((1 - var(--p) * 1.55) * 60vh))) scale(min(1, calc(0.74 + var(--p) * 0.4)))',
                    borderRadius: 'max(0px, calc(32px - var(--p) * 48px))',
                  }
                : undefined
            }
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

// Toss-style sticky showcase: a list on the left whose active item expands, and a
// visual on the right that swaps as you scroll through the pinned section.
// items: [{ key, title, sub?, desc, link?: { to, label }, visual: node }]
// Below lg every item is shown stacked with its own visual.
export function StickyShowcase({ id, head, items, className = '', visualClassName = 'aspect-[1/1]' }) {
  const ref = useRef(null)
  const motion = useMotion()
  const n = items.length
  const step = useStep(ref, n, motion)
  const active = motion ? step : -1

  return (
    <section id={id} ref={ref} className={className} style={motion ? { height: `${n * 85 + 40}vh` } : undefined}>
      <div className="hx-section py-[120px] max-sm:py-20 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)] lg:items-center lg:py-0">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[1fr_1.1fr] items-center gap-20 max-lg:grid-cols-1 max-lg:gap-12">
          <div>
            {head}
            <ul className="mt-10 flex flex-col gap-2 max-lg:gap-12">
              {items.map((it, i) => {
                const on = !motion || active === i
                return (
                  <li key={it.key}>
                    {/* mobile: the item's own visual above its text */}
                    <div className={`mb-6 overflow-hidden rounded-[24px] lg:hidden ${visualClassName}`}>{it.visual}</div>
                    <button
                      type="button"
                      disabled={!motion}
                      onClick={() => scrollToStep(ref.current, i, n)}
                      className="block w-full py-3 text-left disabled:cursor-default"
                    >
                      <span
                        className={`block text-[28px] font-bold tracking-[-0.7px] transition-colors duration-300 max-sm:text-[23px] ${
                          on ? 'text-ink' : 'text-ink/20 hover:text-ink/40'
                        }`}
                      >
                        {it.title}
                      </span>
                      {it.sub && (
                        <span className={`mt-1 block text-[15px] font-semibold transition-colors ${on ? 'text-primary-500' : 'text-ink/20'}`}>
                          {it.sub}
                        </span>
                      )}
                    </button>
                    <div
                      className={`grid transition-all duration-500 ease-out ${
                        on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-[460px] pb-2 text-[17px] leading-[1.7] text-ink-sub">{it.desc}</p>
                        {it.link && (
                          <Link
                            to={it.link.to}
                            className="mb-3 mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink/[0.06] px-4 py-2 text-[14px] font-semibold text-ink transition-colors hover:bg-ink/10"
                          >
                            {it.link.label}
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink text-white">
                              <ArrowRight size={10} strokeWidth={3} />
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* desktop: one visual frame; items crossfade inside it */}
          <div className={`relative overflow-hidden rounded-[32px] bg-mist max-lg:hidden ${visualClassName}`}>
            {items.map((it, i) => (
              <div
                key={it.key}
                className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${
                  active === i ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
                }`}
              >
                {it.visual}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function MoreLink({ to, children, className = '' }) {
  return (
    <Link
      to={to}
      className={`group/more inline-flex items-center gap-1 text-[16px] font-semibold text-primary-500 transition-colors hover:text-primary-600 ${className}`}
    >
      {children}
      <ArrowRight size={16} strokeWidth={2.4} className="transition-transform duration-200 group-hover/more:translate-x-0.5" />
    </Link>
  )
}

export function Chip({ children, tone = 'neutral', className = '' }) {
  const tones = {
    neutral: 'bg-mist text-ink-sub',
    hx: 'bg-primary-50 text-primary-500',
    violet: 'bg-white text-violet-500',
    dark: 'bg-hx text-white',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[14px] font-semibold tracking-[-0.2px] ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

// Stand-in for lecture footage (education has no photos yet — wireframe 03-3
// asks for a "바이브코딩으로 어플 만드는 법" lecture still). Drawn, not faked.
export function LectureMock({ compact = false }) {
  const { t } = useLang()
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-dark-surface p-[8%] text-left">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="relative">
        <p className={`font-semibold text-primary-400 ${compact ? 'text-[11px]' : 'text-[13px]'}`}>
          {t('3강 · 화면 설계', 'Lesson 3 · Screen design')}
        </p>
        <p className={`mt-2 font-bold leading-snug text-white ${compact ? 'text-[18px]' : 'text-[28px] max-sm:text-[20px]'}`}>
          {t('바이브코딩으로', 'Build an app')}
          <br />
          {t('어플 만드는 법', 'with vibe coding')}
        </p>
      </div>
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-dark-bg">
            <Play size={14} fill="currentColor" />
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[38%] rounded-full bg-primary-400" />
          </div>
          <span className="text-[12px] tabular-nums text-white/60">18:42 / 49:10</span>
        </div>
        {/* chapter markers */}
        {!compact && (
          <div className="mt-3 flex gap-1.5">
            {[t('개념', 'Concepts'), t('설계', 'Design'), t('구현', 'Build'), t('배포', 'Ship')].map((c, i) => (
              <span
                key={c}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                  i === 1 ? 'bg-primary-400 text-dark-bg' : 'bg-white/10 text-white/70'
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const FEATURE_ICONS = {
  answer: MessageSquareText,
  chapters: ListTree,
  languages: Languages,
  clips: Scissors,
  book: BookOpenText,
}

// Visual for a feature card: the photo when there is one, otherwise an icon tile.
export function FeatureVisual({ feature }) {
  if (feature.img) {
    return (
      <img
        src={feature.img}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
        style={{ objectPosition: feature.pos }}
      />
    )
  }
  const Icon = FEATURE_ICONS[feature.icon] ?? BookOpenText
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-50 via-white to-violet-50">
      <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-primary-500 shadow-[0_10px_30px_-12px_rgba(35,77,120,0.45)]">
        <Icon size={36} strokeWidth={1.6} />
      </span>
    </div>
  )
}

// Hero / card image for an industry — its photo, or the lecture mock for
// education until real lecture footage is supplied.
export function IndustryImage({ industry, compact = false }) {
  if (!industry.image) return <LectureMock compact={compact} />
  return (
    <img
      src={industry.image}
      alt=""
      loading="lazy"
      className="h-full w-full object-cover"
      style={{ objectPosition: industry.imagePos }}
    />
  )
}
