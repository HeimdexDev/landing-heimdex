import { Navigate, useParams } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Link from '../i18n/Link.jsx'
import Reveal from '../components/Reveal.jsx'
import { Chip, DarkCta, FeatureVisual, IndustryImage, Lines, SectionHead } from '../components/Sections.jsx'
import { useLang, localizePath } from '../i18n/LanguageContext.jsx'
import { INDUSTRIES, findIndustry, industryPath } from '../data/industries.js'
import { TESTIMONIALS } from '../data/testimonials.js'

// Industry detail page — one template for all five (homepage-wireframe 03-1~5).
// URL: /product/business/industry/:slug
export default function Industry() {
  const { slug } = useParams()
  const { lang, t } = useLang()
  const ind = findIndustry(slug)
  if (!ind) return <Navigate to={localizePath('/', lang)} replace />

  const en = lang === 'en'
  const name = en ? ind.nameEn : ind.name
  const quote = TESTIMONIALS[ind.slug]?.[0]

  return (
    <div>
      {/* Hero */}
      <section className="hx-section pb-24 pt-[120px] max-sm:pb-16 max-sm:pt-[104px]">
        <div className="mx-auto max-w-[1200px]">
          <nav aria-label={t('현재 위치', 'Breadcrumb')} className="flex flex-wrap items-center gap-1 text-[13px] text-ink-sub">
            {[
              [t('제품', 'Product'), '/product/business'],
              ['HEIMDEX', '/product/business'],
              [t('산업별', 'Industries'), '/#industries'],
            ].map(([label, to]) => (
              <span key={label} className="flex items-center gap-1">
                <Link to={to} className="hover:text-ink">
                  {label}
                </Link>
                <ChevronRight size={13} />
              </span>
            ))}
            <span className="text-ink">{name}</span>
          </nav>

          <div className="mt-10 grid grid-cols-[1fr_1.05fr] items-center gap-14 max-lg:grid-cols-1 max-lg:gap-10">
            <Reveal>
              <div className="flex items-center gap-2">
                <Chip className="text-ink">{ind.tag}</Chip>
                <span className="text-[15px] font-semibold text-ink-sub">{name}</span>
              </div>
              <h1 className="mt-6 text-[54px] font-bold leading-[1.25] tracking-[-1.6px] text-ink max-xl:text-[46px] max-md:text-[36px] max-sm:text-[30px]">
                <Lines lines={en ? ind.headlineEn : ind.headline} />
              </h1>
              <p className="mt-6 text-[14px] text-ink-sub">
                {t('무료 1달 PoC로 먼저 검토해 보세요', 'Try it first with a free 1-month PoC')}
              </p>
            </Reveal>
            <Reveal delay={120} className="relative">
              <div aria-hidden className="absolute -inset-6 rounded-[40px] bg-brand opacity-20 blur-3xl" />
              <div className="relative aspect-[584/440] overflow-hidden rounded-[22px] bg-[#E5E8EB] shadow-[0_30px_70px_-35px_rgba(15,27,51,0.45)]">
                <IndustryImage industry={ind} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Key features */}
      <section className="hx-section bg-white py-[120px] max-sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow={t('핵심 기능', 'Key features')}
            title={en ? `Heimdex, built for ${ind.nameEn}` : `${ind.name} 현장에 맞춘 하임덱스`}
          />
          <div className="mt-14 grid grid-cols-2 gap-6 max-md:grid-cols-1">
            {ind.features.map((f, n) => (
              <Reveal key={f.title} delay={(n % 2) * 80} className="flex flex-col rounded-[22px] bg-[#F2F4F6] p-8 max-sm:p-5">
                <div className="aspect-[524/240] overflow-hidden rounded-xl bg-[#EAE9E4]">
                  <FeatureVisual feature={f} />
                </div>
                <p className="mt-5 font-product text-[14px] font-bold tabular-nums text-primary-500">
                  {String(n + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-[24px] font-bold tracking-[-0.5px] text-ink max-sm:text-[21px]">
                  {en ? f.titleEn : f.title}
                </h3>
                <p className="mt-3 text-[16px] leading-[1.65] text-ink-sub">{en ? f.descEn : f.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial — hidden until the industry has a real quote */}
      {quote && (
        <section className="hx-section py-[90px] max-sm:py-16">
          <Reveal className="mx-auto max-w-[800px] text-center">
            <h2 className="hx-eyebrow">{en ? `${ind.nameEn} customer story` : `${ind.name} 고객 후기`}</h2>
            <figure className="mt-6 rounded-[22px] border border-line bg-white px-10 py-9 text-left max-sm:px-6 max-sm:py-7">
              <blockquote className="text-[21px] font-medium leading-[1.6] tracking-[-0.3px] text-ink max-sm:text-[18px]">
                “{en ? quote.quoteEn : quote.quote}”
              </blockquote>
              <figcaption className="mt-4 text-[15px] text-ink-sub">— {en ? quote.whoEn : quote.who}</figcaption>
            </figure>
          </Reveal>
        </section>
      )}

      {/* Other industries */}
      <section className={`hx-section py-16 ${quote ? 'bg-white' : ''}`}>
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-5">
          <h2 className="text-[15px] font-semibold text-ink-sub">{t('다른 산업도 둘러보세요', 'Explore other industries')}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {INDUSTRIES.filter((i) => i.slug !== ind.slug).map((i) => (
              <Link
                key={i.slug}
                to={industryPath(i.slug)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold text-ink transition-colors hover:border-primary-500 hover:text-primary-500"
              >
                {en ? i.nameEn : i.name} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DarkCta
        lines={en ? ind.closingEn : ind.closing}
        sub={t('무료 1달 PoC로 우리 영상 데이터에서 먼저 확인해 보세요.', 'See it on your own footage first with a free 1-month PoC.')}
      />
    </div>
  )
}
