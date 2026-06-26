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
import { useLang } from '../i18n/LanguageContext.jsx'

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
    pillEn: 'Thousands of hours of CCTV — missing the decisive second?',
    title: '로펌 · 수사',
    titleEn: 'Legal & Investigation',
    caption:
      '증거 영상 전체를 돌려볼 필요 없습니다. 행동과 맥락 검색/요약으로 결정적 증거 장면을 즉시 식별합니다.',
    captionEn:
      'No need to review entire evidence videos. Search and summarize by action and context to instantly pinpoint the decisive scene.',
    to: '/product?tab=legal',
  },
  {
    img: '/assets/card-creative.jpg',
    pill: '수 테라의 영상 소스, 어디에 뭐가 있는지 기억나시나요?',
    pillEn: 'Terabytes of footage — do you remember where everything is?',
    title: '마케터 · PD',
    titleEn: 'Marketers & Producers',
    caption:
      '"A멤버 웃는 장면" 한 줄이면 흩어진 저장소에서 소스 탐색부터 AI 쇼츠 제작까지 한 번에 끝납니다.',
    captionEn:
      'One line like “Member A smiling” takes you from finding the source across scattered storage to AI-generated short-form — all at once.',
    to: '/product?tab=creative',
  },
  {
    img: '/assets/card-research.jpg',
    pill: '수천 회 실험 영상, 아직 눈으로 하나씩 확인하시나요?',
    pillEn: 'Thousands of experiment videos — still checking them one by one?',
    title: '데이터 · 연구',
    titleEn: 'Data & Research',
    caption:
      '"충돌 직전 감속", "이상 동작" 등 맥락 검색으로 원하는 장면만 추출하고 분석 리포트를 자동 생성합니다.',
    captionEn:
      'Context search like “deceleration before impact” or “anomalous motion” extracts only the scenes you want and auto-generates an analysis report.',
    to: '/product?tab=research',
  },
]

const TESTIMONIALS = [
  {
    initial: '강', color: '#a768ff', name: '이혼 전문 8년차 서OO 변호사',
    nameEn: 'Divorce Attorney · 8 yrs',
    pre: '가정 법원 사건은 영상·녹취 보는 게 일도 일이지만 솔직히 정신적 고문이거든요. 하임덱스는 ',
    hl: '증거가 될 만한 걸 먼저 추리고 하이라이트',
    post: '해주니까, 다 안 봐도 제가 놓친 것까지 찾아내서 살 것 같습니다.',
    preEn: 'Reviewing footage and recordings for family court cases is exhausting — honestly, mentally draining. Heimdex ',
    hlEn: 'surfaces and highlights what could become evidence first',
    postEn: ', so even without watching everything, it catches what I missed. A lifesaver.',
  },
  {
    initial: '유', color: '#fcc922', name: '이혼 전문 8년차 서OO 변호사',
    nameEn: 'Divorce Attorney · 8 yrs',
    pre: '보안 때문에 녹취록조차 속기사를 써야하고, 클라우드 AI도 못썼어요. 증거영상을 클라우드에 올려야되니까요. 하지만 하임덱스는 ',
    hl: '따로 업로드도 하지 않아도 되어 의뢰인 영상 유출 걱정 없이',
    post: ' 믿고 쓸 수 있어 좋습니다.',
    preEn: 'For security we even hired stenographers for transcripts and couldn’t use cloud AI, since it meant uploading evidence. But with Heimdex, ',
    hlEn: 'there are no uploads, so no worry about leaking a client’s footage',
    postEn: ' — I can rely on it with confidence.',
  },
  {
    initial: '이', color: '#dc8e93', name: '라이브커머스 8년차 PD',
    nameEn: 'Live Commerce Producer · 8 yrs',
    pre: '퇴사자가 많다보니 인수인계가 쉽지 않아요. NAS, 하드, 클라우드까지 인수인계 없이 ',
    hl: '하임덱스로 소스 찾는 시간 아껴서',
    post: ' 컷 편집에만 집중할 수 있어 살 것 같습니다.',
    preEn: 'With high turnover, handovers are tough. Across NAS, drives, and cloud — with no handover at all, ',
    hlEn: 'Heimdex saves so much time finding the right source',
    postEn: ' that I can focus purely on the edit. A lifesaver.',
  },
  {
    initial: '최', color: '#7c7d8b', name: '엔터테인먼트 7년차 PD',
    nameEn: 'Entertainment Producer · 7 yrs',
    pre: '다인원 그룹은 콘텐츠 양부터 압도적입니다. ',
    hl: '멤버별로 구간을 잘라서 만들어줄 수 있어서',
    post: ' 팬들도, 멤버들도 만족하고 있어요.',
    preEn: 'With large groups, the sheer volume of content is overwhelming. ',
    hlEn: 'It cuts and assembles clips per member',
    postEn: ', so both fans and the members are happy.',
  },
  {
    initial: '박', color: '#68b2ff', name: '피지컬 AI 기업 7년차 책임',
    nameEn: 'Physical AI Company · Lead, 7 yrs',
    pre: '외부 AI는 보안상 꿈도 못 꿨는데, 하임덱스는 온프레미스 기반이라 우리 연구실 안에서 ',
    hl: '원본 유출 걱정 없이 안심',
    post: '하고 쓰고 있습니다.',
    preEn: 'External AI was out of the question for security, but Heimdex runs on-premise, so inside our own lab we ',
    hlEn: 'use it with peace of mind — no leak worries',
    postEn: '.',
  },
  {
    initial: '김', color: '#66c28d', name: '피지컬 AI 기업 7년차 책임',
    nameEn: 'Physical AI Company · Lead, 7 yrs',
    pre: '로그는 깨끗한데 실제 구동이 튀면 원인 찾느라 머리 터지거든요. ',
    hl: '하임덱스는 특정 동작 맥락만 치면 로그랑 일치하는 구간을 바로 하이라이트',
    post: '해주니까, 제가 놓친 미세 오류까지 다 보여서 살 것 같습니다.',
    preEn: 'The logs look clean, but when a run misbehaves, finding the cause is a headache. ',
    hlEn: 'Type the context of a specific motion and Heimdex instantly highlights the segment matching the logs',
    postEn: ', revealing even the subtle errors I missed. A lifesaver.',
  },
]

