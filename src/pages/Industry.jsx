import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from '../i18n/Link.jsx'
import Reveal from '../components/Reveal.jsx'
import CharReveal from '../components/CharReveal.jsx'
import WordRise from '../components/WordRise.jsx'
import { DarkCta, IndustryImage } from '../components/Sections.jsx'
import { useLang, localizePath } from '../i18n/LanguageContext.jsx'
import { INDUSTRIES, findIndustry, industryPath } from '../data/industries.js'
import { TESTIMONIALS } from '../data/testimonials.js'

// Industry detail page — one template for all five (homepage-wireframe 03-1~5).
// URL: /product/business/industry/:slug
//
// Hero after the Framer "Hero" (glass tag, headline, button, product
// screen); then the Toss product page's numbered chapters (boxed 01/02/03
// + a headline that writes itself in). The copy is the industry's own data:
// 01 = first feature with a large visual, 02 = second feature with the other
// two as image cards, then the customer quote, 03 = the other industries, and
// a proof-point strip before the closing band.

// Boxed chapter number (Toss "01").
function StepNo({ n }) {
  return (
    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] border border-[rgba(3,31,63,0.09)] px-2.5 font-product text-[15px] font-bold tabular-nums text-[#234C77]">
      {String(n).padStart(2, '0')}
    </span>
  )
}

