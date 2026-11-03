import { useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Link from '../../i18n/Link.jsx'
import Reveal from '../../components/Reveal.jsx'
import { useLang, localizePath } from '../../i18n/LanguageContext.jsx'
import { DATA_PATH, REQUEST_PATH, collectionPath, useDataCopy } from '../../data/dataMarket.js'
import { A, Button, Eyebrow, IconTile, Tag } from '../../components/data/ui.jsx'

// /data/:slug — collection detail (Figma: KO / 02–06 상세). One template, five
// collections; content comes from data/dataMarket.*.js.

const WIDE = 'mx-auto w-full max-w-[1168px] px-5 md:px-8 xl:px-0' // hero (136–1304)
const NARROW = 'mx-auto w-full max-w-[904px] px-5 md:px-8 lg:px-0' // body (268–1172)
const DELIVERY_ICONS = ['icon-doc.svg', 'icon-box.svg', 'icon-cloud.svg']

function Arrowed({ items }) {
  return (
    <ul className="mt-[14px] flex flex-col gap-2">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2 text-[16px] font-semibold leading-[1.5] tracking-[-0.03em] text-ink-soft max-sm:text-[15px]">
          {/* ↳ drawn as SVG: its horizontal stroke sits on the first line's centre (12 of 24px) */}
          <svg aria-hidden width="18" height="24" viewBox="0 0 18 24" fill="none" className="shrink-0 text-accent">
            <path d="M3 4v4a4 4 0 0 0 4 4h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8.5L15.5 12 12 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

function Hero({ c, d }) {
  return (
    <section className="border-b border-line pb-[110px] pt-[111px] max-lg:pb-16 max-sm:pt-[96px]">
      <div className={`${WIDE} grid grid-cols-[1fr_416px] gap-10 max-lg:grid-cols-1`}>
        <div>
          <nav className="flex items-center gap-1 text-[14px] tracking-[-0.03em]" aria-label="breadcrumb">
            <Link to={`${DATA_PATH}#collections`} className="flex items-center gap-1 font-semibold text-ink-sub hover:text-ink">
              <img src={A('icon-back.svg')} alt="" width="18" height="18" /> {d.breadcrumb}
            </Link>
            <span className="mx-1 text-ink-mute">/</span>
            <span className="font-semibold text-ink">{c.name}</span>
          </nav>
          <p className="mt-[38px] inline-flex max-w-full items-center gap-2.5 rounded-full border border-line bg-white p-2 pr-4">
            <span className="shrink-0 rounded-full bg-accent px-[9.6px] py-[5.6px] text-[12px] font-bold leading-none text-white">{c.problemPill.caption}</span>
            <span className="text-[14px] font-semibold tracking-[-0.03em] text-ink-soft">{c.problemPill.body}</span>
          </p>
          <h1 className="mt-[22px] text-[56px] font-black leading-[1.2] tracking-[-0.03em] text-ink max-md:text-[40px] max-sm:text-[32px]">{c.name}</h1>
          <p className="mt-5 max-w-[641px] text-[18px] leading-[1.5] tracking-[-0.03em] text-ink-sub max-sm:text-[16px]">
            {c.descLines.map((l, i) => (
              <span key={l} className="block">
                {i > 0 && ' '}
                {l}
              </span>
            ))}
          </p>
          <div className="mt-6 flex flex-wrap gap-[5px]">
            {c.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-[15px]">
            <Button to={REQUEST_PATH} size="M">{d.heroButtons[0]}</Button>
            <Button to="/contact" type="secondary" size="M">{d.heroButtons[1]}</Button>
          </div>
        </div>

        <aside className="self-start rounded-[28px] lg:mt-[59px] border border-line bg-white px-[38px] pb-[30px] pt-[33px] shadow-[0_16px_40px_-16px_rgba(10,34,64,0.1)] max-lg:max-w-[560px] max-sm:px-6">
          <p className="text-[14px] font-bold tracking-[-0.03em] text-ink-mute">{d.problemsTitle}</p>
          <Arrowed items={c.summary.problems} />
          <hr className="my-7 border-line" />
          <p className="text-[14px] font-bold tracking-[-0.03em] text-ink-mute">{d.receiveTitle}</p>
          <Arrowed items={c.summary.receive} />
        </aside>
      </div>
    </section>
  )
}

function UseCases({ c, d }) {
  return (
    <section className="rounded-t-[40px] bg-snow pb-[160px] pt-[156px] max-sm:pb-20 max-sm:pt-20">
      <div className={WIDE}>
        <Reveal className="flex flex-col items-center text-center">
          <p className="flex items-center gap-2 text-[14px] font-bold tracking-[-0.03em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {d.useCasesEyebrow}
          </p>
          <h2 className="mt-4 text-[40px] font-extrabold tracking-[-0.03em] text-ink max-md:text-[32px] max-sm:text-[26px]">{d.useCasesTitle}</h2>
        </Reveal>
        <Reveal className="mt-[57px] grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {c.useCases.map((u, i) => (
            <div key={u.text} className="relative flex min-h-[213px] flex-col items-center rounded-[24px] bg-white px-8 pb-8 pt-10 text-center shadow-[0_12px_32px_-12px_rgba(10,34,64,0.08)]">
              <span className="absolute right-6 top-6 text-[14px] font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
              <img src={A(u.picto)} alt="" width="64" height="64" className="block h-16 w-16" />
              <p className="mt-8 text-[18px] font-extrabold leading-[1.5] tracking-[-0.03em] text-ink">{u.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function SpecTable({ t }) {
  return (
    <div>
      <h2 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink max-sm:text-[24px]">{t.title}</h2>
      <dl className="mt-5 overflow-hidden rounded-[12px] border border-[#D0D4DA] bg-white py-1">
        {t.rows.map((r) => (
          <div key={r.label} className="flex gap-4 border-b border-[#E3E6EA] px-4 py-3 last:border-b-0 max-sm:flex-col max-sm:gap-1">
            <dt className="w-[240px] shrink-0 pt-px text-[12px] font-bold tracking-[-0.03em] text-[#5A6270]">{r.label}</dt>
            <dd className="flex-1 text-[14px] tracking-[-0.03em] text-[#1F2328]">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Body({ c, d }) {
  return (
    <section className="pb-[160px] pt-[160px] max-sm:pb-20 max-sm:pt-20">
      <div className={`${NARROW} flex flex-col gap-[50px]`}>
        {c.specTables.map((t) => (
          <Reveal key={t.title}>
            <SpecTable t={t} />
          </Reveal>
        ))}

        {/* Sample CTA Card */}
        <Reveal className="flex items-center justify-between gap-8 rounded-[28px] border border-line bg-white px-8 py-[34px] shadow-[0_16px_40px_-16px_rgba(10,34,64,0.1)] max-md:flex-col max-md:items-start">
          <div className="max-w-[560px]">
            <Eyebrow>{d.sampleCta.eyebrow}</Eyebrow>
            <p className="mt-3 text-[28px] font-extrabold tracking-[-0.03em] text-ink max-sm:text-[22px]">{d.sampleCta.title}</p>
            <p className="mt-2 text-[16px] leading-[1.5] tracking-[-0.03em] text-ink-sub">{d.sampleCta.body}</p>
          </div>
          <div className="flex shrink-0 gap-[10px]">
            <Button to={REQUEST_PATH} className="h-[46px]">{d.sampleCta.buttons[0]}</Button>
            <Button to="/contact" type="secondary" className="h-[46px] w-[112px]">{d.sampleCta.buttons[1]}</Button>
          </div>
        </Reveal>

        {/* 납품 형식 */}
        <div id="delivery" className="scroll-mt-28" />
        <Reveal className="mt-[60px] max-sm:mt-0">
          <Eyebrow>{d.deliveryEyebrow}</Eyebrow>
          <h2 className="mt-4 text-[40px] font-extrabold tracking-[-0.03em] text-ink max-md:text-[32px] max-sm:text-[26px]">{d.deliveryTitle}</h2>
          <ul className="mt-[57px] rounded-[20px] border border-line bg-white px-6">
            {c.delivery.map((r, i) => (
              <li key={r.label} className="flex min-h-[80px] items-center gap-6 border-b border-line py-5 last:border-b-0 max-sm:flex-wrap max-sm:gap-3">
                <IconTile icon={A(DELIVERY_ICONS[i])} size={40} iconSize={20} />
                <span className="text-[12px] font-bold tracking-[-0.03em] text-ink-mute">{r.label}</span>
                <span className="ml-auto text-right text-[16px] font-extrabold tracking-[-0.03em] text-ink max-sm:ml-0 max-sm:w-full max-sm:text-left max-sm:text-[15px]">
                  {r.value}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* 권리와 동의 */}
        <Reveal className="mt-[110px] max-sm:mt-10">
          <Eyebrow>{d.rightsEyebrow}</Eyebrow>
          <h2 className="mt-4 text-[40px] font-extrabold tracking-[-0.03em] text-ink max-md:text-[32px] max-sm:text-[26px]">{d.rightsTitle}</h2>
          <div className="mt-[57px] grid grid-cols-2 gap-5 max-md:grid-cols-1">
            {c.rights.map((r) => (
              <div key={r.title} className="min-h-[148px] rounded-[18px] bg-snow p-6">
                <div className="flex items-center gap-4">
                  <IconTile icon={A(r.icon)} size={40} iconSize={20} />
                  <p className="text-[16px] font-extrabold tracking-[-0.03em] text-ink">{r.title}</p>
                </div>
                <p className="mt-5 text-[14px] tracking-[-0.03em] text-ink-sub">{r.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function CustomBand({ c }) {
  return (
    <section className="bg-ice py-[129px] max-md:py-20">
      <Reveal className={`${NARROW} flex items-center justify-between gap-8 max-md:flex-col max-md:items-start`}>
        <div>
          <p className="text-[32px] font-extrabold tracking-[-0.03em] text-ink max-md:text-[26px]">{c.customBand.title}</p>
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
  const pages = others.length
  const go = (dir) => {
    const el = track.current
    if (!el) return
    const card = el.firstElementChild
    const step = card ? card.getBoundingClientRect().width + 12.5 : el.clientWidth
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = track.current
    const card = el?.firstElementChild
    if (!card) return
    setPage(Math.round(el.scrollLeft / (card.getBoundingClientRect().width + 12.5)))
  }
  return (
    <section className="pb-[160px] pt-40 max-sm:pb-20 max-sm:pt-20">
      <div className={NARROW}>
        <div className="flex items-center justify-between">
          <h2 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink max-sm:text-[24px]">{d.carouselTitle}</h2>
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
                className="flex h-11 w-11 items-center justify-center rounded-full border border-hx bg-hx text-white transition-colors hover:bg-primary-600 disabled:cursor-default disabled:border-line-strong disabled:bg-white disabled:text-ink-mute"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d={path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        <div
          ref={track}
          onScroll={onScroll}
          className="-mx-5 mt-[23px] flex snap-x snap-mandatory gap-[12.5px] overflow-x-auto px-5 pb-6 pt-4 [scrollbar-width:none] md:-mx-8 md:px-8 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {others.map((o) => (
            <Link
              key={o.slug}
              to={collectionPath(o.slug)}
              className="flex w-[303px] shrink-0 snap-start flex-col rounded-[24px] border border-[#F2F2F2] bg-white px-5 pb-6 pt-[26px] shadow-[0_12px_32px_-12px_rgba(10,34,64,0.06)] transition-shadow hover:shadow-[0_20px_40px_-16px_rgba(10,34,64,0.16)]"
            >
              <p className="text-[18px] font-extrabold tracking-[-0.03em] text-ink">{o.name}</p>
              <p className="mt-3 text-[14px] leading-[1.5] tracking-[-0.03em] text-ink-sub">{o.carouselDesc}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {o.tags.map((t) => (
                  <Tag key={t} fill>
                    {t}
                  </Tag>
                ))}
              </div>
              <span className="mt-5 text-[14px] font-bold tracking-[-0.03em] text-hx">{d.carouselMore}</span>
            </Link>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2" aria-hidden>
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
  const c = data.collections.find((x) => x.slug === slug)
  if (!c) return <Navigate to={localizePath(DATA_PATH, lang)} replace />
  const d = data.detail
  return (
    <div className="bg-white">
      <Hero c={c} d={d} />
      <UseCases c={c} d={d} />
      <Body c={c} d={d} />
      <CustomBand c={c} />
      <Carousel slug={c.slug} d={d} />
    </div>
  )
}
