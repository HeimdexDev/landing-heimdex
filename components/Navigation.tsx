'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Locale } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { extractPathWithoutLocale, getLocalizedPath, getBookingLink, switchLocale } from '@/lib/i18n'

interface NavigationProps {
  locale: Locale
}

const BLOG_EXTERNAL_URL = 'https://blog.heimdex.co'

type NavItem = { href: string; label: string; external?: boolean }

const navItems: Record<Locale, NavItem[]> = {
  ko: [
    { href: '/', label: '홈' },
    { href: '/product', label: '제품' },
    { href: '/company', label: '회사' },
    { href: BLOG_EXTERNAL_URL, label: '블로그', external: true },
    { href: '/contact', label: '문의' },
  ],
  en: [
    { href: '/', label: 'Home' },
    { href: '/product', label: 'Product' },
    { href: '/company', label: 'Company' },
    { href: BLOG_EXTERNAL_URL, label: 'Blog', external: true },
    { href: '/contact', label: 'Contact' },
  ],
}

export default function Navigation({ locale }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const pathWithoutLocale = extractPathWithoutLocale(pathname)
  const items = navItems[locale]
  const otherLocale = locale === 'ko' ? 'en' : 'ko'

  const handleLocaleSwitch = () => {
    router.push(switchLocale(pathname, otherLocale))
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="section-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={getLocalizedPath('/', locale)} className="flex items-center gap-2">
            <Image
              src="/images/logos/heimdex-logo.svg"
              alt="HEIMDEX"
              width={140}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => {
              const linkClass =
                'relative px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors'

              if (item.external) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                )
              }

              const fullPath = getLocalizedPath(item.href, locale)
              const isActive =
                item.href === '/'
                  ? pathWithoutLocale === '/'
                  : pathWithoutLocale.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={fullPath}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-blue rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right: Language toggle + CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLocaleSwitch}
              className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg transition-colors"
            >
              {locale === 'ko' ? 'EN' : '한국어'}
            </button>
            <a
              href="https://playground.heimdex.co"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm px-4 py-2"
            >
              {locale === 'ko' ? '체험하기' : 'Try It'}
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
