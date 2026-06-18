import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext.jsx'

const LINKS = [
  { label: '개인정보 수집 동의', en: 'Privacy Policy', to: '/policy?tab=privacy' },
  { label: '이용약관', en: 'Terms of Service', to: '/policy?tab=terms' },
  { label: '도입문의', en: 'Contact Sales', to: '/contact' },
]

export default function Footer() {
  const { lang } = useLang()
  return (
    <footer className="flex justify-center">
      <div className="flex w-full max-w-page flex-col items-center gap-[120px] p-[60px] max-lg:gap-20 max-lg:px-8 max-lg:py-12 max-sm:gap-14 max-sm:px-5 max-sm:py-10">
        {/* Keeps the desktop row layout at every size — only the logo/text sizes scale down */}
        <div className="flex w-full items-start justify-between">
          {/* Logo */}
          <div className="flex items-center gap-[7px] max-sm:gap-[5px]">
            <img
              src="/assets/logo-symbol.svg"
              alt=""
              className="h-[34px] w-[31px] max-sm:h-[24px] max-sm:w-[22px]"
            />
            <img
              src="/assets/logo-wordmark.svg"
              alt="heimdex"
              className="h-[23px] w-[112px] max-sm:h-[16px] max-sm:w-[78px]"
            />
          </div>

          {/* Links + email */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-[10px] max-sm:gap-2">
              {LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-base font-medium tracking-[-0.4px] text-grayscale-800 hover:text-navy-500 max-sm:text-[11px]"
                >
                  {lang === 'en' ? link.en : link.label}
                </Link>
              ))}
            </div>
            <a
              href="mailto:heimdex@heimdex.co"
              className="text-sm font-medium tracking-[-0.35px] text-grayscale-500 max-sm:text-[11px]"
            >
              heimdex@heimdex.co
            </a>
          </div>
        </div>

        <p className="text-sm font-medium tracking-[-0.35px] text-grayscale-500 max-sm:text-xs">
          © 2026 Heimdex. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
