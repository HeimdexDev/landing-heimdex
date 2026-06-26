import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'

const NAV = [
  { key: 'home', label: '홈', en: 'Home', to: '/' },
  { key: 'product', label: '제품', en: 'Product', to: '/product' },
  { key: 'blog', label: '블로그', en: 'Blog', href: 'https://blog.heimdex.co/', external: true },
  { key: 'contact', label: '문의', en: 'Contact', to: '/contact' },
]

// Industry solutions shown in the "제품" mega-menu (label + caption).
const PRODUCT_MENU = [
  {
    label: '로펌·수사',
    en: 'Legal & Investigation',
    caption: '방대한 영상 증거에서 결정적 단서만',
    captionEn: 'The decisive clue from vast video evidence',
    to: '/product?tab=legal',
  },
  {
    label: '마케터·PD',
    en: 'Marketers & Producers',
    caption: '검색 한 줄로 바로 숏폼 제작까지',
    captionEn: 'From a single search to ready-made short-form',
    to: '/product?tab=creative',
  },
  {
    label: '데이터·연구',
    en: 'Data & Research',
    caption: '연구 인사이트를 더 빠르고, 정확하게',
    captionEn: 'Research insights, faster and more precise',
    to: '/product?tab=research',
  },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { lang, setLang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const [mobileProductOpen, setMobileProductOpen] = useState(false)
  const closeTimer = useRef(null)

  // The GNB sits transparent on top of full-bleed heroes (home + product) until
  // the user scrolls, then turns solid white. Home's hero is dark so its text
  // goes white (heroLook); the product hero is light so text stays dark.
  const atTop = !scrolled
  const onHeroBg =
    pathname === '/' || pathname.startsWith('/product') || pathname.startsWith('/contact')
  // Transparent over heroes, but go solid when the (light) product menu opens on a
  // non-home page so the header and the white dropdown read as one continuous surface.
  const transparent = atTop && onHeroBg && !(productOpen && pathname !== '/')
  const heroLook = atTop && pathname === '/'
  // Mobile full-screen menu uses each page's topmost hero color, independent of
  // scroll position: home = deep navy, other pages = the light hero top.
  const menuDark = pathname === '/'
  // While the menu is open the header row matches the menu's theme.
  const headerWhite = open ? menuDark : heroLook

  // Debounced open/close so moving the cursor across the small gap between the
  // "제품" trigger and the dropdown (which lives outside the header) doesn't flicker.
  const openMenu = () => {
    clearTimeout(closeTimer.current)
    setProductOpen(true)
  }
  const closeMenu = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setProductOpen(false), 120)
  }
  const closeNow = () => {
    clearTimeout(closeTimer.current)
    setProductOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus whenever the route changes.
  useEffect(() => {
    setOpen(false)
    setProductOpen(false)
    setMobileProductOpen(false)
  }, [pathname])

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  const symbol = headerWhite ? '/assets/logo-mark-white.svg' : '/assets/logo-symbol.svg'
  const wordmark = headerWhite ? '/assets/logo-wordmark-white.svg' : '/assets/logo-wordmark.svg'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex flex-col items-center backdrop-blur-[12px] transition-colors duration-300 ${
          open
            ? menuDark
              ? 'bg-[#02060f]'
              : 'bg-[#f4f8fe]'
            : transparent
              ? heroLook
                ? 'bg-[#02060f]/80'
                : 'bg-transparent'
              : 'bg-white/80'
        }`}
      >
        <div className="relative z-10 flex h-20 w-full max-w-page items-center justify-between px-[60px] max-lg:px-5">
          {/* Logo */}
          <Link
            to="/"
            className="flex flex-1 items-center gap-[6px]"
            onMouseEnter={closeNow}
          >
            <img src={symbol} alt="" className="h-[28px] w-[26px]" />
            <img src={wordmark} alt="heimdex" className="h-[19px] w-[92px]" />
          </Link>

          {/* Center nav */}
          <nav className="flex items-center gap-3 max-lg:hidden">
            {NAV.map((item) => {
              const active = !item.external && isActive(item.to)
              const cls = `flex items-center justify-center px-[18px] py-3 text-[17px] leading-[1.4] tracking-[-0.4px] transition-colors ${
                heroLook ? 'text-white' : 'text-grayscale-800'
              } ${
                active
                  ? `font-semibold ${heroLook ? 'border-b-2 border-white' : 'border-b-2 border-navy-500'}`
                  : 'font-medium'
              }`
              return item.external ? (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cls}
                  onMouseEnter={closeNow}
                >
                  {lang === 'en' ? item.en : item.label}
                </a>
              ) : (
                <Link
                  key={item.key}
                  to={item.to}
                  className={cls}
                  onMouseEnter={item.key === 'product' ? openMenu : closeNow}
                  onMouseLeave={item.key === 'product' ? closeMenu : undefined}
                >
                  {lang === 'en' ? item.en : item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right action */}
          <div className="flex flex-1 items-center justify-end gap-1 max-lg:hidden">
            <a
              href="https://playground.heimdex.co/"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={closeNow}
              className={`flex h-10 items-center justify-center rounded-lg px-4 py-[10px] text-[15px] font-semibold transition-colors ${
                heroLook
                  ? 'text-[#e3edfb] hover:bg-white/10'
                  : 'text-navy-500 hover:bg-navy-500/5'
              }`}
            >
              {t('웹에서 체험하기', 'Try on Web')}
            </a>
            {/* KOR / ENG language toggle */}
            <div
              onMouseEnter={closeNow}
              className={`flex items-center gap-2.5 pl-4 text-[14px] font-semibold ${
                heroLook ? 'text-white' : 'text-grayscale-800'
              }`}
            >
              <button
                type="button"
                onClick={() => setLang('ko')}
                className={`transition-opacity ${lang === 'ko' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
              >
                KOR
              </button>
              <span className={heroLook ? 'text-white/30' : 'text-grayscale-300'}>|</span>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`transition-opacity ${lang === 'en' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
              >
                ENG
              </button>
            </div>
          </div>

          {/* Hamburger (mobile/tablet only) */}
          <button
            type="button"
            aria-label={open ? t('메뉴 닫기', 'Close menu') : t('메뉴 열기', 'Open menu')}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`relative hidden h-7 w-7 items-center justify-center max-lg:flex ${
              headerWhite ? 'text-white' : 'text-grayscale-800'
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
      </header>

      {/* Mobile menu — full-screen drawer. Lives OUTSIDE the header so its
          fixed inset-0 is relative to the VIEWPORT; the header's backdrop-filter
          would otherwise contain it to the 80px header box. The header (z-50)
          stays above so the close (X) button remains tappable. */}
      {open && (
        <div
          className={`fixed inset-0 z-40 flex flex-col lg:hidden ${
            menuDark ? 'bg-[#02060f] text-white' : 'bg-[#f4f8fe] text-grayscale-800'
          }`}
        >
            <div className="flex h-full w-full flex-col px-5 pb-12 pt-24">
              <nav className="flex flex-col">
                {NAV.map((item) => {
                  const cls = `flex items-center py-4 text-[22px] font-semibold leading-[1.3] tracking-[-0.5px] ${
                    menuDark ? 'text-white' : 'text-grayscale-800'
                  }`
                  // "제품" expands into the three solution sub-items.
                  if (item.key === 'product') {
                    return (
                      <div key={item.key}>
                        <button
                          type="button"
                          onClick={() => setMobileProductOpen((v) => !v)}
                          className={`${cls} w-full justify-between`}
                        >
                          {lang === 'en' ? item.en : item.label}
                          <ChevronDown
                            size={24}
                            className={`transition-transform duration-300 ease-out ${
                              mobileProductOpen ? 'rotate-180' : ''
                            } ${menuDark ? 'text-white/70' : 'text-grayscale-500'}`}
                          />
                        </button>
                        <div
                          className={`grid transition-all duration-300 ease-out ${
                            mobileProductOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="overflow-hidden">
                            {PRODUCT_MENU.map((m) => (
                              <Link
                                key={m.label}
                                to={m.to}
                                onClick={() => setOpen(false)}
                                className={`flex items-center py-3 pl-4 text-[17px] font-medium tracking-[-0.4px] ${
                                  menuDark ? 'text-[#cdd9ec]' : 'text-grayscale-500'
                                }`}
                              >
                                {lang === 'en' ? m.en : m.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return item.external ? (
                    <a
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cls}
                      onClick={() => setOpen(false)}
                    >
                      {lang === 'en' ? item.en : item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.key}
                      to={item.to}
                      className={cls}
                      onClick={() => setOpen(false)}
                    >
                      {lang === 'en' ? item.en : item.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-auto flex items-center justify-between">
                {/* KOR / ENG language toggle */}
                <div
                  className={`flex items-center gap-2.5 text-[15px] font-semibold ${
                    menuDark ? 'text-white' : 'text-grayscale-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setLang('ko')}
                    className={lang === 'ko' ? 'opacity-100' : 'opacity-40'}
                  >
                    KOR
                  </button>
                  <span className={menuDark ? 'text-white/30' : 'text-grayscale-300'}>|</span>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={lang === 'en' ? 'opacity-100' : 'opacity-40'}
                  >
                    ENG
                  </button>
                </div>
                {/* CTA — same style as the desktop header CTA */}
                <a
                  href="https://playground.heimdex.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={`inline-flex items-center justify-center gap-1 rounded-lg px-4 py-[10px] text-[15px] font-semibold transition-colors ${
                    menuDark ? 'text-[#e3edfb] hover:bg-white/10' : 'text-navy-500 hover:bg-navy-500/5'
                  }`}
                >
                  {t('웹에서 체험하기', 'Try on Web')}
                  <ArrowUpRight size={20} strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        )}

      {/* Product mega-menu — sibling of the header (outside its backdrop-filter
          root) so its own blur frosts the page behind it. The dim sits BELOW the
          panel (not behind it) so the panel's backdrop matches the header exactly.
          Desktop only. */}
      <div
        className={`fixed inset-x-0 bottom-0 top-20 z-40 hidden flex-col lg:flex ${
          productOpen ? '' : 'pointer-events-none'
        }`}
      >
        {/* Panel */}
        <div
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
          className={`border-t transition-all duration-300 ${
            heroLook
              ? 'border-white/10 bg-[#02060f]/80 backdrop-blur-[12px]'
              : 'border-grayscale-100 bg-white/80 backdrop-blur-[12px]'
          } ${
            productOpen
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-3 opacity-0'
          }`}
        >
        <div className="mx-auto flex w-full max-w-page items-center gap-16 px-[60px] py-10">
          {/* Left — blurb */}
          <div className="w-[300px] shrink-0">
            <p className={`text-sm leading-[1.6] ${heroLook ? 'text-[#e6eefb]' : 'text-navy-500'}`}>
              {t(
                <>
                  하임덱스는 다양한 산업의 영상 가치를 극대화하는
                  <br />
                  솔루션을 보유하고 있습니다.
                </>,
                'Heimdex offers solutions that maximize the value of video across industries.',
              )}
            </p>
            <p className={`mt-3 text-sm leading-[1.6] ${heroLook ? 'text-[#e6eefb]' : 'text-navy-500'}`}>
              {t('각 산업별 사례를 통해 자세히 알아보세요.', 'Explore how it works for each industry.')}
            </p>
          </div>
          {/* Right — 3 industry cards */}
          <div className="grid flex-1 grid-cols-3 gap-3">
            {PRODUCT_MENU.map((m) => (
              <Link
                key={m.label}
                to={m.to}
                onClick={closeNow}
                className={`group rounded-lg p-5 transition-colors ${
                  heroLook ? 'hover:bg-white/[0.06]' : 'hover:bg-softblue-50/40'
                }`}
              >
                <p
                  className={`text-base font-semibold ${
                    heroLook ? 'text-white' : 'text-grayscale-800'
                  }`}
                >
                  {lang === 'en' ? m.en : m.label}
                </p>
                <p
                  className={`mt-2 text-[13px] leading-[1.5] ${
                    heroLook ? 'text-[#c7d6ec]' : 'text-grayscale-500'
                  }`}
                >
                  {lang === 'en' ? m.captionEn : m.caption}
                </p>
              </Link>
            ))}
          </div>
        </div>
        </div>

        {/* Click-catcher below the panel (no dim) — closes the menu on outside click */}
        <div
          aria-hidden
          onMouseEnter={closeNow}
          onClick={closeNow}
          className={`flex-1 ${productOpen ? '' : 'pointer-events-none'}`}
        />
      </div>
    </>
  )
}
