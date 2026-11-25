import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Link from '../../i18n/Link.jsx'
import Reveal from '../../components/Reveal.jsx'
import { useLang, localizePath } from '../../i18n/LanguageContext.jsx'
import { DATA_PATH, REQUEST_PATH, collectionPath, useDataCopy } from '../../data/dataMarket.js'
import { A, Button, IconTile, Tag } from '../../components/data/ui.jsx'

// /data/:slug — collection detail. One template for every collection; content
// comes from data/dataMarket.*.js.

const WIDE = 'mx-auto w-full max-w-content px-5 md:px-8 xl:px-0' // hero (136–1304)
const NARROW = 'mx-auto w-full max-w-[904px] px-5 md:px-8 lg:px-0' // body (268–1172)
const DELIVERY_ICONS = ['icon-doc.svg', 'icon-box.svg', 'icon-cloud.svg']

function Hero({ c, d }) {
  return (
    <section className="hx-hero-t hx-pad-b border-b border-line">
      <div className={WIDE}>
        <nav className="flex items-center gap-1 text-[14px] tracking-[-0.03em]" aria-label="breadcrumb">
          <Link to={`${DATA_PATH}#collections`} className="flex items-center gap-1 font-semibold text-ink-sub hover:text-ink">
            <img src={A('icon-back.svg')} alt="" width="18" height="18" /> {d.breadcrumb}
          </Link>
          <span className="mx-1 text-ink-mute">/</span>
          <span className="font-semibold text-ink">{c.name}</span>
        </nav>
        <h1 className="mt-[38px] text-[56px] font-bold leading-[1.2] tracking-[-0.03em] text-ink max-md:text-[40px] max-sm:text-center max-sm:text-[32px]">{c.name}</h1>
        <p className="mt-5 max-w-[820px] text-[18px] leading-[1.6] tracking-[-0.03em] text-ink-sub max-sm:text-center max-sm:text-[16px]">
          {c.descLines.map((l, i) => (
            <span key={l} className="block max-sm:inline">
              {i > 0 && ' '}
              {l}
            </span>
          ))}
        </p>
        <div className="mt-6 flex flex-wrap gap-[5px] max-sm:justify-center">
          {c.detailTags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <div data-hero-cta className="mt-10 flex flex-wrap gap-2 max-sm:justify-center">
          <Button to={REQUEST_PATH} size="M">{d.heroButtons[0]}</Button>
          <Button to="/contact" type="secondary" size="M">{d.heroButtons[1]}</Button>
        </div>
        {/* 파일 · 묶음 · 전달 */}
        <ul className="mt-12 grid grid-cols-3 gap-3 max-md:grid-cols-1">
          {c.delivery.map((r, i) => (
            <li key={r.label} className="flex items-center gap-4 rounded-[18px] bg-snow px-5 py-4">
              <IconTile icon={A(DELIVERY_ICONS[i])} size={40} iconSize={20} />
              <span className="min-w-0">
                <span className="block text-[12px] font-semibold tracking-[-0.03em] text-ink-mute">{r.label}</span>
                <span className="mt-0.5 block text-[15px] font-semibold tracking-[-0.03em] text-ink">{r.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Spec({ c, d }) {
  return (
    <section className="hx-pad">
      <Reveal className={NARROW}>
        <h2 className="text-[30px] font-bold tracking-[-0.03em] text-ink max-sm:text-[24px]">{d.specTitle}</h2>
        <dl className="mt-5 overflow-hidden rounded-[12px] border border-[#D0D4DA] bg-white py-1">
          {c.spec.map((r) => (
            <div key={r.label} className="flex gap-4 border-b border-[#E3E6EA] px-4 py-3 last:border-b-0 max-sm:flex-col max-sm:gap-1">
              <dt className="w-[200px] shrink-0 pt-px text-[12px] font-semibold tracking-[-0.03em] text-[#5A6270]">{r.label}</dt>
              <dd className="flex-1 whitespace-pre-line text-[14px] leading-[1.6] tracking-[-0.03em] text-[#1F2328]">{r.value}</dd>
            </div>
          ))}
        </dl>
        {c.specNote && <p className="mt-3 text-[13px] leading-[1.5] tracking-[-0.03em] text-ink-mute">{c.specNote}</p>}
      </Reveal>
    </section>
  )
}

// Sample CTA, floating at the bottom of the viewport while the reader is in the
// page body: it shows once the hero's own buttons have scrolled away and hides
// again as the footer comes up. While it's up, body[data-sample-bar] lifts the
// global floating buttons clear of it (index.css).
function SampleBar({ d }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const cta = document.querySelector('[data-hero-cta]')
      const footer = document.querySelector('footer')
      const pastHero = cta ? cta.getBoundingClientRect().bottom < 0 : window.scrollY > 600
      const footerUp = footer ? footer.getBoundingClientRect().top < window.innerHeight : false
      setShow(pastHero && !footerUp)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  useEffect(() => {
    document.body.toggleAttribute('data-sample-bar', show)
    return () => document.body.removeAttribute('data-sample-bar')
  }, [show])

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-6 z-30 px-5 transition-[opacity,transform] duration-300 md:px-8 max-sm:bottom-4 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-[904px] items-center justify-between gap-6 rounded-[24px] bg-white/95 py-4 pl-7 pr-4 shadow-[0_20px_48px_-16px_rgba(10,34,64,0.3)] backdrop-blur max-sm:p-3">
        <div className="min-w-0 max-sm:hidden">
          <p className="text-[18px] font-bold tracking-[-0.03em] text-ink">{d.sampleCta.title}</p>
          <p className="mt-0.5 truncate text-[14px] tracking-[-0.03em] text-ink-sub">{d.sampleCta.body}</p>
        </div>
        <div className="flex shrink-0 gap-2 max-sm:w-full">
          <Button to={REQUEST_PATH} tabIndex={show ? undefined : -1} className="h-[46px] max-sm:flex-1">{d.sampleCta.buttons[0]}</Button>
          <Button to="/contact" type="secondary" tabIndex={show ? undefined : -1} className="h-[46px] w-[112px] max-sm:w-auto max-sm:flex-1">
            {d.sampleCta.buttons[1]}
          </Button>
        </div>
      </div>
    </div>
  )
}

function CustomBand({ c }) {
  return (
    <section className="hx-band bg-ice">
      <Reveal className={`${NARROW} flex items-center justify-between gap-8 max-md:flex-col max-md:items-start max-sm:items-center max-sm:text-center`}>
        <div>
          <p className="text-[32px] font-bold tracking-[-0.03em] text-ink max-md:text-[26px]">{c.customBand.title}</p>
          <p className="mt-3 text-[16px] tracking-[-0.03em] text-ink-sub">{c.customBand.body}</p>
        </div>
        <Button to={`${REQUEST_PATH}?mode=1`} className="h-[49px] shrink-0 rounded-[28px] px-7 text-[14px]">
          {c.customBand.button}
        </Button>
      </Reveal>
    </section>
  )
}

// "다른 데이터셋 둘러보기" — the other collections in a scrollable track.
function Carousel({ slug, d }) {
  const all = useDataCopy().collections
  const others = all.filter((x) => x.slug !== slug)
  const track = useRef(null)
  const [page, setPage] = useState(0)
  // Dots = positions you can actually scroll to, not the card count: with 3
  // cards in view, 4 cards only leave 2 stops. Re-measured on resize.
  const [pages, setPages] = useState(others.length)
  const step = (el) => {
    const card = el.firstElementChild
    return card ? card.getBoundingClientRect().width + 12.5 : el.clientWidth
  }
  const measure = () => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setPages(max > 1 ? Math.ceil((max - 1) / step(el)) + 1 : 1)
    onScroll()
  }
  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  const go = (dir) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: dir * step(el), behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = track.current
    if (!el) return
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2
    const n = Math.ceil(Math.max(0, el.scrollWidth - el.clientWidth - 1) / step(el)) + 1
    setPage(atEnd ? n - 1 : Math.round(el.scrollLeft / step(el)))
  }
  return (
    <section className="hx-pad">
      <div className={NARROW}>
        <div className="flex items-center justify-between">
          <h2 className="text-[30px] font-bold tracking-[-0.03em] text-ink max-sm:text-[24px]">{d.carouselTitle}</h2>
          <div className="flex gap-2">
            {[
              [-1, page <= 0, 'Previous', 'M15 18l-6-6 6-6'],
              [1, page >= pages - 1, 'Next', 'M9 18l6-6-6-6'],
            ].map(([dir, off, label, path]) => (
              <button
                key={label}
                type="button"
                onClick={() => go(dir)}
                disabled={off}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-accent bg-accent text-white transition-colors hover:bg-accent-600 disabled:cursor-default disabled:border-line-strong disabled:bg-white disabled:text-ink-mute"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        <div
          ref={track}
          onScroll={onScroll}
          className="-mx-5 mt-[23px] flex snap-x snap-mandatory scroll-px-5 gap-[12.5px] overflow-x-auto px-5 pb-6 pt-4 md:scroll-px-8 lg:scroll-px-0 [scrollbar-width:none] md:-mx-8 md:px-8 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {others.map((o) => (
            <Link
              key={o.slug}
              to={collectionPath(o.slug)}
              className="flex w-[303px] max-w-[84%] shrink-0 snap-start flex-col rounded-[24px] border border-[#F2F2F2] bg-white px-5 pb-6 pt-[26px] shadow-[0_12px_32px_-12px_rgba(10,34,64,0.06)] transition-shadow hover:shadow-[0_20px_40px_-16px_rgba(10,34,64,0.16)]"
            >
              <p className="text-[18px] font-semibold tracking-[-0.03em] text-ink">{o.name}</p>
              <p className="mt-3 text-[14px] leading-[1.5] tracking-[-0.03em] text-ink-sub">{o.carouselDesc}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {o.tags.map((t) => (
                  <Tag key={t} fill>
                    {t}
                  </Tag>
                ))}
              </div>
              <span className="mt-5 text-[14px] font-semibold tracking-[-0.03em] text-hx">{d.carouselMore}</span>
            </Link>
          ))}
        </div>
        <div className={`mt-4 flex justify-center gap-2 ${pages < 2 ? 'invisible' : ''}`} aria-hidden>
          {Array.from({ length: pages }, (_, i) => (
            <span key={i} className={`h-2 rounded-full transition-all ${i === Math.min(page, pages - 1) ? 'w-6 bg-accent' : 'w-2 bg-line-strong'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function DataDetail() {
  const { slug } = useParams()
  const { lang } = useLang()
  const data = useDataCopy()
  // 화자 분리 대화 음성 was merged into 다화자 대화.
  if (slug === 'speaker-separated') return <Navigate to={localizePath(collectionPath('multi-speaker'), lang)} replace />
  const c = data.collections.find((x) => x.slug === slug)
  if (!c) return <Navigate to={localizePath(DATA_PATH, lang)} replace />
  const d = data.detail
  return (
    <div className="bg-white">
      <Hero c={c} d={d} />
      <Spec c={c} d={d} />
      <CustomBand c={c} />
      <Carousel slug={c.slug} d={d} />
      <SampleBar d={d} />
    </div>
  )
}
