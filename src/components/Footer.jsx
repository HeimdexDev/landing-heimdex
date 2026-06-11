import { Link } from 'react-router-dom'

const LINKS = [
  { label: '개인정보 수집 동의', to: '/policy?tab=privacy' },
  { label: '이용약관', to: '/policy?tab=terms' },
  { label: '도입문의', to: '/contact' },
]

export default function Footer() {
  return (
    <footer className="flex justify-center">
      <div className="flex w-full max-w-page flex-col items-center gap-[120px] p-[60px]">
        <div className="flex w-full items-start justify-between">
          {/* Logo */}
          <div className="flex items-center gap-[7px]">
            <img src="/assets/logo-symbol.svg" alt="" className="h-[34px] w-[31px]" />
            <img src="/assets/logo-wordmark.svg" alt="heimdex" className="h-[23px] w-[112px]" />
          </div>

          {/* Links + email */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-[10px]">
              {LINKS.map((link, i) => (
                <div key={link.label} className="flex items-center gap-[10px]">
                  <Link
                    to={link.to}
                    className="text-base font-medium tracking-[-0.4px] text-grayscale-800 hover:text-navy-500"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
            <a
              href="mailto:heimdex@heimdex.co"
              className="text-sm font-medium tracking-[-0.35px] text-grayscale-500"
            >
              heimdex@heimdex.co
            </a>
          </div>
        </div>

        <p className="text-sm font-medium tracking-[-0.35px] text-grayscale-500">
          © 2026 Heimdex. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
