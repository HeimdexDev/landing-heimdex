import Link from '../i18n/Link.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { SHOW_COMPANY_LINKS } from '../data/flags.js'
import { HEIMLOG_APP, INDUSTRIES, blogUrl, industryPath } from '../data/industries.js'

// Official channels, shown as icons next to the email in the bottom row.
const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/heimdex/',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/heimdex.official/',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@heimdex',
    path: 'M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
]

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
          <div className="flex items-center gap-5">
            <a href="mailto:heimdex@heimdex.co" className="hover:text-ink">
              heimdex@heimdex.co
            </a>
            <ul className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-ink-sub transition-colors hover:bg-[#E5E8EB] hover:text-ink"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