const FEATURES = [
  {
    title: '업로드 없이',
    titleEn: 'No Uploads',
    icon: CloudOff,
    desc: ['대용량 영상도 서버에 올리는 시간 없이,', '원본이 있는 자리에서 바로 분석합니다.'],
    descEn: ['No waiting to upload large files —', 'analyze them right where they live.'],
  },
  {
    title: '구축 부담 없이',
    titleEn: 'No Setup Burden',
    icon: Network,
    desc: ['사내 서버, NAS, 로컬 PC까지.', '기존 환경을 그대로 연동해 구축 부담이', '없습니다.'],
    descEn: ['On-site servers, NAS, even local PCs.', 'Connect your existing environment as-is', '— no setup required.'],
  },
  {
    title: '기다림 없이',
    titleEn: 'No Waiting',
    icon: Clock,
    desc: ['영상을 다 보지 않아도 됩니다.', '텍스트로 검색해 필요한 구간만 클립으로 만드세요.'],
    descEn: ['No need to watch the whole video.', 'Search by text and clip only what you need.'],
  },
  {
    title: '유출 걱정 없이',
    titleEn: 'No Leak Worries',
    icon: ShieldCheck,
    desc: ['외부 전송 없이 폐쇄망 안에서 분석합니다.', '영상 데이터가 외부로 나가지 않습니다.'],
    descEn: ['Analysis runs inside your closed network.', 'Your video data never leaves the premises.'],
  },
]