export default function Industry() {
  const { slug } = useParams()
  const { lang, t } = useLang()
  const ind = findIndustry(slug)
  if (!ind) return <Navigate to={localizePath('/', lang)} replace />

  const en = lang === 'en'
  const name = en ? ind.nameEn : ind.name
  const quote = TESTIMONIALS[ind.slug]?.[0]
  const [f1, f2, ...rest] = ind.features
  const title = (f) => (en ? f.titleEn : f.title)
  const desc = (f) => (en ? f.descEn : f.desc)
  const others = INDUSTRIES.filter((i) => i.slug !== ind.slug)

  return (
    <div className="bg-white">
      {/* ───────── Hero (Framer "Feature Section"): two columns — headline,
          lead, the dark gradient button and a small note on the left; the
          industry's image on the right. ───────── */}
      <section className="hx-section hx-hero-t hx-pad-b relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_0%,rgba(35,76,119,0.10)_0%,rgba(35,76,119,0)_100%)]" />
        <div className="relative mx-auto grid max-w-content grid-cols-2 items-start gap-16 max-lg:grid-cols-1 max-lg:gap-12">
          {/* Text side (Framer article hero): tag pill → title rising word by word → excerpt → the way in.
              Main and sub copy swapped: the card line leads, the long headline follows. */}
          <div className="flex flex-col items-start max-sm:items-center max-sm:text-center">
            <Reveal delay={80} className="flex flex-wrap items-center gap-x-3 gap-y-2 max-sm:justify-center">
              <span className="inline-flex items-center rounded-full border border-[rgba(10,34,64,0.14)] px-3 py-1 text-[13px] font-semibold tracking-[-0.01em] text-[#234C77]">
                {name}
              </span>
            </Reveal>
            <WordRise
              as="h1"
              delay={160}
              text={(en ? ind.cardEn : ind.card).join(' ')}
              className="mt-5 text-[52px] font-bold leading-[1.22] tracking-[-0.035em] text-[#111] max-xl:text-[46px] max-md:text-[38px] max-sm:text-[30px]"
            />
            <Reveal delay={240}>
              <p className="mt-5 max-w-[480px] text-[18px] leading-[1.7] text-[#46484D] max-sm:mx-auto max-sm:text-[16px]">
                {(en ? ind.headlineEn : ind.headline).join(' ')}
              </p>
            </Reveal>
            <Reveal delay={320} className="mt-9 flex flex-col items-start gap-3 max-sm:mt-8 max-sm:items-center">
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] border border-hx bg-[linear-gradient(0deg,#0A2240_33%,#234C77_233%)] px-6 text-[16px] font-semibold text-white shadow-[inset_0_4px_11px_rgba(145,145,145,0.25)] transition-[filter,transform] duration-200 hover:brightness-125 active:scale-[0.97] max-sm:text-[15px]"
              >
                {t('도입 문의하기', 'Get in touch')}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
              </Link>
              <p className="text-[14px] font-medium tracking-[-0.02em] text-[#8B95A1]">
                {t('무료 1달 PoC로 먼저 검토해 보세요', 'Try it first with a free 1-month PoC')}
              </p>
            </Reveal>
          </div>

          <Reveal delay={150}>
            {/* The industry's own image (the main-page card's), or a page-specific one */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-mist shadow-[0_30px_80px_-24px_rgba(10,34,64,0.28)]">
              {ind.heroImage ? (
                <img src={ind.heroImage} alt="" className="h-full w-full object-cover object-left-top" />
              ) : (
                <IndustryImage industry={ind} />
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── Features — text only, one layout for all four: a 2×2 grid of
          number, title and copy under the same hairline ───────── */}
      <section className="hx-section hx-pad-b">
        <div className="mx-auto grid max-w-content grid-cols-2 gap-x-16 gap-y-16 max-md:grid-cols-1 max-sm:gap-y-12">
          {[f1, f2, ...rest.slice(0, 2)].map((f, n) => (
            <Reveal key={f.title} delay={(n % 2) * 80} className="flex flex-col items-start border-t border-[#E8EBF0] pt-8 max-sm:items-center max-sm:pt-7 max-sm:text-center">
              <StepNo n={n + 1} />
              <CharReveal
                as="h2"
                text={title(f)}
                className="mt-5 text-[32px] font-bold leading-[1.35] tracking-[-0.03em] text-[#111] max-md:text-[28px] max-sm:text-[24px]"
              />
              <p className="mt-3 text-[17px] leading-[1.75] text-[#46484D] max-sm:text-[16px]">{desc(f).replace(/\n/g, ' ')}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Customer quote — hidden until the industry has a real one */}
      {quote && (
        <section className="hx-section hx-pad-b">
          <Reveal className="mx-auto max-w-[860px] text-center">
            <p className="text-[15px] font-semibold text-[#727780]">{en ? `${ind.nameEn} customer story` : `${ind.name} 고객 후기`}</p>
            <blockquote className="mt-5 text-[26px] font-bold leading-[1.55] tracking-[-0.02em] text-ink max-sm:text-[20px]">
              “{en ? quote.quoteEn : quote.quote}”
            </blockquote>
            <p className="mt-5 text-[15px] text-ink-sub">{en ? quote.whoEn : quote.who}</p>
          </Reveal>
        </section>
      )}

      {/* ───────── 03 — other industries as a card carousel ───────── */}
      <OtherIndustries others={others} />

      <DarkCta
        lines={en ? ind.closingEn : ind.closing}
        sub={t('무료 1달 PoC로 우리 영상 데이터에서 먼저 확인해 보세요.', 'See it on your own footage first with a free 1-month PoC.')}
      />
    </div>
  )
}

// One "other industry" card, shared by the desktop rail and the phone loop.
function IndustryCard({ o, en, onClickCapture }) {
  return (
    <Link
      to={industryPath(o.slug)}
      draggable={false}
      onClickCapture={onClickCapture}
      className="group flex h-full select-none flex-col rounded-[16px] bg-[#F5F7FA] p-2 transition-[translate,box-shadow] duration-[450ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(10,34,64,0.25)]"
    >
      <span className="relative block aspect-[16/10] overflow-hidden rounded-[11px] bg-mist">
        <span className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04] [&_img]:pointer-events-none">
          <IndustryImage industry={o} compact />
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-2 px-3.5 pb-4 pt-5">
        <span className="text-[14px] font-semibold text-[#8CA5C3]">{o.tag}</span>
        <span className="text-[24px] font-bold leading-[1.2] tracking-[-0.035em] text-[#111] max-sm:text-[21px]">{en ? o.nameEn : o.name}</span>
        <span className="text-[15px] leading-[1.6] text-[#46484D]">{(en ? o.cardEn : o.card).join(' ')}</span>
        <span className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {o.features.slice(0, 3).map((f) => (
            <span key={f.title} className="rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium tracking-[-0.02em] text-[#46484D]">
              {en ? f.titleEn : f.title}
            </span>
          ))}
        </span>
      </span>
    </Link>
  )
}

const ARROW =
  'grid h-12 w-12 place-items-center rounded-full bg-white text-[#111] shadow-[0_1px_3px_rgba(10,34,64,0.08),0_6px_16px_-6px_rgba(10,34,64,0.14)] transition-[background-color,color,opacity] hover:bg-hx hover:text-white disabled:pointer-events-none disabled:opacity-40'

// The other industries. Desktop/tablet: a horizontal card rail that starts on
// the content edge and runs to the screen edge, with prev/next keys, a position
// bar and mouse drag. Phones: an endless loop (PhoneLoop).
function OtherIndustries({ others }) {
  const { lang, t } = useLang()
  const en = lang === 'en'
  const railRef = useRef(null)
  const drag = useRef(null)
  const [pos, setPos] = useState({ f: 0.5, p: 0, start: true, end: false })

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      setPos({ f: Math.min(1, el.clientWidth / el.scrollWidth), p: max > 0 ? el.scrollLeft / max : 0, start: el.scrollLeft < 4, end: el.scrollLeft > max - 4 })
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const step = (dir) => {
    const el = railRef.current
    const card = el.querySelector('li')
    const gap = parseFloat(getComputedStyle(el).columnGap) || 20
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 360) + gap), behavior: 'smooth' })
  }
  const onDown = (e) => {
    if (e.pointerType !== 'mouse') return
    drag.current = { x: e.clientX, left: railRef.current.scrollLeft, moved: false }
  }
  const onMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    railRef.current.scrollLeft = d.left - dx
  }
  const onUp = () => setTimeout(() => (drag.current = null), 0)

  return (
    <section className="hx-pad-b overflow-hidden">
      <div className="hx-section">
        <div className="mx-auto flex max-w-content items-end justify-between gap-8 max-sm:justify-center">
          <Reveal className="flex flex-col items-start max-sm:items-center max-sm:text-center">
            <CharReveal
              text={t('다른 산업도 둘러보세요', 'Explore other industries')}
              className="text-[40px] font-bold leading-[1.35] tracking-[-0.03em] text-[#111] max-md:text-[32px] max-sm:text-[26px]"
            />
          </Reveal>
          <div className="flex shrink-0 gap-2 max-sm:hidden">
            <button type="button" aria-label={t('이전', 'Previous')} disabled={pos.start} onClick={() => step(-1)} className={ARROW}>
              <ArrowLeft size={18} strokeWidth={2.2} />
            </button>
            <button type="button" aria-label={t('다음', 'Next')} disabled={pos.end} onClick={() => step(1)} className={ARROW}>
              <ArrowRight size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={railRef}
        aria-label={t('다른 산업', 'Other industries')}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onClickCapture={(e) => drag.current?.moved && (e.preventDefault(), e.stopPropagation())}
        className="mt-11 flex cursor-grab snap-x snap-mandatory -mb-9 gap-5 overflow-x-auto pb-12 pt-3 [--g:20px] [scrollbar-width:none] active:cursor-grabbing md:[--g:32px] md:snap-none max-sm:hidden [&::-webkit-scrollbar]:hidden"
        style={{ paddingInline: 'max(var(--g), calc((100% - 1168px) / 2))', scrollPaddingInline: 'max(var(--g), calc((100% - 1168px) / 2))' }}
      >
        {others.map((o) => (
          <li key={o.slug} className="w-[min(380px,calc(100%-44px))] shrink-0 snap-start">
            <IndustryCard o={o} en={en} />
          </li>
        ))}
      </ul>

      <div className="hx-section max-sm:hidden">
        <div className="mx-auto mt-6 max-w-content">
          {/* Position bar: thumb width = visible share, place = scroll position */}
          <span aria-hidden className="relative block h-0.5 max-w-[320px] overflow-hidden rounded-full bg-[rgba(10,34,64,0.14)]">
            <i
              className="absolute inset-y-0 left-0 rounded-full bg-hx"
              style={{ width: `${pos.f * 100}%`, transform: `translateX(${pos.f < 1 ? ((pos.p * (1 - pos.f)) / pos.f) * 100 : 0}%)` }}
            />
          </span>
        </div>
      </div>

      <PhoneLoop others={others} en={en} t={t} />
    </section>
  )
}

