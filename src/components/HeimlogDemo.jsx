import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownUp,
  ArrowLeft,
  Bell,
  Check,
  ChevronLeft,
  ChevronUp,
  EllipsisVertical,
  GripVertical,
  Info,
  LoaderCircle,
  PanelLeft,
  Upload,
  X,
} from 'lucide-react'
import { FakeCursor } from './hero/atoms.jsx'

/**
 * The heimlog product, drawn at the 1440 width the solution demo box scales down
 * — the same contract HeroAppMockup works to, and driven the same way: one
 * looping interaction with a cursor that moves, presses, and changes what is on
 * screen, rather than screens taking turns.
 *
 * The run is the route a first project actually takes:
 *
 *   [01-0] 내 프로젝트 빈 상태 → press 새 프로젝트 시작
 *   [03-0] 새 프로젝트 — the clips upload in, then press 분석 시작
 *   [03-7] 분석을 시작할까요? — pick 테마로 만들기, two chips, press 분석하기
 *   [04-0] 분석 중 — 영상 준비 중
 *
 * Layout, copy, type scale and colours are the app's own, taken from AppShell,
 * SideNav, AccountMenu, ProjectsView, UploadHeader, FootageWorkspace,
 * FootageDateGroup, FootageRow, UploadPanel, StartAnalysisDialog and
 * AnalysisView. heimlog is a dark app on its own token set, so the hexes are
 * spelled out rather than mapped onto this site's palette:
 *   surface #262626 · raised #434343 · emphasis #555555 · border #434343
 *   outline #7b7b7b · text #ffffff / secondary #c4c4c4 / muted #9d9d9d
 *   placeholder #d9d9d9 · accent #ff7a66 · on-accent #2b0f06 · success #00a95e
 * and the type scale is display 54 · headline 32 · title 20 · subtitle 18 ·
 * label 14 · body 12 · caption 11, each at -0.02em.
 */

// One shooting day of clips. Filenames, timestamps and lengths are made up; the
// shapes are the app's own — `2025-09-06 10:12` from formatShotTimeKst, `m:ss`
// from formatClipLength.
const DAYS = [
  {
    date: '2026년 9월 8일',
    clips: [
      { name: 'IMG_4821.MOV', at: '2026-09-08 10:12', len: '0:42', img: 1 },
      { name: 'IMG_4830.MOV', at: '2026-09-08 11:04', len: '1:15', img: 2 },
      { name: 'IMG_4852.MOV', at: '2026-09-08 13:37', len: '0:28', img: 3 },
    ],
  },
  {
    date: '2026년 9월 9일',
    clips: [
      { name: 'IMG_4903.MOV', at: '2026-09-09 08:41', len: '0:51', img: 4 },
      { name: 'IMG_4915.MOV', at: '2026-09-09 12:15', len: '1:32', img: 5 },
    ],
  },
]
const PLACED_TOTAL = DAYS.reduce((n, d) => n + d.clips.length, 0)

// The 촬영 정보 없음 column — clips whose container metadata was stripped, which
// is what a messenger does to anything sent through it.
const UNPLACED = [
  { name: 'IMG_5027.MOV', at: null, len: '0:19', img: 6 },
  { name: 'IMG_5041.MOV', at: null, len: '0:44', img: 7 },
]
const CLIP_TOTAL = PLACED_TOTAL + UNPLACED.length

// The six themes 테마로 만들기 offers, in the vocabulary's order.
const THEMES = ['먹거리', '쇼핑', '숙소', '관광', '풍경', '이동']
// The two the run picks, in the order it picks them.
const PICKS = ['먹거리', '풍경']

// The account's balance, and what this batch leaves of it. Stated once so the
// rail card, the dialog's 잔여 and the cost never drift apart.
//
// Priced the way heimlog prices it: ceil(combined minutes) over the PLACED clips
// only — the 촬영 정보 없음 column is "분석에 포함되지 않아요", so it is neither
// counted nor charged (heimlog `credit-policy.ts`, `UploadScreen` analysable).
const CREDIT_BALANCE = 200
const lenMs = (len) => {
  // m:ss only. A bad length throws in dev, where whoever edited DAYS sees it at
  // once; in production (no CI evaluates this module) it logs and counts as 0
  // rather than emptying the demo frame on every visit.
  const hit = /^(\d+):([0-5]\d)$/.exec(len)
  if (!hit) {
    const msg = `HeimlogDemo: clip length must be m:ss, got "${len}"`
    if (import.meta.env.DEV) throw new Error(msg)
    console.error(msg)
    return 0
  }
  return (Number(hit[1]) * 60 + Number(hit[2])) * 1000
}
const clipsMs = (clips) => clips.reduce((n, c) => n + lenMs(c.len), 0)
const creditsFor = (ms) => (ms > 0 ? Math.ceil(ms / 60000) : 0)
const PLACED_CLIPS = DAYS.flatMap((d) => d.clips)
const PLACED_MS = clipsMs(PLACED_CLIPS)
const CREDIT_COST = creditsFor(PLACED_MS)
// heimlog's formatKoreanDuration, for the dialog's length line.
const PLACED_DURATION = (() => {
  const t = Math.floor(PLACED_MS / 1000)
  const h = Math.floor(t / 3600)
  const m = Math.floor(t / 60) % 60
  const s = t % 60
  if (h > 0) return `${h}시간 ${m}분 ${s}초`
  if (m > 0) return `${m}분 ${s}초`
  return `${s}초`
})()

// The faces the blur analysis comes back with — frames cut out of this project's
// own footage. 블러3 and 블러5 are the 주요 인물 it elected to leave alone, which is
// what 주요 인물로 분석된 2명은 자동으로 제외됐어요 names; they draw without a
// checkbox, since that choice is not the user's.
const PROTAGONIST_IDS = ['f3', 'f5']
const FACES = Array.from({ length: 6 }, (_, i) => ({
  id: `f${i + 1}`,
  src: `/assets/vlog/faces/blur-${i + 1}.jpg`,
  excluded: PROTAGONIST_IDS.includes(`f${i + 1}`),
}))
const PROTAGONISTS = PROTAGONIST_IDS.length
// Everything the picker leaves to the user, and which of those it opens ticked.
// It opens on nearly-all rather than on an empty grid: what this stage is here
// to show is that two faces were taken out of the user's hands and the rest were
// not, and an empty grid says neither. The last one is left unticked so the
// choice still reads as a choice — and so 전체 선택 shows its middle state.
const SELECTABLE = FACES.filter((face) => !face.excluded).map((face) => face.id)
const CHECKED = SELECTABLE.slice(0, -1)
// The answer the run gives 이 영상에 나오는 주요 인물은 몇 명인가요?
const BLUR_COUNT = 2

// One box for every panel the run zooms into. The stages hold different amounts
// of content — a chip row, a progress card, a 6-tile grid — and letting each one
// size itself made the whole panel grow and shrink under a reader who is trying
// to follow a single flow. Tall enough for the tallest stage (the face grid),
// and the panels clip rather than stretch, which is what the editor's own
// scrolling column does.
const PANEL_BOX = 'h-[420px] w-[330px]'

// The transcript the AI 자막 panel lists, one card per caption. `words` are the
// transcribed 어절 the split seams sit between — the panel only offers a cut
// where a boundary was measured, never between words it guessed.
const SCRIPT = [
  { id: 'c1', from: 4, to: 11, words: ['오늘은', '성산일출봉부터', '가볼게요'] },
  {
    id: 'c2',
    from: 11,
    to: 22,
    words: ['생각보다', '사람이', '진짜', '많네요', '그래도', '올라가는', '길이', '예뻐요'],
  },
  { id: 'c3', from: 22, to: 29, words: ['여기서', '보는', '풍경이', '제일', '좋았어요'] },
  { id: 'c4', from: 29, to: 36, words: ['점심은', '근처', '국수집에서', '먹었어요'] },
  {
    id: 'c5',
    from: 36,
    to: 45,
    words: ['숙소', '가는', '길에', '노을이', '예뻐서', '잠깐', '멈췄어요'],
  },
  { id: 'c6', from: 45, to: 52, words: ['오늘', '하루도', '잘', '마무리했습니다'] },
]
// The run cuts this card before its 5th word, then joins the halves again.
const SPLIT_CARD = 'c2'
const SPLIT_AT = 4

