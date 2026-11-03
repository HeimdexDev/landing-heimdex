import { useEffect, useRef, useState } from 'react'
import Link from '../i18n/Link.jsx'
import { AlertTriangle, ArrowLeft, ArrowRight, ChevronDown, Search } from 'lucide-react'
import {
  IconBlurFace3d,
  IconNoCloud3d,
  IconServer3d,
} from '../components/icons3d.jsx'
import HeroAppMockup from '../components/HeroAppMockup.jsx'
import Reveal from '../components/Reveal.jsx'
import { IndustryImage, Lines, SectionHead } from '../components/Sections.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { INDUSTRIES, FEATURES, HEIMLOG_APP, industryPath } from '../data/industries.js'
import { TESTIMONIALS } from '../data/testimonials.js'
import { FAQ } from '../data/faq.js'

// Main = company + business-product home (homepage-wireframe 02, 문서 4.2 "/").
// Section rhythm follows flitto.com/ko/ai-data: split hero → navy numbered
// band → logo strip → card carousel + banner → image cards → quote carousel →
// FAQ.

const LOGOS = [
  { src: '/assets/logo-antler.png', alt: 'Antler' },
  { src: '/assets/logo-yonsei.png', alt: 'Yonsei University' },
  { src: '/assets/logo-chxxta.png', alt: 'CHXXTA' },
  { src: '/assets/logo-kibo.png', alt: 'KIBO' },
  { src: '/assets/logo-nvidia.png', alt: 'NVIDIA Inception' },
  { src: '/assets/logo-kt.png', alt: 'KT' },
  { src: '/assets/logo-lg.png', alt: 'LG' },
  { src: '/assets/logo-livenow.png', alt: 'LiveNow' },
  { src: '/assets/logo-samsung.png', alt: 'Samsung' },
]

// Hands-on web demo. Linked without the GA `_gl` linker param — that is generated
// per visitor at click time, so a copied value would pin everyone to one session.
const PLAYGROUND_URL = 'https://playground.heimdex.co/'

// Pill buttons (flitto style). Kept local — the rest of the site still uses .hx-btn.
const PILL =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-6 py-3 text-[16px] font-semibold transition-[background-color,transform] duration-200 active:scale-[0.97] max-sm:px-5 max-sm:text-[15px]'
const PILL_SOLID = `${PILL} bg-hx text-white hover:bg-primary-600`
const PILL_LINE = `${PILL} border border-ink text-ink hover:bg-ink/[0.04]`

// Renders `children` at a fixed design width and scales it to the frame's width,
// so a composed mockup keeps its proportions (text included) at any size.
function ScaleToFit({ base, aspect, className = '', children }) {
  const frameRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / base)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [base])

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: aspect, transform: 'translateZ(0)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: base, height: base / aspect, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  )
}

