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
  Play,
  Copy,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  Check,
  Plus,
  Minus,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenterHorizontal,
  Maximize,
  Trash2,
  Settings,
  SquareSplitHorizontal,
} from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'

// Faithful code build of the Figma "동영상 검색(세로)" screen (node 2289:60619),
// using lucide-react + project design tokens, with a looping demo interaction:
// type a query → results appear → a fake cursor sweeps/scrolls the cards.

const QUERY = '무대 위에서 공연하는 장면'
const QUERY_EN = 'Scene of a performance on stage'
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
const TITLES_EN = [
  '2024_solo_concert_encore_4K',
  'title_track_fancam_original',
  'rehearsal_fullshot_cam2',
  'fanmeeting_opening_performance_highlight_final',
  'music_show_no1_encore_stage',
  'showcase_highlight',
  'world_tour_seoul_day2_ending',
  'backstage_behind_interview',
  'yearend_awards_special_stage_vertical',
  'unit_stage_choreo_dryrun',
  'debut_showcase_title_stage_4K_original_final',
  'live_clip_for_shorts_vertical',
  'concert_opening_intro_VCR',
  'encore_singalong_crowd_reaction',
  'arena_show_drone_shot',
  'stage_lighting_rehearsal_test',
]

const STAGE_IMAGES = Array.from({ length: 16 }, (_, i) => `/assets/stage/stage-${i + 1}.jpg`)
const DEFAULT_PLACEHOLDER = '파일명이나 폴더명으로 찾아보세요 - "마케팅_쇼츠_01"'
const DEFAULT_PLACEHOLDER_EN = 'Search by file or folder name — "marketing_short_01"'

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

