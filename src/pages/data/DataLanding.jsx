import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Link from '../../i18n/Link.jsx'
import Reveal from '../../components/Reveal.jsx'
import { useLang, localizePath } from '../../i18n/LanguageContext.jsx'
import { REQUEST_PATH, collectionPath, useDataCopy } from '../../data/dataMarket.js'
import { A, Button, Eyebrow, H2, IconTile, Lead, Tag } from '../../components/data/ui.jsx'
import HeroRibbon from '../../components/data/HeroRibbon.jsx'
import { OrDivider, QuickRequest, RequestFlow, SampleForm, SamplePackage, SegmentedControl } from '../../components/data/RequestBlocks.jsx'

// /data — 데이터 마켓플레이스 landing (Figma: KO / 01 랜딩 /data). Content sits in a
// 904px column; at xl a sticky section index runs down the left (Section Nav).

// Same order as the sections on the page (공급 구조 comes before 데이터 비교).
const SECTION_IDS = ['diff', 'collections', 'archive', 'about', 'supply', 'compare', 'faq', 'request']
const FEATURE_ICONS = ['feature-film.svg', 'icon-users.svg', 'feature-hand.svg', 'feature-search.svg']
const STEP_ICONS = ['flow-onprem.svg', 'flow-index.svg', 'flow-license.svg']

// Content column: full width below xl, offset past the section index at xl.
const COL = 'mx-auto w-full max-w-[1168px] px-5 md:px-8 xl:px-0'
const INNER = 'xl:ml-[264px] xl:max-w-[904px]'

const nl = (s) => s.split('\n').map((l, i) => (i ? [<br key={i} />, l] : l))

