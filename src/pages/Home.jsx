import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import Link from '../i18n/Link.jsx'
import { AlertTriangle, ArrowRight, ChevronDown, CircleCheck, Minus, Search } from 'lucide-react'
import IsoScene from '../components/IsoScene.jsx'
import HeroAppMockup from '../components/HeroAppMockup.jsx'
import Reveal from '../components/Reveal.jsx'
import CharReveal from '../components/CharReveal.jsx'
import WordRise from '../components/WordRise.jsx'
import { IndustryImage } from '../components/Sections.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { INDUSTRIES, FEATURES, HEIMLOG_APP, industryPath } from '../data/industries.js'
import { TESTIMONIALS } from '../data/testimonials.js'
import HeroShader from '../components/HeroShader'
import { FAQ } from '../data/faq.js'

// Main = company + business-product home (homepage-wireframe 02, 문서 4.2 "/").
// Section rhythm follows flitto.com/ko/ai-data: split hero → navy numbered
// band → logo strip → industry picker + banner → image cards → quote wall →
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

// Renders `children` at a fixed design width and scales it to the frame's width,
// so a composed mockup keeps its proportions (text included) at any size.
// `crop` (optional) is a narrower window onto the same composition for phones:
// { base, aspect, x } shows `base` px of it starting `x` px in, so the part that
// matters is drawn larger instead of the whole desktop screen at a quarter size.
// crisp: scale with CSS zoom instead of a transform. Zoom lays the content out
// again at the real size, so small UI text renders sharp instead of being a
// 400px raster stretched up. Use it for small text-heavy cards.
function ScaleToFit({ base, aspect, crop, crisp = false, className = '', children }) {
  const frameRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [phone, setPhone] = useState(false)
  const view = phone && crop ? crop : { base, aspect, x: 0 }

  useEffect(() => {
    if (!crop) return
    const mq = window.matchMedia('(max-width: 639px)')
    const on = () => setPhone(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [crop])

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / view.base)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [view.base])

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: view.aspect, transform: crisp ? undefined : 'translateZ(0)' }}>
      <div
        style={
          crisp
            ? { position: 'absolute', top: 0, left: 0, width: base, height: base / aspect, zoom: scale }
            : { position: 'absolute', top: 0, left: 0, width: base, height: base / aspect, transform: `scale(${scale}) translateX(${-view.x}px)`, transformOrigin: 'top left' }
        }
      >
        {children}
      </div>
    </div>
  )
}

// Hero backdrop: plain white with a faint navy vignette.
function HeroBackdrop({ horizonRef, crestRef }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-white">
      {/* Wave field of navy/blue points streaming toward the viewer. The mask
          dissolves the big near points before the hero's edge, so they never
          crowd the proof points or cut off against the next section. The
          field's horizon sits just under the CTA row (horizonRef). */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_0%,#000_62%,transparent_92%)]">
        <HeroShader horizonRef={horizonRef} crestRef={crestRef} />
      </div>
    </div>
  )
}

