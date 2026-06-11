import { Link } from 'react-router-dom'
import {
  ArrowUp,
  ArrowUpRight,
  Loader,
  MonitorSpeaker,
  ClockArrowDown,
  ShieldCheck,
} from 'lucide-react'
import CtaBanner from '../components/CtaBanner.jsx'
import HeroAppMockup from '../components/HeroAppMockup.jsx'

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
  { icon: Loader, title: '업로드 없이', desc: ['대용량 영상도 서버에 올리는 시간 없이,', '원본이 있는 자리에서 바로 분석합니다.'] },
  { icon: MonitorSpeaker, title: '구축 부담 없이', desc: ['사내 서버, NAS, 로컬 PC까지.', '기존 환경을 그대로 연동해 구축 부담이 없습니다.'] },
  { icon: ClockArrowDown, title: '기다림 없이', desc: ['영상을 다 보지 않아도 됩니다. 텍스트로 검색해', '필요한 구간만 클립으로 만드세요.'] },
  { icon: ShieldCheck, title: '유출 걱정 없이', desc: ['외부 전송 없이 폐쇄망 안에서 분석합니다.', '영상 데이터가 외부로 나가지 않습니다.'] },
]

export default function Home() {
  return (
    <div>
      {/* ───────── Hero ───────── */}
      <section
        className="relative overflow-hidden"
        style={{
          // Deep brand-color gradient — keeps the white header legible while
          // echoing the soft corner-glow composition of the reference hero.
          background:
            'radial-gradient(58% 50% at 18% 20%, rgba(57,145,255,0.40) 0%, rgba(57,145,255,0) 60%),' +
            'radial-gradient(55% 48% at 84% 16%, rgba(100,178,255,0.34) 0%, rgba(100,178,255,0) 55%),' +
            'radial-gradient(85% 60% at 50% 118%, rgba(57,145,255,0.30) 0%, rgba(57,145,255,0) 60%),' +
            'linear-gradient(180deg, #07203f 0%, #0b2a55 45%, #143a73 100%)',
        }}
      >
        <div className="relative mx-auto flex w-full max-w-page flex-col items-center px-[60px] pb-0 pt-[160px] text-center">
          {/* Centered copy */}
          <div className="flex max-w-[760px] flex-col items-center gap-4">
            <h1 className="font-product text-[58px] font-bold leading-[1.3] text-white">
              영상 속 원하는 장면,
              <br />
              검색 한 줄로
            </h1>
            <p className="font-noto text-lg leading-[1.5] tracking-[-0.45px] text-[#cdd9ec]">
              업로드 없이, 시청 없이.
              <br />
              검색 한 줄로 필요한 장면을 찾고 숏폼·리포트까지 자동으로 만들어 드립니다.
            </p>
          </div>

          {/* Centered actions */}
          <div className="mt-10 flex justify-center gap-5">
            <a
              href="https://playground.heimdex.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#e0e8f5] px-6 py-5 text-base font-semibold text-navy-500 transition-colors hover:bg-white"
            >
              웹에서 체험하기
              <ArrowUpRight size={20} strokeWidth={2} />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-white px-6 py-5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              한 달 무료신청
              <ArrowUpRight size={20} strokeWidth={2} />
            </Link>
          </div>

          {/* Product screen — the real 동영상 검색 dashboard, scaled to fit and
              bottom-clipped so it reads as embedded in the hero. */}
          <div className="relative mt-[72px] w-full max-w-[1040px]">
            {/* Attention glow — brand-color halo that draws the eye to the screen */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-[46%] h-[118%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[48px] bg-softblue-500/30 blur-[130px] animate-pulse [animation-duration:5s]" />
              <div className="absolute left-1/2 top-1/2 h-[85%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#68b2ff]/30 blur-[100px]" />
              <div className="absolute -top-10 left-1/2 h-40 w-[55%] -translate-x-1/2 rounded-full bg-white/25 blur-[90px]" />
            </div>

            {/* Translucent glass bezel — peeks out a touch behind the screen */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-5 -top-5 bottom-0 rounded-t-[24px] bg-white/[0.07] ring-1 ring-white/[0.06] backdrop-blur-[2px]"
            />

            <div
              className="relative h-[470px] overflow-hidden rounded-t-2xl bg-white shadow-[0_40px_100px_-30px_rgba(0,0,0,0.65),0_0_90px_-15px_rgba(57,145,255,0.6)] ring-1 ring-softblue-500/40"
              // own compositing layer so the rounded clip survives the child zoom transform
              style={{ transform: 'translateZ(0)' }}
            >
              {/* 1040 / 1440 ≈ 0.7222 — scale the 1440-wide app down to the frame */}
              <div className="origin-top-left scale-[0.7222]">
                <HeroAppMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Trusted-by logos ───────── */}
      <section className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 px-[60px] pt-[80px] pb-[100px]">
        {LOGOS.map((logo) => (
          <img
            key={logo.src}
            src={logo.src}
            alt=""
            style={{ width: logo.w }}
            className="h-[60px] object-contain"
          />
        ))}
      </section>

      {/* ───────── 직군별 고민 ───────── */}
      <section className="flex flex-col items-center gap-[60px] px-[60px] py-[100px]">
        <h2 className="text-center text-[50px] font-bold leading-[1.4] tracking-[-1.25px]">
          <span className="text-navy-500">직군마다 다른 영상 고민,</span>
          <br />
          <span className="text-neutral-800">하임덱스는 이렇게 해결합니다</span>
        </h2>

        {/* 3 photo cards */}
        <div className="flex gap-[30px]">
          {CARDS.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group relative flex h-[470px] w-[413px] flex-col items-end justify-between overflow-hidden rounded-[24px] p-5 transition-shadow duration-300 hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.4)]"
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
          <div className="pointer-events-none absolute -top-10 left-[16%] h-64 w-64 rounded-full bg-softblue-500/25 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-12 right-[18%] h-72 w-72 rounded-full bg-navy-500/20 blur-[120px]" />
          {/* edge fade for a clean marquee */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-grayscale-10 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-grayscale-10 to-transparent" />

          <div className="marquee-track relative flex w-max gap-6">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <article
                key={i}
                className="relative flex w-[460px] shrink-0 flex-col gap-5 overflow-hidden rounded-[24px] border border-white/70 bg-white/50 p-9 shadow-[0_18px_44px_-18px_rgba(35,76,119,0.32)] backdrop-blur-xl"
              >
                {/* top sheen */}
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-semibold text-white ring-2 ring-white/60"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initial}
                  </span>
                  <p className="text-lg font-bold tracking-[-0.5px] text-grayscale-800">
                    {t.name}
                  </p>
                </div>
                <p className="text-[15px] font-semibold leading-[1.7] tracking-[-0.4px] text-grayscale-800">
                  {t.pre}
                  <span className="font-bold text-navy-500">{t.hl}</span>
                  {t.post}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 영상을 옮기지 않고 ───────── */}
      <section className="flex flex-col items-center gap-20 px-[60px] pb-[200px] pt-[100px]">
        <h2 className="text-center text-[50px] font-bold leading-[1.4] tracking-[-1.25px]">
          <span className="text-navy-500">영상을 옮기지 않고, </span>
          <span className="text-neutral-800">바로 분석합니다</span>
        </h2>
        <div className="grid grid-cols-2 gap-[60px]">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="flex w-[409px] flex-col gap-5 rounded-[20px] bg-white p-[30px] shadow-card"
              >
                <Icon size={80} strokeWidth={1.5} className="text-navy-500" />
                <h3 className="text-[28px] font-bold leading-[1.4] tracking-[-0.7px] text-grayscale-800">
                  {f.title}
                </h3>
                <p className="font-noto text-lg leading-[1.4] tracking-[-0.45px] text-grayscale-800">
                  {f.desc.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <CtaBanner
        title="영상을 옮기지 않고, 가치를 꺼내보세요"
        subtitle={
          <>
            <span className="font-semibold text-navy-500">한 달 무료 체험</span>
            으로 부담 없이 먼저 확인해보세요.
          </>
        }
      />
    </div>
  )
}