function Hero() {
  const { lang, t } = useLang()
  return (
    <section className="hx-section overflow-hidden pb-[120px] pt-[168px] max-lg:pt-[128px] max-sm:pb-20 max-sm:pt-[108px]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[0.92fr_1.08fr] items-center gap-14 max-lg:grid-cols-1 max-lg:gap-12">
        <Reveal>
          <h1 className="text-[60px] font-bold leading-[1.22] tracking-[-0.035em] text-ink max-xl:text-[52px] max-md:text-[42px] max-sm:text-[34px]">
            {t('영상 속 원하는 장면,', 'The scene you need,')} <br />
            {t('검색 한 줄로', 'in a single search')}
          </h1>
          <p className="mt-5 font-product text-[22px] font-bold tracking-[-0.2px] text-ink max-sm:text-[18px]">
            Data Stays, Insight Moves.
          </p>
          <p className="mt-4 max-w-[470px] text-[16px] leading-[1.75] text-ink-sub max-sm:text-[15px]">
            {lang === 'en'
              ? 'No uploads, no watching. Heimdex indexes video where it already lives — NAS, servers, PCs — so one search finds the scene you need and builds the short-form for you.'
              : '업로드 없이, 시청 없이. NAS · 서버 · PC에 있는 영상을 그 자리에서 분석해, 검색 한 줄로 필요한 장면을 찾고 숏폼까지 자동으로 만들어 드립니다.'}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-2.5">
            <a href={PLAYGROUND_URL} target="_blank" rel="noopener noreferrer" className={PILL_SOLID}>
              {t('웹에서 체험하기', 'Try it on the web')}
            </a>
            <Link to="/contact" className={PILL_LINE}>
              {t('문의하기', 'Contact us')}
            </Link>
          </div>
          <p className="mt-4 text-[14px] text-ink-mute">{t('무료 1달 PoC로 먼저 검토해 보세요', 'Try it first with a free 1-month PoC')}</p>
        </Reveal>

        <Reveal delay={150} className="relative">
          <div aria-hidden className="absolute -inset-10 rounded-[64px] bg-brand opacity-[0.14] blur-[70px]" />
          <div className="relative rounded-[20px] shadow-lift ring-1 ring-black/[0.05]">
            <ScaleToFit base={1440} aspect={1440 / 900} className="rounded-[20px] bg-white">
              <HeroAppMockup key={lang} />
            </ScaleToFit>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// Small static compositions standing in for the three "기능 모션 데모" slots
// (original dark versions).
function SceneSearchVisual() {
  const { t } = useLang()
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-dark-surface p-4">
      <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[12px] text-ink">
        <Search size={14} className="text-primary-500" />
        <span className="truncate">{t('무대 위에서 손 하트 하는 장면', 'Making a finger heart on stage')}</span>
        <span className="caret ml-[-4px] h-3.5 w-px bg-ink" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {['/assets/stage/stage-11.jpg', '/assets/stage/stage-5.jpg', '/assets/stage/stage-8.jpg'].map((src, i) => (
          <div key={src} className="relative overflow-hidden rounded-md">
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] tabular-nums text-white">
              {['00:12:41', '01:03:07', '02:18:55'][i]}
            </span>
            {i === 0 && <span className="absolute inset-0 rounded-md ring-2 ring-accent" />}
          </div>
        ))}
      </div>
    </div>
  )
}