function VideoCard({ source, img, title, hovered, shown, index, cardRef, horizontal }) {
  // Both orientations show 4 per row · vertical 9:16, horizontal 16:9.
  const w = horizontal ? 'w-[220px]' : 'w-[200px]'
  const box = horizontal ? 'h-[124px] w-[220px]' : 'h-[337px] w-[200px]'
  return (
    <div
      ref={cardRef}
      className={`flex ${w} flex-col gap-[10px] transition-all duration-500 ease-out`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(12px)',
        transitionDelay: `${shown ? index * 45 : 0}ms`,
      }}
    >
      <div
        className={`relative ${box} overflow-hidden rounded-[10px] border border-neutral-100 bg-neutral-300 transition-shadow duration-300 ${
          hovered ? 'shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)]' : ''
        }`}
      >
        {img ? (
          <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(135deg, #2b313d 0%, #12161e 100%)' }}
          />
        )}
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
        className={`flex ${w} items-start gap-px text-[14px] font-medium tracking-[-0.35px] transition-colors ${
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

// Speaker badge colors (A red, B green) — matches Figma 화자 component.
const SPEAKER_COLOR = { A: '#d53b49', B: '#3fb675' }

function ScriptRow({ speaker, time, text }) {
  return (
    <div className="flex w-full items-start gap-[8px]">
      <div className="flex shrink-0 items-center gap-[6px]">
        <span
          className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full text-[10px] font-medium leading-none text-white"
          style={{ backgroundColor: SPEAKER_COLOR[speaker] || '#7c7d8b' }}
        >
          {speaker}
        </span>
        <span className="text-[12px] font-medium tabular-nums tracking-[-0.3px] text-[#7c7d8b]">
          {time}
        </span>
      </div>
      <p className="flex-1 text-[14px] font-medium leading-[1.6] tracking-[-0.35px] text-grayscale-800">
        {text}
      </p>
    </div>
  )
}

// Horizontal scene card (Figma 1602:34939 / selected 1602:34976) — thumbnail +
// scene label, timestamp range, checkbox, and an action summary. Search-accuracy
// and hashtag chips are intentionally omitted.
function SceneCard({ img, label, range, dur, summary, selected, checkRef }) {
  return (
    <div
      className={`flex h-[102px] items-stretch overflow-hidden rounded-[10px] bg-white ${
        selected ? 'border-2 border-navy-500' : 'border border-neutral-100'
      }`}
    >
      <div className="relative h-full w-[180px] shrink-0 overflow-hidden bg-black">
        {img && <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      </div>
      <div className="flex flex-1 flex-col gap-[8px] overflow-hidden border-l border-neutral-100 p-[12px]">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold tracking-[-0.3px] text-[#020314]">{label}</p>
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[8px]">
              <span className="flex h-[20px] items-center rounded-[4px] bg-grayscale-100 px-[4px] text-[10px] font-medium tracking-[-0.25px] text-[#7c7d8b]">
                {range}
              </span>
              <span className="text-[10px] font-medium tracking-[-0.25px] text-[#7c7d8b]">{dur}</span>
            </div>
            {/* default: check icon is the exact same color as the box outline */}
            <span
              ref={checkRef}
              className={`flex items-center justify-center rounded-[4px] p-[3px] ${
                selected ? 'bg-navy-500' : 'border border-[#c4c5d4] bg-white'
              }`}
            >
              <Check
                size={16}
                strokeWidth={selected ? 3 : 2}
                className={selected ? 'text-white' : 'text-[#c4c5d4]'}
              />
            </span>
          </div>
        </div>
        <p className="text-[12px] font-medium leading-[1.6] tracking-[-0.3px] text-grayscale-800">
          {summary}
        </p>
      </div>
    </div>
  )
}

// Video detail screen — left player + metadata (shared), right is a tabbed panel:
// 개요 (행동 요약 + 스크립트) ↔ 장면 분석 (search + result list of SceneCards).
function DetailView({
  card,
  detail,
  date,
  tab,
  sceneTabRef,
  tabCursor,
  selectedScene,
  sceneCheckRef,
  editBtnRef,
}) {
  const { t } = useLang()
  const tabCls = (active) =>
    `flex items-center justify-center px-[8px] pb-[8px] ${
      active ? 'border-b-2 border-navy-500 text-navy-500' : 'text-[#9d9d9d]'
    }`
  return (
    <div className="flex w-[1058px] items-start gap-[24px] text-left">
      {/* Left card — player + metadata */}
      <div className="flex w-[341px] shrink-0 flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_4px_20px_0_#e8e9f8]">
        {/* Player — portrait 341×606, black backdrop */}
        <div className="relative flex h-[606px] w-[341px] items-end overflow-hidden bg-black">
          {card?.img && (
            <img src={card.img} alt="" className="absolute inset-0 h-full w-full object-contain" />
          )}
          <div className="relative flex w-full flex-col gap-[12px] p-[10px]">
            {/* progress — at the start (0s) */}
            <div className="relative h-[4px] w-full bg-white">
              <div className="absolute left-0 top-0 h-full w-0 bg-navy-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#262626]/50">
                  <Play size={20} className="ml-[1px] text-white" fill="white" />
                </span>
                <span className="flex h-[32px] w-[72px] items-center justify-between rounded-full bg-[#262626]/50 px-[8px]">
                  <SkipBack size={20} className="text-white" fill="white" />
                  <SkipForward size={20} className="text-white" fill="white" />
                </span>
                <span className="flex h-[32px] items-center rounded-full bg-[#262626]/50 px-[10px] text-[14px] font-medium tabular-nums tracking-[-0.35px] text-white">
                  00:00:00 / 00:00:18
                </span>
              </div>
              <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#262626]/50">
                <Volume2 size={20} className="text-white" />
              </span>
            </div>
          </div>
        </div>
        {/* Metadata */}
        <div className="flex h-[274px] flex-col items-end justify-between p-[20px]">
          <div className="flex w-full gap-[32px] text-[14px] font-medium leading-[1.4] tracking-[-0.35px]">
            <div className="flex flex-col gap-[20px] text-[#7b7b7b]">
              <span>{t('파일 위치', 'Location')}</span>
              <span>{t('폴더 제목', 'Folder')}</span>
              <span>{t('재생 시간', 'Duration')}</span>
              <span>{t('업로드 일자', 'Uploaded')}</span>
            </div>
            <div className="flex flex-col gap-[20px] text-grayscale-800">
              <span>Google Drive</span>
              <span>{t('블랙박스', 'Dashcam')}</span>
              <span>00:00:18</span>
              <span>{date} 09:46:28</span>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-[6px] text-[14px] font-semibold tracking-[-0.35px] text-[#7b7b7b]"
          >
            <RotateCcw size={20} />
            {t('장면 재분석', 'Re-analyze')}
          </button>
        </div>
      </div>

      {/* Right card — tab bar + per-tab content (same height as the left card) */}
      <div className="relative flex h-[880px] flex-1 flex-col gap-[24px] overflow-hidden rounded-[10px] bg-white p-[20px] shadow-[0_4px_20px_0_#e8e9f8,10px_10px_20px_0_rgba(185,185,185,0.1)]">
        <div className="flex h-[42px] shrink-0 items-stretch gap-[20px] border-b border-neutral-100 text-[16px] font-semibold tracking-[-0.4px]">
          <span className={tabCls(tab === 'overview')}>{t('개요', 'Overview')}</span>
          <span ref={sceneTabRef} className={tabCls(tab === 'scene')}>
            {t('장면 분석', 'Scene Analysis')}
          </span>
          <span className={tabCls(false)}>{t('인물 관리', 'People')}</span>
        </div>

        {tab === 'scene' ? (
          /* ── 장면 분석 ── */
          <div className="flex flex-col gap-[20px]">
            {/* search bar */}
            <div className="flex items-center gap-[10px] rounded-[10px] border border-neutral-300 px-[16px] py-[12px]">
              <Search size={20} className="text-neutral-300" />
              <span className="text-[14px] font-medium tracking-[-0.35px] text-neutral-300">
                {t('영상 내에서 원하는 장면을 검색하여 찾으세요.', 'Search for the scene you want within the video.')}
              </span>
            </div>
            {/* result header */}
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-semibold tracking-[-0.4px] text-black">
                {t('결과', 'Results')}{' '}
                <span className="text-grayscale-500">
                  {detail.scenes?.length ?? 0}
                  {t('개 장면', ' scenes')}
                </span>
              </p>
              <div className="flex items-center gap-[8px]">
                {/* Secondary */}
                <button
                  type="button"
                  className="flex h-[32px] items-center rounded-[8px] border border-[#7b7b7b] px-[10px] py-[6px] text-[12px] font-semibold text-[#7b7b7b] transition-colors hover:bg-[#f5f5f5] active:bg-[#d9d9d9]"
                >
                  {t('블러 처리', 'Blur')}
                </button>
                {/* Tonal */}
                <button
                  ref={editBtnRef}
                  type="button"
                  className="flex h-[32px] items-center justify-center rounded-[8px] bg-[#becfe6] px-[10px] py-[6px] text-[12px] font-semibold text-navy-500 transition-colors hover:bg-[#e0e8f5] active:bg-[#8ca5c3]"
                >
                  {t('선택 장면 편집', 'Edit Selected')}
                </button>
              </div>
            </div>
            {/* scene cards */}
            <div className="flex flex-col gap-[16px]">
              {detail.scenes?.map((s, i) => (
                <SceneCard
                  key={i}
                  img={s.img || card?.img}
                  label={`${t('장면', 'Scene')} ${i + 1}`}
                  range={s.range}
                  dur={s.dur}
                  summary={s.summary}
                  selected={selectedScene === i}
                  checkRef={i === 1 ? sceneCheckRef : null}
                />
              ))}
            </div>
          </div>
        ) : (
          /* ── 개요 ── */
          <div className="flex flex-col gap-[32px]">
            <div className="flex flex-col gap-[20px]">
              <div className="flex items-center gap-[10px]">
                <p className="text-[18px] font-semibold tracking-[-0.45px] text-black">
                  {t('행동 요약', 'Action Summary')}
                </p>
                <Copy size={16} className="text-grayscale-500" />
              </div>
              <p className="text-[14px] font-semibold leading-[1.6] tracking-[-0.35px] text-[#555]">
                {detail.summary}
              </p>
            </div>

            <div className="flex flex-col gap-[20px]">
              <div className="flex items-center gap-[10px]">
                <p className="text-[18px] font-semibold tracking-[-0.45px] text-black">
                  {t('스크립트', 'Transcript')}
                </p>
                <Copy size={16} className="text-grayscale-500" />
              </div>
              {detail.script && detail.script.length > 0 ? (
                <div className="flex flex-col gap-[16px]">
                  {detail.script.map((s, i) => (
                    <ScriptRow key={i} speaker={s.speaker} time={s.time} text={s.text} />
                  ))}
                </div>
              ) : (
                <p className="text-[14px] font-medium leading-[1.6] tracking-[-0.35px] text-[#9d9d9d]">
                  {t('스크립트가 없습니다.', 'No transcript available.')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* cursor that clicks the 장면 분석 tab / 선택 장면 편집 button */}
        <FakeCursor x={tabCursor.x} y={tabCursor.y} visible={tabCursor.visible} dur={tabCursor.dur} />
      </div>
    </div>
  )
}

// Tiny stepper pill used across the custom panel (− value +).
function Stepper({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-[8px] rounded-[10px] border border-grayscale-300 bg-white px-[8px] py-[10px]">
      <Minus size={18} className="text-grayscale-500" />
      {Icon ? <Icon size={16} className="text-grayscale-500" /> : null}
      <span className="text-[14px] font-medium tracking-[-0.35px] text-grayscale-800">{value}</span>
      <Plus size={18} className="text-grayscale-500" />
    </div>
  )
}

function PanelSlider({ value, percent = 0 }) {
  return (
    <div className="flex items-center gap-[10px]">
      <div className="relative flex flex-1 items-center gap-[6px] px-[6px]">
        <Minus size={18} className="text-grayscale-500" />
        <div className="relative h-[2px] flex-1 bg-neutral-200">
          <div className="absolute left-0 top-0 h-full bg-grayscale-800" style={{ width: `${percent}%` }} />
          <div
            className="absolute top-1/2 h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-grayscale-800"
            style={{ left: `${percent}%` }}
          />
        </div>
        <Plus size={18} className="text-grayscale-500" />
      </div>
      <div className="rounded-[10px] border border-grayscale-300 bg-white px-[8px] py-[10px] text-[14px] font-medium tracking-[-0.35px] text-grayscale-800">
        {value}
      </div>
    </div>
  )
}

// Shorts editor screen (Figma 2376:205568) — collapsed LNB, header save buttons,
// left subtitle (empty), center 9:16 preview, right text panel, bottom timeline.
const INITIAL_SCENES = [{ w: 179 }, { w: 315 }, { w: 469 }, { w: 198 }, { w: 206 }]

function EditorView({ card, img }) {
  const { t } = useLang()
  const editorImg = img || card?.img
  const lnbIcons = [Video, ImageIcon, UserRound, Scissors, Save]
  const rootRef = useRef(null)
  const sceneRefs = useRef([])
  const trashRef = useRef(null)
  const saveRef = useRef(null)
  // camera = how the fixed 1440×1024 screen is framed (the demo frame crops it).
  const [cam, setCam] = useState({ scale: 1, x: 0, y: 0 })
  const [cursor, setCursor] = useState({ x: 720, y: 540, visible: false })
  const [selSeg, setSelSeg] = useState(null)
  const [scenes, setScenes] = useState(INITIAL_SCENES)
  const [trashPressed, setTrashPressed] = useState(false)
  const [savePressed, setSavePressed] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // One-shot editor demo: zoom into the timeline, pan, pick a scene box,
  // delete it via the trash button, then press 저장하기.
  useEffect(() => {
    let cancelled = false
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    const aim = (el) => {
      if (!el || !rootRef.current) return null
      const r = el.getBoundingClientRect()
      const root = rootRef.current.getBoundingClientRect()
      const s = root.width / 1440 || 1
      return {
        x: (r.left - root.left) / s + r.width / (2 * s),
        y: (r.top - root.top) / s + r.height / (2 * s),
      }
    }
    ;(async () => {
      // 1) arrive — top of the screen is framed like every other view
      await wait(850)
      if (cancelled) return
      // 2) camera pans down + zooms into the (normally cropped) timeline
      setCam({ scale: 1.7, x: -40, y: -1190 })
      await wait(1350)
      if (cancelled) return
      // 3) keep moving across the timeline while zoomed in
      setCam({ scale: 1.7, x: -160, y: -1190 })
      await wait(1250)
      if (cancelled) return
      // 4) pick a scene box
      const target = aim(sceneRefs.current[2])
      if (target) setCursor({ ...target, visible: true })
      await wait(750)
      if (cancelled) return
      setSelSeg(2)
      await wait(800)
      if (cancelled) return
      // 5) move to the trash button and press → delete the scene
      const tr = aim(trashRef.current)
      if (tr) setCursor({ ...tr, visible: true })
      await wait(800)
      if (cancelled) return
      setTrashPressed(true)
      await wait(300)
      if (cancelled) return
      setTrashPressed(false)
      setScenes((s) => s.filter((_, i) => i !== 2))
      setSelSeg(null)
      await wait(900)
      if (cancelled) return
      // 6) camera pulls back up to the header; cursor travels to 저장하기
      setCam({ scale: 1, x: 0, y: 0 })
      const sv = aim(saveRef.current)
      if (sv) setCursor({ ...sv, visible: true })
      await wait(1300)
      if (cancelled) return
      setSavePressed(true)
      await wait(340)
      if (cancelled) return
      setSavePressed(false)
      setCursor((c) => ({ ...c, visible: false }))
      // 7) "저장이 완료되었습니다" popup appears centered
      await wait(450)
      if (!cancelled) setShowPopup(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative h-[1024px] w-[1440px] overflow-hidden bg-grayscale-10">
      {/* the camera frames this fixed 1440×1024 screen; the demo frame crops it */}
      <div
        ref={rootRef}
        className="flex h-[1024px] w-[1440px] text-left"
        style={{
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
          transformOrigin: '0 0',
          transition: 'transform 1150ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Collapsed LNB */}
        <aside className="flex w-[72px] shrink-0 flex-col items-center justify-between border-r border-neutral-100 bg-white py-[24px]">
          <div className="flex flex-col items-center gap-[28px]">
            <PanelLeft size={24} className="rotate-180 text-[#9d9d9d]" />
            {lnbIcons.map((Icon, i) => (
              <span
                key={i}
                className={`flex h-[40px] w-[40px] items-center justify-center rounded-lg ${
                  i === 0 ? 'bg-neutral-100' : ''
                }`}
              >
                <Icon size={22} strokeWidth={1.8} className="text-grayscale-800" />
              </span>
            ))}
          </div>
          <Settings size={22} className="text-grayscale-800" />
        </aside>

        {/* Right of LNB — GNB + 3-column body */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* GNB */}
          <div className="flex h-[80px] shrink-0 items-center justify-between bg-grayscale-10/70 px-[32px] backdrop-blur-[6px]">
            <div className="flex items-center gap-[16px]">
              <span className="flex items-center gap-[8px] text-[16px] tracking-[-0.4px] text-grayscale-500">
                <ChevronLeft size={20} className="text-grayscale-800" />
                {t('동영상 검색', 'Video Search')}
              </span>
              <span className="text-[18px] font-semibold tracking-[-0.45px] text-grayscale-800">
                {card?.title ? `${card.title}.mp4` : '동영상1.mp4'}
              </span>
            </div>
            <div className="flex items-center gap-[28px]">
              <div className="flex items-center gap-[8px]">
                {/* Secondary */}
                <button
                  type="button"
                  className="flex h-[32px] items-center rounded-[8px] border border-[#7b7b7b] px-[10px] py-[6px] text-[12px] font-semibold text-[#7b7b7b] transition-colors hover:bg-[#f5f5f5] active:bg-[#d9d9d9]"
                >
                  {t('템플릿 저장', 'Save Template')}
                </button>
                {/* Primary — pressed during the save step */}
                <button
                  ref={saveRef}
                  type="button"
                  className={`flex h-[32px] items-center rounded-[8px] px-[10px] py-[6px] text-[12px] font-semibold text-white transition-colors ${
                    savePressed ? 'bg-[#0a2240]' : 'bg-navy-500 hover:bg-[#6985a6]'
                  }`}
                >
                  {t('저장하기', 'Save')}
                </button>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="flex flex-col items-end">
                  <p className="text-[16px] font-medium tracking-[-0.4px] text-grayscale-800">
                    {t('하임덱스', 'Heimdex')}
                  </p>
                  <p className="text-[12px] tracking-[-0.3px] text-grayscale-500">heimdex@heimdex.co</p>
                </div>
                <span className="flex items-center justify-center rounded-full bg-[#d9dae9] p-[8px]">
                  <UserRound size={24} className="text-white" />
                </span>
              </div>
            </div>
          </div>

          {/* 3-column body */}
          <div className="flex min-h-0 flex-1 justify-center gap-[63px] px-[16px] pb-[16px]">
            {/* Left — subtitle (empty) */}
            <div className="flex w-[474px] shrink-0 flex-col gap-[16px] rounded-[20px] bg-white p-[20px] shadow-[0_4px_20px_0_#e8e9f8]">
              <div className="flex items-center gap-[10px] rounded-[10px] border border-neutral-300 px-[14px] py-[10px]">
                <Search size={20} className="text-neutral-300" />
                <span className="text-[14px] font-medium tracking-[-0.35px] text-neutral-300">
                  {t('자막 검색', 'Search captions')}
                </span>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <p className="text-[14px] font-medium tracking-[-0.35px] text-[#9d9d9d]">
                  {t('자막이 없습니다', 'No captions')}
                </p>
              </div>
            </div>

            {/* Center — video frame; image fits to width, black bars top/bottom */}
            <div className="relative flex w-[352px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-black">
              {editorImg && <img src={editorImg} alt="" className="w-full" />}
            </div>

            {/* Right — text custom panel */}
            <div className="flex w-[371px] shrink-0 flex-col gap-[16px] overflow-hidden rounded-[20px] bg-white p-[20px] shadow-[0_4px_20px_0_#e8e9f8]">
              {/* tabs */}
              <div className="flex h-[32px] items-start border-b border-neutral-100 text-[16px] font-semibold tracking-[-0.4px]">
                <span className="flex flex-1 justify-center border-b-2 border-navy-500 pb-[2px] text-grayscale-800">
                  {t('텍스트', 'Text')}
                </span>
                <span className="flex flex-1 justify-center pb-[2px] text-grayscale-500">
                  {t('배경', 'Background')}
                </span>
                <span className="flex flex-1 justify-center pb-[2px] text-[#7b7b7b]">
                  {t('템플릿', 'Template')}
                </span>
              </div>
              {/* add text */}
              <button
                type="button"
                className="flex h-[36px] items-center justify-center gap-[4px] rounded-[8px] bg-navy-500 text-[14px] font-semibold text-white"
              >
                <Plus size={20} />
                {t('텍스트 추가', 'Add Text')}
              </button>
              {/* text area (default — Figma 1670:186617) */}
              <div className="h-[90px] rounded-[10px] border border-grayscale-500 px-[14px] py-[16px]">
                <p className="text-[14px] font-medium tracking-[-0.35px] text-neutral-300">
                  {t('내용을 입력해주세요.', 'Enter your text.')}
                </p>
              </div>
              <div className="h-px w-full bg-neutral-100" />
              {/* font + size */}
              <div className="flex gap-[10px]">
                <div className="flex flex-1 items-center justify-between rounded-[10px] border border-grayscale-300 px-[12px] py-[10px] text-[14px] font-medium text-grayscale-800">
                  Pretendard
                  <ChevronDown size={20} className="text-grayscale-500" />
                </div>
                <Stepper value="0pt" />
              </div>
              {/* format toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[6px]">
                  <span className="flex items-center rounded-[4px] p-[4px]">
                    <Bold size={20} className="text-grayscale-800" />
                  </span>
                  <span className="flex items-center rounded-[4px] p-[4px]">
                    <Italic size={20} className="text-grayscale-800" />
                  </span>
                  <span className="flex items-center rounded-[4px] p-[4px]">
                    <Underline size={20} className="text-grayscale-800" />
                  </span>
                </div>
                <span className="h-[26px] w-[2px] bg-grayscale-100" />
                <div className="flex items-center gap-[4px]">
                  <span className="flex items-center gap-[2px] p-[4px]">
                    <AlignLeft size={20} className="text-grayscale-800" />
                    <ChevronDown size={16} className="text-grayscale-500" />
                  </span>
                  <span className="flex items-center gap-[2px] p-[4px]">
                    <AlignCenterHorizontal size={20} className="text-grayscale-800" />
                    <ChevronDown size={16} className="text-grayscale-500" />
                  </span>
                </div>
                <span className="h-[26px] w-[2px] bg-grayscale-100" />
                <span className="flex h-[28px] w-[28px] items-center justify-center border-b-4 border-grayscale-800 text-[18px] font-medium text-grayscale-800">
                  A
                </span>
              </div>
              <div className="h-px w-full bg-neutral-100" />
              {/* 변형 + 윤곽선 */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-[10px]">
                  <p className="text-[14px] font-semibold tracking-[-0.35px] text-grayscale-800">
                    {t('변형', 'Transform')}
                  </p>
                  <div className="flex items-center gap-[10px]">
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[12px] font-medium tracking-[-0.3px] text-grayscale-500">{t('위치', 'Position')}</span>
                      <div className="flex items-center gap-[6px] rounded-[10px] border border-grayscale-300 p-[10px] text-[14px]">
                        <span className="text-neutral-300">X</span>
                        <span className="w-[20px] text-grayscale-800">0</span>
                        <span className="text-neutral-300">Y</span>
                        <span className="w-[20px] text-grayscale-800">0</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[12px] font-medium tracking-[-0.3px] text-grayscale-500">{t('회전', 'Rotate')}</span>
                      <div className="flex items-center gap-[4px] rounded-[10px] border border-grayscale-300 px-[8px] py-[10px] text-[14px] text-grayscale-800">
                        <span className="w-[26px]">0</span>°
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <p className="text-[14px] font-semibold tracking-[-0.35px] text-grayscale-800">
                    {t('윤곽선', 'Outline')}
                  </p>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[12px] font-medium tracking-[-0.3px] text-grayscale-500">{t('굵기', 'Width')}</span>
                    <div className="flex items-center gap-[10px]">
                      <Stepper value="0px" />
                      <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-grayscale-300 p-[5px]">
                        <span className="h-full w-full rounded-[6px] bg-grayscale-800" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* 불투명도 */}
              <div className="flex flex-col gap-[10px]">
                <p className="text-[14px] font-semibold tracking-[-0.35px] text-grayscale-800">
                  {t('불투명도', 'Opacity')}
                </p>
                <PanelSlider value="100%" percent={100} />
              </div>
              {/* 그림자 */}
              <div className="flex flex-col gap-[10px]">
                <p className="text-[14px] font-semibold tracking-[-0.35px] text-grayscale-800">
                  {t('그림자', 'Shadow')}
                </p>
                <PanelSlider value="0px" percent={0} />
              </div>
            </div>
          </div>

          {/* Timeline — Figma 2376:205747 (no caption track: there is no script) */}
          <div className="relative mx-[16px] mb-[16px] flex flex-col items-center gap-[12px] overflow-hidden rounded-[20px] bg-white py-[12px] shadow-[0_4px_20px_0_#e8e9f8]">
            {/* control bar */}
            <div className="flex w-full items-center px-[24px]">
              <div className="flex w-[346px] items-center gap-[12px]">
                <button
                  ref={trashRef}
                  type="button"
                  className={`flex h-[28px] w-[28px] items-center justify-center rounded-[6px] transition-colors ${
                    trashPressed ? 'bg-grayscale-100' : ''
                  }`}
                >
                  <Trash2 size={20} className="text-grayscale-500" />
                </button>
                <span className="h-[26px] w-[2px] bg-grayscale-100" />
                <span className="text-[14px] font-semibold tracking-[-0.35px] text-grayscale-500">
                  00:00:00 / 00:00:18
                </span>
              </div>
              <div className="flex flex-1 items-center justify-center gap-[10px]">
                {[SkipBack, Play, SkipForward].map((Icon, i) => (
                  <span key={i} className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-neutral-50">
                    <Icon size={20} className="text-grayscale-800" fill={Icon === Play ? 'currentColor' : 'none'} />
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-[10px]">
                <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-neutral-50">
                  <Volume2 size={20} className="text-grayscale-800" />
                </span>
                <span className="flex h-[32px] items-center rounded-[8px] bg-neutral-50 px-[10px] text-[14px] font-semibold tracking-[-0.35px] text-neutral-800">
                  1.0x
                </span>
                <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-neutral-50">
                  <Maximize size={20} className="text-grayscale-800" />
                </span>
                <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-neutral-50">
                  <SquareSplitHorizontal size={20} className="text-grayscale-800" />
                </span>
              </div>
              <div className="flex w-[175px] items-center justify-end">
                <div className="relative flex w-[156px] items-center justify-center gap-[8px] p-[6px]">
                  <Minus size={20} className="text-grayscale-800" />
                  <div className="relative h-[2px] w-[88px] bg-neutral-200">
                    <div className="absolute left-0 top-0 h-full w-[33px] bg-grayscale-800" />
                    <div className="absolute left-[29px] top-1/2 h-[8px] w-[8px] -translate-y-1/2 rounded-full bg-grayscale-800" />
                  </div>
                  <Plus size={20} className="text-grayscale-800" />
                </div>
              </div>
            </div>

            {/* tracks viewport */}
            <div className="w-full overflow-hidden pl-[24px]">
              <div className="flex w-max flex-col gap-[8px]">
                {/* time ruler */}
                <div className="flex items-center gap-[16px]">
                  {['0s', '10s', '20s', '30s', '40s', '50s', '1m', '1:10', '1:20', '1:30', '1:40', '1:50', '2m'].map(
                    (label, i) => (
                      <div key={i} className="flex shrink-0 items-center gap-[16px]">
                        <span className="text-[12px] font-medium tracking-[-0.3px] text-grayscale-800">{label}</span>
                        <span
                          className="h-[2px] w-[56px]"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(90deg,#c4c5d4 0 3px,transparent 3px 7px)',
                          }}
                        />
                      </div>
                    ),
                  )}
                  <span className="shrink-0 text-[14px] font-semibold tracking-[-0.35px] text-grayscale-800">2:10</span>
                </div>

                {/* video filmstrip */}
                <div className="flex h-[60px] gap-[2px]">
                  {scenes.map((seg, i) => (
                    <div
                      key={i}
                      ref={(el) => (sceneRefs.current[i] = el)}
                      style={{ width: seg.w }}
                      className="relative h-[60px] shrink-0 overflow-hidden rounded-[10px] bg-[#262626] transition-[width] duration-300"
                    >
                      {editorImg && (
                        <img src={editorImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
                      )}
                      <div className="absolute inset-0 flex">
                        {Array.from({ length: Math.ceil(seg.w / 80) }).map((_, c) => (
                          <span key={c} className="h-full w-[80px] shrink-0 border-r border-[#9d9d9d]/70" />
                        ))}
                      </div>
                      {selSeg === i && (
                        <div className="absolute inset-0 flex items-center justify-between rounded-[8px] border-2 border-white px-[6px]">
                          <span className="h-[35px] w-[3px] rounded-full bg-white" />
                          <span className="h-[35px] w-[3px] rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* audio track (empty) */}
                <div className="h-[44px] w-[1375px] rounded-l-[10px] bg-neutral-50" />
              </div>
            </div>

            {/* scrollbar */}
            <div className="ml-[31px] h-[6px] w-[134px] self-start rounded-full bg-neutral-300" />

            {/* playhead */}
            <div className="pointer-events-none absolute left-[300px] top-[54px] flex flex-col items-center">
              <span className="h-[10px] w-[10px] rotate-45 rounded-[2px] bg-navy-500" />
              <span className="h-[150px] w-[2px] bg-navy-500" />
            </div>
          </div>
        </div>

        {/* demo cursor — lives inside the camera, in editor-local 1440-coords */}
        <FakeCursor x={cursor.x} y={cursor.y} visible={cursor.visible} dur={650} />
      </div>

      {/* save-complete popup — centered in the visible (cropped) frame */}
      {showPopup && <SavePopup />}
    </div>
  )
}

// "저장이 완료되었습니다" modal (Figma 2107:410685), centered in the visible frame.
function SavePopup() {
  const { t } = useLang()
  return (
    <div className="absolute inset-0 z-30">
      {/* the demo frame shows the top ~651px of the 1024 screen → center there */}
      <div className="absolute left-1/2 top-[320px] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[20px] rounded-[20px] bg-white p-[24px] shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)]">
        {/* Figma 2107:410686 — green circle + white check */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <rect width="24" height="24" rx="12" fill="#3FB675" />
          <path
            d="M17 8.66251L10.125 15.5375L7.00003 12.4125"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-[18px] font-bold tracking-[-0.45px] text-neutral-800">
          {t('저장이 완료되었습니다', 'Saved successfully')}
        </p>
        <div className="flex items-start gap-[8px]">
          {/* Secondary */}
          <span className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#7b7b7b] px-[12px] py-[8px] text-[14px] font-semibold text-[#7b7b7b]">
            {t('계속 편집', 'Keep Editing')}
          </span>
          {/* Primary */}
          <span className="flex h-[36px] items-center justify-center rounded-[8px] bg-navy-500 px-[12px] py-[8px] text-[14px] font-semibold text-white">
            {t('내 쇼츠로 이동', 'Go to My Shorts')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function HeroAppMockup({
  query = null,
  titles = null,
  images = STAGE_IMAGES,
  placeholder = null,
  sweep = true,
  orientation = 'vertical',
  detail = null,
  cardSource = null,
}) {
  const { t, lang } = useLang()
  const horizontal = orientation === 'horizontal'
  // Fall back to the (lang-aware) stage defaults when no content is passed (home hero).
  const q = query ?? (lang === 'en' ? QUERY_EN : QUERY)
  const ts = titles ?? (lang === 'en' ? TITLES_EN : TITLES)
  const ph = placeholder ?? (lang === 'en' ? DEFAULT_PLACEHOLDER_EN : DEFAULT_PLACEHOLDER)
  const cards = Array.from({ length: 16 }, (_, i) => ({
    source: cardSource || SOURCE_CYCLE[i % SOURCE_CYCLE.length],
    title: ts[i % ts.length],
    img: images ? images[i % images.length] : null,
  }))

  // Dates reflect the current date so the mockup never looks stale.
  const pad = (n) => String(n).padStart(2, '0')
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(today.getDate() - 7)
  const dateRange = `${weekAgo.getFullYear()}.${pad(weekAgo.getMonth() + 1)}.${pad(
    weekAgo.getDate(),
  )} – ${pad(today.getMonth() + 1)}.${pad(today.getDate())}`
  const updatedAt = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  // Per-interaction random library stats — folders are far fewer than videos.
  const [counts] = useState(() => ({
    videos: 80 + Math.floor(Math.random() * 240), // ~80–319
    folders: 4 + Math.floor(Math.random() * 14), // ~4–17
  }))

  // ── Demo interaction state ──
  const [typed, setTyped] = useState('')
  const [searched, setSearched] = useState(false)
  const [hoverIndex, setHoverIndex] = useState(-1)
  const [scroll, setScroll] = useState(0)
  const [cursor, setCursor] = useState({ x: 380, y: 360, visible: false, dur: 400 })
  // Intro zoom: start magnified on the search bar, then zoom out to full screen.
  const [zoom, setZoom] = useState(1.7)
  // 'results' search grid ↔ 'detail' video-detail screen (legal demo only).
  const [view, setView] = useState('results')
  // Detail screen sub-tab: '개요' ↔ '장면 분석'.
  const [detailTab, setDetailTab] = useState('overview')
  const [tabCursor, setTabCursor] = useState({ x: 0, y: 0, visible: false, dur: 500 })
  // Which scene card is selected on the 장면 분석 tab (null = none).
  const [selectedScene, setSelectedScene] = useState(null)

  const scrollerRef = useRef(null)
  const cardRefs = useRef([])
  const sceneTabRef = useRef(null)
  const sceneCheckRef = useRef(null)
  const editBtnRef = useRef(null)
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
        setTabCursor((c) => ({ ...c, visible: false }))
        setZoom(1.7)
        setView('results')
        setDetailTab('overview')
        setSelectedScene(null)
        await wait(850)
        if (cancelled) return

        // 1. type the query (zoomed in)
        for (let i = 1; i <= q.length; i++) {
          if (cancelled) return
          setTyped(q.slice(0, i))
          await wait(85)
        }
        await wait(550)

        // 2. zoom back out to the full screen; results appear (staggered)
        setSearched(true)
        setZoom(1)
        await wait(950)

        if (detail) {
          // Hold the results, then the cursor moves to the 4th card and "clicks"
          // it → navigate to the video-detail screen, hold, then loop.
          await wait(750)
          const idx = 3
          const card = cardRefs.current[idx]
          if (card) {
            setCursor({ x: card.offsetLeft + 110, y: card.offsetTop + 62, visible: true, dur: 600 })
          }
          setHoverIndex(idx)
          await wait(1050)
          if (cancelled) return
          setView('detail')
          setDetailTab('overview')
          setHoverIndex(-1)
          setCursor((c) => ({ ...c, visible: false }))
          await wait(2600)
          if (cancelled) return
          // move the cursor to the 장면 분석 tab and click → scene-analysis view
          const tabEl = sceneTabRef.current
          if (tabEl) {
            setTabCursor({
              x: tabEl.offsetLeft + tabEl.offsetWidth / 2,
              y: tabEl.offsetTop + tabEl.offsetHeight - 4,
              visible: true,
              dur: 600,
            })
          }
          await wait(1000)
          if (cancelled) return
          setDetailTab('scene')
          await wait(950)
          if (cancelled) return
          // move the cursor to the 2nd scene card's checkbox and select it
          const checkEl = sceneCheckRef.current
          if (checkEl) {
            setTabCursor({
              x: checkEl.offsetLeft + checkEl.offsetWidth / 2,
              y: checkEl.offsetTop + checkEl.offsetHeight / 2,
              visible: true,
              dur: 700,
            })
          }
          await wait(1050)
          if (cancelled) return
          setSelectedScene(1)
          await wait(900)
          if (cancelled) return
          // move the cursor to "선택 장면 편집" and open the editor screen
          const editEl = editBtnRef.current
          if (editEl) {
            setTabCursor({
              x: editEl.offsetLeft + editEl.offsetWidth / 2,
              y: editEl.offsetTop + editEl.offsetHeight / 2,
              visible: true,
              dur: 650,
            })
          }
          await wait(1000)
          if (cancelled) return
          setTabCursor((c) => ({ ...c, visible: false }))
          setView('editor')
          await wait(12800)
          setView('results')
          setDetailTab('overview')
          setSelectedScene(null)
          await wait(550)
          continue
        }

        if (!sweep) {
          // Stop after the zoom-out reveal — just hold the full view, then loop.
          await wait(2600)
          continue
        }

        // 3. cursor sweeps the cards left→right while the view scrolls to follow
        setCursor((c) => ({ ...c, visible: true }))
        for (let i = 0; i < cards.length; i++) {
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
      {view === 'editor' ? (
        <EditorView card={cards[3]} img={detail?.scenes?.[1]?.img || cards[3]?.img} />
      ) : (
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
                <p className="text-[16px] font-semibold tracking-[-0.4px] text-[#9d9d9d]">
                  {t('메인', 'Main')}
                </p>
                <NavItem icon={Video} label={t('동영상 검색', 'Video Search')} active />
                <NavItem icon={ImageIcon} label={t('이미지 검색', 'Image Search')} />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[16px] font-semibold tracking-[-0.4px] text-[#9d9d9d]">
                  {t('라이브러리', 'Library')}
                </p>
                <NavItem icon={UserRound} label={t('인물 라벨 관리', 'People & Labels')} />
                <NavItem icon={Scissors} label={t('교차 편집', 'Cross Editing')} />
                <NavItem icon={Save} label={t('내 쇼츠', 'My Shorts')} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[4px]">
            <Bolt size={20} className="text-grayscale-800" />
            <span className="text-[14px] font-semibold tracking-[-0.35px] text-grayscale-800">
              {t('설정', 'Settings')}
            </span>
          </div>
        </aside>

        {/* ───── Content ───── */}
        <div className="flex w-[1190px] flex-col items-center gap-[24px]">
          {/* GNB — fixed + translucent glass; scrolled results blur through it */}
          <div className="relative z-10 flex h-[80px] w-full items-center justify-between bg-grayscale-10/70 px-[32px] backdrop-blur-[6px]">
            {/* breadcrumb — only on the detail screen */}
            <div className="flex min-w-0 items-center gap-[16px] text-[16px] tracking-[-0.4px]">
              {view === 'detail' && (
                <>
                  <span className="flex items-center gap-[8px] text-grayscale-500">
                    <ChevronLeft size={20} className="text-grayscale-800" />
                    {t('동영상 검색', 'Video Search')}
                  </span>
                  <span className="max-w-[560px] truncate font-semibold text-grayscale-800">
                    {cards[3]?.title}.mp4
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-[28px]">
              {/* AI buttons — shown on the detail screen (개요 · 장면 분석 tabs) */}
              {view === 'detail' && (
                <div className="flex items-center gap-[8px]">
                  {/* Secondary */}
                  <button
                    type="button"
                    className="flex h-[32px] items-center rounded-[8px] border border-[#7b7b7b] px-[10px] py-[6px] text-[12px] font-semibold text-[#7b7b7b] transition-colors hover:bg-[#f5f5f5] active:bg-[#d9d9d9]"
                  >
                    {t('AI 구간 분할', 'AI Segment Split')}
                  </button>
                  {/* Primary */}
                  <button
                    type="button"
                    className="flex h-[32px] items-center rounded-[8px] bg-navy-500 px-[10px] py-[6px] text-[12px] font-semibold text-white transition-colors hover:bg-[#6985a6] active:bg-[#0a2240]"
                  >
                    {t('AI 쇼츠 생성', 'AI Shorts')}
                  </button>
                </div>
              )}
              <div className="flex items-center gap-[12px]">
                <div className="flex flex-col items-end">
                  <p className="text-[16px] font-medium tracking-[-0.4px] text-grayscale-800">
                    {t('하임덱스', 'Heimdex')}
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
          </div>

          {/* Results ↔ detail crossfade */}
          <div className="relative flex w-full flex-col items-center">
            {/* Detail screen — fades in over the results when a card is clicked */}
            {detail && (
              <div
                className={`absolute inset-x-0 top-0 z-10 flex justify-center px-[16px] transition-opacity duration-500 ease-out ${
                  view === 'detail' ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <DetailView
                  card={cards[3]}
                  detail={detail}
                  date={updatedAt}
                  tab={detailTab}
                  sceneTabRef={sceneTabRef}
                  tabCursor={tabCursor}
                  selectedScene={selectedScene}
                  sceneCheckRef={sceneCheckRef}
                  editBtnRef={editBtnRef}
                />
              </div>
            )}

            {/* Scroll region — only this translates; LNB + GNB stay fixed */}
            <div
              ref={scrollerRef}
              className={`relative z-0 flex w-[943px] flex-col gap-[20px] transition-[transform,opacity] duration-500 ease-out ${
                view === 'detail' ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
              style={{ transform: `translateY(${-scroll}px)` }}
            >
            {/* Search card */}
            <div className="flex flex-col gap-[20px] rounded-[10px] bg-white p-[20px] shadow-[0_4px_10px_0_#e8e9f8]">
              <p className="text-[18px] font-semibold tracking-[-0.45px] text-black">
                {t('동영상 검색', 'Video Search')}
              </p>
              <div className="flex items-stretch gap-[10px]">
                <div className="flex items-stretch gap-[4px] rounded-[10px] bg-[#f5f5f5] p-[4px]">
                  {[
                    ['파일', 'File'],
                    ['내용', 'Content'],
                    ['의미', 'Meaning'],
                  ].map(([ko, en]) => (
                    <span
                      key={ko}
                      className={`flex items-center justify-center rounded-[8px] px-[10px] py-[2px] text-[16px] font-medium tracking-[-0.4px] transition-colors ${
                        ko === activeTab ? 'bg-white text-grayscale-800' : 'text-[#9d9d9d]'
                      }`}
                    >
                      {lang === 'en' ? en : ko}
                    </span>
                  ))}
                </div>
                <div
                  className={`flex flex-1 items-center gap-[10px] rounded-[10px] p-[16px] ${
                    zoom > 1 ? 'search-spin' : ''
                  }`}
                  style={zoom > 1 ? undefined : { border: '1.6px solid #7c7d8b', background: '#fff' }}
                >
                  <Search
                    size={24}
                    className={typed ? 'text-navy-500' : 'text-neutral-300'}
                  />
                  {typed ? (
                    <span className="flex items-center text-[16px] font-medium tracking-[-0.4px] text-grayscale-800">
                      {typed}
                      <span className="ml-[1px] inline-block h-[18px] w-[2px] animate-pulse bg-grayscale-800" />
                    </span>
                  ) : (
                    <span className="text-[16px] font-medium tracking-[-0.4px] text-neutral-300">
                      {ph}
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
                      {t('검색 결과', 'Search Results')}
                    </p>
                    <div className="flex items-center gap-[4px] text-[14px] font-medium tracking-[-0.35px] text-[#7b7b7b]">
                      <span>{t(`동영상 ${counts.videos}개`, `${counts.videos} videos`)}</span>
                      <span className="text-navy-500">·</span>
                      <span>{t(`폴더 ${counts.folders}개`, `${counts.folders} folders`)}</span>
                      <span className="text-navy-500">·</span>
                      <span>{t('업데이트', 'Updated')} {updatedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[16px]">
                    <div className="flex items-center gap-[6px] rounded-[8px] border border-neutral-300 px-[10px] py-[6px] text-[14px] font-medium tracking-[-0.35px] text-[#7b7b7b]">
                      <Calendar size={16} className="text-[#7b7b7b]" />
                      {dateRange}
                    </div>
                    <div className="flex items-center gap-[4px] text-[16px] font-medium tracking-[-0.4px] text-[#7b7b7b]">
                      {t('생성 일자 순', 'By date created')}
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>
                {/* filter row */}
                <div className="flex items-center gap-[10px]">
                  <div className="flex flex-1 items-center gap-[8px]">
                    <FilterChip label={t('전체', 'All')} />
                    <span className="h-[26px] w-[2px] bg-neutral-100" />
                    <FilterChip label="Drive" dot={SOURCES.Drive} />
                    <FilterChip label="Youtube" dot={SOURCES.Youtube} />
                    <FilterChip label="Local" dot={SOURCES.Local} />
                    <FilterChip label="Disk" dot={SOURCES.Disk} />
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <div className="flex items-center gap-[4px] rounded-[6px] bg-[#f5f5f5] p-[3px]">
                      {[
                        ['동영상', 'Video'],
                        ['장면', 'Scene'],
                      ].map(([ko, en], i) => (
                        <span
                          key={ko}
                          className={`rounded-[4px] px-[6px] py-[2px] text-[12px] font-medium tracking-[-0.3px] ${
                            i === 0 ? 'bg-white text-grayscale-800' : 'text-[#9d9d9d]'
                          }`}
                        >
                          {lang === 'en' ? en : ko}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-[4px] rounded-[6px] bg-[#f5f5f5] p-[3px]">
                      <span
                        className={`flex items-center gap-[4px] rounded-[4px] px-[4px] py-[2px] text-[12px] font-medium ${
                          horizontal ? 'bg-white text-grayscale-800' : 'text-[#9d9d9d]'
                        }`}
                      >
                        <RectangleHorizontal size={16} />
                        {t('가로', 'Landscape')}
                      </span>
                      <span
                        className={`flex items-center gap-[4px] rounded-[4px] px-[4px] py-[2px] text-[12px] font-medium ${
                          horizontal ? 'text-[#9d9d9d]' : 'bg-white text-grayscale-800'
                        }`}
                      >
                        <RectangleVertical size={16} />
                        {t('세로', 'Portrait')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* grid */}
              <div className="flex flex-wrap justify-between gap-y-[24px]">
                {cards.map((c, i) => (
                  <VideoCard
                    key={i}
                    index={i}
                    cardRef={(el) => (cardRefs.current[i] = el)}
                    shown={searched}
                    hovered={hoverIndex === i}
                    horizontal={horizontal}
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
      )}
    </div>
  )
}
