import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Link from '../i18n/Link.jsx'
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  ChevronDown,
  Clapperboard,
  Database,
  Handshake,
  Mic,
  PersonStanding,
  Presentation,
  Search,
  Send,
  Users,
  Video,
  Globe,
  FlaskConical,
  GraduationCap,
  Menu,
  PenLine,
  Scale,
  ShoppingBag,
  X,
} from 'lucide-react'
import { useLang, stripLangPrefix } from '../i18n/LanguageContext.jsx'
import { DATA_PATH, REQUEST_PATH, collectionPath, useDataCopy } from '../data/dataMarket.js'
import { SHOW_COMPANY_LINKS } from '../data/flags.js'
import {
  INDUSTRIES,
  HEIMLOG_APP,
  blogUrl,
  industryPath,
} from '../data/industries.js'

// GNB per homepage-wireframe 01 (문서 4.1):
//   로고 | 제품▾ · 도입 사례 · 블로그↗ · 회사▾ | KO/EN | [도입 문의] [하임로그 시작하기]
// 제품 opens a mega-menu split by audience (비즈니스용 / 산업별 / 개인용) rather
// than "B2B/B2C"; 블로그 hovers into one entry per readership; 회사 is a dropdown.

export const INDUSTRY_ICONS = {
  commerce: ShoppingBag,
  media: Clapperboard,
  education: GraduationCap,
  legal: Scale,
  research: FlaskConical,
}

const BLOG = [
  {
    key: 'business',
    label: 'Business 블로그',
    en: 'Business blog',
    caption: '도입 검토 · 고객 사례 · 산업 동향 · 기술 해설',
    captionEn: 'Evaluation · customer stories · trends · tech explainers',
    icon: Briefcase,
  },
  {
    key: 'creators',
    label: 'Creators 블로그',
    en: 'Creators blog',
    caption: '브이로그 제작 가이드 · 편집 팁 · 하임로그 사용법',
    captionEn: 'Vlog guides · editing tips · how to use heimlog',
    icon: PenLine,
  },
  {
    key: 'company',
    label: 'Company',
    en: 'Company',
    caption: '소식 · 브랜드 노트 · 팀 문화',
    captionEn: 'News · brand notes · team culture',
    icon: Building2,
  },
]

const COMPANY = [
  { label: '소개', en: 'About', caption: '하임덱스가 만드는 표준', captionEn: 'The standard Heimdex is building', to: '/company/about' },
  { label: '소식', en: 'News', caption: '투자 · 수상 · 선정 · 방송', captionEn: 'Funding · awards · selections · media', to: '/company/news' },
  { label: '브랜드', en: 'Brand', caption: '로고 · BX 가이드', captionEn: 'Logo · BX guide', to: '/company/brand' },
  { label: '채용', en: 'Careers', caption: '하임덱스 크루 되기', captionEn: 'Join the Heimdex crew', to: '/company/careers' },
]

const HEIMLOG_LINKS = [
  { label: '하임로그 소개', en: 'About heimlog', to: '/heimlog' },
  { label: '요금제 · 크레딧', en: 'Pricing & credits', to: '/heimlog/pricing' },
  { label: '사용 가이드', en: 'User guide', to: '/heimlog/guide' },
]

function Caret({ open }) {
  return (
    <ChevronDown
      size={14}
      strokeWidth={2.4}
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    />
  )
}

// Square icon tile used in front of menu rows.
function Tile({ icon: Icon, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-[#F2F4F6] text-ink',
    cyan: 'bg-primary-50 text-primary-500',
  }
  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
      <Icon size={18} strokeWidth={1.8} />
    </span>
  )
}

