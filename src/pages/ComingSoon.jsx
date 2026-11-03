import { useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Link from '../i18n/Link.jsx'
import { useLang, stripLangPrefix } from '../i18n/LanguageContext.jsx'
import { COMING_SOON } from '../seo/meta.js'

// Routes from the v1.2 IA (wireframe 00 ⑤) whose pages aren't designed yet.
// They resolve to a real page instead of the 404 so the new GNB never dead-ends.
export const COMING_SOON_PATHS = Object.keys(COMING_SOON)

export default function ComingSoon() {
  const { pathname } = useLocation()
  const { lang, t } = useLang()
  const [ko, en] = COMING_SOON[stripLangPrefix(pathname)] ?? ['', '']

  return (
    <section className="hx-section flex min-h-[70vh] items-center pb-24 pt-[140px]">
      <div className="mx-auto max-w-[720px] text-center">
        <p className="hx-eyebrow">{t('준비 중', 'Coming soon')}</p>
        <h1 className="mt-3 text-[44px] font-bold tracking-[-1.2px] text-ink max-sm:text-[30px]">{lang === 'en' ? en : ko}</h1>
        <p className="mt-4 text-[18px] text-ink-sub">
          {t('이 페이지는 곧 공개될 예정이에요.', 'This page is on its way.')}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/" className="hx-btn hx-line">
            {t('홈으로', 'Back to home')}
          </Link>
          <Link to="/contact" className="hx-btn hx-primary">
            {t('도입 문의하기', 'Contact sales')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