// The mockup starts tipped back in perspective (rotateX 24°) and lies flat as the
// hero scrolls up. Reduced motion: shown flat.
function useSettleOnScroll() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      // Untransformed top (the parent's box plus the frame's offset), so the
      // tilt itself doesn't feed back into the measurement.
      const top = el.parentElement.getBoundingClientRect().top + el.offsetTop
      const vh = window.innerHeight
      // 0 when the frame's top is at the bottom of the screen, 1 once it is 30% down.
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.7)))
      // Framer "Dashboard": tipped back in perspective, lying flat as it rises.
      el.style.transform = `perspective(1200px) rotateX(${((1 - p) * 24).toFixed(2)}deg) scale(${(0.94 + p * 0.06).toFixed(3)})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return ref
}

// Phones: drop the mockup's 250px sidebar and show the search column only.
const HERO_CROP = { base: 1190, aspect: 1190 / 980, x: 250 }

function Hero() {
  const { lang, t } = useLang()
  const settleRef = useSettleOnScroll()
  const ctaRef = useRef(null)
  const leadRef = useRef(null) // top of the lead copy = bottom of the headline
  return (
    <section className="hx-section hx-hero-t hx-pad-b relative overflow-hidden">
      <HeroBackdrop horizonRef={ctaRef} crestRef={leadRef} />

      <div className="relative mx-auto flex max-w-content flex-col items-center">
        <Reveal className="flex max-w-[820px] flex-col items-center text-center">
          {/* Slogan wordmark: [Data Stays, Insight Moves] */}
          <img src="/assets/hero/slogan.svg" alt="Data Stays, Insight Moves." width={770} height={74} className="h-auto w-[260px] max-md:w-[230px] max-sm:w-[200px]" />

          {/* Types itself in, one character at a time out of a blur */}
          <CharReveal
            as="h1"
            step={0.05}
            text={t('영상 속 원하는 장면,\n검색 한 줄로', 'The scene you need,\nin a single search')}
            className="mt-6 text-[60px] font-bold leading-[1.22] tracking-[-0.035em] text-[#111] max-xl:text-[52px] max-md:text-[42px] max-sm:text-[34px]"
          />
          {/* Phones: the opening line on its own, and the phrases that must not
              split (NAS · 서버 · PC, 검색 한 줄로) held together. */}
          <p ref={leadRef} className="mt-5 max-w-[560px] text-[17px] leading-[1.7] text-[#46484D] max-sm:w-full max-sm:text-[15px]">
            {lang === 'en' ? (
              <>
                No uploads, no watching.<br className="sm:hidden" /> Heimdex indexes video where it already lives{' '}
                <span className="whitespace-nowrap">(NAS, servers, PCs)</span> so one search finds the scene you need and builds the short-form for you.
              </>
            ) : (
              <>
                업로드 없이, 시청 없이.<br className="sm:hidden" /> <span className="whitespace-nowrap">NAS · 서버 · PC에</span> 있는 영상을 그 자리에서
                분석해, <span className="whitespace-nowrap">검색 한 줄로</span> 필요한 장면을 찾고 숏폼까지 자동으로 만들어 드립니다.
              </>
            )}
          </p>

          <div ref={ctaRef} className="mt-9 flex flex-wrap items-center justify-center gap-3 max-sm:mt-8 max-sm:grid max-sm:w-full max-sm:grid-cols-2 max-sm:gap-2">
            <a
              href={PLAYGROUND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] border border-hx bg-[linear-gradient(0deg,#0A2240_33%,#234C77_233%)] px-6 text-[16px] font-semibold text-white shadow-[inset_0_4px_11px_rgba(145,145,145,0.25)] transition-[filter,transform] duration-200 hover:brightness-125 active:scale-[0.97] max-sm:px-3 max-sm:text-[15px]"
            >
              {t('웹에서 체험하기', 'Try it on the web')}
              <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
            </a>
            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] bg-white px-6 text-[16px] font-semibold text-[#111] shadow-[0_1px_3px_rgba(10,34,64,0.08),0_6px_16px_-6px_rgba(10,34,64,0.14)] transition-[box-shadow,transform] duration-200 hover:shadow-[0_2px_4px_rgba(10,34,64,0.1),0_10px_22px_-8px_rgba(10,34,64,0.2)] active:scale-[0.97] max-sm:px-3 max-sm:text-[15px]"
            >
              {t('문의하기', 'Contact us')}
            </Link>
          </div>
        </Reveal>

        <div ref={settleRef} className="relative mt-16 w-full max-w-[1052px] origin-[50%_100%] will-change-transform max-sm:mt-12">
          <div className="relative rounded-[20px] border border-[rgba(70,72,77,0.12)] bg-white/40 p-2 shadow-[0_30px_80px_rgba(10,34,64,0.18)] backdrop-blur-sm max-sm:rounded-[16px] max-sm:p-1.5">
            <ScaleToFit base={1440} aspect={1440 / 900} crop={HERO_CROP} className="rounded-[14px] bg-white max-sm:rounded-[12px]">
              <HeroAppMockup key={lang} />
            </ScaleToFit>
          </div>
        </div>

        {/* Proof points, under the demo, where the bloom has faded back to white */}
        <ul className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 max-sm:mt-8">
          {[t('업로드 없음', 'No uploads'), t('온프레미스 · 폐쇄망', 'On-prem · air-gapped'), t('무료 1달 PoC', 'Free 1-month PoC')].map((label) => (
            <li key={label} className="flex items-center gap-1.5 text-[14px] font-medium tracking-[-0.02em] text-[#46484D]">
              <CircleCheck size={15} strokeWidth={2} className="text-[#234C77]" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
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
      <img src="/assets/stage/rights-stage-v2.webp" alt="" loading="lazy" className="h-full w-full object-cover object-[center_60%] opacity-70" />
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
  // Drawn by FEATURE_IMAGES outside the scaled layer, so it stays sharp
  return null
}

// Visuals that are just a screenshot: rendered at the card's real size instead
// of inside ScaleToFit, where a 400px raster scaled up would blur the UI text.
const FEATURE_IMAGES = {
  // Figma node 5:326, cropped to the subtitle list + preview. Pre-scaled sizes
  // (Lanczos) so the browser never has to shrink the UI text by 3x itself.
  'auto-recut': {
    src: '/assets/hero/editor-recut-1080.webp',
    srcSet: '/assets/hero/editor-recut-640.webp 640w, /assets/hero/editor-recut-1080.webp 1080w, /assets/hero/editor-recut.webp 1880w',
  },
}

const FEATURE_VISUALS = {
  'scene-intelligence': SceneSearchVisual,
  'rights-monitor': RightsVisual,
  'auto-recut': RecutVisual,
}


// Features (Framer "Desktop 01"): a tag pill and headline over a ruled list on
// the left — one item open at a time, its description sliding down — and the
// open feature's demo in a white card on the right. Advances on its own.
function Features() {
  const { lang, t } = useLang()
  const [active, setActive] = useState(0)
  const n = FEATURES.length
  // Rolls on its own every 6s; a click jumps there and the timer restarts.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => setActive((a) => (a + 1) % n), 6000)
    return () => clearTimeout(id)
  }, [active, n])

  // The open feature's demo in a white card (all three stacked, cross-fading).
  const card = (
    <div className="rounded-[16px] bg-white p-3 shadow-[0_7px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.03]">
      <div className="relative overflow-hidden rounded-[10px] bg-[#FCFCFF]">
        <ScaleToFit base={400} aspect={400 / 300} crisp>
          {FEATURES.map((f, i) => {
            const Visual = FEATURE_VISUALS[f.slug]
            return (
              <div
                key={f.slug}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${i === active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              >
                <Visual />
              </div>
            )
          })}
        </ScaleToFit>
        {FEATURES.map((f, i) =>
          FEATURE_IMAGES[f.slug] ? (
            <img
              key={f.slug}
              src={FEATURE_IMAGES[f.slug].src}
              srcSet={FEATURE_IMAGES[f.slug].srcSet}
              sizes="(min-width: 1280px) 530px, (min-width: 1024px) 42vw, 92vw"
              alt=""
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover object-left-top transition-[opacity,transform] duration-700 ease-out ${
                i === active ? 'scale-100 opacity-100' : 'pointer-events-none scale-[1.03] opacity-0'
              }`}
            />
          ) : null,
        )}
      </div>
    </div>
  )

  return (
    <section id="features" className="hx-section hx-pad-b relative bg-white">
      <div className="mx-auto grid max-w-content grid-cols-2 items-center gap-[60px] max-lg:grid-cols-1 max-lg:gap-10">
        <div>
          <Reveal className="flex flex-col items-start">
            <CharReveal
              text={t('찾고, 지키고, 다시 만듭니다', 'Find it. Protect it. Remake it.')}
              className="hm-title"
            />
            <p className="hm-lead mt-4">
              {t('쌓여만 있던 영상을 다시 일하는 자산으로', 'Turn footage that just sits there back into a working asset')}
            </p>
          </Reveal>

          {/* Phones/tablets: the demo card sits between the headline and the list */}
          <Reveal delay={80} className="mt-10 lg:hidden">{card}</Reveal>

          <Reveal delay={100} className="mt-14 max-sm:mt-10">
            <ol className="border-b border-[rgba(58,58,61,0.12)]">
              {FEATURES.map((f, i) => {
                const on = i === active
                return (
                  <li key={f.slug} className="border-t border-[rgba(58,58,61,0.12)]">
                    <button type="button" aria-expanded={on} onClick={() => setActive(i)} className="block w-full py-6 text-left max-sm:py-5">
                      <span className={`flex items-baseline gap-2.5 transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
                        <span className={`text-[24px] font-bold tracking-[-0.03em] max-sm:text-[20px] ${on ? 'text-[#111]' : 'text-[#46484D]'}`}>
                          {lang === 'en' ? f.kindEn : f.kind}
                        </span>
                        <span className="font-product text-[13px] font-bold text-[#8CA5C3]">{f.name}</span>
                      </span>
                      <span className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <span className="overflow-hidden">
                          <span
                            className={`hm-body block pt-2.5 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:whitespace-pre-line ${
                              on ? 'translate-y-0 opacity-100' : '-translate-y-1/2 opacity-0'
                            }`}
                          >
                            {lang === 'en' ? f.descEn : f.desc}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </Reveal>
        </div>

        <Reveal delay={120} className="max-lg:hidden">{card}</Reveal>
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
    <section className="hx-pad-b">
      <Reveal className="flex flex-col items-center gap-9">
        <h2 className="hm-kicker px-5">{t('현장에서 먼저 검증된 기술력', 'Proven in the field first')}</h2>
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


// The heimlog product demo (the one on the solution page), loaded only when its
// block comes near the screen. A failed chunk just leaves the dark frame empty.
const HeimlogDemo = lazy(() => import('../components/HeimlogDemo.jsx'))
class QuietBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

// Personal path (Vercel "Host platforms" block): a large heading, the heimlog
// demo across eight columns fading into the page, and on the right a two-tone
// line, what it does, and the way in — in Heimlog's coral, as its own product.
function HeimlogBlock() {
  const { t } = useLang()
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return setNear(true)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: '400px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="mt-40 flex flex-col gap-14 max-lg:mt-[120px] max-sm:mt-20 max-sm:gap-10">
      {/* Same head as the other sections (title, then copy), with the way into
          heimlog as a round arrow on the right end */}
      <Reveal className="flex items-end justify-between gap-6">
        <div>
          <h2 className="hm-title">{t('개인 크리에이터라면, heimlog', 'For individual creators, heimlog')}</h2>
          <p className="hm-lead mt-4 max-w-[34em]">
            {t(
              '직접 찍은 여행 · 일상 영상을 올리면 AI가 장면을\u00A0골라 자막\u00A0·\u00A0블러까지 자동으로 편집해 브이로그로 만들어 드려요.',
              'Upload your travel and everyday clips, and AI picks the scenes and adds captions and blur to make your vlog.',
            )}
          </p>
        </div>
        <a
          href={HEIMLOG_APP}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('heimlog 둘러보기', 'Explore heimlog')}
          className="group grid h-16 w-16 shrink-0 place-items-center rounded-full bg-heimlog text-heimlog-on shadow-[0_12px_28px_-12px_rgba(255,122,102,0.7)] transition-colors hover:bg-heimlog-hover max-sm:h-12 max-sm:w-12"
        >
          <ArrowRight size={24} strokeWidth={2.2} className="transition-transform duration-300 group-hover:translate-x-0.5 max-sm:h-5 max-sm:w-5" aria-hidden />
        </a>
      </Reveal>

      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-20 top-1/3 h-48 rounded-full bg-heimlog/20 blur-[110px]" />
        <ScaleToFit base={1440} aspect={1440 / 660} className="rounded-[18px] bg-[#262626] max-sm:rounded-[12px]">
          {near && (
            <QuietBoundary>
              <Suspense fallback={null}>
                <HeimlogDemo />
              </Suspense>
            </QuietBoundary>
          )}
        </ScaleToFit>
      </div>
    </div>
  )
}

// Industries (Framer "Process Cards" stack): a mono eyebrow and a headline that
// rises word by word, then one card per industry that sticks under the header
// as you scroll; each card the next one covers sinks back a little (scale +
// dim), so the five pile up like a deck before the section moves on.
function Industries() {
  const { lang, t } = useLang()
  const en = lang === 'en'
  const items = useRef([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const els = items.current.filter(Boolean)
      els.forEach((li, i) => {
        const inner = li.firstElementChild
        const next = els[i + 1]
        if (!inner) return
        if (!next) return void (inner.style.transform = inner.style.filter = '')
        const a = li.getBoundingClientRect()
        const b = next.getBoundingClientRect()
        // 0 while the next card is a full card-height away, 1 once it has landed on top
        const p = Math.min(1, Math.max(0, 1 - (b.top - a.top - 16) / a.height))
        inner.style.transform = `scale(${1 - p * 0.05})`
        inner.style.filter = `brightness(${1 - p * 0.08})`
      })
    }
    const onScroll = () => raf || (raf = requestAnimationFrame(update))
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    // overflow-x-clip, not overflow-hidden: a hidden overflow would make this
    // section the scroll box and the cards would stop sticking.
    <section id="industries" className="hx-pad-b overflow-x-clip">
      <div className="hx-section">
        <div className="mx-auto max-w-content">
          <Reveal className="max-w-[920px]">
            <WordRise
              text={t('우리 업계에 맞춘 하임덱스', 'Heimdex, built for your industry')}
              className="hm-title"
            />
            <p className="hm-lead mt-4 max-w-[34em]">
              {t('업계마다 다른 영상 업무, 그 흐름에 맞춰 일합니다.', 'Every industry works with video differently. Heimdex fits the flow.')}
            </p>
          </Reveal>

          <ol className="mt-14 flex flex-col gap-6 max-sm:mt-10 max-sm:gap-4">
            {INDUSTRIES.map((ind, i) => (
              <li
                key={ind.slug}
                ref={(el) => (items.current[i] = el)}
                className="sticky"
                style={{ top: `calc(96px + ${i * 16}px)` }}
              >
                <div className="origin-top will-change-transform">
                  <Link
                    to={industryPath(ind.slug)}
                    className="group grid grid-cols-[180px_minmax(0,1fr)_minmax(0,0.85fr)] gap-10 rounded-[28px] bg-white p-10 shadow-[0_20px_50px_-20px_rgba(10,34,64,0.18)] max-lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] max-lg:gap-8 max-lg:p-8 max-md:grid-cols-1 max-md:gap-6 max-sm:rounded-[22px] max-sm:p-5"
                  >
                    {/* "For" small over the industry word, e.g. For / Commerce */}
                    <span className="flex flex-col gap-1.5 text-[#8CA5C3] max-lg:hidden">
                      <span className="text-[15px] font-medium leading-none tracking-[-0.01em]">{ind.tag.split(' ')[0]}</span>
                      <span className="text-[36px] font-semibold leading-none tracking-[-0.04em] text-hx">{ind.tag.split(' ').slice(1).join(' ')}</span>
                    </span>

                    <span className="flex min-w-0 flex-col max-md:order-2">
                      <span className="flex items-center justify-between gap-4 border-b border-[rgba(10,34,64,0.1)] pb-4 text-[14px] font-semibold">
                        <span className="text-[#111]">{en ? ind.nameEn : ind.name}</span>
                        <span className="font-mono text-[12.5px] font-medium text-ink-mute lg:hidden">{ind.tag}</span>
                      </span>
                      <span className="mt-7 text-[30px] font-bold leading-[1.3] tracking-[-0.035em] text-[#111] max-lg:text-[26px] max-sm:mt-5 max-sm:text-[22px]">
                        {(en ? ind.cardEn : ind.card).join(' ')}
                      </span>
                      <span className="hm-body mt-4">
                        {en ? ind.features[0].descEn : ind.features[0].desc}
                      </span>
                      <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-7 max-sm:pt-5">
                        {ind.features.slice(0, 3).map((f) => (
                          <span key={f.title} className="hm-chip bg-[#F5F7FA] shadow-none">
                            {en ? f.titleEn : f.title}
                          </span>
                        ))}
                      </span>
                    </span>

                    <span className="relative block aspect-[4/3] overflow-hidden rounded-[18px] bg-mist max-md:order-1 max-md:aspect-[16/9] max-sm:rounded-[14px]">
                      <span className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                        <IndustryImage industry={ind} compact />
                      </span>
                    </span>
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="hx-section">
        <div className="mx-auto max-w-content">
          <HeimlogBlock />
        </div>
      </div>
    </section>
  )
}

// flitto's image-topped solution cards — a dark navy "photo" carrying the icon.
function Security() {
  const { t } = useLang()
  const cards = [
    {
      scene: 'local',
      img: '/assets/stage/security-local.webp', // Figma node 10:251
      title: t('업로드 없는 로컬 인덱싱', 'Local indexing, no uploads'),
      desc: t('영상은 원래 저장소에 그대로, 검색에 필요한\u00A0인덱스만 만들어요.', 'Video stays where it is. Only the search index is built.'),
      tags: [t('원본 보존', 'Originals stay put'), t('로컬 인덱스', 'Local index'), 'NAS · Server · PC'],
    },
    {
      scene: 'onprem',
      title: t('온프레미스 · 폐쇄망 지원', 'On-premise & air-gapped'),
      desc: t('민감한 영상이 회사 밖으로 나가지 않아요.', 'Sensitive footage never leaves the company.'),
      tags: [t('온프레미스', 'On-premise'), t('폐쇄망', 'Air-gapped'), t('외부 전송 없음', 'No outbound transfer')],
    },
    {
      scene: 'blur',
      img: '/assets/stage/security-blur.webp', // Figma node 11:251
      title: t('개인정보 자동 블러', 'Automatic privacy blur'),
      desc: t('제3자 얼굴 · 차량 번호판을 AI가 자동으로 가려요.', 'AI automatically masks third-party faces and license plates.'),
      tags: [t('얼굴', 'Faces'), t('번호판', 'License plates'), t('자동 마스킹', 'Auto masking')],
    },
  ]
  return (
    <section className="hx-section hx-pad bg-fog">
      <div className="mx-auto max-w-content">
        <Reveal className="max-lg:text-center">
          <CharReveal text={t('영상은 그 자리에, 인사이트만 움직입니다', 'Video stays put. Only insight moves.')} className="hm-title" />
          <p className="hm-lead mt-4">Data Stays, Insight Moves</p>
        </Reveal>
        <Reveal className="mt-14 grid grid-cols-3 gap-6 max-lg:mx-auto max-lg:grid-cols-1 max-lg:max-w-[520px] max-sm:mt-10">
          {cards.map(({ scene, img, title, desc, tags }) => (
            <div key={title} className="flex flex-col max-lg:items-center max-lg:text-center">
              <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[16px] bg-[radial-gradient(120%_90%_at_50%_10%,#173A63_0%,#0A1F3A_55%,#050F1F_100%)]">
                {img ? (
                  <img src={img} alt="" loading="lazy" decoding="async" width={2400} height={1800} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <IsoScene kind={scene} className="absolute inset-0 h-full w-full" />
                )}
              </div>
              <h3 className="hm-h3 mt-6">{title}</h3>
              <p className="hm-body mt-2 lg:min-h-[3.4em]">{desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 max-lg:justify-center">
                {tags.map((tag) => (
                  <span key={tag} className="hm-chip">
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

// Testimonial wall (Framer "Hear from our customers"): no tabs, no carousel —
// every quote at once in a staggered 3-column masonry, with photo cards for two
// industries mixed in (in place of the reference's video cards) that open that
// industry's page. Columns collapse to 2 on tablets and 1 on phones.
function Cases() {
  const { lang, t } = useLang()
  const en = lang === 'en'
  // Every real quote we have, one card each; the ticker repeats the set once so
  // the -50% loop lands exactly on the start.
  const items = ['commerce', 'media', 'legal', 'research']
    .map((slug) => ({ ind: INDUSTRIES.find((i) => i.slug === slug), q: TESTIMONIALS[slug]?.[0] }))
    .filter((it) => it.ind && it.q)

  return (
    <section id="testimonials" className="hx-pad relative overflow-hidden">
      {/* soft navy wash so the glass cards have something to blur */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(40% 60% at 15% 70%, rgba(35,76,119,0.10), transparent 70%), radial-gradient(35% 55% at 85% 40%, rgba(140,165,195,0.18), transparent 70%)',
        }}
      />
      <div className="hx-section relative">
        <div className="mx-auto max-w-content">
          <CharReveal
            text={t('현장에서 먼저 쓰고 있습니다', 'Already at work in the field')}
            className="hm-title"
          />
        </div>
      </div>

      <div className="relative mt-14 -mb-12 overflow-hidden pb-12 max-sm:mt-10">
        <ul className="marquee-track flex w-max items-stretch" style={{ animationDuration: '60s' }}>
          {[...items, ...items].map(({ ind, q }, i) => {
            const copy = i >= items.length
            return (
              <li key={i} aria-hidden={copy || undefined} className="flex shrink-0 pr-5 max-sm:pr-3.5">
                <figure className="flex w-[440px] flex-col gap-7 rounded-[40px] bg-white/45 p-9 shadow-[0_10px_40px_rgba(10,34,64,0.05)] backdrop-blur-[10px] max-sm:w-[300px] max-sm:gap-6 max-sm:rounded-[28px] max-sm:p-7">
                  <blockquote className="hm-lead text-[#111]">
                    {(en ? q.quoteEn : q.quote).replace(/\n/g, ' ')}
                  </blockquote>
                  <figcaption className="mt-auto flex flex-col gap-0.5 text-[15px] font-semibold tracking-[-0.01em]">
                    <span className="text-[#111]">{en ? q.whoEn : q.who}</span>
                    <span className="text-[#8B95A1]">{en ? ind.nameEn : ind.name}</span>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

// FAQ — visible Q&A plus FAQPage JSON-LD built from the same entries, so AI
// search can quote answers that match what the page shows. Every answer stays in
// the DOM (and in the prerendered HTML) even while collapsed.
function Faq() {
  const { lang, t } = useLang()
  const [open, setOpen] = useState(0)
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
    <section id="faq" className="hx-pad-b relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(35% 50% at 85% 30%, rgba(35,76,119,0.08), transparent 70%), radial-gradient(40% 55% at 10% 80%, rgba(140,165,195,0.16), transparent 70%)',
        }}
      />
      <div className="hx-section relative">
        <div className="mx-auto max-w-content">
          <CharReveal
            text={t('도입 전에 가장 많이 묻는 질문들', 'What teams ask before they start')}
            className="hm-title"
          />
          <Reveal className="mt-14 flex flex-col gap-2.5 max-sm:mt-10">
            {FAQ.map((f, i) => {
              const on = open === i
              return (
                <div
                  key={f.q}
                  className={`rounded-[32px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6),inset_0_0_0_1px_rgba(10,34,64,0.06),0_8px_30px_rgba(10,34,64,0.04)] backdrop-blur-[10px] transition-colors duration-300 max-sm:rounded-[24px] ${
                    on ? 'bg-white/80' : 'bg-white/45 hover:bg-white/65'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(on ? -1 : i)}
                      className="flex w-full items-center gap-6 px-[30px] py-6 text-left max-sm:gap-4 max-sm:px-6 max-sm:py-5"
                    >
                      <span className="flex-1 text-[18px] font-semibold tracking-[-0.03em] text-[#111] max-sm:text-[16px]">{en ? f.qEn : f.q}</span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-[background-color,color] duration-300 ${
                          on ? 'bg-hx text-white' : 'bg-white text-ink-sub shadow-[inset_0_0_0_1px_rgba(10,34,64,0.08)]'
                        }`}
                      >
                        {on ? <Minus size={18} strokeWidth={2} aria-hidden /> : <ChevronDown size={18} strokeWidth={2} aria-hidden />}
                      </span>
                    </button>
                  </h3>
                  {/* Kept in the DOM while closed so the prerendered HTML carries every answer */}
                  <div
                    id={`faq-a-${i}`}
                    className={`grid transition-[grid-template-rows] duration-[450ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`hm-body px-[30px] pb-7 pr-[90px] transition-opacity duration-300 max-sm:px-6 max-sm:pb-6 ${
                          on ? 'opacity-100 delay-100' : 'opacity-0'
                        }`}
                      >
                        {en ? f.aEn : f.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </Reveal>
        </div>
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
