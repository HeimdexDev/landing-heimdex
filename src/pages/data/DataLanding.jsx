import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Link from '../../i18n/Link.jsx'
import Reveal from '../../components/Reveal.jsx'
import { useLang, localizePath } from '../../i18n/LanguageContext.jsx'
import { REQUEST_PATH, collectionPath, useDataCopy } from '../../data/dataMarket.js'
import { A, Button, Eyebrow, H2, IconTile, Lead, Tag } from '../../components/data/ui.jsx'
import { OrDivider, QuickRequest, RequestFlow, SampleForm, SamplePackage, SegmentedControl } from '../../components/data/RequestBlocks.jsx'

// /data — 데이터 마켓플레이스 landing (Figma: KO / 01 랜딩 /data). Content sits in a
// 904px column; at xl a sticky section index runs down the left (Section Nav).

// Same order as the sections on the page.
const SECTION_IDS = ['diff', 'collections', 'archive', 'about', 'compare', 'faq', 'request']

// Content column: full width below xl, offset past the section index at xl.
const COL = 'mx-auto w-full max-w-content px-5 md:px-8 xl:px-0'
const INNER = 'xl:ml-[264px] xl:max-w-[904px]'

const nl = (s) => s.split('\n').map((l, i) => (i ? [<br key={i} />, l] : l))
// Desktop-only line breaks: the authored `\n` sets the rag on wide screens; on
// phones the copy reflows on its own (a forced break there strands one word).
const nlMd = (s) => s.split('\n').map((l, i) => (i ? [' ', <br key={i} className="max-md:hidden" />, l] : l))

