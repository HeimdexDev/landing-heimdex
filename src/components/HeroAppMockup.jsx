import { useEffect, useRef, useState } from 'react'
import {
  PanelLeft,
  Video,
  Image as ImageIcon,
  UserRound,
  Scissors,
  Save,
  Bolt,
  Search,
  Calendar,
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  RectangleHorizontal,
  RectangleVertical,
  EllipsisVertical,
  SquareArrowOutUpRight,
} from 'lucide-react'

// Faithful code build of the Figma "동영상 검색(세로)" screen (node 2289:60619),
// using lucide-react + project design tokens, with a looping demo interaction:
// type a query → results appear → a fake cursor sweeps/scrolls the cards.

const QUERY = '무대 위에서 공연하는 장면'
const COLS = 4

const SOURCES = {
  Drive: '#68b2ff', // softblue/300
  Youtube: '#cd626a', // red/300
  Local: '#66c28d', // green/300
  Disk: '#c4c5d4', // grayscale/300
}

// Thumbnails themed to the query (stage/concert), served locally so nothing
// renders from an external host at runtime.
const SOURCE_CYCLE = ['Drive', 'Youtube', 'Local', 'Disk']
// Varied per-card titles — a few long enough to trigger the ellipsis.
const TITLES = [
  '2024_단독콘서트_앙코르무대_4K',
  '신곡_타이틀곡_직캠_원본',
  '리허설_풀샷_카메라2',
  '팬미팅_오프닝_퍼포먼스_하이라이트_편집본_납품용_최종',
  '음악방송_1위_앵콜무대',
  '쇼케이스_하이라이트',
  '월드투어_서울_2일차_엔딩무대',
  '백스테이지_비하인드_인터뷰',
  '연말시상식_축하공연_세로형',
  '유닛무대_안무연습_드라이런',
  '데뷔_쇼케이스_타이틀무대_고화질_원본_최종_real_final',
  '라이브클립_쇼츠용_세로',
  '콘서트_오프닝_인트로_VCR',
  '앵콜무대_떼창_관객반응',
  '아레나_공연_드론샷',
  '무대_조명_리허설_테스트',
]

const CARDS = Array.from({ length: 16 }, (_, i) => ({
  source: SOURCE_CYCLE[i % SOURCE_CYCLE.length],
  title: TITLES[i % TITLES.length],
  img: `/assets/stage/stage-${i + 1}.jpg`,
}))

function SourceChip({ source }) {
  return (
    <span className="inline-flex items-center gap-[6px] rounded-full bg-black/50 py-[2px] pl-[8px] pr-[10px] text-[12px] font-medium tracking-[-0.3px] text-white">
      <span
        className="h-[6px] w-[6px] rounded-full"
        style={{ backgroundColor: SOURCES[source] }}
      />
      {source}
    </span>
  )
}

