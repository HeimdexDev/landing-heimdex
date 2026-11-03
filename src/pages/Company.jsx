import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, Copy, Download, Mail } from 'lucide-react'
import Link from '../i18n/Link.jsx'
import Reveal from '../components/Reveal.jsx'
import { IconAlert3d, IconLayers3d, IconNoCloud3d, IconSearch3d } from '../components/icons3d.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { FEATURES, HEIMLOG_APP, blogUrl } from '../data/industries.js'
import {
  CAPABILITIES,
  COMPANY_TABS,
  CONTACT,
  NEWS,
  NEWS_CATEGORIES,
  POSITIONS,
  VALUES,
} from '../data/company.js'

// /company/* — 소개 · 소식 · 브랜드 · 채용. Each page opens with the same
// left-aligned hero and a sticky tab bar (flitto-style), then its own sections.

const PILL =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-6 py-3 text-[16px] font-semibold transition-[background-color,transform] duration-200 active:scale-[0.97] max-sm:px-5 max-sm:text-[15px]'
const PILL_SOLID = `${PILL} bg-hx text-white hover:bg-primary-600`
const PILL_LINE = `${PILL} border border-ink text-ink hover:bg-ink/[0.04]`

const WRAP = 'mx-auto max-w-[1200px]'

function Shell({ tab, title, lead, hero, children }) {
  const { lang, t } = useLang()
  return (
    <div>
      {hero ?? (
      <section className="hx-section pb-14 pt-[160px] max-lg:pt-[128px] max-sm:pb-10 max-sm:pt-[108px]">
        <Reveal className={WRAP}>
          <p className="hx-eyebrow">{t('회사', 'Company')}</p>
          <h1 className="mt-3 max-w-[860px] text-[52px] font-bold leading-[1.25] tracking-[-0.035em] text-ink max-md:text-[40px] max-sm:text-[30px]">
            {title}
          </h1>
          {lead && <p className="mt-5 max-w-[680px] text-[18px] leading-[1.7] text-ink-sub max-sm:text-[16px]">{lead}</p>}
        </Reveal>
      </section>
      )}

      <nav
        aria-label={t('회사 메뉴', 'Company sections')}
        className="hx-section sticky top-20 z-30 border-b border-line bg-white/95 backdrop-blur-md"
      >
        <ul className={`${WRAP} flex gap-8 overflow-x-auto [scrollbar-width:none] max-sm:gap-6 [&::-webkit-scrollbar]:hidden`}>
          {COMPANY_TABS.map((tb) => {
            const on = tb.key === tab
            return (
              <li key={tb.key}>
                <Link
                  to={tb.to}
                  aria-current={on ? 'page' : undefined}
                  className={`relative block whitespace-nowrap py-4 text-[16px] transition-colors ${
                    on ? 'font-semibold text-ink' : 'font-medium text-ink-sub hover:text-ink'
                  }`}
                >
                  {lang === 'en' ? tb.en : tb.label}
                  {on && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-hx" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {children}
    </div>
  )
}

function Head({ eyebrow, title, lead, center = false, dark = false }) {
  return (
    <Reveal className={center ? 'text-center' : ''}>
      {eyebrow && <p className={`text-[15px] font-bold tracking-[-0.2px] ${dark ? 'text-primary-300' : 'text-primary-500'}`}>{eyebrow}</p>}
      <h2
        className={`mt-3 text-[36px] font-bold leading-[1.35] tracking-[-0.03em] max-md:text-[30px] max-sm:text-[25px] ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`mt-4 text-[17px] leading-[1.7] max-sm:text-[15px] ${dark ? 'text-white/65' : 'text-ink-sub'} ${center ? 'mx-auto max-w-[640px]' : 'max-w-[640px]'}`}>
          {lead}
        </p>
      )}
    </Reveal>
  )
}

// Navy statement banner carrying the slogan — used on 소개 and 브랜드.
function SloganBanner({ body }) {
  return (
    <section className="hx-section pt-14 max-sm:pt-10">
      <Reveal className={`${WRAP} relative overflow-hidden rounded-[24px] bg-hx px-14 py-16 text-white max-md:px-8 max-md:py-12 max-sm:px-6`}>
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-primary-500/50 blur-[110px]" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(90deg,transparent,#000_60%)]"
        />
        <div className="relative grid grid-cols-[1.1fr_1fr] items-end gap-12 max-lg:grid-cols-1 max-lg:gap-6">
          <p className="font-product text-[64px] font-bold leading-[1.05] tracking-[-0.02em] max-lg:text-[52px] max-sm:text-[38px]">
            Data Stays,
            <br />
            Insight Moves.
          </p>
          <p className="text-[17px] leading-[1.75] text-white/70 max-sm:text-[15px]">{body}</p>
        </div>
      </Reveal>
    </section>
  )
}

/* ─────────────────────────── 소개 ─────────────────────────── */
// Modelled on toss.im/company: big English slogan → "● label" + statement →
// rounded photo row → centred mission line over staggered product cards →
// numbered "how we work" rows → partners → oversized closing line.

const CAP_ICONS = { layers: IconLayers3d, search: IconSearch3d, nocloud: IconNoCloud3d, alert: IconAlert3d }

const PARTNER_LOGOS = [
  { src: '/assets/logo-antler.png', alt: 'Antler' },
  { src: '/assets/logo-nvidia.png', alt: 'NVIDIA Inception' },
  { src: '/assets/logo-yonsei.png', alt: 'Yonsei University' },
  { src: '/assets/logo-livenow.png', alt: 'LiveNow' },
  { src: '/assets/logo-chxxta.png', alt: 'CHXXTA' },
]

// Small "● Label" marker toss uses in front of every block.
function Dot({ children, dark = false }) {
  return (
    <p className={`flex items-center gap-2 self-start text-[13px] font-semibold ${dark ? 'text-white/60' : 'text-ink-sub'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-white/60' : 'bg-ink'}`} />
      {children}
    </p>
  )
}

const VALUE_EN_TITLES = ['Push the Limits', 'Privacy First', 'Amplify Creators', 'Explain Everything']

function AboutHero() {
  const { t } = useLang()
  return (
    <section className="hx-section relative overflow-hidden pb-24 pt-[200px] max-lg:pt-[150px] max-sm:pb-16 max-sm:pt-[120px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-56 h-[620px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(95,134,176,0.32),rgba(238,243,248,0.5)_55%,transparent)] blur-2xl"
      />
      <Reveal className={`${WRAP} relative`}>
        <h1 className="font-product text-[96px] font-bold leading-[1.02] tracking-[-0.035em] text-ink max-lg:text-[72px] max-md:text-[56px] max-sm:text-[42px]">
          Data Stays,
          <br />
          Insight Moves.
        </h1>
        <p className="mt-7 text-[26px] font-bold tracking-[-0.03em] text-ink max-sm:text-[19px]">
          {t('영상은 그 자리에, 인사이트만 움직이는 하임덱스', 'Heimdex — the video stays put, only the insight moves')}
        </p>
      </Reveal>
    </section>
  )
}

const PRODUCT_CARDS = [
  {
    key: 'heimdex',
    name: 'HEIMDEX',
    mark: '/assets/logo-mark-white.svg',
    img: '/assets/stage/stage-8.jpg',
    desc: '팀 · 기업 · 기관을 위한 온프레미스 AI 영상 검색',
    descEn: 'On-premise AI video search for teams and institutions',
    tall: true,
  },
  { key: 'scene-intelligence', img: '/assets/stage/stage-5.jpg' },
  { key: 'rights-monitor', img: '/assets/stage/stage-6.jpg', tall: true },
  { key: 'auto-recut', img: '/assets/creative/mkt-scene-3.jpg', tall: true },
  {
    key: 'heimlog',
    name: 'heimlog',
    mark: '/assets/heimlog-mark-white.svg',
    img: '/assets/vlog/clip-3.jpg',
    desc: '찍어둔 여행 · 일상 영상을 AI가 브이로그로 만들어 주는 서비스',
    descEn: 'AI turns your travel and everyday clips into a vlog',
    href: HEIMLOG_APP,
  },
  { key: 'research', img: '/assets/research/research-2.jpg', tall: true },
]

function ProductCard({ card }) {
  const { lang } = useLang()
  const en = lang === 'en'
  const f = FEATURES.find((x) => x.slug === card.key)
  const name = card.name ?? f?.name ?? 'AI Scene Intelligence'
  const desc = card.desc
    ? en
      ? card.descEn
      : card.desc
    : f
      ? en
        ? f.descEn
        : f.desc
      : en
        ? 'Computer vision, NLP and audio analysis that understand video at the level of meaning.'
        : '컴퓨터 비전 · 자연어 처리 · 오디오 분석으로 영상을 의미 수준에서 이해합니다.'
  const body = (
    <>
      <img src={card.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/75" />
      <div className="relative flex h-full flex-col items-center justify-between p-6 text-center text-white">
        <span />
        <span className="flex items-center gap-2 font-product text-[26px] font-bold tracking-[-0.02em] max-sm:text-[22px]">
          {card.mark && <img src={card.mark} alt="" className="h-[22px] w-[22px]" />}
          {name}
        </span>
        <span className="text-[13px] leading-[1.6] text-white/80">{desc}</span>
      </div>
    </>
  )
  const cls = `group relative block overflow-hidden rounded-[24px] bg-hx ${card.tall ? 'aspect-[3/3.7]' : 'aspect-[3/3.1]'}`
  if (card.href)
    return (
      <a href={card.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {body}
      </a>
    )
  return <div className={cls}>{body}</div>
}

export function CompanyAbout() {
  const { lang, t } = useLang()
  const en = lang === 'en'
  const cols = [PRODUCT_CARDS.slice(0, 2), PRODUCT_CARDS.slice(2, 4), PRODUCT_CARDS.slice(4)]
  return (
    <Shell tab="about" hero={<AboutHero />}>
      {/* Mission */}
      <section className="hx-section pt-20 max-sm:pt-14">
        <div className={WRAP}>
          <Reveal className="grid grid-cols-[1fr_1.45fr] gap-12 max-lg:grid-cols-1 max-lg:gap-5">
            <Dot>Mission</Dot>
            <div>
              <p className="text-[22px] font-bold leading-[1.5] tracking-[-0.03em] text-ink max-sm:text-[19px]">
                {t(
                  '영상을 수동적인 콘텐츠에서 검색 가능한 지식으로 바꿉니다',
                  'We turn video from passive content into searchable knowledge',
                )}
              </p>
              <div className="mt-4 flex flex-col gap-3 text-[16px] leading-[1.8] text-ink-sub max-sm:text-[15px]">
                <p>
                  {t(
                    '영상에는 대화, 얼굴, 사물, 장면, 감정 등 풍부한 정보가 담겨 있습니다. 하지만 대부분의 조직은 수천 시간의 영상 중 특정 순간을 찾는 데 어려움을 겪습니다.',
                    'Video is rich with conversations, faces, objects, scenes and emotion — yet most organizations struggle to find a single moment in thousands of hours of footage.',
                  )}
                </p>
                <p>
                  {t(
                    '하임덱스는 영상을 의미 수준에서 이해하는 AI로 모든 초를 검색 가능하게, 모든 장면을 재사용 가능하게 만듭니다. 원본은 그 자리에 둔 채로요.',
                    'Heimdex uses AI that understands video at the level of meaning to make every second searchable and every scene reusable — with the originals left where they are.',
                  )}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal className="mt-20 grid grid-cols-3 gap-4 max-sm:mt-12 max-sm:grid-cols-1">
            {['/assets/stage/stage-11.jpg', '/assets/creative/mkt-scene-7.jpg', '/assets/research/research-1.jpg'].map((src) => (
              <div key={src} className="aspect-[4/4.6] overflow-hidden rounded-[28px] bg-mist max-sm:aspect-[4/3]">
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Products — centred line over staggered cards */}
      <section className="hx-section py-[160px] max-sm:py-24">
        <div className={WRAP}>
          <Reveal className="flex flex-col items-center text-center">
            <Dot>Products</Dot>
            <h2 className="mt-6 text-[54px] font-bold leading-[1.3] tracking-[-0.035em] text-ink max-md:text-[40px] max-sm:text-[30px]">
              {t('쌓여만 있던 영상을', 'To put footage')}
              <br />
              {t('다시 일하게 만든다는', 'that just sits there')}
              <br />
              {t('단 하나의 목표를 위해', 'back to work')}
            </h2>
          </Reveal>
          <Reveal className="mt-20 grid grid-cols-3 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
            {cols.map((col, i) => (
              <div key={i} className={`flex flex-col gap-4 ${i === 1 ? 'md:mt-16' : ''}`}>
                {col.map((c) => (
                  <ProductCard key={c.key} card={c} />
                ))}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Technology */}
      <section className="hx-section border-t border-line py-[120px] max-sm:py-20">
        <div className={`${WRAP} grid grid-cols-[1fr_1.45fr] gap-12 max-lg:grid-cols-1 max-lg:gap-8`}>
          <Reveal>
            <Dot>Technology</Dot>
            <h2 className="mt-5 text-[34px] font-bold leading-[1.35] tracking-[-0.03em] text-ink max-sm:text-[26px]">AI Scene Intelligence</h2>
            <p className="mt-3 text-[16px] leading-[1.75] text-ink-sub">
              {t(
                '컴퓨터 비전, 자연어 처리, 오디오 분석을 결합해 영상 콘텐츠를 의미 수준에서 이해합니다.',
                'Computer vision, natural-language processing and audio analysis, combined to understand video at the level of meaning.',
              )}
            </p>
          </Reveal>
          <Reveal delay={100} className="grid grid-cols-2 gap-x-10 gap-y-12 max-sm:grid-cols-1">
            {CAPABILITIES.map((c) => {
              const Icon = CAP_ICONS[c.icon]
              return (
                <div key={c.title}>
                  <Icon size={44} />
                  <h3 className="mt-4 text-[19px] font-bold tracking-[-0.03em] text-ink">{en ? c.titleEn : c.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.7] text-ink-sub">{en ? c.descEn : c.desc}</p>
                </div>
              )
            })}
          </Reveal>
        </div>
      </section>

      {/* Culture — toss's numbered rows */}
      <section className="hx-section bg-fog py-[140px] max-sm:py-20">
        <div className={WRAP}>
          <Reveal>
            <h2 className="text-[34px] font-bold leading-[1.35] tracking-[-0.03em] text-ink max-sm:text-[26px]">
              {t('일하는 방식이 곧 우리의 기준', 'How we work is what we stand for')}
            </h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-[1fr_3fr] gap-12 max-lg:grid-cols-1 max-lg:gap-6">
            <Reveal>
              <Dot>Culture</Dot>
            </Reveal>
            <Reveal as="ol" className="border-t border-line">
              {VALUES.map((v, i) => (
                <li key={v.title} className="grid grid-cols-[48px_1fr_1.4fr] gap-6 border-b border-line py-9 max-md:grid-cols-[40px_1fr] max-md:gap-y-3">
                  <span className="pt-0.5 font-product text-[15px] font-bold text-ink-mute">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="font-product text-[15px] font-bold text-ink">{VALUE_EN_TITLES[i]}</p>
                    <p className="mt-1 text-[18px] font-bold tracking-[-0.03em] text-ink">{en ? v.titleEn : v.title}</p>
                  </div>
                  <p className="text-[15px] leading-[1.75] text-ink-sub max-md:col-start-2">{en ? v.descEn : v.desc}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="hx-section py-[120px] max-sm:py-20">
        <div className={`${WRAP} grid grid-cols-[1fr_3fr] gap-12 max-lg:grid-cols-1 max-lg:gap-6`}>
          <Reveal>
            <Dot>Partners</Dot>
          </Reveal>
          <Reveal>
            <p className="text-[22px] font-bold leading-[1.5] tracking-[-0.03em] text-ink max-sm:text-[19px]">
              {t('하임덱스와 함께하는 곳', 'Who we work with')}
            </p>
            <p className="mt-2 text-[16px] leading-[1.75] text-ink-sub">
              {t('하임덱스는 Antler의 투자를 받아 영상 인텔리전스 기술을 발전시키고 있습니다.', 'Heimdex is backed by Antler as it advances its video intelligence technology.')}
            </p>
            <div className="mt-10 grid grid-cols-5 items-center gap-6 max-md:grid-cols-3 max-sm:grid-cols-2">
              {PARTNER_LOGOS.map((l) => (
                <div key={l.src} className="flex h-14 items-center justify-start">
                  <img src={l.src} alt={l.alt} className="h-7 w-auto max-w-[85%] object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact + oversized closing line */}
      <section className="hx-section border-t border-line pb-16 pt-[100px] max-sm:pt-16">
        <div className={WRAP}>
          <Reveal className="grid grid-cols-[1fr_3fr] gap-12 max-lg:grid-cols-1 max-lg:gap-6">
            <Dot>Contact</Dot>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 text-[16px]">
                <dt className="text-ink-mute">{t('이메일', 'Email')}</dt>
                <dd>
                  <a href={`mailto:${CONTACT.email}`} className="font-semibold text-ink hover:text-primary-500">
                    {CONTACT.email}
                  </a>
                </dd>
                <dt className="text-ink-mute">{t('주소', 'Address')}</dt>
                <dd className="font-semibold text-ink">{en ? CONTACT.addressEn : CONTACT.address}</dd>
              </dl>
              <Link to="/contact" className={PILL_SOLID}>
                {t('도입 문의하기', 'Contact sales')} <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <p className="mt-24 font-product text-[clamp(44px,8.6vw,124px)] font-bold leading-[0.95] tracking-[-0.045em] text-ink max-sm:mt-16">
              Make every video
              <br />
              searchable.
            </p>
          </Reveal>
        </div>
      </section>
    </Shell>
  )
}

/* ─────────────────────────── 소식 ─────────────────────────── */

export function CompanyNews() {
  const { lang, t } = useLang()
  const en = lang === 'en'
  const [cat, setCat] = useState('all')
  const items = cat === 'all' ? NEWS : NEWS.filter((n) => n.cat === cat)
  const catName = (key) => {
    const c = NEWS_CATEGORIES.find((x) => x.key === key)
    return c ? (en ? c.en : c.label) : ''
  }
  const chip = (on) =>
    `rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
      on ? 'bg-hx text-white' : 'border border-line bg-white text-ink-sub hover:border-ink/30 hover:text-ink'
    }`

  return (
    <Shell
      tab="news"
      title={t('하임덱스의 새로운 소식', 'What’s new at Heimdex')}
      lead={t('투자 · 선정 · 수상 · 방송 소식을 전해 드려요.', 'Funding, selections, awards and media.')}
    >
      <section className="hx-section py-16 max-sm:py-12">
        <div className={WRAP}>
          <Reveal className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setCat('all')} className={chip(cat === 'all')}>
              {t('전체', 'All')}
            </button>
            {NEWS_CATEGORIES.map((c) => (
              <button key={c.key} type="button" onClick={() => setCat(c.key)} className={chip(cat === c.key)}>
                {en ? c.en : c.label}
              </button>
            ))}
          </Reveal>

          {items.length ? (
            <Reveal className="mt-10 grid grid-cols-2 gap-6 max-md:grid-cols-1">
              {items.map((n) => (
                <article key={n.title} className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-white">
                  <div className="flex aspect-[16/7] items-center justify-center bg-fog">
                    <img src={n.logo} alt="" className="h-12 w-auto max-w-[50%] object-contain" />
                  </div>
                  <div className="flex flex-1 flex-col p-7 max-sm:p-5">
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="rounded-full bg-primary-50 px-2.5 py-0.5 font-semibold text-primary-500">{catName(n.cat)}</span>
                      {n.date && <span className="text-ink-mute">{n.date}</span>}
                    </div>
                    <h2 className="mt-4 text-[22px] font-bold leading-[1.4] tracking-[-0.03em] text-ink">{en ? n.titleEn : n.title}</h2>
                    <p className="mt-2 text-[15px] leading-[1.7] text-ink-sub">{en ? n.descEn : n.desc}</p>
                  </div>
                </article>
              ))}
            </Reveal>
          ) : (
            <Reveal className="mt-10 rounded-[20px] bg-fog px-6 py-20 text-center">
              <p className="text-[18px] font-semibold text-ink">{t('아직 등록된 소식이 없어요', 'Nothing here yet')}</p>
              <p className="mt-2 text-[15px] text-ink-sub">{t('새 소식이 생기면 이곳에 가장 먼저 올릴게요.', 'New stories will show up here first.')}</p>
            </Reveal>
          )}
        </div>
      </section>

      <section className="hx-section pb-[120px] max-sm:pb-20">
        <Reveal className={`${WRAP} flex items-center gap-6 rounded-[20px] bg-hx px-10 py-9 max-md:flex-col max-md:items-start max-sm:px-6`}>
          <div className="flex-1">
            <p className="text-[21px] font-bold tracking-[-0.03em] text-white">{t('더 많은 이야기는 Company 블로그에서', 'More stories on the Company blog')}</p>
            <p className="mt-1.5 text-[15px] text-white/65">{t('소식 · 브랜드 노트 · 팀 문화', 'News · brand notes · team culture')}</p>
          </div>
          <a href={blogUrl('company', lang)} target="_blank" rel="noopener noreferrer" className={`${PILL} bg-white text-hx hover:bg-primary-50`}>
            {t('블로그 보기', 'Visit the blog')} <ArrowUpRight size={16} />
          </a>
        </Reveal>
      </section>
    </Shell>
  )
}

/* ─────────────────────────── 브랜드 ─────────────────────────── */

const COLORS = [
  { name: 'Main brand', ko: '메인 브랜드', hex: '#0A2240', text: 'white' },
  { name: 'Primary', ko: '프라이머리', hex: '#234D78', text: 'white' },
  { name: 'Primary 400', ko: '프라이머리 400', hex: '#5F86B0', text: 'white' },
  { name: 'Primary 50', ko: '프라이머리 50', hex: '#EEF3F8', text: 'ink' },
  { name: 'Ink', ko: '텍스트', hex: '#191F28', text: 'white' },
  { name: 'Mist', ko: '면 · 배경', hex: '#F2F4F6', text: 'ink' },
]

function Swatch({ c, big = false }) {
  const { lang, t } = useLang()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.hex)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard blocked — the hex is on screen anyway */
    }
  }
  const light = c.text === 'white'
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={t(`${c.hex} 복사`, `Copy ${c.hex}`)}
      className={`group flex flex-col justify-between rounded-[16px] p-5 text-left ring-1 ring-black/[0.05] transition-transform hover:-translate-y-0.5 ${
        big ? 'min-h-[220px]' : 'min-h-[150px]'
      } ${light ? 'text-white' : 'text-ink'}`}
      style={{ background: c.hex }}
    >
      <span className="text-[14px] font-semibold opacity-80">{lang === 'en' ? c.name : c.ko}</span>
      <span className="flex items-center justify-between">
        <span className="font-product text-[20px] font-bold tracking-[0.02em]">{c.hex}</span>
        <span className="opacity-0 transition-opacity group-hover:opacity-80">{copied ? <Check size={16} /> : <Copy size={16} />}</span>
      </span>
    </button>
  )
}

// `files`: the SVGs that make up what the tile shows, each downloadable.
function LogoTile({ dark = false, children, files, label }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-line">
      <div className={`flex aspect-[16/9] items-center justify-center ${dark ? 'bg-hx' : 'bg-white'}`}>{children}</div>
      <div className="flex items-center justify-between gap-3 border-t border-line bg-white px-5 py-3.5">
        <span className="text-[14px] font-semibold text-ink">{label}</span>
        <span className="flex gap-3">
          {files.map((f) => (
            <a
              key={f.href}
              href={f.href}
              download
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary-500 hover:text-primary-600"
            >
              <Download size={14} /> {f.label}
            </a>
          ))}
        </span>
      </div>
    </div>
  )
}

export function CompanyBrand() {
  const { lang, t } = useLang()
  const en = lang === 'en'
  return (
    <Shell
      tab="brand"
      title={t('하임덱스 브랜드', 'The Heimdex brand')}
      lead={t('로고 · 컬러 · 타이포그래피 등 하임덱스를 표현하는 기본 요소를 소개해요.', 'The basics that make Heimdex look like Heimdex — logo, color and type.')}
    >
      <SloganBanner
        body={t(
          '하임덱스의 슬로건은 제품이 일하는 방식 그대로입니다. 원본 영상은 원래 저장소에 그대로 두고, 검색과 인사이트만 움직입니다.',
          'Our slogan is simply how the product works: the original footage stays where it is, and only search and insight move.',
        )}
      />

      {/* 로고 */}
      <section className="hx-section py-[120px] max-sm:py-20">
        <div className={WRAP}>
          <Head
            eyebrow={t('로고', 'Logo')}
            title={t('심볼과 워드마크', 'Symbol and wordmark')}
            lead={t(
              '기본은 심볼과 워드마크를 함께 쓰는 조합형이에요. 어두운 배경에서는 화이트 버전을 사용해요.',
              'The default lockup pairs the symbol with the wordmark. Use the white version on dark backgrounds.',
            )}
          />
          <Reveal className="mt-12 grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
            <LogoTile
              label={t('조합형 · 기본', 'Lockup · default')}
              files={[
                { label: t('심볼', 'Symbol'), href: '/assets/logo-symbol.svg' },
                { label: t('워드마크', 'Wordmark'), href: '/assets/logo-wordmark.svg' },
              ]}
            >
              <span className="flex items-center gap-[9px]">
                <img src="/assets/logo-symbol.svg" alt="" className="h-[42px] w-[39px]" />
                <img src="/assets/logo-wordmark.svg" alt="heimdex" className="h-[28px] w-[136px]" />
              </span>
            </LogoTile>
            <LogoTile
              dark
              label={t('조합형 · 화이트', 'Lockup · white')}
              files={[
                { label: t('심볼', 'Symbol'), href: '/assets/logo-mark-white.svg' },
                { label: t('워드마크', 'Wordmark'), href: '/assets/logo-wordmark-white.svg' },
              ]}
            >
              <span className="flex items-center gap-[9px]">
                <img src="/assets/logo-mark-white.svg" alt="" className="h-[40px] w-[40px]" />
                <img src="/assets/logo-wordmark-white.svg" alt="heimdex" className="h-[28px] w-[136px]" />
              </span>
            </LogoTile>
            <LogoTile label={t('심볼', 'Symbol')} files={[{ label: 'SVG', href: '/assets/logo-symbol.svg' }]}>
              <img src="/assets/logo-symbol.svg" alt="" className="h-[64px] w-[59px]" />
            </LogoTile>
          </Reveal>
        </div>
      </section>

      {/* 컬러 */}
      <section className="hx-section bg-fog py-[120px] max-sm:py-20">
        <div className={WRAP}>
          <Head
            eyebrow={t('컬러', 'Color')}
            title={t('깊은 네이비 하나로', 'Built on one deep navy')}
            lead={t(
              '메인 브랜드 컬러 #0A2240과 프라이머리 #234D78을 중심으로, 밝은 단계는 배경과 태그에 써요. 칩을 누르면 색상 코드가 복사돼요.',
              'Main brand #0A2240 and primary #234D78 lead; lighter steps go on backgrounds and tags. Click a chip to copy its code.',
            )}
          />
          <Reveal className="mt-12 grid grid-cols-2 gap-5 max-sm:grid-cols-1">
            <Swatch c={COLORS[0]} big />
            <Swatch c={COLORS[1]} big />
          </Reveal>
          <Reveal className="mt-5 grid grid-cols-4 gap-5 max-md:grid-cols-2">
            {COLORS.slice(2).map((c) => (
              <Swatch key={c.hex} c={c} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* 타이포그래피 */}
      <section className="hx-section py-[120px] max-sm:py-20">
        <div className={WRAP}>
          <Head eyebrow={t('타이포그래피', 'Typography')} title={t('국문은 Pretendard, 영문 키워드는 Product Sans', 'Pretendard for text, Product Sans for English keys')} />
          <Reveal className="mt-12 grid grid-cols-2 gap-5 max-md:grid-cols-1">
            <div className="rounded-[20px] border border-line p-8 max-sm:p-6">
              <p className="text-[13px] font-semibold text-ink-mute">{t('본문 · 제목', 'Body · headings')}</p>
              <p className="mt-2 text-[28px] font-bold text-ink">Pretendard</p>
              <p className="mt-8 text-[44px] font-bold leading-[1.2] tracking-[-0.035em] text-ink max-sm:text-[34px]">
                {t('영상 속 원하는 장면', 'The scene you need')}
              </p>
              <p className="mt-4 text-[16px] leading-[1.7] text-ink-sub">
                {t('검색 한 줄로 필요한 장면을 찾고 숏폼까지 자동으로 만들어 드립니다.', 'One search finds the scene — and builds the short-form for you.')}
              </p>
              <div className="mt-8 flex gap-6 text-[14px] text-ink-sub">
                <span className="font-normal">Regular 400</span>
                <span className="font-semibold">SemiBold 600</span>
                <span className="font-bold">Bold 700</span>
              </div>
            </div>
            <div className="rounded-[20px] bg-hx p-8 text-white max-sm:p-6">
              <p className="text-[13px] font-semibold text-white/60">{t('슬로건 · 영문 브랜드명', 'Slogan · English brand names')}</p>
              <p className="mt-2 font-product text-[28px] font-bold">Product Sans</p>
              <p className="mt-8 font-product text-[44px] font-bold leading-[1.15] max-sm:text-[34px]">Data Stays, Insight Moves.</p>
              <p className="mt-4 font-product text-[18px] text-white/70">HEIMDEX · Scene Intelligence · Rights Monitor · Auto Recut</p>
              <div className="mt-8 flex gap-6 font-product text-[14px] text-white/70">
                <span className="font-normal">Regular 400</span>
                <span className="font-bold">Bold 700</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 하임로그 · 표기 원칙 */}
      <section className="hx-section bg-fog py-[120px] max-sm:py-20">
        <div className={`${WRAP} grid grid-cols-[1fr_1fr] gap-12 max-lg:grid-cols-1`}>
          <div>
            <Head
              eyebrow={t('서브 브랜드', 'Sub-brand')}
              title="HEIMLOG by HEIMDEX"
              lead={t(
                '개인 크리에이터용 제품 하임로그는 하임덱스의 서브 브랜드예요. 자체 코랄 컬러를 쓰고, 푸터와 회사 소개에는 "HEIMLOG by HEIMDEX"로 귀속을 표기해요.',
                'heimlog, our product for individual creators, is a Heimdex sub-brand. It has its own coral color and is credited as "HEIMLOG by HEIMDEX" in footers and company copy.',
              )}
            />
            <Reveal className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex aspect-[16/9] items-center justify-center rounded-[16px] bg-white ring-1 ring-black/[0.05]">
                <img src="/assets/heimlog-lockup-dark.svg" alt="heimlog" className="h-[30px] w-auto" />
              </div>
              <Swatch c={{ name: 'heimlog coral', ko: '하임로그 코랄', hex: '#FF7A66', text: 'ink' }} />
            </Reveal>
          </div>
          <Reveal delay={100} className="rounded-[20px] bg-white p-8 max-sm:p-6">
            <p className="text-[17px] font-bold text-ink">{t('표기 원칙', 'Naming rules')}</p>
            <ul className="mt-5 flex flex-col gap-4 text-[15px] leading-[1.6]">
              {[
                [true, t('제품 하위는 "HEIMDEX / 하임로그"로 표기해요.', 'Products are written "HEIMDEX / heimlog".')],
                [true, t('비즈니스용 · 개인용으로 구분해요. "B2B · B2C"라는 말은 쓰지 않아요.', 'Say "for business / for individuals", not "B2B / B2C".')],
                [true, t('하임로그는 "HEIMLOG by HEIMDEX"로 귀속을 밝혀요.', 'Credit heimlog as "HEIMLOG by HEIMDEX".')],
                [false, t('heimlight · 하임라이트 · Heimdex Vlog AI · 하임덱스 브이로그 표기는 쓰지 않아요.', 'Don’t use heimlight, Heimdex Vlog AI or "Heimdex vlog".')],
              ].map(([ok, text]) => (
                <li key={text} className="flex gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                      ok ? 'bg-primary-50 text-primary-500' : 'bg-[#FFEEEE] text-[#F04452]'
                    }`}
                  >
                    {ok ? '✓' : '✕'}
                  </span>
                  <span className="text-ink-soft">{text}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </Shell>
  )
}

/* ─────────────────────────── 채용 ─────────────────────────── */

export function CompanyCareers() {
  const { lang, t } = useLang()
  const en = lang === 'en'
  return (
    <Shell
      tab="careers"
      title={t('영상을 다시 일하게 만들 크루를 찾아요', 'Join us in putting video back to work')}
      lead={t(
        '쌓여만 있던 영상을 검색하고, 지키고, 다시 만드는 일. 하임덱스와 함께 영상 인텔리전스의 표준을 만들어 갈 동료를 기다려요.',
        'Searching, protecting and remaking footage that just sits there. We’re looking for people to set the standard for video intelligence with us.',
      )}
    >
      {/* 우리가 만드는 것 */}
      <section className="hx-section py-[120px] max-sm:py-20">
        <div className={WRAP}>
          <Head eyebrow={t('우리가 만드는 것', 'What we build')} title={t('비즈니스와 크리에이터, 두 개의 제품', 'Two products — for business and for creators')} />
          <Reveal className="mt-12 grid grid-cols-2 gap-5 max-md:grid-cols-1">
            <div className="relative overflow-hidden rounded-[20px] bg-hx p-8 text-white max-sm:p-6">
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary-500/50 blur-[80px]" />
              <p className="relative text-[13px] font-semibold text-primary-300">{t('비즈니스용', 'For business')}</p>
              <p className="relative mt-1 font-product text-[28px] font-bold">HEIMDEX</p>
              <p className="relative mt-3 text-[15px] leading-[1.7] text-white/70">
                {t(
                  '원본을 옮기지 않고 영상 아카이브에서 장면을 찾고, 지키고, 다시 만드는 온프레미스 AI.',
                  'On-premise AI that finds, protects and remakes scenes in a video archive — without moving the originals.',
                )}
              </p>
              <div className="relative mt-6 flex flex-wrap gap-1.5">
                {FEATURES.map((f) => (
                  <span key={f.slug} className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-white/85">
                    {f.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[20px] bg-heimlog-cream p-8 max-sm:p-6">
              <p className="text-[13px] font-semibold text-heimlog-ink">{t('개인용', 'For individuals')}</p>
              <img src="/assets/heimlog-lockup-dark.svg" alt="heimlog" className="mt-2.5 h-[26px] w-auto" />
              <p className="mt-3 text-[15px] leading-[1.7] text-ink-sub">
                {t(
                  '찍어둔 여행 · 일상 영상을 AI가 골라 자막 · 블러까지 입혀 브이로그로 만들어 주는 서비스.',
                  'A service where AI picks your travel and everyday clips, adds captions and blur, and makes your vlog.',
                )}
              </p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {[t('AI 자동 편집', 'AI auto-edit'), t('AI 블러', 'AI blur'), t('AI 자막', 'AI captions')].map((c) => (
                  <span key={c} className="rounded-full bg-white px-3 py-1 text-[13px] font-medium text-heimlog-ink">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 일하는 방식 */}
      <section className="hx-section bg-fog py-[120px] max-sm:py-20">
        <div className={WRAP}>
          <Head eyebrow={t('일하는 방식', 'How we work')} title={t('우리가 지키는 네 가지', 'Four things we hold to')} />
          <Reveal className="mt-12 grid grid-cols-2 gap-5 max-sm:grid-cols-1">
            {VALUES.map((v, i) => (
              <div key={v.title} className="flex gap-5 rounded-[20px] bg-white p-7">
                <span className="font-product text-[22px] font-bold text-primary-400">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-[20px] font-bold tracking-[-0.03em] text-ink">{en ? v.titleEn : v.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.7] text-ink-sub">{en ? v.descEn : v.desc}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 채용 중인 포지션 */}
      <section className="hx-section py-[120px] max-sm:py-20">
        <div className={WRAP}>
          <Head eyebrow={t('채용 공고', 'Open roles')} title={t('함께할 포지션', 'Open positions')} />
          {POSITIONS.length ? (
            <Reveal className="mt-10 border-t border-ink">
              {POSITIONS.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-6 border-b border-line py-6 max-sm:flex-col max-sm:items-start max-sm:gap-2"
                >
                  <span className="w-[160px] shrink-0 text-[14px] font-semibold text-primary-500">{en ? p.teamEn : p.team}</span>
                  <span className="flex-1 text-[19px] font-semibold text-ink group-hover:text-primary-500">{en ? p.titleEn : p.title}</span>
                  <span className="text-[14px] text-ink-mute">{en ? p.typeEn : p.type}</span>
                  <ArrowUpRight size={18} className="text-ink-mute group-hover:text-primary-500 max-sm:hidden" />
                </a>
              ))}
            </Reveal>
          ) : (
            <Reveal className="mt-10 rounded-[20px] bg-fog px-6 py-16 text-center">
              <p className="text-[18px] font-semibold text-ink">{t('지금은 열려 있는 공고가 없어요', 'No open roles right now')}</p>
              <p className="mt-2 text-[15px] leading-[1.7] text-ink-sub">
                {t('새 공고가 열리면 이곳에 안내해 드릴게요. 궁금한 점은 아래 메일로 문의해 주세요.', 'New roles will be posted here. Questions? Reach us by email.')}
              </p>
              <a href={`mailto:${CONTACT.email}`} className={`${PILL_LINE} mt-6 bg-white`}>
                <Mail size={16} /> {CONTACT.email}
              </a>
            </Reveal>
          )}
        </div>
      </section>
    </Shell>
  )
}