function Hero() {
  const d = useDataCopy().landing
  return (
    <section className="hx-hero-t hx-pad-b">
      <div className={COL}>
        <Reveal className="max-w-[880px] max-sm:text-center">
          {/* Phones: one line, so the pill stays a pill. The last figure (dataset
              count) drops there; the library heading below repeats it. */}
          <p className="inline-flex max-w-full items-center gap-[18px] rounded-full border border-line bg-white/90 py-[5px] pl-[5px] pr-5 max-sm:gap-2.5 max-sm:pr-3.5">
            <span className="shrink-0 rounded-full bg-accent px-[10px] py-[5px] text-[12px] font-bold leading-none text-white">{d.promoPill.caption}</span>
            <span className="truncate text-[14px] font-semibold tracking-[-0.03em] text-ink-sub max-sm:text-[13px]">
              {d.promoPill.body.split(' · ').map((part, i, all) => (
                <span key={part} className={i === all.length - 1 ? 'max-sm:hidden' : undefined}>
                  {i > 0 && ' · '}
                  {part}
                </span>
              ))}
            </span>
          </p>
          <h1 className="mt-[34px] text-[44px] font-bold leading-[1.4] tracking-[-0.03em] text-ink max-md:text-[34px] max-sm:mt-7 max-sm:text-[27px]">{nlMd(d.heroTitle)}</h1>
          <p className="mt-[25px] text-[18px] leading-[1.6] tracking-[-0.03em] text-ink-sub max-sm:mt-5 max-sm:text-[16px]">{nlMd(d.heroBody)}</p>
          <div className="mt-[39px] flex flex-wrap gap-2 max-sm:mt-8 max-sm:justify-center">
            <Button to={REQUEST_PATH} size="M">{d.heroButtons[0]}</Button>
            <Button to={`${REQUEST_PATH}?mode=1`} type="secondary" size="M">{d.heroButtons[1]}</Button>
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-2 max-sm:mx-auto max-sm:mt-7 max-sm:w-fit max-sm:flex-col max-sm:text-left">
            {d.heroChecks.map((c) => (
              <li key={c} className="flex items-center gap-1.5 text-[12px] font-semibold max-sm:text-[13px] tracking-[-0.03em] text-ink-sub">
                <img src={A('icon-check-small.svg')} alt="" width="16" height="16" /> {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

// Sticky section index (Figma "Section Nav (sticky)") — highlights the section in view.
function SectionNav() {
  const d = useDataCopy().landing
  const [active, setActive] = useState(SECTION_IDS[0])
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return (
    <nav aria-label="Sections" className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[1168px] -translate-x-1/2 xl:block">
      {/* toss.im-style contents indicator: inactive items sit at 30%; the active
          one fades up while a dot scales in and pushes the label right. */}
      <ul className="pointer-events-auto sticky top-[160px] flex w-[200px] flex-col gap-4 pt-40">
        {SECTION_IDS.map((id, i) => {
          const on = active === id
          return (
            <li key={id}>
              <a href={`#${id}`} aria-current={on ? 'true' : undefined} className="group relative flex h-6 items-center">
                <span
                  aria-hidden
                  className={`absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-hx transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    on ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                />
                <span
                  className={`text-[14px] font-semibold tracking-[-0.03em] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    on ? 'translate-x-[14px] text-hx' : 'translate-x-0 text-[#B0B8C1] group-hover:text-ink-soft'
                  }`}
                >
                  {d.sectionNav[i]}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function Diff() {
  const d = useDataCopy().landing.diff
  return (
    <section id="diff" className="hx-pad lg:scroll-mt-24 rounded-t-[40px] bg-ice">
      <div className={COL}>
        <div className={INNER}>
          <Reveal className="max-sm:text-center">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{d.title}</H2>
            <Lead className="mt-4">{d.lead}</Lead>
          </Reveal>
          <Reveal className="mt-14 grid grid-cols-2 gap-5 max-md:grid-cols-1">
            {d.features.map((f, i) => (
              <div key={f.title} className="flex flex-col rounded-[28px] border border-line bg-white p-8 drop-shadow-[0_16px_20px_rgba(10,34,64,0.1)] max-sm:p-6">
                <span className="text-[14px] font-bold tracking-[-0.03em] text-accent">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.03em] text-ink">{f.title}</h3>
                <p className="mt-2.5 text-[16px] leading-[1.6] tracking-[-0.03em] text-ink-sub md:whitespace-pre-line">{f.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function CollectionCard({ c, labels }) {
  const navigate = useNavigate()
  const { lang } = useLang()
  const to = collectionPath(c.slug)
  return (
    <article
      onClick={() => navigate(localizePath(to, lang))}
      className="group flex cursor-pointer flex-col rounded-[24px] border border-[#F2F2F2] bg-white px-[26px] pb-[26px] pt-[41px] shadow-[0_12px_32px_-12px_rgba(10,34,64,0.06)] transition-shadow hover:shadow-[0_20px_40px_-16px_rgba(10,34,64,0.16)] max-sm:px-5"
    >
      <IconTile icon={A(c.icon)} />
      <h3 className="mt-[17px] flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[18px] font-semibold tracking-[-0.03em] text-ink">
        {c.name}
        {c.count && <span className="whitespace-nowrap text-[13px] font-medium text-ink-mute">{c.count}</span>}
      </h3>
      <p className="mt-[22px] text-[14px] leading-[1.6] tracking-[-0.03em] text-ink-sub md:whitespace-pre-line">{c.desc}</p>
      <div className="mt-[37px] flex flex-wrap gap-[5px]">
        {c.tags.map((t) => (
          <Tag key={t} fill>
            {t}
          </Tag>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {c.stats.map((s) => (
          <div key={s.label} className="rounded-[12px] bg-snow px-[14px] py-3">
            <p className="text-[20px] font-bold tracking-[-0.03em] text-hx">{s.value}</p>
            <p className="mt-1 text-[12px] tracking-[-0.03em] text-ink-mute">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between pt-12">
        <Link to={to} onClick={(e) => e.stopPropagation()} className="text-[14px] tracking-[-0.03em] text-ink-sub group-hover:text-ink">
          {labels.more}
        </Link>
        <Button to={REQUEST_PATH} size="S" onClick={(e) => e.stopPropagation()}>
          {labels.cta}
        </Button>
      </div>
    </article>
  )
}

function Collections() {
  const data = useDataCopy()
  const d = data.landing.collections
  return (
    <section id="collections" className="hx-pad lg:scroll-mt-24">
      <div className={COL}>
        <div className={INNER}>
          <Reveal className="max-sm:text-center">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{d.title}</H2>
            <Lead className="mt-4">{d.lead}</Lead>
          </Reveal>
          <Reveal className="mt-[66px] grid grid-cols-2 gap-5 max-md:grid-cols-1">
            {data.collections.map((c) => (
              <CollectionCard key={c.slug} c={c} labels={d} />
            ))}
            <NewRequestCard />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// The 6th slot of the collection grid: same card frame, pointing to a custom
// request instead of a collection.
function NewRequestCard() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const d = useDataCopy().landing.newRequest
  const to = `${REQUEST_PATH}?mode=1`
  return (
    <article
      onClick={() => navigate(localizePath(to, lang))}
      className="group flex cursor-pointer flex-col rounded-[24px] border border-[#F2F2F2] bg-white px-[26px] pb-[26px] pt-[41px] shadow-[0_12px_32px_-12px_rgba(10,34,64,0.06)] transition-shadow hover:shadow-[0_20px_40px_-16px_rgba(10,34,64,0.16)] max-sm:px-5"
    >
      <IconTile icon={A('icon-search.svg')} />
      <h3 className="mt-[17px] text-[18px] font-semibold tracking-[-0.03em] text-accent">{d.title}</h3>
      {/* Example query only — the field is disabled (search isn't live yet). */}
      <div aria-disabled="true" className="mt-[22px] flex h-12 select-none items-center gap-2 rounded-[12px] border border-line bg-white px-4">
        <img src={A('icon-search-input.svg')} alt="" width="18" height="18" />
        <input
          disabled
          tabIndex={-1}
          placeholder={d.searchPlaceholder}
          aria-label={d.title}
          className="pointer-events-none h-full min-w-0 flex-1 bg-transparent text-[14px] tracking-[-0.03em] text-ink placeholder:text-ink-sub disabled:opacity-100"
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 max-sm:grid-cols-1">
        {d.options.map((o, i) => (
          <div key={o.title} className="rounded-[12px] bg-snow px-[14px] py-3">
            <p className="text-[16px] font-semibold tracking-[-0.03em] text-hx">
              <span aria-hidden className="mr-1 text-[14px]">{['①', '②'][i]}</span>
              {o.title}
            </p>
            <p className="mt-1 text-[12px] tracking-[-0.03em] text-ink-mute">{o.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between pt-12">
        <span className="text-[14px] tracking-[-0.03em] text-ink-sub group-hover:text-ink">{d.eyebrow}</span>
        <Button to={to} size="S" onClick={(e) => e.stopPropagation()}>
          {d.button}
        </Button>
      </div>
    </article>
  )
}

function Archive() {
  const d = useDataCopy().landing.archive
  return (
    <section id="archive" className="hx-pad lg:scroll-mt-24 bg-snow">
      <div className={COL}>
        <div className={INNER}>
          <Reveal className="max-sm:text-center">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{d.title}</H2>
            <Lead className="mt-4 max-w-[640px]">{d.lead}</Lead>
            <Button to={REQUEST_PATH} size="M" className="mt-8">
              {d.button}
            </Button>
          </Reveal>
          <div id="about" className="mt-20 lg:scroll-mt-32 max-sm:mt-12">
          <Reveal className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div className="rounded-[24px] border border-line bg-white p-10 shadow-[0_1px_2px_rgba(10,34,64,0.04)] max-sm:p-7">
              <Eyebrow>{d.license.eyebrow}</Eyebrow>
              <p className="mt-6 text-[28px] font-bold tracking-[-0.03em] text-ink max-sm:mt-4 max-sm:text-[24px]">{d.license.title}</p>
              <ul className="mt-8 flex flex-col gap-3.5">
                {d.license.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-[16px] font-semibold tracking-[-0.03em] text-ink">
                    <img src={A('icon-check-circle.svg')} alt="" width="22" height="22" /> {it}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[24px] border border-line bg-white p-10 shadow-[0_1px_2px_rgba(10,34,64,0.04)] max-sm:p-7">
              <Eyebrow>{d.about.eyebrow}</Eyebrow>
              <p className="mt-6 text-[28px] font-bold tracking-[-0.03em] text-ink max-sm:mt-4 max-sm:text-[24px]">{d.about.title}</p>
              <p className="mt-6 text-[16px] leading-[1.5] tracking-[-0.03em] text-ink-sub max-sm:text-[15px]">{nlMd(d.about.body)}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {d.about.badges.map((b) => (
                  <span key={b} className="rounded-[8px] bg-accent-50 px-3 py-[7px] text-[12px] font-semibold tracking-[-0.03em] text-[#2B6FD6]">
                    {b}
                  </span>
                ))}
              </div>
              <div className="mt-8 border-t border-line pt-6">
                <p className="text-[12px] font-bold tracking-[0.08em] text-ink-mute">BACKED BY</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <img src={A('backer-samsungfire.svg')} alt={d.about.backers[0]} width="82" height="24" className="h-6 w-auto" />
                  <img src={A('backer-antler.svg')} alt={d.about.backers[1]} width="117" height="28" className="h-6 w-auto" />
                </div>
              </div>
            </div>
          </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Compare() {
  const d = useDataCopy().landing.compare
  const last = d.columns.length - 1
  return (
    <section id="compare" className="hx-pad lg:scroll-mt-24">
      <div className={COL}>
        <div className={INNER}>
          <Reveal className="max-sm:text-center">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{d.title}</H2>
            <Lead className="mt-2">{d.lead}</Lead>
          </Reveal>
          <CompareCards d={d} />
          <Reveal className="-mx-5 mt-10 overflow-x-auto px-5 pb-4 max-sm:hidden md:mx-0 md:px-0">
            <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="w-[130px] border-b border-line" />
                  {d.columns.map((col, i) => (
                    <th
                      key={col}
                      className={`border-b px-[18px] py-[19px] align-top text-[12px] tracking-[-0.03em] ${
                        i === last
                          ? 'rounded-t-[20px] border-x border-t border-accent-100 border-b-[#E5E8EB] bg-accent-50 pt-[26px] font-semibold text-accent'
                          : 'border-line font-bold text-ink-mute'
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.rows.map((r, ri) => (
                  <tr key={r.label}>
                    <th scope="row" className="whitespace-pre-line border-b border-line px-[18px] py-[17px] align-top text-[14px] font-semibold tracking-[-0.03em] text-ink">
                      {r.label}
                    </th>
                    {r.cells.map((cell, i) => (
                      <td
                        key={i}
                        className={`whitespace-pre-line border-b px-[18px] py-[17px] align-top text-[14px] tracking-[-0.03em] ${
                          i === last
                            ? 'border-x border-accent-100 border-b-[#E5E8EB] bg-accent-50 font-semibold text-ink'
                            : 'border-line text-ink-sub'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* The highlighted column runs 20px past the last row so the grey
                    rule underneath stays one unbroken line, then rounds off. */}
                <tr aria-hidden="true">
                  <td className="h-5 p-0" />
                  {d.columns.map((col, i) => (
                    <td key={col} className={`h-5 p-0 ${i === last ? 'rounded-b-[20px] border-x border-b border-accent-100 bg-accent-50' : ''}`} />
                  ))}
                </tr>
              </tbody>
            </table>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// Phones: the 5-column table would need sideways scrolling, so each row becomes
// a card — HEIMDEX's answer first (the highlighted column), the others below.
function CompareCards({ d }) {
  const last = d.columns.length - 1
  return (
    <div className="mt-8 flex flex-col gap-3 sm:hidden">
      {d.rows.map((r) => (
        <Reveal key={r.label} className="overflow-hidden rounded-[20px] border border-line bg-white">
          <div className="border-b border-accent-100 bg-accent-50 px-5 py-4">
            <p className="text-[13px] font-semibold tracking-[-0.03em] text-ink-mute">{r.label.replace(/\n/g, ' ')}</p>
            <p className="mt-2 text-[12px] font-semibold tracking-[-0.03em] text-accent">{d.columns[last]}</p>
            <p className="mt-1 whitespace-pre-line text-[16px] font-semibold leading-[1.5] tracking-[-0.03em] text-ink">{r.cells[last]}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 px-5 py-4">
            {r.cells.slice(0, last).map((cell, i) => (
              <div key={i} className="min-w-0">
                <dt className="text-[12px] tracking-[-0.03em] text-ink-mute">{d.columns[i]}</dt>
                <dd className="mt-0.5 text-[14px] leading-[1.45] tracking-[-0.03em] text-ink-sub">{cell.replace(/\n/g, ' ')}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      ))}
    </div>
  )
}

function Partner() {
  const d = useDataCopy().landing.partner
  return (
    <section className="hx-band bg-ice">
      <div className={COL}>
        <Reveal className={`${INNER} flex items-center justify-between gap-8 max-md:flex-col max-md:items-start max-sm:items-center max-sm:text-center`}>
          <div>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <p className="mt-3 text-[32px] font-bold tracking-[-0.03em] text-ink [text-wrap:balance] max-md:text-[26px] max-sm:text-[23px]">{d.title}</p>
            <p className="mt-3 text-[18px] tracking-[-0.03em] text-ink-sub max-sm:text-[16px]">{d.body}</p>
          </div>
          <Button to="/contact" className="h-[52px] shrink-0 rounded-[26px]">
            {d.button}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}

// One answer open at a time. The answer's height eases open/closed through a
// 0fr → 1fr grid row (works in every browser, unlike animating <details>), and
// stays in the DOM so the prerendered page still carries the text.
const EASE = 'duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]'
function FaqItem({ q, a, id, open, onToggle }) {
  return (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-[26px] pl-1 text-left"
      >
        <span className="text-[18px] font-semibold tracking-[-0.03em] text-ink max-sm:text-[16px]">{q}</span>
        <span
          className={`relative flex shrink-0 items-center justify-center rounded-full transition-all ${EASE} ${
            open ? 'h-[45px] w-[45px] bg-accent' : 'h-8 w-8 bg-mist'
          }`}
        >
          <img src={A('faq-plus.svg')} alt="" width="14" height="14" className={`absolute transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
          <img src={A('faq-plus-white.svg')} alt="" width="20" height="20" className={`absolute transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
        </span>
      </button>
      {/* The 8px pull-up sits on the outer grid, not the text: inside the
          overflow-hidden wrapper it clipped the first line. */}
      <div id={id} role="region" className={`grid transition-[grid-template-rows,opacity,margin] ${EASE} ${open ? '-mt-2 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="whitespace-pre-line pb-[26px] pl-1 pr-16 text-[16px] leading-[1.6] tracking-[-0.03em] text-ink-sub max-sm:pr-0">{a}</p>
        </div>
      </div>
    </div>
  )
}

function Faq() {
  const [openFaq, setOpenFaq] = useState(0)
  const d = useDataCopy().landing.faq
  return (
    <section id="faq" className="hx-pad lg:scroll-mt-24 bg-snow">
      <div className={COL}>
        <div className={INNER}>
          <Reveal className="max-sm:text-center">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{d.title}</H2>
            <Lead className="mt-2 text-[16px]">{d.lead}</Lead>
            <Button to="/contact" className="mt-10 h-[52px] bg-white px-6 text-[14px] !text-ink hover:!bg-white/70" type="soft">
              {d.button}
            </Button>
          </Reveal>
          <Reveal className="mt-14 border-t border-line">
            {d.items.map((it, i) => (
              <FaqItem key={it.q} q={it.q} a={it.a} id={`faq-${i}`} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function RequestSection() {
  const data = useDataCopy()
  const d = data.request
  const [mode, setMode] = useState(0)
  const formRef = useRef(null)
  const pickMode = (i) => {
    setMode(i)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <section id="request" className="hx-pad lg:scroll-mt-24">
      <div className={COL}>
        <div className={INNER}>
          <Reveal className="max-sm:text-center">
            <Eyebrow>{d.breadcrumb}</Eyebrow>
            <H2 className="mt-4">
              {d.titleLines.map((l, i) => (
                <span key={l} className="block">
                  {i > 0 && ' '}
                  {l}
                </span>
              ))}
            </H2>
            <div className="mt-8">
              <SegmentedControl options={d.segments} value={mode} onChange={pickMode} />
            </div>
          </Reveal>
          <Reveal className="mt-14 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <RequestFlow />
            <SamplePackage />
          </Reveal>
          <Reveal className="mt-14">
            <QuickRequest />
          </Reveal>
          <div className="my-[30px]">
            <OrDivider />
          </div>
          <div ref={formRef} className="lg:scroll-mt-24">
            <Reveal>
              <SampleForm key={mode} mode={mode} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function DataLanding() {
  return (
    <div className="bg-white">
      <Hero />
      <div className="relative">
        <SectionNav />
        <Diff />
        <Collections />
        <Archive />
        <Compare />
        <Partner />
        <Faq />
      </div>
      {/* The index stops following here — it doesn't ride over the request form. */}
      <RequestSection />
    </div>
  )
}
