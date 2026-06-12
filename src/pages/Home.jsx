import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUp,
  ArrowUpRight,
  Plus,
  CloudOff,
  Network,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import CtaBanner from '../components/CtaBanner.jsx'
import HeroAppMockup from '../components/HeroAppMockup.jsx'
import Reveal from '../components/Reveal.jsx'

const LOGOS = [
  { src: '/assets/logo-1.png', w: 144 },
  { src: '/assets/logo-yonsei.png', w: 144 },
  { src: '/assets/logo-chxxta.png', w: 200 },
  { src: '/assets/logo-kibo.png', w: 120 },
  { src: '/assets/logo-nvidia-inception.png', w: 139 },
]

const CARDS = [
  {
    img: '/assets/card-legal.jpg',
    pill: '수천 시간의 CCTV, 결정적 1초를 놓치고 계신가요?',
    title: '로펌 · 수사',
    caption:
      '증거 영상 전체를 돌려볼 필요 없습니다. 행동과 맥락 검색/요약으로 결정적 증거 장면을 즉시 식별합니다.',
    to: '/product?tab=legal',
  },
  {
    img: '/assets/card-creative.jpg',
    pill: '수 테라의 영상 소스, 어디에 뭐가 있는지 기억나시나요?',
    title: '마케터 · PD',
    caption:
      '"A멤버 웃는 장면" 한 줄이면 흩어진 저장소에서 소스 탐색부터 AI 쇼츠 제작까지 한 번에 끝납니다.',
    to: '/product?tab=creative',
  },
  {
    img: '/assets/card-research.jpg',
    pill: '수천 회 실험 영상, 아직 눈으로 하나씩 확인하시나요?',
    title: '데이터 · 연구',
    caption:
      '"충돌 직전 감속", "이상 동작" 등 맥락 검색으로 원하는 장면만 추출하고 분석 리포트를 자동 생성합니다.',
    to: '/product?tab=research',
  },
]

const TESTIMONIALS = [
  {
    initial: '강', color: '#a768ff', name: '이혼 전문 8년차 서OO 변호사',
    pre: '가정 법원 사건은 영상·녹취 보는 게 일도 일이지만 솔직히 정신적 고문이거든요. 하임덱스는 ',
    hl: '증거가 될 만한 걸 먼저 추리고 하이라이트',
    post: '해주니까, 다 안 봐도 제가 놓친 것까지 찾아내서 살 것 같습니다.',
  },
  {
    initial: '유', color: '#fcc922', name: '이혼 전문 8년차 서OO 변호사',
    pre: '보안 때문에 녹취록조차 속기사를 써야하고, 클라우드 AI도 못썼어요. 증거영상을 클라우드에 올려야되니까요. 하지만 하임덱스는 ',
    hl: '따로 업로드도 하지 않아도 되어 의뢰인 영상 유출 걱정 없이',
    post: ' 믿고 쓸 수 있어 좋습니다.',
  },
  {
    initial: '이', color: '#dc8e93', name: '라이브커머스 8년차 PD',
    pre: '퇴사자가 많다보니 인수인계가 쉽지 않아요. NAS, 하드, 클라우드까지 인수인계 없이 ',
    hl: '하임덱스로 소스 찾는 시간 아껴서',
    post: ' 컷 편집에만 집중할 수 있어 살 것 같습니다.',
  },
  {
    initial: '최', color: '#7c7d8b', name: '엔터테인먼트 7년차 PD',
    pre: '다인원 그룹은 콘텐츠 양부터 압도적입니다. ',
    hl: '멤버별로 구간을 잘라서 만들어줄 수 있어서',
    post: ' 팬들도, 멤버들도 만족하고 있어요.',
  },
  {
    initial: '박', color: '#68b2ff', name: '피지컬 AI 기업 7년차 책임',
    pre: '외부 AI는 보안상 꿈도 못 꿨는데, 하임덱스는 온프레미스 기반이라 우리 연구실 안에서 ',
    hl: '원본 유출 걱정 없이 안심',
    post: '하고 쓰고 있습니다.',
  },
  {
    initial: '김', color: '#66c28d', name: '피지컬 AI 기업 7년차 책임',
    pre: '로그는 깨끗한데 실제 구동이 튀면 원인 찾느라 머리 터지거든요. ',
    hl: '하임덱스는 특정 동작 맥락만 치면 로그랑 일치하는 구간을 바로 하이라이트',
    post: '해주니까, 제가 놓친 미세 오류까지 다 보여서 살 것 같습니다.',
  },
]

