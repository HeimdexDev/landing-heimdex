import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, MessageSquareText } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'

/**
 * Floating scroll-to-top + 문의하기 widget (Figma 1540:46922).
 * Appears once the user has scrolled past one full viewport height.
 * Mounted globally so it shows on every page.
 */
export default function FloatingActions() {
  const { t } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY >= window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className={`fixed bottom-10 right-10 z-40 flex w-[52px] flex-col items-center gap-6 transition-all duration-300 max-lg:right-5 max-sm:right-4 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      {/* Scroll to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t('맨 위로', 'Back to top')}
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5"
      >
        <ArrowUp size={24} className="text-grayscale-800" />
      </button>

      {/* 문의하기 */}
      <div className="flex flex-col items-center gap-1">
        <Link
          to="/contact"
          aria-label={t('문의하기', 'Contact us')}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-navy-500 shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5"
        >
          <MessageSquareText size={24} className="text-white" />
        </Link>
        <span className="text-xs font-semibold tracking-[-0.3px] text-navy-500 max-lg:hidden">{t('문의하기', 'Contact')}</span>
      </div>
    </div>
  )
}