function RightsVisual() {
  const { t } = useLang()
  return (
    <div className="relative h-full w-full overflow-hidden bg-dark-surface">
      <img src="/assets/stage/stage-6.jpg" alt="" loading="lazy" className="h-full w-full object-cover opacity-70" />
      <div className="absolute inset-x-4 top-4 flex flex-col gap-2">
        {[
          [t('무단 업로드 감지', 'Unauthorized upload'), 'video-share.example · 98%'],
          [t('재편집 유통 의심', 'Suspected re-edit'), 'clips.example · 91%'],
        ].map(([title, meta]) => (
          <div key={title} className="flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 shadow">
            <AlertTriangle size={14} className="shrink-0 text-[#F5A524]" />
            <span className="text-[12px] font-semibold text-ink">{title}</span>
            <span className="ml-auto truncate text-[10px] text-ink-sub">{meta}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecutVisual() {
  const segments = [
    [6, 14],
    [30, 12],
    [55, 9],
    [78, 13],
  ]
  return (
    <div className="flex h-full w-full items-center gap-4 bg-dark-surface p-4">
      <div className="flex flex-1 flex-col gap-2">
        {[0, 1, 2].map((row) => (
          <div key={row} className="relative h-6 rounded bg-white/10">
            {segments.map(([l, w], i) =>
              (i + row) % 2 === 0 ? (
                <span key={i} className="absolute inset-y-0 rounded bg-accent/80" style={{ left: `${l}%`, width: `${w}%` }} />
              ) : null,
            )}
          </div>
        ))}
      </div>
      <ArrowRight size={18} className="shrink-0 text-white/60" />
      <div className="relative aspect-[9/16] h-[85%] overflow-hidden rounded-lg ring-2 ring-white/80">
        <img src="/assets/creative/mkt-scene-7.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
    </div>
  )
}

const FEATURE_VISUALS = {
  'scene-intelligence': SceneSearchVisual,
  'rights-monitor': RightsVisual,
  'auto-recut': RecutVisual,
}


// Navy band with a numbered list (flitto's "01 Multi-Phase…" block): one feature
// open at a time, its visual on the right. Keeps advancing on its own.
function Features() {
  const { lang, t } = useLang()
  const [active, setActive] = useState(0)
  const n = FEATURES.length
  // Rolls on its own every 6s, hover or not; a click jumps there and the
  // timer restarts from that item.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => setActive((a) => (a + 1) % n), 6000)
    return () => clearTimeout(id)
  }, [active, n])

  return (
    <section
      id="features"
      className="hx-section relative overflow-hidden bg-hx py-[140px] text-white max-sm:py-24"
    >
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary-500/40 blur-[120px]" />
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-[1fr_1.05fr] items-center gap-16 max-lg:grid-cols-1 max-lg:gap-10">
        <div>
          <Reveal>
            <p className="text-[15px] font-bold tracking-[-0.2px] text-primary-300">HEIMDEX</p>
            <h2 className="mt-3 text-[42px] font-bold leading-[1.3] tracking-[-0.03em] max-md:text-[34px] max-sm:text-[28px]">
              {t('찾고, 지키고, 다시 만듭니다', 'Find it. Protect it. Remake it.')}
            </h2>
            <p className="mt-4 text-[17px] text-white/60 max-sm:text-[15px]">
              {t('쌓여만 있던 영상을 다시 일하는 자산으로', 'Turn footage that just sits there back into a working asset')}
            </p>
          </Reveal>
          <ol className="mt-12 border-t border-white/15">
            {FEATURES.map((f, i) => {
              const on = i === active
              const Visual = FEATURE_VISUALS[f.slug]
              return (
                <li key={f.slug} className="border-b border-white/15">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    className="flex w-full items-baseline gap-5 py-6 text-left max-sm:gap-3"
                  >
                    <span className={`font-product text-[20px] font-bold tabular-nums transition-colors ${on ? 'text-white' : 'text-white/30'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-[28px] font-bold tracking-[-0.03em] transition-colors max-sm:text-[22px] ${
                        on ? 'text-white' : 'text-white/30 hover:text-white/60'
                      }`}
                    >
                      {f.name}
                    </span>
                  </button>
                  <div className={`grid transition-all duration-500 ease-out ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="pb-7 pl-[47px] max-sm:pl-0">
                        <p className="text-[14px] font-semibold text-primary-300">{lang === 'en' ? f.kindEn : f.kind}</p>
                        <p className="mt-2 max-w-[460px] text-[16px] leading-[1.7] text-white/70">{lang === 'en' ? f.descEn : f.desc}</p>
                        <div className="mt-6 overflow-hidden rounded-2xl lg:hidden">
                          <ScaleToFit base={400} aspect={400 / 260}>
                            <Visual />
                          </ScaleToFit>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <Reveal delay={120} className="max-lg:hidden">
          <div className="relative overflow-hidden rounded-[24px] ring-1 ring-white/10">
            <ScaleToFit base={400} aspect={400 / 300}>
              {FEATURES.map((f, i) => {
                const Visual = FEATURE_VISUALS[f.slug]
                return (
                  <div
                    key={f.slug}
                    className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${
                      i === active ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'
                    }`}
                  >
                    <Visual />
                  </div>
                )
              })}
            </ScaleToFit>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// Partner logos in the static row's style (grey → colour on hover), drifting
// endlessly: the list is rendered twice and the track slides by half its width
// (.marquee-track). Pauses while hovered.
function Logos() {
  const { t } = useLang()
  return (
    <section className="border-b border-line py-16 max-sm:py-12">
      <Reveal className="flex flex-col items-center gap-9">
        <h2 className="px-5 text-[15px] font-semibold text-ink-mute">{t('현장에서 먼저 검증된 기술력', 'Proven in the field first')}</h2>
        <div className="w-full overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="marquee-track flex w-max items-center" style={{ animationDuration: '40s' }}>
            {[...LOGOS, ...LOGOS].map((l, i) => {
              const copy = i >= LOGOS.length
              return (
                <li key={i} aria-hidden={copy || undefined} className="flex h-14 shrink-0 items-center pr-16 max-sm:pr-10">
                  <img
                    src={l.src}
                    alt={copy ? '' : l.alt}
                    className="h-7 w-auto max-w-[140px] object-contain opacity-50 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 max-sm:h-6 max-sm:max-w-[110px]"
                  />
                </li>
              )
            })}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}

// Horizontal snap carousel with round prev/next buttons underneath.
// Children size themselves with a `basis-*` class.
function Carousel({ trackRef, children, label, hideNav = false, center = false }) {
  const { t } = useLang()
  const own = useRef(null)
  const track = trackRef ?? own
  const [edge, setEdge] = useState({ start: true, end: false })

  const update = () => {
    const el = track.current
    if (!el) return
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }
  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const go = (d) => {
    const el = track.current
    const card = el?.firstElementChild
    if (!card) return
    el.scrollBy({ left: d * (card.getBoundingClientRect().width + 24), behavior: 'smooth' })
  }

  const btn =
    'flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-ink/40 disabled:opacity-30 disabled:hover:border-line'
  return (
    <div>
      <div
        ref={track}
        onScroll={update}
        aria-label={label}
        className={`-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pb-2 ${center ? 'justify-center' : ''} [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden`}
      >
        {children}
      </div>
      <div className={`mt-8 flex justify-center gap-2 ${hideNav ? 'hidden' : ''}`}>
        <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label={t('이전', 'Previous')} className={btn}>
          <ArrowLeft size={18} />
        </button>
        <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label={t('다음', 'Next')} className={btn}>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

const CARD_BASIS = 'shrink-0 snap-start basis-[calc((100%-48px)/3)] max-lg:basis-[calc((100%-24px)/2)] max-sm:basis-[84%]'

function IndustryCard({ industry }) {
  const { lang, t } = useLang()
  const en = lang === 'en'
  return (
    <Link to={industryPath(industry.slug)} className={`group flex flex-col ${CARD_BASIS}`}>
      <div className="aspect-[4/3] overflow-hidden rounded-[16px] bg-mist">
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <IndustryImage industry={industry} compact />
        </div>
      </div>
      <p className="mt-5 text-[14px] font-semibold text-primary-500">{en ? industry.nameEn : industry.name}</p>
      <h3 className="mt-1.5 text-[22px] font-bold leading-[1.4] tracking-[-0.03em] text-ink max-sm:text-[20px]">
        <Lines lines={en ? industry.cardEn : industry.card} />
      </h3>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {industry.features.slice(0, 3).map((f) => (
          <span key={f.title} className="rounded-full border border-line px-2.5 py-1 text-[12px] font-medium text-ink-sub">
            {en ? f.titleEn : f.title}
          </span>
        ))}
      </div>
      <span className="mt-5 inline-flex items-center gap-1 text-[15px] font-semibold text-ink transition-colors group-hover:text-primary-500">
        {t('자세히 보기', 'Learn more')} <ArrowRight size={15} strokeWidth={2.4} />
      </span>
    </Link>
  )
}

function Industries() {
  const { lang, t } = useLang()
  const [tab, setTab] = useState('all')
  // A tab narrows the cards to that industry; 전체 shows them all.
  const shown = tab === 'all' ? INDUSTRIES : INDUSTRIES.filter((ind) => ind.slug === tab)
  const pick = setTab

  const chip = (on) =>
    `rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
      on ? 'bg-hx text-white' : 'border border-line bg-white text-ink-sub hover:border-ink/30 hover:text-ink'
    }`

  return (
    <section id="industries" className="hx-section py-[140px] max-sm:py-24">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead
          eyebrow={t('산업별 솔루션', 'Solutions by industry')}
          title={t('우리 업계에 맞춘 하임덱스', 'Heimdex, built for your industry')}
          lead={t('업계마다 다른 영상 업무, 그 흐름에 맞춰 일합니다.', 'Every industry works with video differently — Heimdex fits the flow.')}
        />
        <Reveal className="mt-12 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => pick('all')} className={chip(tab === 'all')}>
            {t('전체', 'All')}
          </button>
          {INDUSTRIES.map((ind) => (
            <button key={ind.slug} type="button" onClick={() => pick(ind.slug)} className={chip(tab === ind.slug)}>
              {lang === 'en' ? ind.nameEn : ind.name}
            </button>
          ))}
        </Reveal>
        <Reveal className="mt-12">
          <Carousel key={tab} hideNav={tab !== 'all'} center={tab !== 'all'} label={t('산업별 솔루션', 'Solutions by industry')}>
            {shown.map((ind) => (
              <IndustryCard key={ind.slug} industry={ind} />
            ))}
          </Carousel>
        </Reveal>

        {/* Personal (heimlog) path as a banner — flitto's "궁금하신가요?" strip,
            in heimlog's own coral palette since it is a different product */}
        <Reveal className="mt-24 max-sm:mt-16">
          <div className="relative flex items-center gap-6 overflow-hidden rounded-[20px] bg-heimlog-cream px-10 py-8 max-md:flex-col max-md:items-start max-sm:px-6 max-sm:py-7">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-heimlog/25 blur-[80px]" />
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_-10px_rgba(255,122,102,0.6)]">
              <img src="/assets/heimlog-mark.svg" alt="" className="h-7 w-7" />
            </span>
            <div className="relative flex-1">
              <p className="text-[21px] font-bold tracking-[-0.03em] text-ink max-sm:text-[19px]">
                {t('개인 크리에이터라면, 하임로그', 'For individual creators — heimlog')}
              </p>
              <p className="mt-1.5 text-[15px] leading-[1.6] text-ink-sub">
                {t(
                  '직접 찍은 여행 · 일상 영상을 올리면 AI가 장면을 골라 자막 · 블러까지 자동으로 편집해 브이로그로 만들어 드려요.',
                  'Upload your travel and everyday clips — AI picks the scenes and adds captions and blur to make your vlog.',
                )}
              </p>
            </div>
            <div className="relative flex shrink-0 items-center gap-4">
              <a href={HEIMLOG_APP} target="_blank" rel="noopener noreferrer" className={`${PILL} bg-heimlog text-heimlog-on hover:bg-heimlog-hover`}>
                {t('하임로그 둘러보기', 'Explore heimlog')}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// flitto's image-topped solution cards — a dark navy "photo" carrying the icon.
function Security() {
  const { t } = useLang()
  const cards = [
    {
      icon: IconNoCloud3d,
      title: t('업로드 없는 로컬 인덱싱', 'Local indexing, no uploads'),
      desc: t('영상은 원래 저장소에 그대로, 검색에 필요한 인덱스만 만들어요.', 'Video stays where it is — only the search index is built.'),
      tags: [t('원본 보존', 'Originals stay put'), t('로컬 인덱스', 'Local index'), 'NAS · Server · PC'],
    },
    {
      icon: IconServer3d,
      title: t('온프레미스 · 폐쇄망 지원', 'On-premise & air-gapped'),
      desc: t('민감한 영상이 회사 밖으로 나가지 않아요.', 'Sensitive footage never leaves the company.'),
      tags: [t('온프레미스', 'On-premise'), t('폐쇄망', 'Air-gapped'), t('외부 전송 없음', 'No outbound transfer')],
    },
    {
      icon: IconBlurFace3d,
      title: t('개인정보 자동 블러', 'Automatic privacy blur'),
      desc: t('제3자 얼굴 · 차량 번호판을 AI가 자동으로 가려요.', 'AI automatically masks third-party faces and license plates.'),
      tags: [t('얼굴', 'Faces'), t('번호판', 'License plates'), t('자동 마스킹', 'Auto masking')],
    },
  ]
  return (
    <section className="hx-section bg-fog py-[140px] max-sm:py-24">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead
          eyebrow={t('보안', 'Security')}
          title={t('영상은 그 자리에, 인사이트만 움직입니다', 'Video stays put. Only insight moves.')}
          lead="Data Stays, Insight Moves"
        />
        <Reveal className="mt-16 grid grid-cols-3 gap-6 max-lg:grid-cols-1 max-lg:mx-auto max-lg:max-w-[520px]">
          {cards.map(({ icon: Icon, title, desc, tags }) => (
            <div key={title} className="flex flex-col">
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[16px] bg-[radial-gradient(120%_90%_at_50%_0%,#2E5F92_0%,#0A2240_62%,#06162B_100%)]">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(70%_70%_at_50%_45%,#000,transparent)]"
                />
                <div aria-hidden className="absolute h-40 w-40 rounded-full bg-primary-300/30 blur-3xl" />
                <Icon size={112} className="relative drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]" />
              </div>
              <h3 className="mt-6 text-[22px] font-bold tracking-[-0.03em] text-ink">{title}</h3>
              <p className="mt-2 text-[15px] leading-[1.65] text-ink-sub">{desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-line bg-white px-2.5 py-1 text-[12px] font-medium text-ink-sub">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function Cases() {
  const { lang, t } = useLang()
  const en = lang === 'en'
  // Industry priority order; industries without a quote are skipped.
  const all = INDUSTRIES.flatMap((ind) => (TESTIMONIALS[ind.slug] ?? []).slice(0, 1).map((q) => ({ ind, q })))
  // Same industry tags as the solutions section; only industries with a story get one.
  const [tab, setTab] = useState('all')
  const slides = tab === 'all' ? all : all.filter((s) => s.ind.slug === tab)
  const chip = (on) =>
    `rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
      on ? 'bg-hx text-white' : 'border border-line bg-white text-ink-sub hover:border-ink/30 hover:text-ink'
    }`
  return (
    <section className="hx-section py-[140px] max-sm:py-24">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead eyebrow={t('도입 사례', 'Customer stories')} title={t('현장에서 먼저 쓰고 있습니다', 'Already at work in the field')} />
        <Reveal className="mt-12 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => setTab('all')} className={chip(tab === 'all')}>
            {t('전체', 'All')}
          </button>
          {all.map(({ ind }) => (
            <button key={ind.slug} type="button" onClick={() => setTab(ind.slug)} className={chip(tab === ind.slug)}>
              {en ? ind.nameEn : ind.name}
            </button>
          ))}
        </Reveal>
        <Reveal className="mt-12">
          <Carousel key={tab} hideNav={tab !== 'all'} center={tab !== 'all'} label={t('도입 사례', 'Customer stories')}>
            {slides.map(({ ind, q }) => (
              <figure
                key={ind.slug}
                className="flex shrink-0 snap-start basis-[calc((100%-24px)/2)] flex-col rounded-[16px] border border-line bg-white p-9 max-md:basis-[84%] max-sm:p-6"
              >
                <span aria-hidden className="font-product text-[52px] font-bold leading-[0.8] text-primary-200">
                  “
                </span>
                <p className="mt-4 text-[13px] font-semibold text-primary-500">{en ? ind.nameEn : ind.name}</p>
                <blockquote className="mt-2 flex-1 text-[18px] font-semibold leading-[1.7] tracking-[-0.02em] text-ink max-sm:text-[16px]">
                  {en ? q.quoteEn : q.quote}
                </blockquote>
                <figcaption className="mt-8 text-right text-[14px] text-ink-mute">{en ? q.whoEn : q.who}</figcaption>
              </figure>
            ))}
          </Carousel>
        </Reveal>
      </div>
    </section>
  )
}

// FAQ — visible Q&A plus FAQPage JSON-LD built from the same entries, so AI
// search can quote answers that match what the page shows. <details> keeps every
// answer in the DOM (and in the prerendered HTML) even while collapsed.
function Faq() {
  const { lang, t } = useLang()
  const en = lang === 'en'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: en ? 'en' : 'ko',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: en ? f.qEn : f.q,
      acceptedAnswer: { '@type': 'Answer', text: en ? f.aEn : f.a },
    })),
  }
  return (
    <section id="faq" className="hx-section pb-[140px] max-sm:pb-24">
      <div className="mx-auto max-w-[920px]">
        <SectionHead eyebrow="FAQ" title={t('도입 전에 가장 많이 묻는 질문들', 'What teams ask before they start')} />
        <Reveal className="mt-12 border-t border-ink">
          {FAQ.map((f, i) => (
            <details key={f.q} open={i === 0} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-ink max-sm:text-[16px]">{en ? f.qEn : f.q}</h3>
                <ChevronDown size={20} strokeWidth={1.8} className="shrink-0 text-ink-sub transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="pb-6 pr-10 text-[15px] leading-[1.75] text-ink-sub max-sm:pr-0">{en ? f.aEn : f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  )
}

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Logos />
      <Industries />
      <Security />
      <Cases />
      <Faq />
    </div>
  )
}