// Numbered accordion paired with a 3D icon that reflects the active item.
// Desktop: the section is tall and sticky-pinned, so scrolling through it
// auto-advances the active feature; clicking a row jumps to it. Below lg the
// pin is dropped and it behaves as a plain click accordion.
function FeatureShowcase() {
  const { lang, t } = useLang()
  const [active, setActive] = useState(0)
  const wrapRef = useRef(null)
  // While a click-initiated smooth scroll is running, ignore the scroll handler
  // so it doesn't flicker the active item through every intermediate segment.
  const lockRef = useRef(false)
  const unlockTimer = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (lockRef.current) return
      const el = wrapRef.current
      if (!el || window.innerWidth < 1024) return
      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total)
      const idx = Math.min(
        FEATURES.length - 1,
        Math.floor((scrolled / total) * FEATURES.length),
      )
      setActive(idx)
    }
    const onScrollEnd = () => {
      lockRef.current = false
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScrollEnd)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('resize', onScroll)
      clearTimeout(unlockTimer.current)
    }
  }, [])

  // Click → set active, and on desktop scroll the page to that feature's segment
  // so the sticky scroll position stays in sync. The handler is locked until the
  // smooth scroll settles (scrollend, with a timeout fallback for Safari).
  const select = (i) => {
    setActive(i)
    const el = wrapRef.current
    if (!el || window.innerWidth < 1024) return
    const total = el.offsetHeight - window.innerHeight
    const absTop = window.scrollY + el.getBoundingClientRect().top
    lockRef.current = true
    clearTimeout(unlockTimer.current)
    unlockTimer.current = setTimeout(() => {
      lockRef.current = false
    }, 800)
    window.scrollTo({
      top: absTop + (total * (i + 0.5)) / FEATURES.length,
      behavior: 'smooth',
    })
  }

  const ActiveIcon = FEATURES[active].icon

  return (
    <div ref={wrapRef} className="w-full lg:h-[260vh]">
      <div className="flex flex-col items-center gap-20 max-lg:gap-12 lg:sticky lg:top-0 lg:h-screen lg:justify-center">
        <h2 className="text-center text-[50px] max-md:text-[30px] max-sm:text-[24px] font-bold leading-[1.4] tracking-[-1.25px]">
          <span className="text-navy-500">{t('영상을 옮기지 않고,', 'No moving your video —')}</span>
          <br />
          <span className="text-neutral-800">{t('바로 분석합니다', 'analyze it in place')}</span>
        </h2>

        <div className="grid w-full max-w-page grid-cols-[460px_560px] items-center justify-center gap-[72px] max-lg:grid-cols-1 max-lg:gap-12 max-lg:justify-items-center">
          {/* Left — numbered accordion */}
          <div className="w-full border-t border-grayscale-100">
            {FEATURES.map((f, i) => {
              const isActive = active === i
              return (
                <button
                  key={f.title}
                  type="button"
                  onClick={() => select(i)}
                  className="group relative block w-full text-left"
                >
                  <div className="flex items-center gap-6 py-6">
                    <span className="font-product text-base tabular-nums text-grayscale-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={`text-2xl font-bold tracking-[-0.5px] transition-colors ${
                        isActive ? 'text-navy-500' : 'text-grayscale-800'
                      }`}
                    >
                      {lang === 'en' ? f.titleEn : f.title}
                    </h3>
                    <span
                      className={`ml-auto transition-colors ${
                        isActive ? 'text-navy-500' : 'text-grayscale-500 group-hover:text-navy-500'
                      }`}
                    >
                      <Plus
                        size={30}
                        strokeWidth={1}
                        className={`transition-transform duration-300 ease-out ${
                          isActive ? '-rotate-45' : 'rotate-0'
                        }`}
                      />
                    </span>
                  </div>
                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pl-[42px] font-noto text-lg leading-[1.5] tracking-[-0.45px] text-grayscale-500">
                        {(lang === 'en' ? f.descEn : f.desc).map((line) => (
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
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          {/* Right — Heimdex-navy blueprint card (dashed frame + thin white line
              icon); reflects the active feature. Hidden when stacked. */}
          <div className="relative flex h-[440px] items-center justify-center max-lg:hidden">
            <div className="flex h-[400px] w-[540px] items-center justify-center border border-grayscale-200 px-[44px]">
              <div className="flex h-[260px] w-full items-center justify-center border border-dashed border-navy-500/35">
                <div key={active} className="icon-pop">
                  <ActiveIcon size={104} strokeWidth={1.3} className="text-navy-500" />
                </div>
              </div>
            </div>
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
  const [radius, setRadius] = useState(16)

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      setScale(w / 1440)
      // Shrink the corner radius alongside the frame on tablet/mobile
      setRadius(w >= 720 ? 16 : w >= 480 ? 12 : 10)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={frameRef}
      className="relative h-[470px] overflow-hidden rounded-t-2xl bg-white shadow-[0_40px_100px_-30px_rgba(0,0,0,0.65),0_0_90px_-15px_rgba(57,145,255,0.6)] ring-1 ring-softblue-500/40 lg:h-auto lg:aspect-[1040/470] max-md:h-[320px] max-md:rounded-t-xl max-sm:aspect-[1040/600] max-sm:h-auto max-sm:rounded-t-[10px] max-sm:shadow-none max-sm:ring-0"
      // clip-path enforces the rounded clip even while the child zoom transform
      // animates (overflow-hidden + border-radius alone breaks during transforms)
      style={{
        transform: 'translateZ(0)',
        clipPath: `inset(0 round ${radius}px ${radius}px 0 0)`,
      }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  )
}

// Drifting network graph — nodes float slowly and link to nearby nodes, like an
// embedding/index graph. A slow vertical beam sweeps across (Heimdall's
// ever-watching gaze); nodes it lights up occasionally emit a signal ping
// (Gjallarhorn's call) — i.e. "watch → detect". Cursor also links the graph.
function NetworkGraph() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const LINK = 150 // node-to-node connection distance
    const CURSOR = 190 // cursor connection radius
    const BAND = 130 // half-width of the scanning beam
    const SWEEP = 9000 // ms for one left→right sweep
    let w = 0, h = 0
    let nodes = []
    let pings = []
    let beam = 0 // sweep progress 0→1
    let pingCooldown = 0
    let last = 0
    const mouse = { x: -9999, y: -9999, active: false }

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(26, Math.min(84, Math.round((w * h) / 18000)))
      // jittered grid → even spread across the whole canvas (incl. bottom),
      // avoiding the random clustering/overlap of pure Math.random placement
      const cols = Math.max(2, Math.round(Math.sqrt(count * (w / h))))
      const rows = Math.max(2, Math.ceil(count / cols))
      const cw = w / cols
      const ch = h / rows
      nodes = []
      for (let r = 0; r < rows && nodes.length < count; r++) {
        for (let c = 0; c < cols && nodes.length < count; c++) {
          nodes.push({
            x: (c + 0.2 + Math.random() * 0.6) * cw,
            y: (r + 0.2 + Math.random() * 0.6) * ch,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            r: 1 + Math.random() * 1.3,
            glow: 0,
          })
        }
      }
      pings = []
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < 0 || y < 0 || x > w || y > h) {
        mouse.active = false
        return
      }
      mouse.x = x
      mouse.y = y
      mouse.active = true
    }

    let raf
    const tick = (now) => {
      const dt = last ? Math.min(now - last, 50) : 16
      last = now
      ctx.clearRect(0, 0, w, h)

      // Advance the scanning beam
      beam += dt / SWEEP
      if (beam > 1) beam -= 1
      const beamX = beam * w
      pingCooldown -= dt

      // Drift + edge bounce + glow decay + beam boost (→ occasional ping)
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
        n.glow *= 0.95
        const db = Math.abs(n.x - beamX)
        if (db < BAND) {
          const lit = 1 - db / BAND
          if (lit > n.glow) {
            n.glow = lit
            if (lit > 0.86 && pingCooldown <= 0 && Math.random() < 0.05) {
              pings.push({ x: n.x, y: n.y, r: 0 })
              pingCooldown = 650
            }
          }
        }
      }

      // (Invisible scanning sweep — only its lighting of nodes/links shows)

      // Node-to-node links (brighter when an endpoint is lit)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK) {
            const base = (1 - d / LINK) * 0.22
            const boost = Math.max(a.glow, b.glow) * 0.35
            ctx.strokeStyle = `rgba(160,190,235,${base + boost})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Cursor links — brighter, ties the graph to the pointer
      if (mouse.active) {
        for (const n of nodes) {
          const dx = n.x - mouse.x
          const dy = n.y - mouse.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < CURSOR) {
            ctx.strokeStyle = `rgba(185,212,255,${(1 - d / CURSOR) * 0.55})`
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }

      // Signal pings — expanding rings that fade out
      pings = pings.filter((p) => p.r < 64)
      for (const p of pings) {
        p.r += dt * 0.055
        ctx.strokeStyle = `rgba(175,205,255,${(1 - p.r / 64) * 0.4})`
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, 6.2832)
        ctx.stroke()
      }

      // Nodes — size/brightness lift with their glow
      for (const n of nodes) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(188,212,255,${0.55 + n.glow * 0.45})`
        ctx.arc(n.x, n.y, n.r + n.glow * 1.6, 0, 6.2832)
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    build()
    const ro = new ResizeObserver(build)
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        maskImage:
          'linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.06) 52%, rgba(0,0,0,0.06) 80%, rgba(0,0,0,0.5) 91%, rgba(0,0,0,0.85) 100%)',
        WebkitMaskImage:
          'linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.06) 52%, rgba(0,0,0,0.06) 80%, rgba(0,0,0,0.5) 91%, rgba(0,0,0,0.85) 100%)',
      }}
    />
  )
}

export default function Home() {
  const { lang, t } = useLang()
  return (
    <div>
      {/* ───────── Hero ───────── */}
      <section
        className="relative overflow-hidden"
        style={{
          // Predawn night sky in the navy palette: deepest navy up top (night),
          // a softblue dawn glow rising from the horizon, faint nebula up-left.
          background:
            'linear-gradient(180deg, #02060f 0%, #050d1e 28%, #0a1f3c 52%, #07142b 78%, #03081a 100%)',
        }}
      >
        {/* Network graph — drifting nodes link to each other and to the cursor */}
        <NetworkGraph />
        <div className="relative z-10 mx-auto flex w-full max-w-page flex-col items-center px-[60px] max-lg:px-8 max-sm:px-5 pb-0 pt-[160px] max-lg:pt-[120px] max-sm:pt-[100px] text-center min-h-screen">
          {/* Centered copy */}
          <Reveal className="flex max-w-[760px] flex-col items-center gap-4">
            <h1 className="font-product text-[58px] max-md:text-[34px] max-sm:text-[28px] font-bold leading-[1.3] text-white">
              {lang === 'en' ? (
                <>
                  The scene you need,
                  <br />
                  in a single search
                </>
              ) : (
                <>
                  영상 속 원하는 장면,
                  <br />
                  검색 한 줄로
                </>
              )}
            </h1>
            <p className="font-noto text-lg leading-[1.5] tracking-[-0.45px] text-[#cdd9ec] max-sm:text-[15px]">
              {lang === 'en' ? (
                <>
                  No uploads, no watching.
                  <br />
                  One search finds the scene you need — and even builds the short-form for you.
                </>
              ) : (
                <>
                  업로드 없이, 시청 없이.
                  <br />
                  검색 한 줄로 필요한 장면을 찾고 숏폼까지{' '}
                  <br className="hidden max-sm:block" />
                  자동으로 만들어 드립니다.
                </>
              )}
            </p>
          </Reveal>

          {/* Centered actions */}
          <Reveal className="mt-10 flex w-full justify-center gap-5 max-sm:gap-3" delay={120}>
            <a
              href="https://playground.heimdex.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-white px-6 py-5 max-lg:max-w-[200px] max-lg:flex-1 max-sm:gap-0.5 max-sm:px-3 max-sm:py-4 text-base font-semibold text-navy-500 transition-colors hover:bg-[#eef1f6] max-sm:text-[13px]"
            >
              {t('웹에서 체험하기', 'Try on Web')}
              <ArrowUpRight size={20} strokeWidth={2} className="max-sm:h-4 max-sm:w-4" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-white px-6 py-5 max-lg:max-w-[200px] max-lg:flex-1 max-sm:gap-0.5 max-sm:px-3 max-sm:py-4 text-base font-semibold text-white transition-colors hover:bg-white/10 max-sm:text-[13px]"
            >
              {t('한 달 무료신청', 'Start Free Trial')}
              <ArrowUpRight size={20} strokeWidth={2} className="max-sm:h-4 max-sm:w-4" />
            </Link>
          </Reveal>

          {/* Product screen — the real 동영상 검색 dashboard, scaled to fit and
              bottom-clipped so it reads as embedded in the hero. */}
          {/* Tablet/desktop: grows to push the screen to the bottom edge,
              filling the viewport while keeping a minimum gap above it. */}
          <div aria-hidden className="hidden w-full flex-1 sm:block" />
          <div className="relative mt-[72px] w-full max-w-[1040px] lg:max-w-[1320px] max-sm:mt-[100px] max-sm:[-webkit-mask-image:radial-gradient(ellipse_155%_118%_at_50%_-18%,#000_42%,#000000d8_60%,#000000a0_72%,#0000005a_84%,#00000022_93%,#0000_100%)] max-sm:[mask-image:radial-gradient(ellipse_155%_118%_at_50%_-18%,#000_42%,#000000d8_60%,#000000a0_72%,#0000005a_84%,#00000022_93%,#0000_100%)]">
            {/* Glassmorphism bezel — frosted glass that peeks out behind the screen */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-5 -top-5 bottom-0 rounded-t-[24px] bg-gradient-to-b from-white/20 to-white/[0.04] ring-1 ring-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md max-md:rounded-t-[18px] max-sm:hidden"
            />

            {/* Fluid JS-measured scale fits the 1440-wide app to the frame width */}
            <FluidMockup>
              <HeroAppMockup key={lang} />
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
          <span className="text-navy-500">
            {t('직군마다 다른 영상 고민,', 'Different video challenges for every role —')}
          </span>
          <br />
          <span className="text-neutral-800">
            {t('하임덱스는 이렇게 해결합니다', 'here’s how Heimdex solves them')}
          </span>
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
                {t('자세히 보기', 'Learn more')}
                <ArrowUpRight size={20} strokeWidth={2} className="group-hover:hidden" />
                <ArrowUp size={20} strokeWidth={2} className="hidden group-hover:block" />
              </span>

              {/* Text block — bottom left */}
              <div className="relative z-10 flex w-full flex-col items-start gap-[10px] px-[10px] py-[20px]">
                <span className="flex h-[28px] items-center rounded-full border border-white/20 bg-white/20 px-[13px] py-[7px] text-[11.5px] font-semibold leading-[1.4] tracking-[-0.2875px] text-white">
                  {lang === 'en' ? card.pillEn : card.pill}
                </span>
                <div className="flex flex-col gap-[6px]">
                  <h3 className="font-product text-[32px] font-bold leading-[1.4] tracking-[-0.8px] text-white">
                    {lang === 'en' ? card.titleEn : card.title}
                  </h3>
                  <p className="w-full text-sm leading-[1.4] tracking-[-0.35px] text-[#f5f5f5]">
                    {lang === 'en' ? card.captionEn : card.caption}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Testimonials marquee — glassmorphism */}
        <div className="relative mt-4 w-screen overflow-hidden py-14">
          {/* edge fade for a clean marquee */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-grayscale-10 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-grayscale-10 to-transparent" />
          {/* top/bottom fade into the page bg so the section edges are invisible */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-grayscale-10 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-grayscale-10 to-transparent" />

          <div className="marquee-track relative flex w-max gap-6">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((tm, i) => (
              <article
                key={i}
                className="relative flex w-[460px] max-sm:w-[200px] shrink-0 flex-col gap-5 max-sm:gap-3 overflow-hidden rounded-[24px] max-sm:rounded-2xl border border-white/70 bg-white/50 p-9 max-sm:p-4 shadow-[0_18px_44px_-18px_rgba(35,76,119,0.32)] backdrop-blur-xl"
              >
                {/* top sheen */}
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="flex items-center gap-3 max-sm:gap-2">
                  <span
                    className="flex h-12 w-12 max-sm:h-8 max-sm:w-8 items-center justify-center rounded-full text-xl max-sm:text-sm font-semibold text-white"
                    style={{ backgroundColor: tm.color }}
                  >
                    {tm.initial}
                  </span>
                  <p className="text-lg max-sm:text-xs font-bold tracking-[-0.5px] text-grayscale-800">
                    {lang === 'en' ? tm.nameEn : tm.name}
                  </p>
                </div>
                <p className="text-[15px] max-sm:text-[11px] font-semibold leading-[1.7] max-sm:leading-[1.5] tracking-[-0.4px] text-grayscale-800">
                  {lang === 'en' ? tm.preEn : tm.pre}
                  <span className="font-bold text-navy-500">{lang === 'en' ? tm.hlEn : tm.hl}</span>
                  {lang === 'en' ? tm.postEn : tm.post}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ───────── 영상을 옮기지 않고 ───────── */}
      <section className="flex flex-col items-center px-[60px] max-lg:px-8 max-sm:px-5 pb-[200px] pt-[100px] max-lg:pb-[100px] max-lg:pt-[80px] max-sm:pb-[72px] max-sm:pt-[64px]">
        <FeatureShowcase />
      </section>

      {/* ───────── CTA ───────── */}
      <Reveal>
      <CtaBanner
        title={t('영상을 옮기지 않고, 가치를 꺼내보세요', 'Move nothing. Unlock the value of your video.')}
        primaryLabel={t('한 달 무료신청', 'Start Free Trial')}
        outlineLabel={t('웹에서 체험하기', 'Try on Web')}
        subtitle={
          lang === 'en' ? (
            <>
              Start with a <span className="font-semibold text-navy-500">free one-month trial</span> — no commitment.
            </>
          ) : (
            <>
              <span className="font-semibold text-navy-500">한 달 무료 체험</span>
              으로 부담 없이 먼저 확인해보세요.
            </>
          )
        }
      />
      </Reveal>
    </div>
  )
}
