import Link from '../i18n/Link.jsx'
import { ArrowUpRight } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { NetworkGraph } from './Home.jsx'
import SpaceField from '../components/SpaceField.jsx'

// 404 — same dark-navy background as the home hero + reusing the constellation interaction
export default function NotFound() {
  const { lang, setLang, t } = useLang()
  return (
    <section
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-[60px] pb-[120px] pt-[120px] text-center max-lg:px-8 max-sm:px-5"
      style={{
        background:
          'linear-gradient(180deg, #02060f 0%, #050d1e 28%, #0a1f3c 52%, #07142b 78%, #03081a 100%)',
      }}
    >
      {/* Deep-space nebula glow — subtle blue light near the vanishing point for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(46,96,180,0.22) 0%, rgba(24,54,110,0.12) 38%, transparent 68%)',
        }}
      />
      {/* mask to fill the logo with solid white */}
      <style>{`
        .logo-mark {
          display: inline-block;
          -webkit-mask: url(/assets/logo-mark-white.svg) center / contain no-repeat;
          mask: url(/assets/logo-mark-white.svg) center / contain no-repeat;
        }
      `}</style>
      {/* Perspective star field — stars grow as they approach from the vanishing point */}
      <SpaceField />
      {/* Constellation — preserve existing style (subtle top/bottom, faint center) */}
      <NetworkGraph mask="linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.2) 58%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.85) 100%)" />

      {/* KOR/ENG toggle — placed alone in the top right since there is no header (same style as the header) */}
      <div className="absolute right-[60px] top-[34px] z-20 flex items-center gap-2.5 text-[14px] font-semibold text-white max-lg:right-8 max-sm:right-5 max-sm:top-[24px]">
        <button
          type="button"
          onClick={() => setLang('ko')}
          className={`transition-opacity ${lang === 'ko' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
        >
          KOR
        </button>
        <span className="text-white/30">|</span>
        <button
          type="button"
          onClick={() => setLang('en')}
          className={`transition-opacity ${lang === 'en' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
        >
          ENG
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-sm:gap-6">
        {/* 404 — the center 0 is replaced by the Heimdex logo; both digits and logo share the same nebula fill */}
        <span
          aria-label="404"
          className="inline-flex -translate-x-[14px] select-none items-center font-product text-[clamp(96px,17vw,220px)] font-bold leading-none tracking-[-0.04em] text-white max-sm:translate-x-0"
        >
          <span>4</span>
          <span
            role="img"
            aria-label="Heimdex"
            className="logo-mark ml-[0.1em] mr-[0.03em] bg-white"
            style={{ width: '0.56em', height: '0.6em' }}
          />
          <span>4</span>
        </span>

        {/* Guidance text — inline links to the playground and blog */}
        <p className="max-w-[600px] font-noto text-lg leading-[1.7] tracking-[-0.45px] text-[#cdd9ec] max-sm:text-[15px]">
          {t(
            <>
              요청하신 페이지를 찾을 수 없어요.
              <br />
              하임덱스{' '}
              <a
                href="https://playground.heimdex.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
              >
                플레이그라운드
              </a>
              에서 직접 체험하거나,
              <br />
              <a
                href="https://blog.heimdex.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
              >
                블로그
              </a>
              에서 최신 소식을 확인해보세요.
            </>,
            <>
              We couldn’t find that page.
              <br />
              Instead, try Heimdex on the{' '}
              <a
                href="https://playground.heimdex.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
              >
                Playground
              </a>
              ,
              <br />
              or catch up on the{' '}
              <a
                href="https://blog.heimdex.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
              >
                Blog
              </a>
              .
            </>,
          )}
        </p>

        {/* Contact button */}
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-white px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10 max-sm:px-5 max-sm:text-sm"
        >
          {t('문의하기', 'Contact us')}
          <ArrowUpRight size={20} strokeWidth={2} className="max-sm:h-4 max-sm:w-4" />
        </Link>
      </div>
    </section>
  )
}