function NavItem({ icon: Icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-[10px] rounded-lg py-[10px] pl-[10px] pr-[12px] ${
        active ? 'bg-neutral-100' : ''
      }`}
    >
      <Icon size={20} strokeWidth={1.8} className="text-grayscale-800" />
      <span className="whitespace-nowrap text-[16px] font-semibold tracking-[-0.4px] text-grayscale-800">
        {label}
      </span>
    </div>
  )
}

function FilterChip({ label, dot }) {
  return (
    <span className="inline-flex items-center gap-[6px] rounded-full border border-navy-500 py-[2px] pl-[8px] pr-[10px] text-[14px] font-medium tracking-[-0.35px] text-navy-500">
      {dot && (
        <span className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: dot }} />
      )}
      {label}
    </span>
  )
}

function VideoCard({ source, img, title, hovered, shown, index, cardRef }) {
  return (
    <div
      ref={cardRef}
      className="flex w-[200px] flex-col gap-[10px] transition-all duration-500 ease-out"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(12px)',
        transitionDelay: `${shown ? index * 45 : 0}ms`,
      }}
    >
      <div
        className={`relative h-[337px] w-[200px] overflow-hidden rounded-[10px] border border-neutral-100 bg-neutral-300 transition-shadow duration-300 ${
          hovered ? 'shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)]' : ''
        }`}
      >
        <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative flex h-full items-start justify-between p-[10px]">
          <SourceChip source={source} />
          {hovered && (
            <div className="flex h-full flex-col items-end justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-black/50">
                <EllipsisVertical size={16} className="text-white" />
              </span>
              <SquareArrowOutUpRight size={24} className="text-white" />
            </div>
          )}
        </div>
      </div>
      <div
        className={`flex w-[200px] items-start gap-px text-[14px] font-medium tracking-[-0.35px] transition-colors ${
          hovered ? 'text-navy-500' : 'text-grayscale-800'
        }`}
      >
        {/* default: single-line ellipsis · hover: full title wraps into view */}
        <span className={`min-w-0 ${hovered ? 'whitespace-normal break-words' : 'truncate'}`}>
          {title}
        </span>
        <span className="shrink-0 text-right">.mp4</span>
      </div>
    </div>
  )
}

// Glove-style pointing-hand cursor that glides between cards. `dur` lets each
// move have its own (human-varied) duration with an ease-in-out feel.
function FakeCursor({ x, y, visible, dur }) {
  return (
    <div
      className="pointer-events-none absolute z-20"
      style={{
        left: x,
        top: y,
        opacity: visible ? 1 : 0,
        // fingertip is near the top-center of the art → nudge so it points at (x, y)
        transform: 'translate(-11px, -2px)',
        transition: `left ${dur}ms cubic-bezier(0.45,0.05,0.35,1), top ${dur}ms cubic-bezier(0.45,0.05,0.35,1), opacity 260ms ease`,
        filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))',
      }}
      aria-hidden="true"
    >
      <svg width="27" height="27" viewBox="0 0 28 28">
        <path
          d="M11 3.2c0-1.05.85-1.9 1.9-1.9s1.9.85 1.9 1.9v6.6c.35-.45.9-.75 1.5-.75 1.05 0 1.9.85 1.9 1.9v.3c.35-.4.85-.65 1.4-.65 1.05 0 1.9.85 1.9 1.9v.4c.3-.25.7-.4 1.1-.4 1 0 1.8.8 1.8 1.8v3.9c0 .5-.08 1-.25 1.47l-1.05 3.05c-.5 1.45-1.86 2.42-3.4 2.42h-4.3c-1.1 0-2.14-.5-2.83-1.36l-4.7-5.9c-.66-.83-.5-2.03.34-2.66.78-.58 1.86-.47 2.5.26L11 16.2V3.2z"
          fill="white"
          stroke="#272833"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default function HeroAppMockup() {
  // Dates reflect the current date so the mockup never looks stale.
  const pad = (n) => String(n).padStart(2, '0')
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(today.getDate() - 7)
  const dateRange = `${weekAgo.getFullYear()}.${pad(weekAgo.getMonth() + 1)}.${pad(
    weekAgo.getDate(),
  )} – ${pad(today.getMonth() + 1)}.${pad(today.getDate())}`
  const updatedAt = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  // ── Demo interaction state ──
  const [typed, setTyped] = useState('')
  const [searched, setSearched] = useState(false)
  const [hoverIndex, setHoverIndex] = useState(-1)
  const [scroll, setScroll] = useState(0)
  const [cursor, setCursor] = useState({ x: 380, y: 360, visible: false, dur: 400 })
  // Intro zoom: start magnified on the search bar, then zoom out to full screen.
  const [zoom, setZoom] = useState(1.7)

  const scrollerRef = useRef(null)
  const cardRefs = useRef([])
  const activeTab = typed ? '의미' : '파일'

  useEffect(() => {
    let cancelled = false
    const timers = []
    const wait = (ms) =>
      new Promise((resolve) => timers.push(setTimeout(resolve, ms)))

    async function run() {
      while (!cancelled) {
        // 0. reset — zoomed in on the search bar
        setTyped('')
        setSearched(false)
        setHoverIndex(-1)
        setScroll(0)
        setCursor((c) => ({ ...c, visible: false }))
        setZoom(1.7)
        await wait(850)
        if (cancelled) return

        // 1. type the query (zoomed in)
        for (let i = 1; i <= QUERY.length; i++) {
          if (cancelled) return
          setTyped(QUERY.slice(0, i))
          await wait(85)
        }
        await wait(550)

        // 2. zoom back out to the full screen; results appear (staggered)
        setSearched(true)
        setZoom(1)
        await wait(950)

        // 3. cursor sweeps the cards left→right while the view scrolls to follow
        setCursor((c) => ({ ...c, visible: true }))
        for (let i = 0; i < CARDS.length; i++) {
          if (cancelled) return
          setHoverIndex(i)
          const card = cardRefs.current[i]
          const scroller = scrollerRef.current
          if (card && scroller) {
            const left = card.offsetLeft
            const top = card.offsetTop
            setCursor({ x: left + 148, y: top + 250, visible: true, dur: 350 })
            // visible window below the fixed GNB ≈ 540px (unscaled)
            // smaller offset → hovered card sits higher in the view
            const maxScroll = Math.max(0, scroller.offsetHeight - 540)
            setScroll(Math.min(maxScroll, Math.max(0, top - 110)))
          }
          await wait(360)
        }
        await wait(500)
        setHoverIndex(-1)
        setCursor((c) => ({ ...c, visible: false }))
        await wait(700)
      }
    }

    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div
      className="relative bg-grayscale-10"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: '64% 10%', // centered on the search bar
        transition: 'transform 750ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="flex w-[1440px] items-start text-left">
        {/* ───── LNB ───── */}
        <aside className="flex h-[1024px] w-[250px] shrink-0 flex-col justify-between border-r border-neutral-100 bg-white p-[24px]">
          <div className="flex flex-col gap-[68px]">
            <div className="flex items-center justify-between">
              {/* Default header logo — symbol + wordmark (not the white variant) */}
              <span className="flex items-center gap-[6px]">
                <img src="/assets/logo-symbol.svg" alt="" className="h-[28px] w-[26px]" />
                <img
                  src="/assets/logo-wordmark.svg"
                  alt="heimdex"
                  className="h-[19px] w-[92px]"
                />
              </span>
              <PanelLeft size={24} className="text-[#9d9d9d]" />
            </div>

            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-col gap-[6px]">
                <p className="text-[16px] font-semibold tracking-[-0.4px] text-[#9d9d9d]">메인</p>
                <NavItem icon={Video} label="동영상 검색" active />
                <NavItem icon={ImageIcon} label="이미지 검색" />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[16px] font-semibold tracking-[-0.4px] text-[#9d9d9d]">
                  라이브러리
                </p>
                <NavItem icon={UserRound} label="인물 라벨 관리" />
                <NavItem icon={Scissors} label="교차 편집" />
                <NavItem icon={Save} label="내 쇼츠" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[4px]">
            <Bolt size={20} className="text-grayscale-800" />
            <span className="text-[14px] font-semibold tracking-[-0.35px] text-grayscale-800">
              설정
            </span>
          </div>
        </aside>

        {/* ───── Content ───── */}
        <div className="flex w-[1190px] flex-col items-center gap-[24px]">
          {/* GNB — fixed + translucent glass; scrolled results blur through it */}
          <div className="relative z-10 flex h-[80px] w-full items-center justify-end bg-grayscale-10/70 px-[32px] backdrop-blur-[6px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex flex-col items-end">
                <p className="text-[16px] font-medium tracking-[-0.4px] text-grayscale-800">
                  하임덱스
                </p>
                <p className="text-[12px] tracking-[-0.3px] text-grayscale-500">
                  heimdex@heimdex.co
                </p>
              </div>
              <span className="flex items-center justify-center rounded-full bg-[#d9dae9] p-[8px]">
                <UserRound size={24} className="text-white" />
              </span>
            </div>
          </div>

          {/* Scroll region — only this translates; LNB + GNB stay fixed */}
          <div
            ref={scrollerRef}
            className="relative z-0 flex w-[943px] flex-col gap-[20px] transition-transform duration-500 ease-out"
            style={{ transform: `translateY(${-scroll}px)` }}
          >
            {/* Search card */}
            <div className="flex flex-col gap-[20px] rounded-[10px] bg-white p-[20px] shadow-[0_4px_10px_0_#e8e9f8]">
              <p className="text-[18px] font-semibold tracking-[-0.45px] text-black">동영상 검색</p>
              <div className="flex items-stretch gap-[10px]">
                <div className="flex items-stretch gap-[4px] rounded-[10px] bg-[#f5f5f5] p-[4px]">
                  {['파일', '내용', '의미'].map((t) => (
                    <span
                      key={t}
                      className={`flex items-center justify-center rounded-[8px] px-[10px] py-[2px] text-[16px] font-medium tracking-[-0.4px] transition-colors ${
                        t === activeTab ? 'bg-white text-grayscale-800' : 'text-[#9d9d9d]'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-1 items-center gap-[10px] rounded-[10px] border border-grayscale-500 bg-white p-[16px]">
                  <Search
                    size={24}
                    className={typed ? 'text-grayscale-500' : 'text-neutral-300'}
                  />
                  {typed ? (
                    <span className="flex items-center text-[16px] font-medium tracking-[-0.4px] text-grayscale-800">
                      {typed}
                      <span className="ml-[1px] inline-block h-[18px] w-[2px] animate-pulse bg-grayscale-800" />
                    </span>
                  ) : (
                    <span className="text-[16px] font-medium tracking-[-0.4px] text-neutral-300">
                      파일명이나 폴더명으로 찾아보세요 - "마케팅_쇼츠_01"
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Results card */}
            <div className="flex flex-col gap-[20px] rounded-[10px] bg-white p-[20px] shadow-[0_4px_10px_0_#e8e9f8]">
              {/* header */}
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-[16px]">
                  <div className="flex flex-1 items-center gap-[16px]">
                    <p className="whitespace-nowrap text-[18px] font-semibold tracking-[-0.45px] text-black">
                      검색 결과
                    </p>
                    <div className="flex items-center gap-[4px] text-[14px] font-medium tracking-[-0.35px] text-[#7b7b7b]">
                      <span>동영상 125개</span>
                      <span className="text-navy-500">·</span>
                      <span>폴더 125개</span>
                      <span className="text-navy-500">·</span>
                      <span>업데이트 {updatedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[16px]">
                    <div className="flex items-center gap-[6px] rounded-[8px] border border-neutral-300 px-[10px] py-[6px] text-[14px] font-medium tracking-[-0.35px] text-[#7b7b7b]">
                      <Calendar size={16} className="text-[#7b7b7b]" />
                      {dateRange}
                    </div>
                    <div className="flex items-center gap-[4px] text-[16px] font-medium tracking-[-0.4px] text-[#7b7b7b]">
                      생성 일자 순
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>
                {/* filter row */}
                <div className="flex items-center gap-[10px]">
                  <div className="flex flex-1 items-center gap-[8px]">
                    <FilterChip label="전체" />
                    <span className="h-[26px] w-[2px] bg-neutral-100" />
                    <FilterChip label="Drive" dot={SOURCES.Drive} />
                    <FilterChip label="Youtube" dot={SOURCES.Youtube} />
                    <FilterChip label="Local" dot={SOURCES.Local} />
                    <FilterChip label="Disk" dot={SOURCES.Disk} />
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <div className="flex items-center gap-[4px] rounded-[6px] bg-[#f5f5f5] p-[3px]">
                      {['동영상', '장면'].map((t, i) => (
                        <span
                          key={t}
                          className={`rounded-[4px] px-[6px] py-[2px] text-[12px] font-medium tracking-[-0.3px] ${
                            i === 0 ? 'bg-white text-grayscale-800' : 'text-[#9d9d9d]'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-[4px] rounded-[6px] bg-[#f5f5f5] p-[3px]">
                      <span className="flex items-center gap-[4px] rounded-[6px] px-[4px] py-[2px] text-[12px] font-medium text-[#9d9d9d]">
                        <RectangleHorizontal size={16} />
                        가로
                      </span>
                      <span className="flex items-center gap-[4px] rounded-[4px] bg-white px-[4px] py-[2px] text-[12px] font-medium text-grayscale-800">
                        <RectangleVertical size={16} />
                        세로
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* grid */}
              <div className="flex flex-wrap justify-between gap-y-[24px]">
                {CARDS.map((c, i) => (
                  <VideoCard
                    key={i}
                    index={i}
                    cardRef={(el) => (cardRefs.current[i] = el)}
                    shown={searched}
                    hovered={hoverIndex === i}
                    {...c}
                  />
                ))}
              </div>

              {/* pagination */}
              <div className="flex items-center justify-center gap-[16px]">
                <div className="flex items-center text-grayscale-500">
                  <ChevronsLeft size={24} />
                  <ChevronLeft size={20} />
                </div>
                <div className="flex items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-navy-500 text-[16px] font-medium text-white">
                    1
                  </span>
                  {[2, 3, 4, 5, '...'].map((n) => (
                    <span
                      key={n}
                      className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[16px] font-medium text-[#7b7b7b]"
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-grayscale-500">
                  <ChevronRight size={20} />
                  <ChevronsRight size={24} />
                </div>
              </div>
            </div>

            {/* fake cursor — inside the scroll region, glued to the cards */}
            <FakeCursor x={cursor.x} y={cursor.y} visible={cursor.visible} />
          </div>
        </div>
      </div>
    </div>
  )
}