function Hero() {
  const d = useDataCopy().landing
  return (
    <section className="pb-[150px] pt-[136px] max-lg:pt-[112px] max-lg:pb-24 max-sm:pb-16">
      <div className={`${COL} grid grid-cols-[1fr_560px] items-start gap-10 max-lg:grid-cols-1`}>
        <Reveal>
          <p className="inline-flex max-w-full items-center gap-[18px] rounded-full border border-line bg-white/90 py-[5px] pl-[5px] pr-5">
            <span className="rounded-full bg-accent px-[10px] py-[5px] text-[12px] font-bold leading-none text-white">{d.promoPill.caption}</span>
            <span className="truncate text-[14px] font-semibold tracking-[-0.03em] text-ink-sub">{d.promoPill.body}</span>
          </p>
          <h1 className="mt-[34px] text-[44px] font-extrabold leading-[1.5] tracking-[-0.03em] text-ink max-md:text-[36px] max-sm:text-[28px]">
            {d.heroTitleAccent && (
              <>
                <span className="text-accent">{d.heroTitleAccent}</span>
                <br />
              </>
            )}
            {nl(d.heroTitle)}
          </h1>
          <p className="mt-[25px] text-[18px] leading-[1.5] tracking-[-0.03em] text-ink-sub max-sm:text-[16px]">{nl(d.heroBody)}</p>
          <div className="mt-[39px] flex flex-wrap gap-[15px]">
            <Button to={REQUEST_PATH} size="M">{d.heroButtons[0]}</Button>
            <Button to={`${REQUEST_PATH}?mode=1`} type="secondary" size="M">{d.heroButtons[1]}</Button>
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-2">
            {d.heroChecks.map((c) => (
              <li key={c} className="flex items-center gap-1.5 text-[12px] font-semibold tracking-[-0.03em] text-ink-sub">
                <img src={A('icon-check-small.svg')} alt="" width="16" height="16" /> {c}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Hero Voice Visual */}
        <Reveal delay={120} className="pt-[68px] max-lg:hidden">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[16px] font-bold tracking-[-0.03em] text-accent">
              <img src={A('icon-status-bars.svg')} alt="" width="14" height="14" /> {d.heroVisual.speaking}
            </span>
            <span className="text-[14px] tracking-[-0.03em] text-ink-mute">{d.heroVisual.cam}</span>
          </div>
          <HeroRibbon className="mt-[23px] block h-[200px] w-[560px]" />
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
                  className={`absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-ink transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    on ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                />
                <span
                  className={`text-[14px] font-semibold tracking-[-0.03em] text-ink transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    on ? 'translate-x-[14px] opacity-100' : 'translate-x-0 opacity-30 group-hover:opacity-60'
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
    <section id="diff" className="scroll-mt-24 rounded-t-[40px] bg-ice pb-[160px] pt-40 max-sm:pb-20 max-sm:pt-20">
      <div className={COL}>
        <div className={INNER}>
          <Reveal>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{d.title}</H2>
          </Reveal>
          <Reveal className="mt-14 grid grid-cols-2 gap-5 max-md:grid-cols-1">
            {d.features.map((f, i) => (
              <div key={f.title} className="flex min-h-[240px] flex-col justify-center rounded-[28px] border border-line bg-white p-8 drop-shadow-[0_16px_20px_rgba(10,34,64,0.1)] max-sm:p-6">
                <IconTile icon={A(FEATURE_ICONS[i])} size={52} />
                <h3 className="mt-7 text-[20px] font-extrabold tracking-[-0.03em] text-ink">{nl(f.title)}</h3>
                <p className="mt-2.5 text-[16px] leading-[1.5] tracking-[-0.03em] text-ink-sub">{nl(f.body)}</p>
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
      <h3 className="mt-[17px] text-[18px] font-extrabold tracking-[-0.03em] text-ink">{c.name}</h3>
      <p className="mt-[22px] text-[14px] tracking-[-0.03em] text-ink-sub">{c.desc}</p>
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
            <p className="text-[20px] font-extrabold tracking-[-0.03em] text-hx">{s.value}</p>
            <p className="mt-1 text-[12px] tracking-[-0.03em] text-ink-mute">{s.label}</p>
          </div>
        ))}
      </div>
      {c.note && <p className="mt-2 text-[12px] tracking-[-0.03em] text-ink-mute">{c.note}</p>}
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
    <section id="collections" className="scroll-mt-24 pb-[120px] pt-40 max-sm:pb-16 max-sm:pt-20">
      <div className={COL}>
        <div className={INNER}>
          <Reveal>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{d.title}</H2>
            <Lead className="mt-4">{d.lead}</Lead>
          </Reveal>
          <Reveal className="mt-[66px] grid grid-cols-2 gap-5 max-md:grid-cols-1">
            {data.collections.map((c) => (
              <CollectionCard key={c.slug} c={c} labels={d} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function NewRequest() {
  const d = useDataCopy().landing.newRequest
  return (
    <section className="pb-[120px] max-sm:pb-20">
      <div className={COL}>
        <Reveal className={`${INNER} grid grid-cols-[1fr_390px] gap-10 max-md:grid-cols-1`}>
          <div>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{d.title}</H2>
            <Button to={`${REQUEST_PATH}?mode=1`} type="soft" className="mt-6 h-[52px] px-[18px]">
              {d.button}
            </Button>
          </div>
          <div className="pt-[26px] max-md:pt-0">
            {/* Example query only — the field is disabled (search isn't live yet). */}
            <div aria-disabled="true" className="flex h-12 cursor-default select-none items-center gap-2 rounded-[12px] border border-line bg-white px-4">
              <img src={A('icon-search.svg')} alt="" width="18" height="18" />
              <input
                disabled
                placeholder={d.searchPlaceholder}
                aria-label={d.title}
                className="h-full flex-1 cursor-default bg-transparent text-[14px] tracking-[-0.03em] text-ink placeholder:text-ink-sub disabled:opacity-100"
              />
            </div>
            <ul className="mt-8 flex flex-col gap-[22px]">
              {d.options.map((o, i) => (
                <li key={o.title}>
                  <p className="flex items-center gap-1 text-[16px] font-bold tracking-[-0.03em] text-ink">
                    <span aria-hidden className="text-[14px]">{['①', '②'][i]}</span> {o.title}
                  </p>
                  <p className="mt-1 text-[14px] tracking-[-0.03em] text-ink-sub">{o.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Archive() {
  const d = useDataCopy().landing.archive
  return (
    <section id="archive" className="scroll-mt-24 bg-snow pb-[160px] pt-40 max-sm:pb-20 max-sm:pt-20">
      <div className={COL}>
        <div className={INNER}>
          <Reveal>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{d.title}</H2>
            <Lead className="mt-4 max-w-[640px]">{d.lead}</Lead>
            <Button to={REQUEST_PATH} size="M" className="mt-8">
              {d.button}
            </Button>
          </Reveal>
          <div id="about" className="mt-20 scroll-mt-32">
          <Reveal className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div className="rounded-[24px] border border-line bg-white p-10 shadow-[0_1px_2px_rgba(10,34,64,0.04)] max-sm:p-7">
              <Eyebrow>{d.license.eyebrow}</Eyebrow>
              <p className="mt-6 text-[28px] font-extrabold tracking-[-0.03em] text-ink">{d.license.title}</p>
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
              <p className="mt-6 text-[28px] font-extrabold tracking-[-0.03em] text-ink">{d.about.title}</p>
              <p className="mt-6 text-[16px] leading-[1.5] tracking-[-0.03em] text-ink-sub">{nl(d.about.body)}</p>
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

function Supply() {
  const d = useDataCopy().landing.supply
  return (
    <section id="supply" className="scroll-mt-24 pb-[120px] pt-40 max-sm:pb-16 max-sm:pt-20">
      <div className={COL}>
        <div className={INNER}>
          <Reveal>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{nl(d.title)}</H2>
            <Lead className="mt-5">{nl(d.lead)}</Lead>
          </Reveal>
          <Reveal className="relative mt-14 grid grid-cols-3 max-md:grid-cols-1 max-md:gap-10">
            <span aria-hidden className="absolute left-[16.6%] right-[16.6%] top-6 h-[2px] bg-gradient-to-r from-accent to-accent/20 max-md:hidden" />
            {d.steps.map((s, i) => (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent text-[18px] font-bold ${
                    i === 1 ? 'bg-accent text-white' : 'bg-white text-accent'
                  }`}
                >
                  {i + 1}
                </span>
                <p className="mt-6 text-[12px] font-semibold tracking-[-0.03em] text-accent">{s.step}</p>
                <p className="mt-2.5 text-[22px] font-extrabold tracking-[-0.03em] text-ink max-lg:text-[19px]">{s.title}</p>
                <span className="mt-[17px] inline-flex h-8 items-center gap-1.5 rounded-[14px] bg-mist px-3 text-[12px] tracking-[-0.03em] text-ink-sub">
                  <img src={A(STEP_ICONS[i])} alt="" width="18" height="18" /> {s.chip}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Compare() {
  const d = useDataCopy().landing.compare
  const last = d.columns.length - 1
  return (
    <section id="compare" className="scroll-mt-24 pb-40 pt-10 max-sm:pb-20">
      <div className={COL}>
        <div className={INNER}>
          <Reveal>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{d.title}</H2>
            <Lead className="mt-2">{d.lead}</Lead>
          </Reveal>
          <Reveal className="-mx-5 mt-10 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0">
            <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="w-[130px] border-b border-line" />
                  {d.columns.map((col, i) => (
                    <th
                      key={col}
                      className={`border-b px-[18px] py-[19px] align-top text-[12px] tracking-[-0.03em] ${
                        i === last
                          ? 'rounded-t-[20px] border-x border-t border-accent-100 border-b-[#E5E8EB] bg-accent-50 pt-[26px] font-black text-accent'
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
                    <th scope="row" className="whitespace-pre-line border-b border-line px-[18px] py-[17px] align-top text-[14px] font-bold tracking-[-0.03em] text-ink">
                      {r.label}
                    </th>
                    {r.cells.map((cell, i) => (
                      <td
                        key={i}
                        className={`whitespace-pre-line border-b px-[18px] py-[17px] align-top text-[14px] tracking-[-0.03em] ${
                          i === last
                            ? `border-x border-accent-100 border-b-[#E5E8EB] bg-accent-50 font-bold text-ink ${ri === d.rows.length - 1 ? 'rounded-b-[20px] border-b-accent-100' : ''}`
                            : 'border-line text-ink-sub'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Partner() {
  const d = useDataCopy().landing.partner
  return (
    <section className="bg-ice py-[70px] max-sm:py-14">
      <div className={COL}>
        <Reveal className={`${INNER} flex items-center justify-between gap-8 max-md:flex-col max-md:items-start`}>
          <div>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <p className="mt-3 text-[32px] font-extrabold tracking-[-0.03em] text-ink max-md:text-[26px]">{d.title}</p>
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

function Faq() {
  const d = useDataCopy().landing.faq
  return (
    <section id="faq" className="scroll-mt-24 bg-snow pb-40 pt-40 max-sm:py-20">
      <div className={COL}>
        <div className={INNER}>
          <Reveal>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <H2 className="mt-4">{d.title}</H2>
            <Lead className="mt-2 text-[16px]">{d.lead}</Lead>
            <Button to="/contact" className="mt-10 h-[52px] bg-white px-6 text-[14px] !text-ink hover:!bg-white/70" type="soft">
              {d.button}
            </Button>
          </Reveal>
          <Reveal className="mt-14 border-t border-line">
            {d.items.map((it, i) => (
              <details key={it.q} open={i === 0} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-[26px] pl-1 [&::-webkit-details-marker]:hidden">
                  <span className="text-[18px] font-bold tracking-[-0.03em] text-ink max-sm:text-[16px]">{it.q}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist transition-colors group-open:h-[45px] group-open:w-[45px] group-open:bg-hx">
                    <img src={A('faq-plus.svg')} alt="" width="14" height="14" className="group-open:hidden" />
                    <img src={A('faq-plus-white.svg')} alt="" width="20" height="20" className="hidden group-open:block" />
                  </span>
                </summary>
                <p className="-mt-2 pb-[26px] pl-1 pr-16 text-[16px] leading-[1.6] tracking-[-0.03em] text-ink-sub max-sm:pr-0">{it.a}</p>
              </details>
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
  return (
    <section id="request" className="scroll-mt-24 pb-[120px] pt-40 max-sm:pb-20 max-sm:pt-20">
      <div className={COL}>
        <div className={INNER}>
          <Reveal>
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
              <SegmentedControl options={d.segments} value={mode} onChange={setMode} />
            </div>
          </Reveal>
          <Reveal className="mt-14 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <RequestFlow />
            <SamplePackage />
          </Reveal>
          <Reveal className="mt-14">
            <QuickRequest accentButton />
          </Reveal>
          <div className="my-[30px]">
            <OrDivider />
          </div>
          <Reveal>
            <SampleForm key={mode} mode={mode} />
          </Reveal>
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
        <NewRequest />
        <Archive />
        <Supply />
        <Compare />
        <Partner />
        <Faq />
      </div>
      {/* The index stops following here — it doesn't ride over the request form. */}
      <RequestSection />
    </div>
  )
}
