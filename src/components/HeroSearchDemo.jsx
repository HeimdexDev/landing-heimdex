import { useEffect, useState } from 'react'
import {
  Search,
  Video,
  Image as ImageIcon,
  UserRound,
  Scissors,
  Save,
  Settings,
  PanelLeft,
  Play,
  ChevronDown,
  Calendar,
} from 'lucide-react'

// Heimdex 제품 대시보드("동영상 검색")를 토대로 한 히어로 인터랙션.
// 로펌·마케터·연구자·일반 사용자 검색어가 타이핑되고 → 매칭 장면이 하이라이트됩니다.

const SOURCES = {
  drive: { label: 'Drive', dot: '#68b2ff' },
  youtube: { label: 'Youtube', dot: '#cd626a' },
  local: { label: 'Local', dot: '#66c28d' },
  disk: { label: 'Disk', dot: '#c4c5d4' },
}

const CARDS = [
  { src: 'drive', name: '신제품_언박싱_풀버전.mp4', g: 'from-[#6d92c4] to-[#2b4366]' },
  { src: 'disk', name: '로비_CCTV_0214.mp4', g: 'from-[#8a93a6] to-[#3a4150]' },
  { src: 'local', name: '충돌테스트_07회차.mp4', g: 'from-[#74b58f] to-[#2f6147]' },
  { src: 'drive', name: 'A멤버_비하인드_02.mp4', g: 'from-[#c98f9b] to-[#6e3344]' },
  { src: 'disk', name: '주차장_CCTV_야간.mp4', g: 'from-[#5f7fb0] to-[#26405e]' },
  { src: 'local', name: '세포배양_타임랩스.mp4', g: 'from-[#7ec0a8] to-[#356b58]' },
  { src: 'youtube', name: '반려견_산책_브이로그.mp4', g: 'from-[#c7a86a] to-[#6e4a23]' },
  { src: 'drive', name: '광고_촬영_원본_03.mp4', g: 'from-[#7a8db0] to-[#36456a]' },
]

// persona: 검색어 + 매칭 장면 인덱스
const QUERIES = [
  { persona: '마케터', q: 'A멤버 웃는 장면', matches: [0, 3, 7] },
  { persona: '로펌', q: 'CCTV 속 폭행 장면', matches: [1, 4, 6] },
  { persona: '연구자', q: '충돌 직전 감속 구간', matches: [2, 5, 7] },
  { persona: '일반 사용자', q: '강아지 뛰노는 장면', matches: [6, 0, 3] },
  { persona: '마케터', q: '제품 클로즈업 컷', matches: [0, 3, 5] },
]

