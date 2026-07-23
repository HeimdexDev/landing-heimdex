import { useEffect, useRef, useState } from 'react'
import {
  Video, Image as ImageIcon, UserRound, Scissors, Save, PanelLeft, Settings,
  ChevronLeft, Search, ChevronDown, Plus, Minus, Bold, Italic, Underline,
  AlignLeft, AlignCenterHorizontal, Trash2, SkipBack, Play, SkipForward,
  Volume2, Maximize, SquareSplitHorizontal,
} from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext.jsx'
import { INITIAL_SCENES } from './constants.js'
import { FakeCursor } from './atoms.jsx'

// Tiny stepper pill used across the custom panel (− value +).
export function Stepper({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-[8px] rounded-[10px] border border-grayscale-300 bg-white px-[8px] py-[10px]">
      <Minus size={18} className="text-grayscale-500" />
      {Icon ? <Icon size={16} className="text-grayscale-500" /> : null}
      <span className="text-[14px] font-medium tracking-[-0.35px] text-grayscale-800">{value}</span>
      <Plus size={18} className="text-grayscale-500" />
    </div>
  )
}

export function PanelSlider({ value, percent = 0 }) {
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

export function EditorView({ card, img }) {
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
  // delete it via the trash button, then press Save.
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
      // 6) camera pulls back up to the header; cursor travels to the save button
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
      // 7) "Save complete" popup appears centered
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
              {/* Transform + Outline */}
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
              {/* Opacity */}
              <div className="flex flex-col gap-[10px]">
                <p className="text-[14px] font-semibold tracking-[-0.35px] text-grayscale-800">
                  {t('불투명도', 'Opacity')}
                </p>
                <PanelSlider value="100%" percent={100} />
              </div>
              {/* Shadow */}
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

// "Save complete" modal (Figma 2107:410685), centered in the visible frame.
export function SavePopup() {
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
