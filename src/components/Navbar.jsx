import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const NAV = [
  { label: '홈', to: '/' },
  { label: '제품', to: '/product' },
  { label: '블로그', href: 'https://blog.heimdex.co/', external: true },
  { label: '문의', to: '/contact' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Home hero is dark — the GNB sits transparent on top of it and turns
  // solid/white once the user scrolls past the hero. Other pages are always solid.
  const overHero = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  const symbol = overHero ? '/assets/logo-mark-white.svg' : '/assets/logo-symbol.svg'
  const wordmark = overHero ? '/assets/logo-wordmark-white.svg' : '/assets/logo-wordmark.svg'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex flex-col items-center backdrop-blur-[12px] transition-colors duration-300 ${
        overHero ? 'bg-transparent' : 'bg-white/80'
      }`}
    >
      <div className="flex h-20 w-full max-w-page items-center justify-between px-[60px] max-lg:px-5">
        {/* Logo */}
        <Link to="/" className="flex flex-1 items-center gap-[6px]">
          <img src={symbol} alt="" className="h-[28px] w-[26px]" />
          <img src={wordmark} alt="heimdex" className="h-[19px] w-[92px]" />
        </Link>

        {/* Center nav */}
        <nav className="flex items-center gap-3 max-lg:hidden">
          {NAV.map((item) => {
            const active = !item.external && isActive(item.to)
            const cls = `flex items-center justify-center px-[18px] py-3 text-[17px] leading-[1.4] tracking-[-0.4px] transition-colors ${
              overHero ? 'text-white' : 'text-grayscale-800'
            } ${
              active
                ? `font-semibold ${overHero ? 'border-b-2 border-white' : 'border-b-2 border-navy-500'}`
                : 'font-medium'
            }`
            return item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.label} to={item.to} className={cls}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right action */}
        <div className="flex flex-1 justify-end max-lg:hidden">
          <a
            href="https://playground.heimdex.co/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex h-10 items-center justify-center rounded-lg px-4 py-[10px] text-[15px] font-semibold transition-colors ${
              overHero
                ? 'text-[#e3edfb] hover:bg-white/10'
                : 'text-navy-500 hover:bg-navy-500/5'
            }`}
          >
            웹에서 체험하기
          </a>
        </div>

        {/* Hamburger (mobile/tablet only) */}
        <button
          type="button"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`relative hidden h-7 w-7 items-center justify-center max-lg:flex ${
            overHero ? 'text-white' : 'text-grayscale-800'
          }`}
        >
          <Menu
            className={`absolute h-7 w-7 transition-all duration-300 ease-out ${
              open ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            }`}
          />
          <X
            className={`absolute h-7 w-7 transition-all duration-300 ease-out ${
              open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            }`}
          />
        </button>
      </div>

      {/* Mobile menu panel — inherits the header bg/blur; colors follow overHero */}
      {open && (
        <div className="hidden w-full max-lg:block lg:hidden">
          <div
            className={`flex w-full flex-col px-5 pb-3 pt-1 ${
              overHero ? 'text-white' : 'text-grayscale-800'
            }`}
          >
            {NAV.map((item) => {
              const cls = `flex items-center py-3 text-[17px] font-medium leading-[1.4] tracking-[-0.4px] transition-colors ${
                overHero ? 'text-white' : 'text-grayscale-800'
              }`
              return item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cls}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className={cls}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
            {/* CTA — bottom-right text button, same style as the desktop header CTA */}
            <a
              href="https://playground.heimdex.co/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`mt-1 inline-flex items-center justify-center gap-1 self-end rounded-lg px-4 py-[10px] text-[15px] font-semibold transition-colors ${
                overHero ? 'text-[#e3edfb] hover:bg-white/10' : 'text-navy-500 hover:bg-navy-500/5'
              }`}
            >
              웹에서 체험하기
              <ArrowUpRight size={20} strokeWidth={2} />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