function NavItem({ icon: Icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg py-2 pl-2 pr-3 ${
        active ? 'bg-neutral-100' : ''
      }`}
    >
      <Icon size={16} className="text-grayscale-800" />
      <span className="text-[13px] font-semibold tracking-[-0.3px] text-grayscale-800">{label}</span>
    </div>
  )
}

export default function HeroSearchDemo() {
  const [typed, setTyped] = useState('')
  const [matches, setMatches] = useState([])

  useEffect(() => {
    let cancelled = false
    const timers = []
    const wait = (ms) =>
      new Promise((r) => {
        const t = setTimeout(r, ms)
        timers.push(t)
      })

    async function run() {
      let qi = 0
      await wait(600)
      while (!cancelled) {
        const { q, matches: ms } = QUERIES[qi]
        setMatches([])
        setTyped('')
        for (let i = 1; i <= q.length && !cancelled; i++) {
          setTyped(q.slice(0, i))
          await wait(85)
        }
        await wait(450)
        for (let k = 0; k < ms.length && !cancelled; k++) {
          setMatches((prev) => [...prev, ms[k]])
          await wait(300)
        }
        await wait(2200)
        qi = (qi + 1) % QUERIES.length
      }
    }
    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  const searching = matches.length > 0

  return (
    <div className="flex h-[600px] bg-[#fcfcff] text-left">
      {/* ── Sidebar (LNB) ── */}
      <aside className="flex w-[156px] shrink-0 flex-col justify-between border-r border-neutral-100 bg-white p-3">
        <div className="flex flex-col gap-7">
          <div className="flex items-center justify-between pl-1">
            <img src="/assets/logo-wordmark.svg" alt="heimdex" className="h-[16px]" />
            <PanelLeft size={18} className="text-grayscale-500" />
          </div>
          <nav className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="pl-2 text-[13px] font-semibold tracking-[-0.3px] text-neutral-400">메인</span>
              <NavItem icon={Video} label="동영상 검색" active />
              <NavItem icon={ImageIcon} label="이미지 검색" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="pl-2 text-[13px] font-semibold tracking-[-0.3px] text-neutral-400">라이브러리</span>
              <NavItem icon={UserRound} label="인물 라벨 관리" />
              <NavItem icon={Scissors} label="교차 편집" />
              <NavItem icon={Save} label="내 쇼츠" />
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-1 pl-2">
          <Settings size={16} className="text-grayscale-800" />
          <span className="text-xs font-semibold tracking-[-0.3px] text-grayscale-800">설정</span>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex h-12 items-center justify-end px-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end leading-tight">
              <span className="text-[13px] font-medium tracking-[-0.3px] text-grayscale-800">김준수</span>
              <span className="text-[10px] font-medium tracking-[-0.2px] text-grayscale-500">example@email.com</span>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d9dae9]">
              <UserRound size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 pb-4">
          {/* Search card */}
          <div className="flex flex-col gap-3 rounded-[10px] bg-white p-3 shadow-[0_4px_10px_#e8e9f8]">
            <span className="text-[15px] font-semibold tracking-[-0.4px] text-black">동영상 검색</span>
            <div className="flex items-center gap-2">
              <div className="flex shrink-0 gap-1 rounded-lg bg-neutral-50 p-1">
                {['파일', '내용', '의미'].map((t, i) => (
                  <span
                    key={t}
                    className={`rounded-md px-2.5 py-1 text-[13px] font-medium ${
                      i === 0 ? 'bg-white text-grayscale-800' : 'text-neutral-400'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-grayscale-500 px-3 py-2.5">
                <Search size={18} className="shrink-0 text-grayscale-500" />
                <span className="truncate text-[14px] font-medium tracking-[-0.35px] text-grayscale-800">
                  {typed}
                  <span className="caret ml-px inline-block h-[15px] w-[2px] -translate-y-px bg-navy-500 align-middle" />
                </span>
              </div>
            </div>
          </div>

          {/* Result card */}
          <div className="flex flex-1 flex-col gap-3 overflow-hidden rounded-[10px] bg-white p-3 shadow-[0_4px_10px_#e8e9f8]">
            {/* header */}
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-[15px] font-semibold tracking-[-0.4px] text-black">검색 결과</span>
              <span className="text-[12px] font-medium tracking-[-0.3px] text-[#7b7b7b]">
                {searching ? (
                  <>
                    <span className="font-semibold text-navy-500">{matches.length}개 장면</span> 발견
                  </>
                ) : (
                  <>동영상 248개 <span className="text-navy-500">·</span> 폴더 12개</>
                )}
              </span>
              <div className="ml-auto flex items-center gap-3 text-[#7b7b7b]">
                <div className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-2 py-1">
                  <Calendar size={13} />
                  <span className="text-[11px] font-medium">2026.02.12 – 02.19</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-[12px] font-medium tracking-[-0.3px]">생성 일자 순</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* filter chips */}
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-navy-500 px-2.5 py-0.5 text-[12px] font-medium text-navy-500">
                전체
              </span>
              <span className="h-[20px] w-0.5 bg-neutral-100" />
              {Object.values(SOURCES).map((s) => (
                <span
                  key={s.label}
                  className="flex items-center gap-1.5 rounded-full border border-navy-500 py-0.5 pl-2 pr-2.5 text-[12px] font-medium text-navy-500"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                  {s.label}
                </span>
              ))}
            </div>

            {/* grid */}
            <div className="grid grid-cols-4 gap-3 overflow-hidden">
              {CARDS.map((card, i) => {
                const hit = matches.includes(i)
                const dimmed = searching && !hit
                const src = SOURCES[card.src]
                return (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div
                      className={`relative h-[150px] overflow-hidden rounded-[10px] bg-gradient-to-br ${card.g} transition-all duration-300 ${
                        hit
                          ? 'shadow-[0_8px_22px_-6px_rgba(57,145,255,0.6)] ring-2 ring-softblue-500'
                          : 'ring-1 ring-black/5'
                      } ${dimmed ? 'opacity-35 saturate-50' : 'opacity-100'} ${hit ? 'scale-[1.03]' : ''}`}
                    >
                      {/* source badge */}
                      <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/50 py-0.5 pl-1.5 pr-2 text-[10px] font-medium text-white">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: src.dot }} />
                        {src.label}
                      </span>
                      {/* play */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
                          <Play size={14} className="translate-x-px text-white" fill="white" />
                        </div>
                      </div>
                      {/* match badge */}
                      {hit && (
                        <span className="absolute bottom-1.5 right-1.5 rounded-full bg-softblue-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          매칭
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[11px] font-medium tracking-[-0.3px] text-grayscale-800">
                      {card.name}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
