import Link from '../i18n/Link.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { SHOW_COMPANY_LINKS } from '../data/flags.js'
import { HEIMLOG_APP, INDUSTRIES, blogUrl, industryPath } from '../data/industries.js'

// Footer per homepage-wireframe 02. heimlog is a sub-brand, so the bottom row
// always carries "HEIMLOG by HEIMDEX" (wireframe 00 ①).
export default function Footer() {
  const { lang, t } = useLang()
  const en = lang === 'en'

  const columns = [
    {
      title: t('제품', 'Product'),
      links: [
        { label: 'Heimdex', to: '/' },
        { label: 'Heimlog', href: HEIMLOG_APP },
        { label: t('데이터 마켓플레이스', 'Data Marketplace'), to: '/data' },
      ],
    },
    {
      title: t('산업별', 'Industries'),
      links: INDUSTRIES.map((i) => ({ label: en ? i.nameEn : i.name, to: industryPath(i.slug) })),
    },
    {
      title: t('리소스', 'Resources'),
      links: [
        { label: t('도입 사례', 'Customer stories'), to: '/cases' },
        { label: t('Business 블로그', 'Business blog'), href: blogUrl('business', lang) },
        { label: t('Creators 블로그', 'Creators blog'), href: blogUrl('creators', lang) },
      ],
    },
    // 회사 column — hidden while SHOW_COMPANY_LINKS is false (data/flags.js).
    SHOW_COMPANY_LINKS && {
      title: t('회사', 'Company'),
      links: [
        { label: t('소개', 'About'), to: '/company/about' },
        { label: t('소식', 'News'), to: '/company/news' },
        { label: t('브랜드', 'Brand'), to: '/company/brand' },
        { label: t('채용', 'Careers'), to: '/company/careers' },
        { label: t('도입 문의', 'Contact sales'), to: '/contact' },
      ],
    },
  ]

  const linkCls = 'text-[15px] text-ink-mute transition-colors hover:text-ink'

  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto w-full max-w-page px-[120px] pb-8 pt-14 max-xl:px-[60px] max-lg:px-8 max-sm:px-4">
        <div className="flex justify-between gap-12 max-lg:flex-col">
          <div>
            <div className="flex items-center gap-[6px]">
              <img src="/assets/logo-symbol.svg" alt="" className="h-[28px] w-[26px]" />
              <img src="/assets/logo-wordmark.svg" alt="heimdex" className="h-[19px] w-[92px]" />
            </div>
            <p className="mt-4 font-product text-[16px] text-ink-sub">Data Stays, Insight Moves</p>
            <p className="mt-3 max-w-[340px] text-[14px] leading-[1.6] text-ink-sub">
              {t(
                '하임덱스(HEIMDEX)는 원본 영상을 외부로 옮기지 않고 검색 · 요약 · 재편집하는 온프레미스 AI 영상 검색 솔루션입니다.',
                'HEIMDEX is an on-premise AI video search solution that searches, summarizes and re-edits video without moving the source footage.',
              )}
            </p>
          </div>

          <div className={`grid ${SHOW_COMPANY_LINKS ? 'grid-cols-4' : 'grid-cols-3'} gap-x-16 gap-y-10 max-xl:gap-x-10 max-md:grid-cols-2`}>
            {columns.filter(Boolean).map((col) => (
              <div key={col.title}>
                <p className="mb-3 text-[15px] font-semibold text-ink">{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href ? (
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          to={l.to}
                          // Already on home? The route doesn't change, so scroll up ourselves.
                          onClick={l.to === '/' ? () => window.scrollTo({ top: 0, behavior: 'smooth' }) : undefined}
                          className={l.strong ? 'text-[15px] font-bold text-hx transition-colors hover:text-primary-600' : linkCls}
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-[#E5E8EB] pt-6 text-[14px] text-ink-sub max-md:flex-col max-md:items-start">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-medium">© 2026 Heimdex. All rights reserved.</span>
            <span aria-hidden>·</span>
            <Link to="/policy?tab=terms" className="hover:text-ink">
              {t('이용약관', 'Terms of Service')}
            </Link>
            <span aria-hidden>·</span>
            <Link to="/policy?tab=privacy" className="hover:text-ink">
              {t('개인정보처리방침', 'Privacy Policy')}
            </Link>
          </p>
          <a href="mailto:heimdex@heimdex.co" className="hover:text-ink">
            heimdex@heimdex.co
          </a>
        </div>
      </div>
    </footer>
  )
}