/** Timeline seconds → `MM:SS`, floored: 7.9s reads 00:07, the second it is IN. */
const mmss = (seconds) => {
  const total = Math.max(0, Math.floor(seconds))
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

/* ─────────────────────────── icons ───────────────────────────
   Redrawn from heimlog's own icons.tsx: a square 20px box, viewBox 0 0 20 20 so
   the stroke weight scales with it, and every stroke `currentColor`. */
function Icon({ size = 20, path, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {path}
    </svg>
  )
}

const WandIcon = (props) => (
  <Icon
    {...props}
    path={
      <path d="M12.5 5L15 7.5M5 17.5L17.5 5L15 2.5L2.5 15L5 17.5ZM7.5 2.5C7.5 2.94203 7.67559 3.36595 7.98816 3.67851C8.30072 3.99107 8.72464 4.16667 9.16667 4.16667C8.72464 4.16667 8.30072 4.34226 7.98816 4.65482C7.67559 4.96738 7.5 5.39131 7.5 5.83333C7.5 5.39131 7.3244 4.96738 7.01184 4.65482C6.69928 4.34226 6.27536 4.16667 5.83333 4.16667C6.27536 4.16667 6.69928 3.99107 7.01184 3.67851C7.3244 3.36595 7.5 2.94203 7.5 2.5ZM15.8333 10.8333C15.8333 11.2754 16.0089 11.6993 16.3215 12.0118C16.634 12.3244 17.058 12.5 17.5 12.5C17.058 12.5 16.634 12.6756 16.3215 12.9882C16.0089 13.3007 15.8333 13.7246 15.8333 14.1667C15.8333 13.7246 15.6577 13.3007 15.3452 12.9882C15.0326 12.6756 14.6087 12.5 14.1667 12.5C14.6087 12.5 15.0326 12.3244 15.3452 12.0118C15.6577 11.6993 15.8333 11.2754 15.8333 10.8333Z" />
    }
  />
)

const PlusGlyph = (props) => (
  <Icon {...props} path={<path d="M10.0001 4.1665V15.8332M4.16675 9.99984H15.8334" />} />
)

const SquarePlusIcon = (props) => (
  <Icon
    {...props}
    path={
      <path d="M7.5 10H12.5M10 7.5V12.5M2.5 4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667Z" />
    }
  />
)

const VideoGlyph = (props) => (
  <Icon
    {...props}
    path={
      <>
        <path d="M12.5 8.33343L16.2942 6.43677C16.4212 6.37329 16.5623 6.34333 16.7042 6.34972C16.846 6.35611 16.9839 6.39864 17.1047 6.47327C17.2255 6.5479 17.3252 6.65216 17.3944 6.77616C17.4636 6.90015 17.4999 7.03977 17.5 7.18177V12.8184C17.4999 12.9604 17.4636 13.1 17.3944 13.224C17.3252 13.348 17.2255 13.4523 17.1047 13.5269C16.9839 13.6016 16.846 13.6441 16.7042 13.6505C16.5623 13.6569 16.4212 13.6269 16.2942 13.5634L12.5 11.6668V8.33343Z" />
        <path d="M2.5 6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H10.8333C11.2754 5 11.6993 5.17559 12.0118 5.48816C12.3244 5.80072 12.5 6.22464 12.5 6.66667V13.3333C12.5 13.7754 12.3244 14.1993 12.0118 14.5118C11.6993 14.8244 11.2754 15 10.8333 15H4.16667C3.72464 15 3.30072 14.8244 2.98816 14.5118C2.67559 14.1993 2.5 13.7754 2.5 13.3333V6.66667Z" />
      </>
    }
  />
)

const creditMark = (size) => (
  <img src="/assets/vlog/credit-mark.png" alt="" style={{ width: size, height: size }} />
)

/** The press the fake cursor makes: the same dip every real button gets. */
const pressStyle = (on) => ({
  transform: on ? 'scale(0.96)' : 'scale(1)',
  transition: 'transform 140ms ease-out',
})

/* ─────────────────────────── shell ─────────────────────────── */

const NAV = [
  { key: 'new', label: '새 프로젝트', icon: <SquarePlusIcon /> },
  { key: 'mine', label: '내 프로젝트', icon: <VideoGlyph /> },
  { key: 'credits', label: '크레딧 충전', icon: creditMark(20) },
]

/** AppShell's left rail: 255 wide, neutral/800 behind a neutral/700 rule. */
function Rail({ active }) {
  return (
    <aside className="flex w-[255px] shrink-0 flex-col border-r border-[#434343] bg-[#262626] p-5">
      <div className="mb-10 flex h-[26.83px] w-full items-center justify-between">
        <img src="/assets/vlog/logo-tight.svg" alt="heimlog" className="h-[28px] w-[124px]" />
        <PanelLeft size={18} className="text-[#c4c4c4]" />
      </div>

      <nav className="flex flex-col gap-2.5">
        {NAV.map((entry) => {
          const on = entry.key === active
          return (
            <span
              key={entry.key}
              className={`flex h-10 items-center rounded-[8px] text-[14px] tracking-[-0.28px] transition-colors ${
                on
                  ? 'gap-2 bg-[#434343] py-2.5 pr-2.5 font-semibold text-white'
                  : 'gap-2.5 p-2.5 text-[#c4c4c4]'
              }`}
            >
              {/* The selected marker: a 2px white rule flush to the left edge,
                  which is why the active row drops its left padding. */}
              {on && <span className="h-full w-0.5 shrink-0 bg-white" />}
              <span className="flex items-center gap-2.5">
                <span className="grid size-5 shrink-0 place-items-center">{entry.icon}</span>
                {entry.label}
              </span>
            </span>
          )
        })}
      </nav>

      {/* 내 크레딧 on a ruled card, on the rail's bottom edge. */}
      <span className="mt-auto flex items-center justify-between rounded-[10px] border border-[#434343] p-3">
        <span className="flex items-center gap-2.5">
          {creditMark(24)}
          <span className="text-[16px] font-medium tracking-[-0.32px] text-[#d9d9d9]">
            내 크레딧
          </span>
        </span>
        <span className="text-[18px] font-semibold tracking-[-0.36px] text-[#ff7a66]">
          {CREDIT_BALANCE}
        </span>
      </span>
    </aside>
  )
}

function Thumb({ img, len, w = 160, h = 90 }) {
  return (
    <div
      className="relative flex shrink-0 items-end justify-end overflow-hidden bg-[#f5f5f5] p-[10px]"
      style={{ width: w, height: h }}
    >
      <img
        src={`/assets/vlog/clip-${img}.jpg`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="relative rounded-[6px] bg-black/50 px-[6px] py-[2px] text-[12px] leading-[1.48] tracking-[-0.24px] text-white">
        {len}
      </span>
    </div>
  )
}

/* ───────────────────── [01-0] 내 프로젝트, 빈 상태 ───────────────────── */

function StartView({ btnRef, pressed }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-[985px] flex-col items-center justify-center gap-10 text-center">
      <div className="relative flex w-full flex-col items-center gap-5">
        <h1 className="text-[54px] font-bold leading-[1.48] tracking-[-1.08px] text-[#f5f5f5]">
          갤러리에 묵혀둔 영상,
          <br />
          브이로그로 완성하세요.
        </h1>
        <p className="text-[20px] leading-[1.48] tracking-[-0.4px] text-[#c4c4c4]">
          AI가 알아서 시간 순으로 또는 특정 테마만 모아
          <br />
          당신의 일상을 특별한 브이로그로 만들어드립니다.
        </p>
        {/* The brackets hang OVER the second line rather than being set in it —
            every number here is the node's own. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-[calc(50%-5.43px)] top-[83.36px] flex w-[583.145px] -translate-x-1/2 justify-between"
        >
          <img src="/assets/vlog/bracket-left.svg" alt="" width={36} height={74} />
          <img src="/assets/vlog/bracket-right.svg" alt="" width={38} height={74} />
        </span>
      </div>
      {/* Button size="xl" — the hero CTA; its height comes from the padding. */}
      <span
        ref={btnRef}
        style={pressStyle(pressed)}
        className="inline-flex items-center gap-2 rounded-[8px] bg-[#ff7a66] px-[18px] py-[14px] text-[18px] font-semibold tracking-[-0.36px] text-[#2b0f06]"
      >
        <PlusGlyph />
        새 프로젝트 시작
      </span>
    </div>
  )
}

/* ───────────────────── [03-0] 새 프로젝트 ───────────────────── */

function UploadView({ staged, analyzeRef, pressed }) {
  const placed = Math.min(staged, PLACED_TOTAL)
  const unplaced = Math.max(0, Math.min(staged - PLACED_TOTAL, UNPLACED.length))
  const uploading = staged < CLIP_TOTAL
  let seen = 0

  return (
    <>
      {/* UploadHeader: back, project name, credits, and the 분석 시작 CTA. */}
      <header className="flex h-[85px] shrink-0 items-center justify-between gap-[10px] px-[30px]">
        <div className="flex min-w-0 flex-1 items-center gap-[10px]">
          <ChevronLeft size={20} className="shrink-0 text-white" />
          <span className="truncate text-[20px] font-semibold text-white">제주도 여행 3일차</span>
        </div>
        <div className="flex shrink-0 items-center gap-[10px]">
          {/* 사용될 크레딧 — it prices what is placed, so it climbs with the dated
              list and holds while the 촬영 정보 없음 clips upload. */}
          <span className="flex h-[44px] items-center gap-[10px] rounded-full border border-[#7b7b7b] px-[20px]">
            {creditMark(28)}
            <span className="text-[24px] font-semibold tracking-[-0.48px] text-[#ff7a66]">
              {creditsFor(clipsMs(PLACED_CLIPS.slice(0, placed)))}
            </span>
            <span className="text-[16px] font-medium tracking-[-0.32px] text-[#c4c4c4]">
              크레딧 사용
            </span>
          </span>
          {/* Button size="lg", primary: h-11 px-4, label type. Disabled until
              every staged clip has finished uploading, as the real one is. */}
          <span
            ref={analyzeRef}
            style={pressStyle(pressed)}
            className={`inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#ff7a66] px-4 text-[14px] font-semibold tracking-[-0.28px] text-[#2b0f06] transition-opacity ${
              uploading ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <WandIcon />
            {uploading ? '업로드 중…' : '분석 시작'}
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 items-stretch overflow-hidden">
        {/* FootageWorkspace — 사용할 영상 */}
        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-[48px] shrink-0 items-center justify-between border-y border-[#434343] bg-[#262626] px-[20px]">
            <span className="flex items-center gap-[10px]">
              <span className="text-[16px] font-semibold tracking-[-0.32px] text-white">
                사용할 영상
              </span>
              <Info size={16} className="text-[#9d9d9d]" />
            </span>
            <span className="flex items-center gap-[20px]">
              <span className="text-[14px] font-medium tracking-[-0.28px] text-[#c4c4c4]">
                영상 {placed}개 · 제외 0개
              </span>
              <span className="flex items-center gap-[8px] rounded-[8px] px-[10px] py-[8px] text-[12px] font-semibold tracking-[-0.24px] text-[#c4c4c4]">
                <ArrowDownUp size={20} />
                시간순 정렬
              </span>
              <span className="flex items-center gap-[8px] rounded-[8px] px-[10px] py-[8px] text-[12px] font-semibold tracking-[-0.24px] text-[#ff7a66]">
                <Upload size={20} />
                파일 업로드
              </span>
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            {DAYS.map((day) => {
              const shown = day.clips.filter(() => seen++ < placed)
              if (shown.length === 0) return null
              return (
                <div key={day.date} className="flex w-full flex-col border-b border-[#434343]">
                  <div className="flex h-[48px] w-full items-center justify-between bg-[#434343] px-[20px]">
                    <span className="flex min-w-0 items-center gap-[16px]">
                      <span className="truncate text-[16px] font-semibold tracking-[-0.32px] text-white">
                        {day.date}
                      </span>
                      <span className="shrink-0 text-[14px] font-medium tracking-[-0.28px] text-[#c4c4c4]">
                        영상 {shown.length}개
                      </span>
                    </span>
                    <ChevronUp size={20} className="shrink-0 text-[#c4c4c4]" />
                  </div>
                  <div className="flex w-full flex-col pl-[30px]">
                    {shown.map((clip) => (
                      <div key={clip.name} className="clip-in flex items-center">
                        <Thumb img={clip.img} len={clip.len} />
                        <div className="flex min-w-0 flex-1 items-center gap-[20px] py-[10px] pl-[20px]">
                          <span className="min-w-0 flex-1 truncate text-[14px] font-medium tracking-[-0.28px] text-white">
                            {clip.name}
                          </span>
                          <span className="w-[180px] shrink-0 text-[12px] font-medium tracking-[-0.24px] text-[#c4c4c4]">
                            {clip.at}
                          </span>
                          <EllipsisVertical size={16} className="text-[#c4c4c4]" />
                        </div>
                        <div className="flex items-center px-[12px] py-[10px]">
                          <GripVertical size={16} className="text-[#434343]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 촬영 정보 없음 */}
        <section className="flex w-[354px] shrink-0 flex-col border-l border-t border-[#434343]">
          <div className="flex h-[96px] shrink-0 flex-col justify-between border-b border-[#434343] bg-[#262626] py-[12px]">
            <div className="flex items-center justify-between px-[20px]">
              <span className="flex items-center gap-[10px]">
                <span className="truncate text-[16px] font-semibold tracking-[-0.32px] text-white">
                  촬영 정보 없음
                </span>
                <Info size={16} className="text-[#9d9d9d]" />
              </span>
              <span className="shrink-0 text-[14px] font-medium tracking-[-0.28px] text-[#c4c4c4]">
                영상 {unplaced}개
              </span>
            </div>
            <div className="flex items-center justify-between px-[20px]">
              <span className="text-[12px] font-medium tracking-[-0.24px] text-[#c4c4c4]">
                이곳 영상들은 분석에 포함되지 않아요.
              </span>
              <span className="rounded-[8px] border border-[#f5f5f5] px-[10px] py-[8px] text-[12px] font-semibold tracking-[-0.24px] text-[#f5f5f5]">
                여러 개 선택
              </span>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            {UNPLACED.slice(0, unplaced).map((clip) => (
              <div key={clip.name} className="clip-in flex items-center">
                <Thumb img={clip.img} len={clip.len} w={120} h={68} />
                <div className="flex min-w-0 flex-1 items-center gap-[12px] py-[10px] pl-[16px] pr-[12px]">
                  <span className="min-w-0 flex-1 truncate text-[14px] font-medium tracking-[-0.28px] text-white">
                    {clip.name}
                  </span>
                  <EllipsisVertical size={16} className="text-[#c4c4c4]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* UploadPanel, docked bottom-right while the batch is in flight. */}
      {staged > 0 && uploading && (
        <section className="absolute bottom-[30px] right-[30px] w-[319px] overflow-hidden rounded-[10px] bg-[#262626] shadow-[2px_2px_20px_0px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-[16px] bg-[#555555] p-[16px]">
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium tracking-[-0.28px] text-white">
              영상 {CLIP_TOTAL}개 업로드 중
            </span>
            <ChevronUp size={20} className="text-white" />
            <X size={20} className="text-white" />
          </div>
          <div className="space-y-1 px-[16px] pt-[12px]">
            <div className="flex items-center justify-between text-[11px] tracking-[-0.22px] text-[#9d9d9d]">
              {/* floor, not round: a bar must never read 100% while bytes move. */}
              <span>전체 업로드 {Math.floor((staged / CLIP_TOTAL) * 100)}%</span>
              <span>약 {Math.max(5, (CLIP_TOTAL - staged) * 6)}초 남음</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#555555]">
              <div
                className="h-full rounded-full bg-[#ff7a66] transition-[width] duration-300 ease-out"
                style={{ width: `${(staged / CLIP_TOTAL) * 100}%` }}
              />
            </div>
          </div>
          <ul>
            {[...DAYS[0].clips, ...DAYS[1].clips, ...UNPLACED]
              .slice(Math.max(0, staged - 3), staged)
              .map((row, i, rows) => {
                const done = i < rows.length - 1 || !uploading
                return (
                  <li key={row.name} className="flex items-center gap-[10px] p-[16px]">
                    <span className="min-w-0 flex-1 truncate text-[13px] tracking-[-0.26px] text-white">
                      {row.name}
                    </span>
                    {!done && (
                      <span className="shrink-0 text-right text-[12px] tracking-[-0.24px] text-[#ff7a66]">
                        68%
                      </span>
                    )}
                    {done ? (
                      <span className="grid size-[24px] shrink-0 place-items-center rounded-full bg-[#00a95e]">
                        <Check size={14} strokeWidth={3} className="text-white" />
                      </span>
                    ) : (
                      <LoaderCircle
                        size={24}
                        className="shrink-0 animate-spin text-[#ff7a66] motion-reduce:animate-none"
                      />
                    )}
                  </li>
                )
              })}
          </ul>
        </section>
      )}
    </>
  )
}

/* ───────────── [03-7] 분석을 시작할까요? — the credits gate ───────────── */

function CreditsDialog({ mode, picked, themeRef, chipRefs, confirmRef, pressed }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="flex w-[455px] flex-col items-start overflow-hidden rounded-[10px] bg-[#262626] shadow-[2px_2px_20px_0px_rgba(0,0,0,0.25)]">
        <div className="flex w-full items-center p-[20px]">
          <h2 className="flex-1 text-[16px] font-semibold tracking-[-0.32px] text-white">
            분석을 시작할까요?
          </h2>
        </div>

        <div className="flex w-full flex-col px-[20px] pb-[10px] pt-[10px]">
          <div className="flex flex-col items-start gap-[4px]">
            <p className="text-[24px] font-semibold tracking-[-0.48px] text-[#ff7a66]">
              {CREDIT_COST} 크레딧 사용
            </p>
            <p className="flex items-center gap-[4px] whitespace-nowrap px-[2px] text-[12px] font-medium tracking-[-0.24px] text-[#d9d9d9]">
              <span>{PLACED_DURATION}</span>
              <span>·</span>
              <span>클립 {PLACED_TOTAL}개</span>
              <span>·</span>
              <span>잔여 {CREDIT_BALANCE - CREDIT_COST} 크레딧</span>
            </p>
          </div>

          <div className="mt-[30px] flex w-full flex-col gap-[10px]">
            {[
              {
                value: 'date',
                title: '날짜순 만들기',
                desc: '정리된 날짜 순서 그대로 영상을 분석해요.',
              },
              {
                value: 'theme',
                title: '테마로 만들기',
                desc: '원하는 테마의 장면만 모아줘요.',
              },
            ].map((opt) => {
              const on = mode === opt.value
              return (
                <div
                  key={opt.value}
                  ref={opt.value === 'theme' ? themeRef : undefined}
                  className={`flex w-full flex-col rounded-[8px] border px-[20px] py-[14px] transition-colors ${
                    on ? 'border-[#ff7a66]' : 'border-[#434343]'
                  }`}
                >
                  <div className="flex items-start gap-[10px]">
                    <span
                      className={`mt-[1px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        on ? 'border-[#ff7a66]' : 'border-[#434343]'
                      }`}
                    >
                      {on && <span className="h-[10px] w-[10px] rounded-full bg-[#ff7a66]" />}
                    </span>
                    <span className="flex flex-col gap-[2px]">
                      <span className="text-[14px] font-semibold tracking-[-0.28px] text-white">
                        {opt.title}
                      </span>
                      <span className="text-[12px] tracking-[-0.24px] text-[#9d9d9d]">
                        {opt.desc}
                      </span>
                    </span>
                  </div>
                  {opt.value === 'theme' && (
                    <div className="mt-[10px] flex flex-wrap gap-[8px] pl-[30px]">
                      {THEMES.map((theme) => {
                        const chosen = picked.includes(theme)
                        return (
                          <span
                            key={theme}
                            ref={(el) => {
                              chipRefs.current[theme] = el
                            }}
                            className={`flex h-[26px] shrink-0 items-center rounded-full px-[10px] text-[12px] font-medium tracking-[-0.24px] transition-colors ${
                              chosen ? 'bg-[#ff7a66] text-[#2b0f06]' : 'bg-[#434343] text-[#c4c4c4]'
                            }`}
                          >
                            {theme}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex w-full items-start gap-[10px] p-[20px]">
          <span className="flex h-[38px] w-[60px] shrink-0 items-center justify-center rounded-[8px] border border-[#f5f5f5] text-[12px] font-semibold tracking-[-0.24px] text-[#f5f5f5]">
            취소
          </span>
          {/* A 테마 run with nothing chosen has no meaning, so the confirm waits. */}
          <span
            ref={confirmRef}
            style={pressStyle(pressed)}
            className={`flex h-[38px] flex-1 items-center justify-center rounded-[8px] bg-[#ff7a66] text-[12px] font-semibold tracking-[-0.24px] text-[#2b0f06] transition-opacity ${
              mode === 'theme' && picked.length === 0 ? 'opacity-50' : 'opacity-100'
            }`}
          >
            분석하기
          </span>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────── [04-0] 분석 중 ───────────────────── */

function AnalysisView() {
  return (
    <div className="flex h-full flex-col px-[30px] py-[40px]">
      <div className="mx-auto flex w-full max-w-[785px] flex-1 flex-col">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <h1 className="text-[32px] font-semibold leading-[1.48] tracking-[-0.64px] text-white">
              영상을 분석하고 있어요
            </h1>
            <p className="text-[20px] leading-[1.48] tracking-[-0.4px] text-[#c4c4c4]">
              앞서 선택한 방식에 맞게 장면을 선별하고 있습니다.
            </p>
          </div>
          {/* Button size="lg", outline: rule and label on the same neutral/50. */}
          <span className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[8px] border border-[#f5f5f5] px-4 text-[14px] font-semibold tracking-[-0.28px] text-[#f5f5f5]">
            <Bell size={20} strokeWidth={1.8} />
            완료되면 알림 받기
          </span>
        </div>

        {/* The progress card: 40px under the block, on a raised panel. The stage
            stands alone while the job reports no fraction yet — what AnalysisView
            draws for an indeterminate reading. */}
        <div className="mt-10 flex flex-col gap-2.5 rounded-[10px] bg-[#434343] p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[18px] tracking-[-0.36px] text-[#ff7a66]">영상 준비 중</p>
            <p className="text-[14px] tracking-[-0.28px] text-[#c4c4c4]">약 3분 남음</p>
          </div>
          {/* `bg-track`, not the default — this bar sits ON a raised surface. */}
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-[#555555]">
            <span className="hl-indeterminate absolute inset-y-0 w-[32%] rounded-full bg-[#ff7a66]" />
          </div>
        </div>

        <span className="mt-auto inline-flex items-center gap-2 self-start pb-3 pt-2.5 text-[14px] font-semibold tracking-[-0.28px] text-[#ff7a66]">
          <ArrowLeft size={20} strokeWidth={1.8} />
          분석 취소
        </span>
      </div>
    </div>
  )
}


/* ───────────── AI 블러 마법사 — the editor's 블러 panel ─────────────
   PanelView titled AI 블러, the 인원수 선택 · AI 분석 · 블러 적용 breadcrumb, and
   one body per stage. The editor is a shadcn app, so
   its tokens land on heimlog's ramp: background #262626, muted #434343, border
   #434343, foreground #f5f5f5, muted-foreground #9d9d9d, primary #ff7a66. */

const BLUR_STAGES = [
  // The app's own `blurStageCount` reads 인물 수; this demo says 인원수 선택.
  { id: 'count', label: '인원수 선택' },
  { id: 'analyse', label: 'AI 분석' },
  { id: 'apply', label: '블러 적용' },
]

function Breadcrumb({ current }) {
  const activeIndex = BLUR_STAGES.findIndex((st) => st.id === current)
  return (
    <ol className="flex items-center gap-1.5 px-3 pb-2 pt-3">
      {BLUR_STAGES.map((stage, index) => (
        <li key={stage.id} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-[9px] text-[#9d9d9d]/50">›</span>}
          {/* PAST stages stay legible rather than going dim: this says where the
              user is in a sequence, not which controls are disabled. */}
          <span
            className={`whitespace-nowrap text-[9px] ${
              index <= activeIndex ? 'text-[#ff7a66]' : 'text-[#9d9d9d]'
            }`}
          >
            {stage.label}
          </span>
        </li>
      ))}
    </ol>
  )
}

function CheckBox({ on }) {
  return (
    <span
      className={`absolute bottom-0.5 right-0.5 flex size-3 items-center justify-center rounded-[3px] border ${
        on ? 'border-[#ff7a66] bg-[#ff7a66] text-[#2b0f06]' : 'border-[#434343] bg-[#262626]'
      }`}
    >
      {on && (
        <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor">
          <path d="M2.5 6.2 4.8 8.5 9.5 3.8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </span>
  )
}

function BlurPanel({ stage, count, percent, applied, chipRefs, nextRef, pressed }) {
  const toApply = CHECKED.length
  return (
    <div className={`flex ${PANEL_BOX} flex-col overflow-hidden rounded-[10px] border border-[#434343] bg-[#262626]`}>
      {/* PanelView header. The app draws 블러 here and puts AI 블러 / 직접 블러 on
          a tab bar under it; at this size those two rows cost 88 of a 380 box —
          enough to push the picker's own buttons past the bottom edge — so the
          header carries the name the run is actually in. */}
      <div className="flex h-11 shrink-0 items-center border-b border-[#434343] pl-3 pr-2">
        <span className="text-[14px] text-[#9d9d9d]">AI 블러</span>
      </div>

      <Breadcrumb current={stage === 'count' ? 'count' : stage === 'analyse' ? 'analyse' : 'apply'} />

      {stage === 'count' && (
        <div className="flex flex-col">
          <div className="px-3">
            <h2 className="text-[12px] font-bold text-[#f5f5f5]">
              이 영상에 나오는 주요 인물은 몇 명인가요?
            </h2>
            <p className="mt-1 text-[10px] leading-snug text-[#9d9d9d]">
              가려야 할 얼굴을 더 정확하게 찾는 데 사용해요.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['0', '1', '2', '3', '4', '5+'].map((label, i) => {
                const on = count === i
                return (
                  <span
                    key={label}
                    ref={(el) => {
                      chipRefs.current[i] = el
                    }}
                    className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] transition-colors ${
                      on
                        ? 'border-[#ff7a66] bg-[#ff7a66] text-[#2b0f06]'
                        : 'border-[#434343] text-[#9d9d9d]'
                    }`}
                  >
                    {label}
                  </span>
                )
              })}
            </div>
          </div>
          <div className="flex justify-end px-3 py-3">
            {/* Inert until a chip is chosen — `0` is an answer, not an absence. */}
            <span
              ref={nextRef}
              style={pressStyle(pressed === 'blurNext')}
              className={`inline-flex h-7 items-center rounded-[6px] bg-[#ff7a66] px-3 text-[11px] font-semibold text-[#2b0f06] transition-opacity ${
                count === null ? 'opacity-50' : 'opacity-100'
              }`}
            >
              다음
            </span>
          </div>
        </div>
      )}

      {stage === 'analyse' && (
        <div className="px-3 pb-4">
          <h2 className="text-[12px] font-bold text-[#f5f5f5]">얼굴을 찾고 있어요</h2>
          <p className="mt-1 text-[10px] leading-snug text-[#9d9d9d]">
            알려주신 인물 {BLUR_COUNT}명을 기준으로 찾고 있어요.
          </p>
          <div className="mt-3 rounded-[6px] border border-[#434343] p-2.5">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] font-semibold text-[#ff7a66]">{percent}%</span>
                <span className="text-[10px] font-semibold text-[#ff7a66]">분석 중</span>
              </div>
              <span className="text-[9px] text-[#9d9d9d]">약 2분 남음</span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#434343]">
              <div
                className="h-full rounded-full bg-[#ff7a66] transition-[width] duration-100 ease-linear"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {(stage === 'pick' || stage === 'applied') && (
        <div className="flex flex-col">
          <div className="px-3">
            {stage === 'pick' ? (
              <>
                <h2 className="text-[12px] font-bold text-[#f5f5f5]">가릴 얼굴을 선택해 주세요</h2>
                <p className="mt-1 text-[10px] leading-snug text-[#9d9d9d]">
                  주요 인물로 분석된 {PROTAGONISTS}명은 자동으로 제외됐어요.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-[12px] font-bold text-[#f5f5f5]">블러를 적용했어요</h2>
                <p className="mt-1 text-[10px] leading-snug text-[#9d9d9d]">
                  <span className="block">미리보기에서 블러를 바로 확인할 수 있어요.</span>
                  <span className="block">수정에서 대상을 다시 고를 수 있어요.</span>
                </p>
              </>
            )}

            {stage === 'pick' && (
              <div className="mt-3 flex items-center justify-between">
                {/* The tri-state control, on `some` — most of the grid is ticked
                    but not all of it, which the design draws as a minus. */}
                <span className="flex items-center gap-1.5">
                  <span className="flex size-3 items-center justify-center overflow-hidden rounded-[3px] bg-[#ff7a66] text-[#2b0f06]">
                    <span className="h-px w-1.5 bg-current" />
                  </span>
                  <span className="text-[10px] text-[#9d9d9d]">전체 선택</span>
                </span>
              </div>
            )}

            <div className="mt-2.5 grid grid-cols-5 gap-x-[5px] gap-y-[15px]">
              {FACES.map((face) => {
                const on = CHECKED.includes(face.id)
                const blurred = applied && on
                // EVERY TILE CARRIES A BOX, the auto-excluded pair included — the
                // app omits it there, on the reasoning that a control which can
                // never be ticked invites a click that can never work. Here the
                // grid has to read at a glance as one row of the same thing, so
                // the pair keeps its box and says its piece through the dimming.
                return (
                  <span
                    key={face.id}
                    className={`relative block size-[50px] rounded-[9px] border ${
                      on ? 'border-[#ff7a66]' : 'border-transparent'
                    } ${face.excluded ? 'opacity-60' : ''}`}
                  >
                    <span className="block size-full overflow-hidden rounded-[9px] bg-[#434343]">
                      <img
                        src={face.src}
                        alt=""
                        className="size-full object-cover transition-[filter] duration-500"
                        style={{ filter: blurred ? 'blur(5px)' : 'none' }}
                      />
                    </span>
                    <CheckBox on={on} />
                  </span>
                )
              })}
            </div>
          </div>

          <div className="px-3 py-3">
            {stage === 'pick' ? (
              <>
                <p className="text-[10px] font-bold text-[#f5f5f5]">{toApply}명에게 블러 적용</p>
                <p className="text-[9px] text-[#9d9d9d]">적용 후에도 수정에서 다시 바꿀 수 있어요.</p>
                <div className="mt-2 flex justify-end gap-1.5">
                  <span className="inline-flex h-7 items-center rounded-[6px] border border-[#f5f5f5] px-3 text-[11px] font-semibold text-[#f5f5f5]">
                    이전
                  </span>
                  <span
                    ref={nextRef}
                    style={pressStyle(pressed === 'apply')}
                    className="inline-flex h-7 items-center rounded-[6px] bg-[#ff7a66] px-3 text-[11px] font-semibold text-[#2b0f06]"
                  >
                    다음
                  </span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}


/* ───────────── AI 자막 — the editor's 스크립트 panel ─────────────
   PanelView titled AI 자막 with the 고급 자막 pill as its action, then one card
   per caption: ordinal + range, the editable line, and the word ruler whose
   seams are the cut points. Joining a caption to the next one is drawn ON THE
   SEAM between the two cards, because the action is about a pair. */

function ScriptPanel({
  cards,
  selected,
  wordHover,
  seamHover,
  wordRefs,
  seamRefs,
  pressed,
}) {
  return (
    <div className={`flex ${PANEL_BOX} flex-col overflow-hidden rounded-[10px] border border-[#434343] bg-[#262626]`}>
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#434343] pl-3 pr-2">
        <span className="text-[14px] text-[#9d9d9d]">AI 자막</span>
        {/* The glyph is the editor's own OcChatAiIcon — a speech bubble with a
            sparkle, drawn in primary while the label stays foreground, which is
            what all three of the button's states do. */}
        <span className="flex h-[18px] shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full border border-[#ff7a66] bg-[#262626] px-2 text-[8px] leading-[1.48] tracking-[-0.16px] text-[#f5f5f5]">
          <span className="flex shrink-0 text-[#ff7a66]">
            <svg viewBox="0 0 8 8" className="size-2" fill="none" aria-hidden>
              <path
                d="M3.99996 0.666707C4.3003 0.666707 4.5913 0.706707 4.8683 0.781374C4.69525 0.872245 4.55262 1.01184 4.45805 1.18289C4.36349 1.35395 4.32112 1.54897 4.33619 1.74384C4.35126 1.93871 4.42311 2.1249 4.54286 2.27938C4.66261 2.43386 4.825 2.54986 5.00996 2.61304L5.13596 2.65604C5.18423 2.67249 5.22809 2.6998 5.26415 2.73586C5.30021 2.77192 5.32751 2.81577 5.34396 2.86404L5.3873 2.99004C5.45058 3.17482 5.56659 3.33702 5.721 3.45661C5.87542 3.57621 6.06147 3.64797 6.2562 3.66304C6.45094 3.67811 6.64582 3.63582 6.81679 3.5414C6.98776 3.44697 7.12734 3.30455 7.2183 3.13171C7.29466 3.41483 7.33332 3.7068 7.3333 4.00004C7.3333 5.84104 5.84096 7.33337 3.99996 7.33337C3.36996 7.33337 2.77996 7.15837 2.2773 6.85437L1.26663 7.15137C1.2086 7.16845 1.14705 7.16957 1.08843 7.15463C1.02982 7.13968 0.976319 7.10923 0.933548 7.06645C0.890778 7.02368 0.86032 6.97018 0.845377 6.91157C0.830434 6.85296 0.831557 6.7914 0.848629 6.73337L1.14596 5.72271C0.831647 5.20313 0.665855 4.60729 0.666629 4.00004C0.666629 2.15904 2.15896 0.666707 3.99996 0.666707ZM2.8333 3.50004C2.70069 3.50004 2.57351 3.55272 2.47974 3.64649C2.38597 3.74026 2.3333 3.86743 2.3333 4.00004C2.3333 4.13265 2.38597 4.25983 2.47974 4.35359C2.57351 4.44736 2.70069 4.50004 2.8333 4.50004C2.9659 4.50004 3.09308 4.44736 3.18685 4.35359C3.28062 4.25983 3.3333 4.13265 3.3333 4.00004C3.3333 3.86743 3.28062 3.74026 3.18685 3.64649C3.09308 3.55272 2.9659 3.50004 2.8333 3.50004ZM5.16663 3.50004C5.03402 3.50004 4.90684 3.55272 4.81308 3.64649C4.71931 3.74026 4.66663 3.86743 4.66663 4.00004C4.66663 4.13265 4.71931 4.25983 4.81308 4.35359C4.90684 4.44736 5.03402 4.50004 5.16663 4.50004C5.29924 4.50004 5.42641 4.44736 5.52018 4.35359C5.61395 4.25983 5.66663 4.13265 5.66663 4.00004C5.66663 3.86743 5.61395 3.74026 5.52018 3.64649C5.42641 3.55272 5.29924 3.50004 5.16663 3.50004ZM6.3333 0.333374C6.40283 0.333402 6.47061 0.355172 6.52715 0.395637C6.5837 0.436102 6.62617 0.493236 6.64863 0.559041L6.69196 0.685041C6.79196 0.978041 7.02196 1.20837 7.3153 1.30837L7.44096 1.35137C7.50669 1.3739 7.56374 1.4164 7.60414 1.47294C7.64453 1.52948 7.66624 1.59722 7.66624 1.66671C7.66624 1.73619 7.64453 1.80394 7.60414 1.86048C7.56374 1.91701 7.50669 1.95952 7.44096 1.98204L7.31496 2.02537C7.02196 2.12537 6.79163 2.35537 6.69163 2.64871L6.64863 2.77437C6.6261 2.84011 6.5836 2.89716 6.52706 2.93755C6.47053 2.97794 6.40278 2.99965 6.3333 2.99965C6.26381 2.99965 6.19606 2.97794 6.13953 2.93755C6.08299 2.89716 6.04049 2.84011 6.01796 2.77437L5.97463 2.64837C5.92526 2.50375 5.84341 2.37237 5.73535 2.26432C5.6273 2.15626 5.49592 2.07441 5.3513 2.02504L5.22563 1.98204C5.1599 1.95952 5.10285 1.91701 5.06246 1.86048C5.02206 1.80394 5.00035 1.73619 5.00035 1.66671C5.00035 1.59722 5.02206 1.52948 5.06246 1.47294C5.10285 1.4164 5.1599 1.3739 5.22563 1.35137L5.35163 1.30804C5.64463 1.20804 5.87496 0.978041 5.97496 0.684707L6.01796 0.559041C6.04042 0.493236 6.08289 0.436102 6.13944 0.395637C6.19598 0.355172 6.26376 0.333402 6.3333 0.333374Z"
                fill="currentColor"
              />
            </svg>
          </span>
          고급 자막 사용하기
        </span>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2">
        {cards.map((card, index) => {
          const isLast = index === cards.length - 1
          const pairLit = seamHover !== null && (seamHover === card.id || seamHover === cards[index - 1]?.id)
          return (
            <div
              key={card.id}
              className={`relative flex gap-2 rounded-[4px] border bg-[#303030] p-2 transition-colors ${
                pairLit
                  ? 'border-dashed border-[#ff7a66]'
                  : selected === card.id
                    ? 'border-[#ff7a66]'
                    : 'border-[#434343]'
              }`}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] tabular-nums text-[#f5f5f5]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[12px] tabular-nums text-[#9d9d9d]">
                    {mmss(card.from)} - {mmss(card.to)}
                  </span>
                </div>

                {/* The editable line. The border lives on the wrapper so the
                    field's own scrollbar sits inside the focus ring. */}
                <div className="flex overflow-hidden rounded-[6px] border border-[#434343] bg-[#3a3a3a] pr-1.5">
                  <span className="block px-2 py-1.5 text-[13px] leading-4 text-[#f5f5f5]">
                    {card.words.join(' ')}
                  </span>
                </div>

                {/* The word ruler: a seam between each measured pair. */}
                <div className="flex flex-wrap items-center gap-y-1 text-[12px] leading-none">
                  {card.words.map((word, i) => {
                    const key = `${card.id}:${i}`
                    const hot = wordHover === key
                    return (
                      <span key={key} className="contents">
                        {i > 0 && (
                          <span
                            ref={(el) => {
                              wordRefs.current[key] = el
                            }}
                            className="relative px-1"
                          >
                            {/* The seam at rest: 1 × 12, which is what the design draws. */}
                            <span
                              className={`block h-3 w-px shrink-0 transition-colors ${
                                hot ? 'bg-[#ff7a66]' : 'bg-[#434343]'
                              }`}
                            />
                            {/* figma 2457:44787, the editor's own OcRazorBladeIcon.
                                It floats ABOVE the seam with its cutting tip on the
                                cut, so the row never reflows as the pointer crosses. */}
                            <svg
                              viewBox="0 0 25 25"
                              width="24"
                              height="24"
                              className="pointer-events-none absolute bottom-full left-1/2 mb-1 text-[#ff7a66] transition-opacity"
                              style={{ opacity: hot ? 1 : 0 }}
                              fill="none"
                              aria-hidden
                            >
                              <path
                                d="M18.8278 2.20312L0.63623 12.7058L1.62964 14.427L19.8212 3.92432L18.8278 2.20312ZM20.2774 4.71475L2.08594 15.2174L2.48413 15.9071C3.27368 15.6518 4.13745 15.8784 4.6936 16.4899L6.08667 15.6857L6.54297 16.4763L5.1499 17.2803C5.40088 18.0674 5.16538 18.9291 4.5502 19.4853L4.94844 20.1749L23.1399 9.67227L22.7417 8.98262C21.9528 9.23721 21.0884 9.01011 20.5322 8.39971L19.1392 9.20391L18.6829 8.41348L20.0759 7.60928C19.8246 6.82148 20.0588 5.95889 20.6757 5.40293L20.2774 4.71475ZM16.2186 9.14893C16.4338 9.14336 16.6465 9.19599 16.8342 9.30127C17.0219 9.40655 17.1777 9.56057 17.2852 9.74707C17.615 10.3184 17.4201 11.0484 16.8488 11.3782C16.4177 11.6271 15.8976 11.5751 15.5259 11.2897L14.4378 11.9169C14.6755 12.7371 14.3349 13.6435 13.562 14.0897C12.7888 14.5361 11.8341 14.378 11.2427 13.7616L10.1577 14.3888C10.2189 14.8535 10.0016 15.3299 9.57031 15.579C8.99902 15.9088 8.26904 15.7138 7.93916 15.1425C7.60933 14.5712 7.80586 13.8413 8.37715 13.5114C8.55561 13.4083 8.74912 13.3561 8.9416 13.3512C9.21571 13.3443 9.48392 13.4315 9.70156 13.5983L10.7864 12.9728C10.5488 12.1522 10.8895 11.2446 11.6623 10.7983C11.9464 10.6343 12.2546 10.5515 12.561 10.5436C12.8254 10.5368 13.0884 10.5853 13.333 10.6859C13.5776 10.7866 13.7985 10.9371 13.9816 11.1279L15.0681 10.5008C15.0059 10.0356 15.2223 9.5583 15.654 9.30908C15.8325 9.20605 16.0261 9.15381 16.2186 9.14883L16.2186 9.14893ZM23.5962 10.4627L5.40464 20.9653L6.398 22.6865L24.5896 12.1839L23.5962 10.4627Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        )}
                        <span className="text-[#9d9d9d]">{word}</span>
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* JOINING THIS CAPTION TO THE NEXT, drawn on the seam between the
                  two cards. Absent on the last card, which has no partner. */}
              {!isLast && (
                <span
                  ref={(el) => {
                    seamRefs.current[card.id] = el
                  }}
                  className="absolute -bottom-3 left-0 z-10 flex h-4 w-full items-center justify-center"
                >
                  <span
                    style={{
                      opacity: seamHover === card.id ? 1 : 0,
                      transform: pressed === `merge:${card.id}` ? 'scale(0.96)' : 'scale(1)',
                      transition: 'opacity 200ms ease-out, transform 140ms ease-out',
                    }}
                    className="flex h-6 items-center gap-[5px] whitespace-nowrap rounded-full bg-[#ff7a66] px-[11px] text-[11px] font-medium leading-[1.48] tracking-[-0.22px] text-[#2b0f06] shadow-sm"
                  >
                    <svg viewBox="0 0 12 12" className="size-3 shrink-0" fill="none" aria-hidden>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6 0.5C2.9625 0.5 0.5 2.9625 0.5 6C0.5 9.0375 2.9625 11.5 6 11.5C9.0375 11.5 11.5 9.0375 11.5 6C11.5 2.9625 9.0375 0.5 6 0.5ZM6.5 8C6.5 8.2761 6.2761 8.5 6 8.5C5.7239 8.5 5.5 8.2761 5.5 8V6.5H4C3.7239 6.5 3.5 6.2761 3.5 6C3.5 5.7239 3.7239 5.5 4 5.5H5.5V4C5.5 3.7239 5.7239 3.5 6 3.5C6.2761 3.5 6.5 3.7239 6.5 4V5.5H8C8.2761 5.5 8.5 5.7239 8.5 6C8.5 6.2761 8.2761 6.5 8 6.5H6.5V8Z"
                        fill="currentColor"
                      />
                    </svg>
                    합치기
                  </span>
                </span>
              )}
            </div>
          )
        })}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#262626] to-transparent"
        />
      </div>
    </div>
  )
}

/* ─────────────────────────── the run ─────────────────────────── */

export default function HeimlogDemo() {
  const [view, setView] = useState('projects')
  const [staged, setStaged] = useState(0)
  const [mode, setMode] = useState('date')
  const [picked, setPicked] = useState([])
  // ── AI 블러 마법사 ──
  const [blurCount, setBlurCount] = useState(null)
  const [blurPercent, setBlurPercent] = useState(0)
  const [blurApplied, setBlurApplied] = useState(false)
  // ── AI 자막 ──
  const [cards, setCards] = useState(SCRIPT)
  const [selectedCard, setSelectedCard] = useState(null)
  const [wordHover, setWordHover] = useState(null)
  const [seamHover, setSeamHover] = useState(null)
  const [cursor, setCursor] = useState({ x: 720, y: 420, visible: false, dur: 700 })
  const [pressed, setPressed] = useState(null)
  // Intro zoom, like the sibling demos: start close on the CTA, pull back once
  // it is pressed and there is a whole screen worth looking at.
  const [zoom, setZoom] = useState(1.35)
  // The intro zoom sits on the CTA, two thirds down the empty-state screen. The
  // panel zoom has to sit on the CENTRE instead: the panel is centred in the
  // frame, and magnifying it about a point below the middle pushes its header up
  // and out of the visible crop — which is what was slicing the top off it.
  //
  // Only ever changed while the scale is 1 or the screen behind it is being
  // swapped, so the origin never moves under a transform the viewer can see.
  const [origin, setOrigin] = useState('50% 62%')

  const rootRef = useRef(null)
  const startBtnRef = useRef(null)
  const analyzeBtnRef = useRef(null)
  const themeRef = useRef(null)
  const chipRefs = useRef({})
  const confirmRef = useRef(null)
  const countChipRefs = useRef({})
  const blurNextRef = useRef(null)
  const wordRefs = useRef({})
  const seamRefs = useRef({})

  // Where an element sits in the mockup's own 1440-wide coordinates. The frame
  // scales the whole thing down (and the intro zoom scales it again), so the
  // measured box has to be divided back out or the cursor lands short.
  const aim = (el, dur = 650, dx = 0, dy = 0) => {
    const root = rootRef.current
    if (!el || !root) return
    const box = el.getBoundingClientRect()
    const frame = root.getBoundingClientRect()
    const scale = frame.width / root.offsetWidth || 1
    setCursor({
      x: (box.left + box.width / 2 - frame.left) / scale + dx,
      y: (box.top + box.height / 2 - frame.top) / scale + dy,
      visible: true,
      dur,
    })
  }

  useEffect(() => {
    let cancelled = false
    const timers = []
    const wait = (ms) => new Promise((resolve) => timers.push(setTimeout(resolve, ms)))
    // A press is the cursor arriving, the control dipping, and the state
    // changing on the way back up — never a state change on its own.
    const press = async (key, act) => {
      setPressed(key)
      await wait(180)
      if (cancelled) return
      act()
      setPressed(null)
      await wait(120)
    }

    async function run() {
      while (!cancelled) {
        // 0. reset — 내 프로젝트, empty, zoomed in on the CTA
        setView('projects')
        setStaged(0)
        setMode('date')
        setPicked([])
        setBlurCount(null)
        setBlurPercent(0)
        setBlurApplied(false)
        setCards(SCRIPT)
        setSelectedCard(null)
        setWordHover(null)
        setSeamHover(null)
        setPressed(null)
        setZoom(1.35)
        setOrigin('50% 62%')
        setCursor((c) => ({ ...c, visible: false }))
        await wait(900)
        if (cancelled) return

        // 1. 새 프로젝트 시작
        aim(startBtnRef.current, 750)
        await wait(950)
        if (cancelled) return
        await press('start', () => {
          setView('upload')
          setZoom(1)
        })
        setCursor((c) => ({ ...c, visible: false }))
        await wait(500)
        if (cancelled) return

        // 2. the clips upload in, one after another, and the credit figure
        //    climbs with them
        for (let i = 1; i <= CLIP_TOTAL; i++) {
          if (cancelled) return
          setStaged(i)
          await wait(190)
        }
        await wait(650)
        if (cancelled) return

        // 3. 분석 시작
        aim(analyzeBtnRef.current, 700)
        await wait(900)
        if (cancelled) return
        await press('analyze', () => setView('dialog'))
        setCursor((c) => ({ ...c, visible: false }))
        await wait(600)
        if (cancelled) return

        // 4. 테마로 만들기, then the two chips
        aim(themeRef.current, 650, -180, -14)
        await wait(800)
        if (cancelled) return
        await press('mode', () => setMode('theme'))
        await wait(400)
        for (const theme of PICKS) {
          if (cancelled) return
          aim(chipRefs.current[theme], 520)
          await wait(620)
          if (cancelled) return
          await press(theme, () => setPicked((p) => [...p, theme]))
          await wait(180)
        }
        await wait(400)
        if (cancelled) return

        // 5. 분석하기 → 분석 중
        aim(confirmRef.current, 600)
        await wait(750)
        if (cancelled) return
        await press('confirm', () => setView('analysis'))
        setCursor((c) => ({ ...c, visible: false }))
        await wait(2000)
        if (cancelled) return

        // 6. into the editor's AI 블러 panel, zoomed in — the wizard's type is
        //    the editor's own 10-12px, which the demo box would otherwise shrink
        //    past reading size.
        setView('blurCount')
        setOrigin('50% 50%')
        // 1.45: the crop shows 651/zoom of the mockup, so a 420-tall panel keeps
        // ~14px clear at both ends. 10px type still lands near 12.5 on screen.
        setZoom(1.45)
        await wait(1100)
        if (cancelled) return

        // 6a. 인물 수
        aim(countChipRefs.current[BLUR_COUNT], 650)
        await wait(820)
        if (cancelled) return
        await press('count', () => setBlurCount(BLUR_COUNT))
        await wait(380)
        aim(blurNextRef.current, 600)
        await wait(720)
        if (cancelled) return
        await press('blurNext', () => setView('blurAnalysing'))
        setCursor((c) => ({ ...c, visible: false }))

        // 6b. AI 분석 — the bar walks up to full
        for (let pct = 0; pct <= 100; pct += 4) {
          if (cancelled) return
          setBlurPercent(pct)
          await wait(36)
        }
        await wait(520)
        if (cancelled) return

        // 6c. 블러 적용 — the grid opens on 전체 선택, with the two 주요 인물 held
        //     out of it, so the stage is read rather than clicked through
        setView('blurPick')
        await wait(1500)
        if (cancelled) return
        aim(blurNextRef.current, 600)
        await wait(720)
        if (cancelled) return
        // The blur lands on the picked faces first, then the panel moves on —
        // so the moment it is applied is visible rather than skipped past.
        await press('apply', () => setBlurApplied(true))
        setCursor((c) => ({ ...c, visible: false }))
        await wait(1000)
        if (cancelled) return
        setView('blurApplied')
        await wait(2400)
        if (cancelled) return

        // 7. the AI 자막 panel, at the same magnification.
        setView('captions')
        await wait(1300)
        if (cancelled) return

        // 7a. 여기서 자막 나누기 — the seam between two measured words
        {
          const key = `${SPLIT_CARD}:${SPLIT_AT}`
          aim(wordRefs.current[key], 700, 0, -6)
          await wait(820)
          if (cancelled) return
          setWordHover(key)
          await wait(650)
          if (cancelled) return
          await press(`split:${key}`, () => {
            setWordHover(null)
            setCards((list) =>
              list.flatMap((card) => {
                if (card.id !== SPLIT_CARD) return card
                // The cut lands on the boundary the seam names; the halves take
                // the span either side of it.
                const at = card.from + ((card.to - card.from) * SPLIT_AT) / card.words.length
                return [
                  { ...card, id: `${card.id}a`, to: Math.round(at), words: card.words.slice(0, SPLIT_AT) },
                  { ...card, id: `${card.id}b`, from: Math.round(at), words: card.words.slice(SPLIT_AT) },
                ]
              }),
            )
            // The split reveals the half just created, as the panel does.
            setSelectedCard(`${SPLIT_CARD}b`)
          })
          setCursor((c) => ({ ...c, visible: false }))
          await wait(1500)
          if (cancelled) return
        }

        // 7b. 다음 자막과 합치기 — the pill lives on the seam between the pair
        {
          const first = `${SPLIT_CARD}a`
          setSelectedCard(null)
          aim(seamRefs.current[first], 700)
          await wait(780)
          if (cancelled) return
          setSeamHover(first)
          await wait(700)
          if (cancelled) return
          await press(`merge:${first}`, () => {
            setSeamHover(null)
            setCards((list) => {
              const i = list.findIndex((card) => card.id === first)
              if (i < 0) return list
              const a = list[i]
              const b = list[i + 1]
              if (!b) return list
              return [
                ...list.slice(0, i),
                { ...a, id: SPLIT_CARD, to: b.to, words: [...a.words, ...b.words] },
                ...list.slice(i + 2),
              ]
            })
            setSelectedCard(SPLIT_CARD)
          })
          setCursor((c) => ({ ...c, visible: false }))
          await wait(2200)
        }
      }
    }

    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  const railActive = view === 'projects' ? 'mine' : 'new'

  return (
    <div
      className="h-[660px] w-[1440px] overflow-hidden bg-[#262626]"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: origin,
        transition: 'transform 900ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div ref={rootRef} className="relative h-full w-full text-left font-sans text-white">
        <div className="flex h-full">
          <Rail active={railActive} />
          <main className="relative flex min-w-0 flex-1 flex-col">
            {view === 'projects' && (
              <StartView btnRef={startBtnRef} pressed={pressed === 'start'} />
            )}
            {(view === 'upload' || view === 'dialog') && (
              <UploadView
                staged={staged}
                analyzeRef={analyzeBtnRef}
                pressed={pressed === 'analyze'}
              />
            )}
            {view === 'analysis' && <AnalysisView />}
          </main>
        </div>

        {/* The editor's 블러 panel, on its own — the run has zoomed into it. */}
        {view.startsWith('blur') && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#262626]">
            <BlurPanel
              stage={
                view === 'blurCount'
                  ? 'count'
                  : view === 'blurAnalysing'
                    ? 'analyse'
                    : view === 'blurPick'
                      ? 'pick'
                      : 'applied'
              }
              count={blurCount}
              percent={blurPercent}
              applied={blurApplied}
              chipRefs={countChipRefs}
              nextRef={blurNextRef}
              pressed={pressed}
            />
          </div>
        )}

        {/* The editor's AI 자막 panel, at the same magnification. */}
        {view === 'captions' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#262626]">
            <ScriptPanel
              cards={cards}
              selected={selectedCard}
              wordHover={wordHover}
              seamHover={seamHover}
              wordRefs={wordRefs}
              seamRefs={seamRefs}
              pressed={pressed}
            />
          </div>
        )}

        {view === 'dialog' && (
          <CreditsDialog
            mode={mode}
            picked={picked}
            themeRef={themeRef}
            chipRefs={chipRefs}
            confirmRef={confirmRef}
            pressed={pressed === 'confirm'}
          />
        )}

        <FakeCursor x={cursor.x} y={cursor.y} visible={cursor.visible} dur={cursor.dur} />
      </div>
    </div>
  )
}