const FEATURES = [
  { title: '업로드 없이', icon: CloudOff, desc: ['대용량 영상도 서버에 올리는 시간 없이,', '원본이 있는 자리에서 바로 분석합니다.'] },
  { title: '구축 부담 없이', icon: Network, desc: ['사내 서버, NAS, 로컬 PC까지.', '기존 환경을 그대로 연동해 구축 부담이', '없습니다.'] },
  { title: '기다림 없이', icon: Clock, desc: ['영상을 다 보지 않아도 됩니다.', '텍스트로 검색해 필요한 구간만 클립으로 만드세요.'] },
  { title: '유출 걱정 없이', icon: ShieldCheck, desc: ['외부 전송 없이 폐쇄망 안에서 분석합니다.', '영상 데이터가 외부로 나가지 않습니다.'] },
]

// VESSL-style numbered accordion paired with a 3D icon that reflects the
// active item, sitting on a radial glow that fades out at the edges.
function FeatureShowcase() {
  const [open, setOpen] = useState(0)
  const [iconIndex, setIconIndex] = useState(0)
  const toggle = (i) => {
    if (open === i) setOpen(-1)
    else {
      setOpen(i)
      setIconIndex(i)
    }
  }
  const ActiveIcon = FEATURES[iconIndex].icon

  return (
    <div className="grid w-full max-w-page grid-cols-[460px_560px] items-center justify-center gap-[72px] max-lg:grid-cols-1 max-lg:gap-12 max-lg:justify-items-center">
      {/* Left — numbered accordion */}
      <div className="w-full border-t border-grayscale-100">
        {FEATURES.map((f, i) => {
          const active = open === i
          return (
            <button
              key={f.title}
              type="button"
              onClick={() => toggle(i)}
              className="group relative block w-full text-left"
            >
            <div className="flex items-center gap-6 py-6">
              <span className="font-product text-base tabular-nums text-grayscale-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3
                className={`text-2xl font-bold tracking-[-0.5px] transition-colors ${
                  active ? 'text-navy-500' : 'text-grayscale-800'
                }`}
              >
                {f.title}
              </h3>
              <span
                className={`ml-auto transition-colors ${
                  active ? 'text-navy-500' : 'text-grayscale-500 group-hover:text-navy-500'
                }`}
              >
                {/* plus rotates counter-clockwise into a close (×) */}
                <Plus
                  size={30}
                  strokeWidth={1}
                  className={`transition-transform duration-300 ease-out ${
                    active ? '-rotate-45' : 'rotate-0'
                  }`}
                />
              </span>
            </div>
            <div
              className={`grid transition-all duration-500 ease-out ${
                active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pl-[42px] font-noto text-lg leading-[1.5] tracking-[-0.45px] text-grayscale-500">
                  {f.desc.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            {/* base divider + animated accent line */}
            <span className="absolute bottom-0 left-0 right-0 h-px bg-grayscale-100" />
            <span
              className={`absolute bottom-0 left-0 right-0 h-px origin-left bg-navy-500 transition-transform duration-500 ease-out ${
                active ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
            </button>
          )
        })}
      </div>

      {/* Right — 3D icon on a radial glow; hidden once the layout stacks vertically */}
      <div className="relative flex h-[440px] items-center justify-center max-lg:hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(57,145,255,0.20)_0%,_rgba(57,145,255,0.06)_42%,_transparent_72%)]" />
        <div className="relative flex h-[240px] w-[240px] items-center justify-center rounded-full bg-gradient-to-b from-white to-[#e9f0fb] shadow-[0_34px_70px_-22px_rgba(35,76,119,0.45),inset_0_3px_6px_rgba(255,255,255,0.95),inset_0_-10px_18px_rgba(35,76,119,0.1)] ring-1 ring-white/70">
          <div key={iconIndex} className="icon-pop relative">
            {/* extruded shadow copy for depth */}
            <ActiveIcon
              size={104}
              strokeWidth={1.6}
              className="absolute left-0 top-0 translate-y-[6px] text-navy-500/30 blur-[3px]"
            />
            <ActiveIcon
              size={104}
              strokeWidth={1.6}
              className="relative text-navy-500 drop-shadow-[0_8px_10px_rgba(35,76,119,0.3)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Measures the frame width and scales the fixed 1440-wide HeroAppMockup so it
// always fits at any screen size (replacing the static scale-[0.7222]).
function FluidMockup({ children }) {
  const frameRef = useRef(null)
  const [scale, setScale] = useState(0.7222)

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / 1440)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={frameRef}
      className="relative h-[470px] overflow-hidden rounded-t-2xl bg-white shadow-[0_40px_100px_-30px_rgba(0,0,0,0.65),0_0_90px_-15px_rgba(57,145,255,0.6)] ring-1 ring-softblue-500/40 max-md:h-[320px] max-sm:h-[230px]"
      // clip-path enforces the rounded clip even while the child zoom transform
      // animates (overflow-hidden + border-radius alone breaks during transforms)
      style={{ transform: 'translateZ(0)', clipPath: 'inset(0 round 16px 16px 0 0)' }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      {/* ───────── Hero ───────── */}
      <section
        className="relative overflow-hidden"
        style={{
          // Predawn night sky in the navy palette: deepest navy up top (night),
          // a softblue dawn glow rising from the horizon, faint nebula up-left.
          background:
            'linear-gradient(180deg, #050d1c 0%, #081429 26%, #0c2245 52%, #123257 74%, #1c4577 100%)',
        }}
      >
        {/* Star field — sparse, fades out toward the dawn-lit horizon */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(1.5px 1.5px at 25px 35px, rgba(255,255,255,0.9), transparent),' +
              'radial-gradient(1px 1px at 90px 80px, rgba(200,220,255,0.7), transparent),' +
              'radial-gradient(1.2px 1.2px at 150px 140px, rgba(255,255,255,0.6), transparent),' +
              'radial-gradient(1px 1px at 60px 175px, rgba(180,205,255,0.6), transparent),' +
              'radial-gradient(1.4px 1.4px at 195px 55px, rgba(255,255,255,0.5), transparent)',
            backgroundSize: '230px 230px',
            maskImage:
              'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0) 62%)',
            WebkitMaskImage:
              'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0) 62%)',
          }}
        />
        <div className="relative mx-auto flex w-full max-w-page flex-col items-center px-[60px] max-lg:px-8 max-sm:px-5 pb-0 pt-[160px] max-lg:pt-[120px] max-sm:pt-[100px] text-center">
          {/* Centered copy */}
          <Reveal className="flex max-w-[760px] flex-col items-center gap-4">
            <h1 className="font-product text-[58px] max-md:text-[34px] max-sm:text-[28px] font-bold leading-[1.3] text-white">
              영상 속 원하는 장면,
              <br />
              검색 한 줄로
            </h1>
            <p className="font-noto text-lg leading-[1.5] tracking-[-0.45px] text-[#cdd9ec] max-sm:text-[15px]">
              업로드 없이, 시청 없이.
              <br />
              검색 한 줄로 필요한 장면을 찾고 숏폼까지 자동으로 만들어 드립니다.
            </p>
          </Reveal>

          {/* Centered actions */}
          <Reveal className="mt-10 flex justify-center gap-5 max-sm:flex-col max-sm:w-full" delay={120}>
            <a
              href="https://playground.heimdex.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-white px-6 py-5 max-sm:w-full max-sm:px-5 max-sm:py-4 text-base font-semibold text-navy-500 transition-colors hover:bg-grayscale-10"
            >
              웹에서 체험하기
              <ArrowUpRight size={20} strokeWidth={2} />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-white px-6 py-5 max-sm:w-full max-sm:px-5 max-sm:py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              한 달 무료신청
              <ArrowUpRight size={20} strokeWidth={2} />
            </Link>
          </Reveal>

          {/* Product screen — the real 동영상 검색 dashboard, scaled to fit and
              bottom-clipped so it reads as embedded in the hero. */}
          <div className="relative mt-[72px] max-sm:mt-12 w-full max-w-[1040px]">
            {/* Attention glow — brand-color halo that draws the eye to the screen */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-[46%] h-[118%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[48px] bg-softblue-500/30 blur-[130px] max-md:blur-[70px] animate-pulse [animation-duration:5s]" />
              <div className="absolute left-1/2 top-1/2 h-[85%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#68b2ff]/30 blur-[100px] max-md:blur-[60px]" />
              <div className="absolute -top-10 left-1/2 h-40 w-[55%] -translate-x-1/2 rounded-full bg-white/25 blur-[90px]" />
            </div>

            {/* Glassmorphism bezel — frosted glass that peeks out behind the screen */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-5 -top-5 bottom-0 rounded-t-[24px] bg-gradient-to-b from-white/20 to-white/[0.04] ring-1 ring-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md max-sm:-inset-x-3 max-sm:-top-3"
            />

            {/* Fluid JS-measured scale fits the 1440-wide app to the frame width */}
            <FluidMockup>
              <HeroAppMockup />
            </FluidMockup>
          </div>
        </div>
      </section>

      {/* ───────── Trusted-by logos ───────── */}
      <Reveal as="section" className="flex flex-col items-center gap-10 px-[60px] max-lg:px-8 max-sm:px-5 pt-[120px] pb-[120px] max-lg:pt-[100px] max-lg:pb-[100px] max-sm:pt-[72px] max-sm:pb-[72px]">
        <p className="font-product text-2xl font-medium tracking-[0.02em] text-grayscale-800">
          Trusted by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 max-sm:gap-x-3 max-sm:gap-y-6">
          {/* On phones each logo takes ~30% width → exactly 3 per row (3 + 2) */}
          {LOGOS.map((logo) => (
            <div
              key={logo.src}
              className="flex items-center justify-center max-sm:w-[30%]"
            >
              <img
                src={logo.src}
                alt=""
                style={{ width: logo.w }}
                className="h-[60px] object-contain max-sm:!h-[34px] max-sm:!w-full"
              />
            </div>
          ))}
        </div>
      </Reveal>

      {/* ───────── 직군별 고민 ───────── */}
      <Reveal as="section" className="flex flex-col items-center gap-[60px] max-lg:gap-12 px-[60px] max-lg:px-8 max-sm:px-5 py-[100px] max-lg:py-[80px] max-sm:py-[64px]">
        <h2 className="text-center text-[50px] max-md:text-[30px] max-sm:text-[24px] font-bold leading-[1.4] tracking-[-1.25px]">
          <span className="text-navy-500">직군마다 다른 영상 고민,</span>
          <br />
          <span className="text-neutral-800">하임덱스는 이렇게 해결합니다</span>
        </h2>

        {/* 3 photo cards */}
        <div className="flex gap-[30px] max-lg:flex-col max-lg:items-center max-lg:w-full">
          {CARDS.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group relative flex h-[470px] w-[413px] max-lg:w-full max-lg:max-w-[413px] flex-col items-end justify-between overflow-hidden rounded-[24px] p-5 transition-shadow duration-300 hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.4)]"
            >
              {/* Background photo */}
              <img
                src={card.img}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Bottom-up dark gradient */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 32.692%, rgba(0,0,0,0.4) 65.865%, rgba(0,0,0,0.8) 100%)',
                }}
              />

              {/* 자세히 보기 — top right */}
              <span className="relative z-10 inline-flex items-center gap-[2px] rounded-[20px] bg-black/20 px-[10px] py-[6px] text-sm font-medium leading-[1.4] tracking-[-0.35px] text-white transition-colors group-hover:bg-black/50">
                자세히 보기
                <ArrowUpRight size={20} strokeWidth={2} className="group-hover:hidden" />
                <ArrowUp size={20} strokeWidth={2} className="hidden group-hover:block" />
              </span>

              {/* Text block — bottom left */}
              <div className="relative z-10 flex w-full flex-col items-start gap-[10px] px-[10px] py-[20px]">
                <span className="flex h-[28px] items-center rounded-full border border-white/20 bg-white/20 px-[13px] py-[7px] text-[11.5px] font-semibold leading-[1.4] tracking-[-0.2875px] text-white">
                  {card.pill}
                </span>
                <div className="flex flex-col gap-[6px]">
                  <h3 className="font-product text-[32px] font-bold leading-[1.4] tracking-[-0.8px] text-white">
                    {card.title}
                  </h3>
                  <p className="w-full text-sm leading-[1.4] tracking-[-0.35px] text-[#f5f5f5]">
                    {card.caption}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Testimonials marquee — glassmorphism */}
        <div className="relative mt-4 w-screen overflow-hidden py-14">
          {/* soft gradient band — fades into the page bg top & bottom so there's no visible edge */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-grayscale-10 via-[#e6eefb] to-grayscale-10" />
          <div className="pointer-events-none absolute -top-24 left-[8%] h-96 w-[34rem] rounded-full bg-softblue-500/25 blur-[150px]" />
          <div className="pointer-events-none absolute -bottom-28 right-[10%] h-[28rem] w-[40rem] rounded-full bg-navy-500/20 blur-[170px]" />
          {/* edge fade for a clean marquee */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-grayscale-10 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-grayscale-10 to-transparent" />
          {/* top/bottom fade into the page bg so the section edges are invisible */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-grayscale-10 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-grayscale-10 to-transparent" />

          <div className="marquee-track relative flex w-max gap-6">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <article
                key={i}
                className="relative flex w-[460px] max-sm:w-[200px] shrink-0 flex-col gap-5 max-sm:gap-3 overflow-hidden rounded-[24px] max-sm:rounded-2xl border border-white/70 bg-white/50 p-9 max-sm:p-4 shadow-[0_18px_44px_-18px_rgba(35,76,119,0.32)] backdrop-blur-xl"
              >
                {/* top sheen */}
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="flex items-center gap-3 max-sm:gap-2">
                  <span
                    className="flex h-12 w-12 max-sm:h-8 max-sm:w-8 items-center justify-center rounded-full text-xl max-sm:text-sm font-semibold text-white ring-2 max-sm:ring-1 ring-white/60"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initial}
                  </span>
                  <p className="text-lg max-sm:text-xs font-bold tracking-[-0.5px] text-grayscale-800">
                    {t.name}
                  </p>
                </div>
                <p className="text-[15px] max-sm:text-[11px] font-semibold leading-[1.7] max-sm:leading-[1.5] tracking-[-0.4px] text-grayscale-800">
                  {t.pre}
                  <span className="font-bold text-navy-500">{t.hl}</span>
                  {t.post}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ───────── 영상을 옮기지 않고 ───────── */}
      <Reveal as="section" className="flex flex-col items-center gap-20 max-lg:gap-12 px-[60px] max-lg:px-8 max-sm:px-5 pb-[200px] pt-[100px] max-lg:pb-[100px] max-lg:pt-[80px] max-sm:pb-[72px] max-sm:pt-[64px]">
        <h2 className="text-center text-[50px] max-md:text-[30px] max-sm:text-[24px] font-bold leading-[1.4] tracking-[-1.25px]">
          <span className="text-navy-500">영상을 옮기지 않고,</span>
          <br />
          <span className="text-neutral-800">바로 분석합니다</span>
        </h2>
        <FeatureShowcase />
      </Reveal>

      {/* ───────── CTA ───────── */}
      <Reveal>
      <CtaBanner
        title="영상을 옮기지 않고, 가치를 꺼내보세요"
        subtitle={
          <>
            <span className="font-semibold text-navy-500">한 달 무료 체험</span>
            으로 부담 없이 먼저 확인해보세요.
          </>
        }
      />
      </Reveal>
    </div>
  )
}
