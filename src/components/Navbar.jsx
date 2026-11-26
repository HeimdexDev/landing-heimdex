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
  PersonStanding,
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
  blogHomeUrl,
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
    captionEn: 'Vlog guides · editing tips · how to use Heimlog',
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
    <div className="mx-auto w-full max-w-content py-9 max-xl:px-8">
      <div className="grid grid-cols-[1fr_1.55fr_1fr] divide-x divide-line">
        {/* 비즈니스용 */}
        <div className="pr-10">
          <p className={head}>{t('비즈니스용', 'For business')}</p>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-hx">
            <img src="/assets/logo-mark-white.svg" alt="" className="h-[18px] w-[18px]" />
          </span>
          <p className="mt-4 font-product text-[20px] font-bold leading-tight text-hx">Heimdex</p>
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
          <span className="flex items-center gap-2">
            <img src="/assets/heimlog-lockup-dark.svg" alt="heimlog" width={96} height={22} className="h-[22px] w-auto" />
            <span className="inline-flex h-5 items-center rounded-full bg-heimlog px-2 pt-px text-[11px] font-semibold leading-none text-heimlog-on">{t('무료로 시작', 'Start free')}</span>
          </span>
          <span className="mt-1.5 block text-[14px] leading-[1.6] text-ink-sub">
            {t('찍어둔 여행 · 일상 영상을 AI가 브이로그로 자동 편집해요', 'AI edits your travel and daily clips into a vlog')}
          </span>
          <span className="mt-3 block text-[13px] text-ink-mute">{t('크리에이터 · 브이로거', 'Creators · vloggers')}</span>
          <span className="mt-5 inline-block text-[14px] font-semibold text-heimlog-ink">{t('바로가기', 'Open')}</span>
        </a>
      </div>
    </div>
  )
}

// 데이터 마켓플레이스 mega-menu — same three-column build, heading and line icons
// as the 제품 menu (ProductMenu): overview · collections · request.
const COLLECTION_ICONS = {
  'multi-speaker': Users,
  multicam: Video,
  'broadcast-pair': Clapperboard,
  presenter: ShoppingBag,
  motion: PersonStanding,
}

