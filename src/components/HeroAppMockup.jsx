import { useEffect, useRef, useState } from 'react'
import {
  PanelLeft, Video, Image as ImageIcon, UserRound, Scissors, Save, Bolt,
  Search, Calendar, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight,
  ChevronsRight, RectangleHorizontal, RectangleVertical,
} from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import {
  QUERY, QUERY_EN, TITLES, TITLES_EN, STAGE_IMAGES,
  DEFAULT_PLACEHOLDER, DEFAULT_PLACEHOLDER_EN, SOURCE_CYCLE, SOURCES,
} from './hero/constants.js'
import { VideoCard, NavItem, FilterChip, FakeCursor } from './hero/atoms.jsx'
import { DetailView } from './hero/DetailView.jsx'
import { EditorView } from './hero/EditorView.jsx'
import { SplitView } from './hero/SplitView.jsx'

export default function HeroAppMockup({
  query = null,
  titles = null,
  images = STAGE_IMAGES,
  placeholder = null,
  sweep = true,
  orientation = 'vertical',
  detail = null,
  cardSource = null,
  pickIndex = 3,
  editor = false,
  durRange = null,
  sceneToggle = false,
  sceneImages = null,
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
    sceneImg: sceneImages ? sceneImages[i % sceneImages.length] : null,
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
  const [zoomOrigin, setZoomOrigin] = useState('64% 10%')
  // Result grid mode: 'video' ↔ 'scene' (research demo toggles to scene → scene counts).
  const [gridMode, setGridMode] = useState('video')
  // 'results' search grid ↔ 'detail' video-detail screen (legal demo only).
  const [view, setView] = useState('results')
  // Detail screen sub-tab: 'overview' ↔ 'scene analysis'.
  const [detailTab, setDetailTab] = useState('overview')
  const [tabCursor, setTabCursor] = useState({ x: 0, y: 0, visible: false, dur: 500 })
  // Which scene card is selected on the scene-analysis tab (null = none).
  const [selectedScene, setSelectedScene] = useState(null)
  // Marketer flow: clicking the "AI Segment Split" button (in the GNB) instead of selecting a scene.
  const [aiCursor, setAiCursor] = useState({ x: 0, y: 0, visible: false, dur: 600 })
  const [aiPressed, setAiPressed] = useState(false)

  const scrollerRef = useRef(null)
  const cardRefs = useRef([])
  const sceneTabRef = useRef(null)
  const sceneCheckRef = useRef(null)
  const editBtnRef = useRef(null)
  const contentRef = useRef(null)
  const aiSplitRef = useRef(null)
  const scaleWrapRef = useRef(null)
  const gridToggleRef = useRef(null)
  const sceneSpanRef = useRef(null)
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
        setAiCursor((c) => ({ ...c, visible: false }))
        setZoom(1.7)
        setZoomOrigin('64% 10%')
        setGridMode('video')
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
          const idx = pickIndex
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
          if (editor) {
            // legal: tabCursor clicks scene-analysis tab → selects 2nd scene → opens editor
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
          } else {
            // marketer: ONE cursor (content space) glides from the scene-analysis tab
            // straight to "AI Segment Split" — no jump between coordinate systems.
            const aiAim = (el) => {
              if (!el || !contentRef.current) return null
              const r = el.getBoundingClientRect()
              const c = contentRef.current.getBoundingClientRect()
              const s = c.width / 1190 || 1
              return {
                x: (r.left - c.left) / s + r.width / (2 * s),
                y: (r.top - c.top) / s + r.height / (2 * s),
              }
            }
            let p = aiAim(sceneTabRef.current)
            if (p) setAiCursor({ ...p, visible: true, dur: 600 })
            await wait(950)
            if (cancelled) return
            setDetailTab('scene')
            await wait(800)
            if (cancelled) return
            p = aiAim(aiSplitRef.current)
            if (p) setAiCursor({ ...p, visible: true, dur: 700 })
            await wait(1000)
            if (cancelled) return
            setAiPressed(true)
            await wait(320)
            if (cancelled) return
            setAiPressed(false)
            setAiCursor((c) => ({ ...c, visible: false }))
            // → navigate to the segment-split results page, hold, then loop
            await wait(450)
            if (cancelled) return
            setView('split')
            await wait(17200)
          }
          if (cancelled) return
          setView('results')
          setDetailTab('overview')
          setSelectedScene(null)
          await wait(550)
          continue
        }

        if (sceneToggle) {
          // research: zoom into the video/scene tab, click scene, then zoom back out
          await wait(900)
          if (cancelled) return
          const tog = gridToggleRef.current
          const wrap = scaleWrapRef.current
          if (tog && wrap) {
            const r = tog.getBoundingClientRect()
            const w = wrap.getBoundingClientRect()
            setZoomOrigin(
              `${((r.left + r.width / 2 - w.left) / w.width) * 100}% ${((r.top + r.height / 2 - w.top) / w.height) * 100}%`,
            )
          }
          await wait(60)
          setZoom(2.2)
          await wait(1150)
          if (cancelled) return
          // cursor (content space) to the scene tab, then switch
          const sp = sceneSpanRef.current
          const cEl = contentRef.current
          if (sp && cEl) {
            const r = sp.getBoundingClientRect()
            const c = cEl.getBoundingClientRect()
            const s = c.width / 1190 || 1
            setAiCursor({
              x: (r.left - c.left) / s + r.width / (2 * s),
              y: (r.top - c.top) / s + r.height / (2 * s),
              visible: true,
              dur: 600,
            })
          }
          await wait(800)
          if (cancelled) return
          setGridMode('scene')
          await wait(950)
          if (cancelled) return
          setAiCursor((c) => ({ ...c, visible: false }))
          setZoom(1)
          await wait(900)
          setZoomOrigin('64% 10%')
          await wait(1900)
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
      ref={scaleWrapRef}
      className="relative bg-grayscale-10"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: zoomOrigin, // search bar by default; the video/scene tab when toggling
        transition: 'transform 750ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {view === 'editor' ? (
        <EditorView card={cards[pickIndex]} img={detail?.scenes?.[1]?.img || cards[pickIndex]?.img} />
      ) : view === 'split' ? (
        <SplitView detail={detail} title={cards[pickIndex]?.title} />
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
        <div ref={contentRef} className="relative flex w-[1190px] flex-col items-center gap-[24px]">
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
                    {cards[pickIndex]?.title}.mp4
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-[28px]">
              {/* AI buttons — shown on the detail screen (overview · scene-analysis tabs) */}
              {view === 'detail' && (
                <div className="flex items-center gap-[8px]">
                  {/* Secondary — pressed during the marketer segment-split step */}
                  <button
                    ref={aiSplitRef}
                    type="button"
                    className={`flex h-[32px] items-center rounded-[8px] border border-[#7b7b7b] px-[10px] py-[6px] text-[12px] font-semibold text-[#7b7b7b] transition-colors hover:bg-[#f5f5f5] active:bg-[#d9d9d9] ${
                      aiPressed ? 'bg-[#d9d9d9]' : ''
                    }`}
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
                  card={cards[pickIndex]}
                  detail={detail}
                  date={updatedAt}
                  tab={detailTab}
                  sceneTabRef={sceneTabRef}
                  tabCursor={tabCursor}
                  selectedScene={selectedScene}
                  sceneCheckRef={sceneCheckRef}
                  editBtnRef={editBtnRef}
                  vertical={!horizontal}
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
                    <div ref={gridToggleRef} className="flex items-center gap-[4px] rounded-[6px] bg-[#f5f5f5] p-[3px]">
                      {[
                        ['동영상', 'Video', 'video'],
                        ['장면', 'Scene', 'scene'],
                      ].map(([ko, en, mode]) => {
                        const on = gridMode === mode
                        return (
                          <span
                            key={mode}
                            ref={mode === 'scene' ? sceneSpanRef : null}
                            onClick={() => setGridMode(mode)}
                            className={`cursor-pointer rounded-[4px] px-[6px] py-[2px] text-[12px] font-medium tracking-[-0.3px] ${
                              on ? 'bg-white text-grayscale-800' : 'text-[#9d9d9d]'
                            }`}
                          >
                            {lang === 'en' ? en : ko}
                          </span>
                        )
                      })}
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
                    durRange={durRange}
                    sceneMode={gridMode === 'scene'}
                    lang={lang}
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

          {/* AI segment-split cursor — marketer flow, in the 1190-wide content space */}
          <FakeCursor x={aiCursor.x} y={aiCursor.y} visible={aiCursor.visible} dur={aiCursor.dur} />
        </div>
      </div>
      )}
    </div>
  )
}