// Three flat columns split by hairlines — 비즈니스용 · 산업별 · 개인용 — each
// opened by the same small heading, so nothing competes but the items.
function ProductMenu({ lang, t, close }) {
  const en = lang === 'en'
  const head = 'mb-5 text-[12px] font-semibold tracking-[0.02em] text-ink-mute'
  return (
    <div className="mx-auto w-full max-w-[1200px] py-9 max-xl:px-8">
      <div className="grid grid-cols-[1fr_1.55fr_1fr] divide-x divide-line">
        {/* 비즈니스용 */}
        <div className="pr-10">
          <p className={head}>{t('비즈니스용', 'For business')}</p>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-hx">
            <img src="/assets/logo-mark-white.svg" alt="" className="h-[18px] w-[18px]" />
          </span>
          <p className="mt-4 font-product text-[20px] font-bold leading-tight text-hx">HEIMDEX</p>
          <p className="mt-1.5 text-[14px] leading-[1.6] text-ink-sub">
            {t('쌓인 영상 아카이브에서 장면을 찾고, 지키고, 다시 만들어요', 'Find, protect and remake scenes from your archive')}
          </p>
          <p className="mt-3 text-[13px] text-ink-mute">{t('팀 · 기업 · 기관', 'Teams · companies · institutions')}</p>
        </div>

        {/* 산업별 */}
        <div className="px-10">
          <p className={head}>{t('산업별', 'By industry')}</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {INDUSTRIES.map((ind) => {
              const Icon = INDUSTRY_ICONS[ind.slug]
              return (
                <li key={ind.slug}>
                  <Link
                    to={industryPath(ind.slug)}
                    onClick={close}
                    className="group -mx-3 block rounded-xl px-3 py-2.5 transition-colors hover:bg-mist"
                  >
                    <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                      <Icon size={16} strokeWidth={1.9} className="text-ink-mute transition-colors group-hover:text-primary-500" />
                      {en ? ind.nameEn : ind.name}
                    </span>
                    <span className="mt-0.5 block truncate pl-6 text-[13px] text-ink-sub">
                      {en ? ind.menuCaptionEn : ind.menuCaption}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 개인용 — the whole column opens the heimlog app */}
        <a href={HEIMLOG_APP} target="_blank" rel="noopener noreferrer" onClick={close} className="group block pl-10">
          <p className={head}>{t('개인용', 'For individuals')}</p>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-heimlog-cream">
            <img src="/assets/heimlog-mark.svg" alt="" className="h-[18px] w-[18px]" />
          </span>
          <span className="mt-4 flex items-center gap-2">
            <span className="text-[20px] font-bold leading-tight text-ink transition-colors group-hover:text-heimlog-ink">
              {t('하임로그', 'heimlog')}
            </span>
            <span className="rounded-full bg-heimlog px-2 py-0.5 text-[11px] font-semibold text-heimlog-on">{t('무료로 시작', 'Start free')}</span>
          </span>
          <span className="mt-1.5 block text-[14px] leading-[1.6] text-ink-sub">
            {t('찍어둔 여행 · 일상 영상을 AI가 브이로그로 자동 편집해요', 'AI edits your travel and daily clips into a vlog')}
          </span>
          <span className="mt-3 block text-[13px] text-ink-mute">{t('크리에이터 · 브이로거', 'Creators · vloggers')}</span>
          <span className="mt-5 inline-block text-[14px] font-semibold text-heimlog-ink">{t('하임로그 바로가기', 'Open heimlog')}</span>
        </a>
      </div>
    </div>
  )
}

// 데이터 마켓플레이스 mega-menu — same three-column build, heading and line icons
// as the 제품 menu (ProductMenu): overview · collections · request.
const COLLECTION_ICONS = {
  'multi-speaker': Users,
  'speaker-separated': Mic,
  multicam: Video,
  motion: PersonStanding,
  presenter: Presentation,
}

function DataMegaMenu({ t, close }) {
  const d = useDataCopy()
  const head = 'mb-5 text-[12px] font-semibold tracking-[0.02em] text-ink-mute'
  const item = 'group -mx-3 block rounded-xl px-3 py-2.5 transition-colors hover:bg-mist'
  const actions = [
    { icon: Send, to: REQUEST_PATH, label: d.gnb.sample, caption: t('2영업일 안에 샘플 구성안 회신', 'Proposed sample within 2 business days') },
    { icon: Search, to: `${REQUEST_PATH}?mode=1`, label: t('맞춤 데이터 요청', 'Request custom data'), caption: t('필요한 장면을 문장으로 요청', 'Describe the scene you need') },
    { icon: Handshake, to: '/contact', label: t('파트너 문의', 'Partner with us'), caption: t('아카이브를 보유한 제작사 · 방송사', 'For producers and broadcasters with archives') },
  ]
  return (
    <div className="mx-auto w-full max-w-[1200px] py-9 max-xl:px-8">
      <div className="grid grid-cols-[1fr_1.55fr_1fr] divide-x divide-line">
        <Link to={DATA_PATH} onClick={close} className="group block pr-10">
          <p className={head}>{d.gnb.label}</p>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
            <Database size={18} strokeWidth={1.9} />
          </span>
          <span className="mt-4 flex items-center gap-2">
            <span className="text-[20px] font-bold leading-tight text-hx">{d.gnb.label}</span>
            <span className="rounded-[4px] bg-accent px-[5px] py-px text-[12px] font-bold leading-[15px] text-white">{d.gnb.isNew}</span>
          </span>
          <span className="mt-1.5 block text-[14px] leading-[1.6] text-ink-sub">
            {t('방송에 나가지 않은 촬영 원본을 화자별 트랙과 멀티캠 그대로 제공해요', 'Unaired production footage with per-speaker tracks and multi-cam intact')}
          </span>
          <span className="mt-3 block text-[13px] text-ink-mute">{t('AI 학습 데이터 · 비독점 · 기간 한정', 'AI training data · non-exclusive · fixed term')}</span>
        </Link>

        <div className="px-10">
          <p className={head}>{t('컬렉션', 'Collections')}</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {d.collections.map((c) => {
              const Icon = COLLECTION_ICONS[c.slug] ?? Database
              return (
                <li key={c.slug}>
                  <Link to={collectionPath(c.slug)} onClick={close} className={item}>
                    <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                      <Icon size={16} strokeWidth={1.9} className="shrink-0 text-ink-mute transition-colors group-hover:text-primary-500" />
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="mt-0.5 block truncate pl-6 text-[13px] text-ink-sub">{c.desc}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="pl-10">
          <p className={head}>{t('샘플 · 문의', 'Samples · contact')}</p>
          <ul className="flex flex-col gap-1">
            {actions.map(({ icon: Icon, to, label, caption }) => (
              <li key={to}>
                <Link to={to} onClick={close} className={item}>
                  <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                    <Icon size={16} strokeWidth={1.9} className="shrink-0 text-ink-mute transition-colors group-hover:text-primary-500" />
                    {label}
                  </span>
                  <span className="mt-0.5 block truncate pl-6 text-[13px] text-ink-sub">{caption}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function CompanyMenu({ lang, close }) {
  return (
    <div className="w-[300px] p-2">
      {COMPANY.map((c) => (
        <Link
          key={c.to}
          to={c.to}
          onClick={close}
          className="block rounded-xl px-4 py-3 transition-colors hover:bg-ink/[0.04]"
        >
          <span className="block text-[15px] font-semibold text-ink">{lang === 'en' ? c.en : c.label}</span>
          <span className="block text-[13px] text-ink-sub">{lang === 'en' ? c.captionEn : c.caption}</span>
        </Link>
      ))}
    </div>
  )
}

function LangToggle({ className = '' }) {
  const { lang, setLang } = useLang()
  return (
    <div className={`flex items-center gap-1.5 text-[14px] ${className}`}>
      {['ko', 'en'].map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ink-sub/50">/</span>}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={lang === l ? 'font-semibold text-ink' : 'text-ink-sub hover:text-ink'}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}

// Desktop language picker — a globe icon with a small dropdown (flitto GNB).
function LangMenu({ open, trigger, close }) {
  const { lang, setLang, t } = useLang()
  return (
    <div className="relative" {...trigger}>
      <button
        type="button"
        aria-label={t('언어 선택', 'Language')}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist"
      >
        <Globe size={22} strokeWidth={1.6} />
      </button>
      {open && (
        <div className="absolute right-0 top-full pt-2">
          <div className="w-[140px] rounded-[14px] bg-white p-1.5 shadow-lift ring-1 ring-black/[0.05]">
            {[
              ['ko', '한국어'],
              ['en', 'English'],
            ].map(([l, label]) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLang(l)
                  close()
                }}
                aria-pressed={lang === l}
                className={`block w-full rounded-[10px] px-3 py-2 text-left text-[15px] transition-colors hover:bg-mist ${
                  lang === l ? 'font-semibold text-primary-500' : 'text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// One expandable group in the mobile drawer.
function MobileGroup({ label, open, onToggle, children }) {
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-[19px] font-semibold text-ink"
      >
        {label}
        <ChevronDown size={20} className={`text-ink-sub transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

function MobileSubhead({ children }) {
  return <p className="mb-1 mt-3 text-[12px] font-semibold text-ink-sub first:mt-0">{children}</p>
}

const mobileLink = 'block py-2 text-[16px] text-ink'

export default function Navbar() {
  const { pathname } = useLocation()
  const { lang, t } = useLang()
  const dataCopy = useDataCopy()
  const [menu, setMenu] = useState(null) // 'product' | 'blog' | 'company' | null
  const [drawer, setDrawer] = useState(false)
  const [group, setGroup] = useState(null)
  const timer = useRef(null)
  const bare = stripLangPrefix(pathname)

  // Debounced so crossing the gap between a trigger and its panel doesn't flicker.
  const openMenu = (key) => {
    clearTimeout(timer.current)
    setMenu(key)
  }
  const closeSoon = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMenu(null), 140)
  }
  const closeNow = () => {
    clearTimeout(timer.current)
    setMenu(null)
  }

  useEffect(() => {
    closeNow()
    setDrawer(false)
    setGroup(null)
  }, [pathname])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (closeNow(), setDrawer(false))
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Lock page scroll behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawer])

  const section =
    bare.startsWith('/data') || bare.startsWith('/request')
      ? 'data'
      : bare.startsWith('/product') || bare.startsWith('/heimlog')
      ? 'product'
      : bare.startsWith('/cases')
        ? 'cases'
        : bare.startsWith('/company')
          ? 'company'
          : null

  // Flat text items (Figma GNB / KO): 14px semibold; navy marks the open/current one.
  const itemCls = (key) =>
    `flex h-20 items-center gap-1.5 text-[14px] font-semibold tracking-[-0.03em] transition-colors ${
      menu === key || section === key ? 'text-hx' : 'text-ink-soft hover:text-ink'
    }`

  const trigger = (key) => ({
    onMouseEnter: () => openMenu(key),
    onMouseLeave: closeSoon,
    onFocus: () => openMenu(key),
  })

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-full max-w-[1168px] items-center gap-[54px] max-xl:gap-8 max-xl:px-8 max-lg:px-4">
          <Link to="/" onMouseEnter={closeNow} className="flex shrink-0 items-center gap-[6px]" aria-label="HEIMDEX">
            <img src="/assets/logo-symbol.svg" alt="" className="h-[28px] w-[26px]" />
            <img src="/assets/logo-wordmark.svg" alt="heimdex" className="h-[19px] w-[92px]" />
          </Link>

          <nav className="flex items-center gap-10 max-xl:gap-6 max-lg:hidden" aria-label={t('주요 메뉴', 'Main')}>
            <button
              type="button"
              aria-expanded={menu === 'product'}
              onClick={() => (menu === 'product' ? closeNow() : openMenu('product'))}
              className={itemCls('product')}
              {...trigger('product')}
            >
              {t('제품', 'Product')} <Caret open={menu === 'product'} />
            </button>
            <div className="relative" {...trigger('data')}>
              <Link to={DATA_PATH} aria-expanded={menu === 'data'} className={itemCls('data')}>
                {dataCopy.gnb.label}
                <span className="rounded-[4px] bg-accent px-[5px] py-px text-[12px] font-bold leading-[15px] text-white">{dataCopy.gnb.isNew}</span>
                <Caret open={menu === 'data'} />
              </Link>
            </div>
            <Link to="/cases" onMouseEnter={closeNow} className={itemCls('cases')}>
              {t('도입 사례', 'Customers')}
            </Link>
            <a
              href={blogUrl('business', lang)}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={closeNow}
              className={itemCls('blog')}
            >
              {t('블로그', 'Blog')}
            </a>
            {/* 회사 — hidden while SHOW_COMPANY_LINKS is false (data/flags.js) */}
            {SHOW_COMPANY_LINKS && (
              <div className="relative" {...trigger('company')}>
                <button
                  type="button"
                  aria-expanded={menu === 'company'}
                  onClick={() => (menu === 'company' ? closeNow() : openMenu('company'))}
                  className={itemCls('company')}
                >
                  {t('회사', 'Company')} <Caret open={menu === 'company'} />
                </button>
                {menu === 'company' && (
                  <div className="absolute -left-4 top-full">
                    <div className="rounded-[20px] bg-white shadow-lift ring-1 ring-black/[0.04]">
                      <CompanyMenu lang={lang} close={closeNow} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2 max-lg:hidden">
            <LangMenu open={menu === 'lang'} trigger={trigger('lang')} close={closeNow} />
            <Link
              to={REQUEST_PATH}
              onMouseEnter={closeNow}
              className="ml-2 inline-flex h-10 items-center rounded-[8px] border border-line-strong bg-white px-4 text-[14px] font-bold tracking-[-0.03em] text-ink transition-colors hover:bg-snow active:scale-[0.97]"
            >
              {dataCopy.gnb.sample}
            </Link>
            <Link
              to="/contact"
              onMouseEnter={closeNow}
              className="inline-flex h-10 items-center rounded-[8px] bg-hx px-4 text-[14px] font-bold tracking-[-0.03em] text-white transition-colors hover:bg-primary-600 active:scale-[0.97]"
            >
              {dataCopy.gnb.contact}
            </Link>
          </div>

          <button
            type="button"
            aria-label={drawer ? t('메뉴 닫기', 'Close menu') : t('메뉴 열기', 'Open menu')}
            aria-expanded={drawer}
            onClick={() => setDrawer((v) => !v)}
            className="ml-auto hidden h-10 w-10 items-center justify-center text-ink max-lg:flex"
          >
            {drawer ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Data marketplace mega-menu — same panel as 제품 */}
        {menu === 'data' && (
          <div
            className="absolute inset-x-0 top-full border-b border-black/[0.05] bg-white shadow-[0_24px_40px_-24px_rgba(0,27,55,0.12)] max-lg:hidden"
            onMouseEnter={() => openMenu('data')}
            onMouseLeave={closeSoon}
          >
            <DataMegaMenu t={t} close={closeNow} />
          </div>
        )}

        {/* Product mega-menu — full width under the header, desktop only */}
        {menu === 'product' && (
          <div
            className="absolute inset-x-0 top-full border-b border-black/[0.05] bg-white shadow-[0_24px_40px_-24px_rgba(0,27,55,0.12)] max-lg:hidden"
            onMouseEnter={() => openMenu('product')}
            onMouseLeave={closeSoon}
          >
            <ProductMenu lang={lang} t={t} close={closeNow} />
          </div>
        )}
      </header>

      {/* Dim the page while the mega-menu is open (wireframe "페이지 본문 — 딤 처리") */}
      <div
        aria-hidden
        onClick={closeNow}
        className={`fixed inset-0 top-20 z-40 bg-ink/30 transition-opacity duration-200 max-lg:hidden ${
          menu === 'product' || menu === 'data' ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 top-20 z-40 overflow-y-auto bg-white px-4 pb-10 lg:hidden">
          <MobileGroup
            label={t('제품', 'Product')}
            open={group === 'product'}
            onToggle={() => setGroup(group === 'product' ? null : 'product')}
          >
            <MobileSubhead>{t('비즈니스용 · HEIMDEX', 'For business · HEIMDEX')}</MobileSubhead>
            <Link to="/product/business" className={`${mobileLink} font-semibold`}>
              {t('제품 개요', 'Product overview')}
            </Link>
            <MobileSubhead>{t('산업별', 'By industry')}</MobileSubhead>
            {INDUSTRIES.map((ind) => (
              <Link key={ind.slug} to={industryPath(ind.slug)} className={mobileLink}>
                {lang === 'en' ? ind.nameEn : ind.name}
              </Link>
            ))}
            <MobileSubhead>{t('개인용 · 하임로그', 'For individuals · heimlog')}</MobileSubhead>
            {HEIMLOG_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={mobileLink}>
                {lang === 'en' ? l.en : l.label}
              </Link>
            ))}
          </MobileGroup>
          <MobileGroup
            label={
              <span className="flex items-center gap-2">
                {dataCopy.gnb.label}
                <span className="rounded-[4px] bg-accent px-[5px] py-px text-[12px] font-bold leading-[15px] text-white">{dataCopy.gnb.isNew}</span>
              </span>
            }
            open={group === 'data'}
            onToggle={() => setGroup(group === 'data' ? null : 'data')}
          >
            <Link to={DATA_PATH} className={`${mobileLink} font-semibold`}>
              {t('마켓플레이스 전체 보기', 'Marketplace overview')}
            </Link>
            {dataCopy.collections.map((c) => (
              <Link key={c.slug} to={collectionPath(c.slug)} className={mobileLink}>
                {c.name}
              </Link>
            ))}
          </MobileGroup>
          <Link to="/cases" className="block border-b border-line py-4 text-[19px] font-semibold text-ink">
            {t('도입 사례', 'Customers')}
          </Link>
          <MobileGroup
            label={t('블로그', 'Blog')}
            open={group === 'blog'}
            onToggle={() => setGroup(group === 'blog' ? null : 'blog')}
          >
            {BLOG.map((b) => (
              <a
                key={b.key}
                href={blogUrl(b.key, lang)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${mobileLink} flex items-center gap-1`}
              >
                {lang === 'en' ? b.en : b.label} <ArrowUpRight size={14} />
              </a>
            ))}
          </MobileGroup>
          {/* 회사 — hidden while SHOW_COMPANY_LINKS is false (data/flags.js) */}
          {SHOW_COMPANY_LINKS && (
            <MobileGroup
              label={t('회사', 'Company')}
              open={group === 'company'}
              onToggle={() => setGroup(group === 'company' ? null : 'company')}
            >
              {COMPANY.map((c) => (
                <Link key={c.to} to={c.to} className={mobileLink}>
                  {lang === 'en' ? c.en : c.label}
                </Link>
              ))}
            </MobileGroup>
          )}

          <LangToggle className="mt-6 text-[16px]" />
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Link to={REQUEST_PATH} className="hx-btn hx-line">
              {dataCopy.gnb.sample}
            </Link>
            <Link to="/contact" className="hx-btn hx-ink">
              {dataCopy.gnb.contact}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