// Phones: an endless carousel. The current card sits centred at full size; its
// neighbours peek in on both sides, smaller and faded. `idx` only ever counts up
// or down, and each slot shows others[idx mod n], so it never reaches an end.
// Cards are keyed by their absolute slot, so on a step the same element slides
// from the side into the centre instead of being swapped.
function PhoneLoop({ others, en, t }) {
  const n = others.length
  const [idx, setIdx] = useState(0)
  const [dx, setDx] = useState(0)
  const drag = useRef(null)
  const moved = useRef(false)
  const wrapRef = useRef(null)

  const go = (dir) => setIdx((i) => i + dir)
  const onDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, lock: null }
    moved.current = false
  }
  const onMove = (e) => {
    const d = drag.current
    if (!d) return
    const mx = e.clientX - d.x
    const my = e.clientY - d.y
    // decide once whether this gesture is a swipe or a page scroll
    if (!d.lock && Math.abs(mx) + Math.abs(my) > 8) d.lock = Math.abs(mx) > Math.abs(my) ? 'x' : 'y'
    if (d.lock !== 'x') return
    moved.current = true
    setDx(mx)
  }
  const onUp = () => {
    const d = drag.current
    drag.current = null
    if (!d) return
    const w = wrapRef.current?.offsetWidth || 300
    if (Math.abs(dx) > w * 0.15) go(dx < 0 ? 1 : -1)
    setDx(0)
  }

  const mod = (v) => ((v % n) + n) % n
  const slots = [-2, -1, 0, 1, 2]
  const current = others[mod(idx)]

  return (
    <div className="sm:hidden">
      <div
        ref={wrapRef}
        aria-roledescription="carousel"
        aria-label={t('다른 산업', 'Other industries')}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative mx-auto mt-7 grid w-[76%] touch-pan-y pb-6 pt-3 [grid-template-areas:'card']"
      >
        {slots.map((k) => {
          const slot = idx + k
          const o = others[mod(slot)]
          const center = k === 0
          return (
            <div
              key={slot}
              aria-hidden={!center}
              className={`[grid-area:card] ${dx ? '' : 'transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'} ${center ? 'z-10' : 'z-0'}`}
              style={{
                transform: `translateX(calc(${k} * (100% + 14px) + ${dx}px)) scale(${center ? 1 : 0.9})`,
                opacity: center ? 1 : Math.abs(k) === 1 ? 0.45 : 0,
                pointerEvents: center ? 'auto' : 'none',
              }}
            >
              <IndustryCard o={o} en={en} onClickCapture={(e) => moved.current && (e.preventDefault(), e.stopPropagation())} />
            </div>
          )
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {en ? current.nameEn : current.name}
      </p>

      <div className="mt-4 flex justify-center gap-2">
        <button type="button" aria-label={t('이전', 'Previous')} onClick={() => go(-1)} className={`${ARROW} !h-11 !w-11`}>
          <ArrowLeft size={18} strokeWidth={2.2} />
        </button>
        <button type="button" aria-label={t('다음', 'Next')} onClick={() => go(1)} className={`${ARROW} !h-11 !w-11`}>
          <ArrowRight size={18} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}