function DataMegaMenu({ t, close }) {
  const d = useDataCopy()
  const head = 'mb-5 text-[12px] font-semibold tracking-[0.02em] text-ink-mute'
  const item = 'group -mx-3 block rounded-xl px-3 py-2.5 transition-colors hover:bg-mist'
  const actions = [
    { icon: Send, to: REQUEST_PATH, label: d.gnb.sample, caption: t('5영업일 안에 샘플 구성안 회신', 'Proposed sample within 5 business days') },
    { icon: Search, to: `${REQUEST_PATH}?mode=1`, label: t('맞춤 데이터 요청', 'Request custom data'), caption: t('필요한 장면을 문장으로 요청', 'Describe the scene you need') },
    { icon: Handshake, to: '/contact', label: t('파트너 문의', 'Partner with us'), caption: t('아카이브를 보유한 제작사 · 방송사', 'For producers and broadcasters with archives') },
  ]
  return (
    <div className="mx-auto w-full max-w-content py-9 max-xl:px-8">
      <div className="grid grid-cols-[1fr_1.55fr_1fr] divide-x divide-line">
        <Link to={DATA_PATH} onClick={close} className="group block pr-10">
          <p className={head}>{d.gnb.label}</p>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
            <Database size={18} strokeWidth={1.9} />
          </span>
          <span className="mt-4 flex items-center gap-2">
            <span className="text-[20px] font-bold leading-tight text-hx">{d.gnb.label}</span>
            <span className="inline-flex h-[18px] items-center rounded-[4px] bg-accent px-[5px] text-[12px] font-bold leading-none text-white">{d.gnb.isNew}</span>
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
                    <span className="mt-0.5 block truncate pl-6 text-[13px] text-ink-sub">{c.carouselDesc}</span>
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
        className="flex min-h-[56px] w-full items-center justify-between py-2 text-left text-[17px] font-semibold text-ink"
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
  return <p className="mb-1 mt-3 text-[12px] font-semibold text-ink-mute first:mt-0">{children}</p>
}

// A product row in the mobile menu: brand name, with who it's for underneath.
function MobileProduct({ name, sub }) {
  return (
    <span className="flex flex-col">
      <span className="font-product text-[18px] font-bold leading-tight">{name}</span>
      <span className="mt-0.5 text-[12px] font-medium text-ink-mute">{sub}</span>
    </span>
  )
}

const mobileLink = 'block py-2 text-[15px] text-ink-soft'

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

  // Transparent over the top of the page; once scrolled, the bar detaches into
  // a floating frosted pill.
  const [scrolled, setScrolled] = useState(false)
  // Phones/tablets: the bar slides away while reading down and comes back on any
  // scroll up, so it never sits over a section's title and lead.
  const [tucked, setTucked] = useState(false)
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (Math.abs(y - lastY) > 6) {
        setTucked(y > lastY && y > 120)
        lastY = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  // Solid white while a panel hangs off the bar at the top of the page.
  const solid = !scrolled && (drawer || menu === 'product' || menu === 'data')

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
    `flex h-full items-center gap-1.5 text-[14px] font-semibold tracking-[-0.03em] transition-colors ${
      menu === key || section === key ? 'text-hx' : 'text-ink-soft hover:text-ink'
    }`

  // Mega-menu panel: at the top of the page a full-width sheet under the flat
  // bar; once the bar is a floating pill, a floating card of the same width
  // just under it (pt-2 keeps the hover path unbroken), so the two read as one.
  const panelWrapTop = 'absolute inset-x-0 top-full border-b border-black/[0.05] bg-white shadow-[0_24px_40px_-24px_rgba(0,27,55,0.12)] max-lg:hidden'
  const panelWrapScrolled = 'hx-menu-in absolute inset-x-0 top-full px-4 pt-2 max-lg:hidden'
  const panelCardScrolled = 'mx-auto max-w-[1216px] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_60px_-24px_rgba(10,34,64,0.28),0_2px_6px_rgba(10,34,64,0.04)]'
  const menuOpen = menu === 'product' || menu === 'data'

  const trigger = (key) => ({
    onMouseEnter: () => openMenu(key),
    onMouseLeave: closeSoon,
    onFocus: () => openMenu(key),
  })

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding,transform] duration-300 ${solid ? 'bg-white' : 'bg-transparent'} ${scrolled ? 'px-4 max-md:px-3' : ''} ${
          tucked && !drawer ? 'max-lg:-translate-y-[120%]' : ''
        }`}
      >
        <div
          className={`mx-auto flex w-full items-center gap-[54px] border transition-all duration-300 ease-out max-xl:gap-8 lg:grid lg:grid-cols-[1fr_auto_1fr] ${
            scrolled
              ? `mt-3 h-16 max-w-[1216px] rounded-full border-transparent ${menuOpen ? 'bg-white' : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.62)_0%,rgba(255,255,255,0.38)_100%)]'} px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_12px_40px_-12px_rgba(10,34,64,0.18),0_2px_6px_rgba(10,34,64,0.04)] backdrop-blur-[20px] backdrop-saturate-[1.8] max-lg:mt-2 max-lg:h-12 max-md:px-4`
              : 'mt-0 h-20 max-w-content rounded-none border-transparent max-xl:px-8 max-lg:h-14 max-md:px-5'
          }`}
        >
          <Link to="/" onMouseEnter={closeNow} className="flex shrink-0 items-center gap-[6px] justify-self-start" aria-label="Heimdex">
            <img src="/assets/logo-symbol.svg" alt="" className="h-[28px] w-[26px] max-lg:h-[23px] max-lg:w-[21px]" />
            <img src="/assets/logo-wordmark.svg" alt="Heimdex" className="h-[19px] w-[92px] max-lg:h-[16px] max-lg:w-[77px]" />
          </Link>

          {/* Wide screens: three-column grid (logo | menu | actions) so the menu
              sits on the bar's centre line whatever the side widths. */}
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
                <span className="inline-flex h-[18px] items-center rounded-[4px] bg-accent px-[5px] text-[12px] font-bold leading-none text-white">{dataCopy.gnb.isNew}</span>
                <Caret open={menu === 'data'} />
              </Link>
            </div>
            <Link to="/cases" onMouseEnter={closeNow} className={itemCls('cases')}>
              {t('도입 사례', 'Customers')}
            </Link>
            <a
              href={blogHomeUrl(lang)}
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

          <div className="ml-auto flex items-center gap-2 justify-self-end max-lg:hidden">
            <LangMenu open={menu === 'lang'} trigger={trigger('lang')} close={closeNow} />
            {/* CTAs only on the compact (scrolled) bar: at the top of the page
                they fold away to zero width, so the full bar stays quiet. The slot
                opens on a long ease-out; each button then drifts in from the right
                out of a slight blur, the second a beat after the first. Leaving is
                quicker and all at once. */}
            <div
              aria-hidden={!scrolled}
              className={`-my-3 -mr-3 flex items-center gap-2 overflow-hidden py-3 pr-3 transition-[max-width,visibility] ${
                scrolled
                  ? 'visible max-w-[280px] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
                  : 'invisible max-w-0 duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]'
              }`}
            >
            {[
              { to: REQUEST_PATH, label: dataCopy.gnb.sample, cls: 'ml-2 bg-white text-ink shadow-[0_1px_3px_rgba(10,34,64,0.08),0_4px_12px_-4px_rgba(10,34,64,0.12)] hover:bg-snow' },
              { to: '/contact', label: dataCopy.gnb.contact, cls: 'bg-hx text-white hover:bg-primary-600' },
            ].map((b, i) => (
              <Link
                key={b.to}
                to={b.to}
                onMouseEnter={closeNow}
                tabIndex={scrolled ? undefined : -1}
                style={{
                  // per property, so the stagger delays the entrance but never a hover
                  transition: scrolled
                    ? ['opacity', 'transform', 'filter'].map((p) => `${p} 600ms cubic-bezier(0.22,1,0.36,1) ${120 + i * 70}ms`).concat('background-color 150ms').join(', ')
                    : ['opacity', 'transform', 'filter'].map((p) => `${p} 200ms cubic-bezier(0.4,0,1,1)`).concat('background-color 150ms').join(', '),
                }}
                className={`inline-flex h-10 shrink-0 items-center rounded-full px-4 text-[14px] font-bold tracking-[-0.03em] active:scale-[0.97] ${b.cls} ${
                  scrolled ? 'translate-x-0 scale-100 opacity-100 blur-0' : 'translate-x-3 scale-[0.96] opacity-0 blur-[2px]'
                }`}
              >
                {b.label}
              </Link>
            ))}
            </div>
          </div>

          <button
            type="button"
            aria-label={drawer ? t('메뉴 닫기', 'Close menu') : t('메뉴 열기', 'Open menu')}
            aria-expanded={drawer}
            onClick={() => {
              setDrawer((v) => !v)
              setGroup(null)
            }}
            className="-mr-2 ml-auto hidden h-10 w-10 items-center justify-center text-ink max-lg:flex"
          >
            {drawer ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Data marketplace mega-menu — same panel as 제품 */}
        {menu === 'data' && (
          <div
            className={scrolled ? panelWrapScrolled : panelWrapTop}
            onMouseEnter={() => openMenu('data')}
            onMouseLeave={closeSoon}
          >
            <div className={scrolled ? panelCardScrolled : ''}>
              <DataMegaMenu t={t} close={closeNow} />
            </div>
          </div>
        )}

        {/* Product mega-menu — full width under the header, desktop only */}
        {menu === 'product' && (
          <div
            className={scrolled ? panelWrapScrolled : panelWrapTop}
            onMouseEnter={() => openMenu('product')}
            onMouseLeave={closeSoon}
          >
            <div className={scrolled ? panelCardScrolled : ''}>
              <ProductMenu lang={lang} t={t} close={closeNow} />
            </div>
          </div>
        )}
      </header>

      {/* Dim the page while the mega-menu is open (wireframe "페이지 본문 — 딤 처리") */}
      <div
        aria-hidden
        onClick={closeNow}
        className={`fixed inset-0 z-40 bg-ink/30 transition-opacity duration-200 max-lg:hidden ${scrolled ? 'top-0' : 'top-20'} ${
          menu === 'product' || menu === 'data' ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Mobile drawer — the two products are top-level rows of their own, and
          every group starts closed so the whole menu fits on one screen. */}
      {drawer && (
        <div className="fixed inset-0 top-14 z-40 overflow-y-auto bg-white px-5 pb-10 lg:hidden">
          <MobileGroup
            label={<MobileProduct name="Heimdex" sub={t('비즈니스용', 'For business')} />}
            open={group === 'heimdex'}
            onToggle={() => setGroup(group === 'heimdex' ? null : 'heimdex')}
          >
            <MobileSubhead>{t('산업별', 'By industry')}</MobileSubhead>
            <div className="ml-1 border-l border-line pl-4">
              {INDUSTRIES.map((ind) => (
                <Link key={ind.slug} to={industryPath(ind.slug)} className={mobileLink}>
                  {lang === 'en' ? ind.nameEn : ind.name}
                </Link>
              ))}
            </div>
          </MobileGroup>
          <MobileGroup
            label={<MobileProduct name="Heimlog" sub={t('개인 크리에이터용', 'For individual creators')} />}
            open={group === 'heimlog'}
            onToggle={() => setGroup(group === 'heimlog' ? null : 'heimlog')}
          >
            {/* Same as the desktop menu: heimlog is one way in, the app itself */}
            <a href={HEIMLOG_APP} target="_blank" rel="noopener noreferrer" className={`${mobileLink} flex items-center gap-1`}>
              {t('바로가기', 'Open')} <ArrowUpRight size={14} />
            </a>
          </MobileGroup>
          <MobileGroup
            label={
              <span className="flex items-center gap-2">
                {dataCopy.gnb.label}
                <span className="inline-flex h-[18px] items-center rounded-[4px] bg-accent px-[5px] text-[12px] font-bold leading-none text-white">{dataCopy.gnb.isNew}</span>
              </span>
            }
            open={group === 'data'}
            onToggle={() => setGroup(group === 'data' ? null : 'data')}
          >
            <Link to={DATA_PATH} className={mobileLink}>
              {t('마켓플레이스 전체 보기', 'Marketplace overview')}
            </Link>
            <div className="ml-1 border-l border-line pl-4">
              {dataCopy.collections.map((c) => (
                <Link key={c.slug} to={collectionPath(c.slug)} className={mobileLink}>
                  {c.name}
                </Link>
              ))}
            </div>
          </MobileGroup>
          <Link to="/cases" className="flex min-h-[56px] items-center border-b border-line text-[17px] font-semibold text-ink">
            {t('도입 사례', 'Customers')}
          </Link>
          <MobileGroup
            label={t('블로그', 'Blog')}
            open={group === 'blog'}
            onToggle={() => setGroup(group === 'blog' ? null : 'blog')}
          >
            <a
              href={blogHomeUrl(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${mobileLink} flex items-center gap-1`}
            >
              {t('블로그 홈', 'Blog home')} <ArrowUpRight size={14} />
            </a>
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

          <LangToggle className="mt-5 text-[15px]" />
          <div className="mt-5 grid grid-cols-2 gap-2">
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
