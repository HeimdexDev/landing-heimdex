import { useEffect, useRef, useState } from 'react'
import {
  PanelLeft, Video, Image as ImageIcon, UserRound, Scissors, Save, Settings,
  ChevronLeft, ArrowUpDown, ChevronDown, Filter, Check, Bolt, Play, SkipBack,
  SkipForward, Volume2, RotateCcw, X,
} from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext.jsx'
import { SPLIT_TAG, SPLIT_TAG_ORDER } from './constants.js'
import { NavItem, FakeCursor } from './atoms.jsx'

// Segment split results — tag palette (Figma 2454:211994 dropdown).

export function TagChip({ tag, t, onRemove }) {
  const tg = SPLIT_TAG[tag] || SPLIT_TAG.etc
  return (
    <span
      className="flex items-center gap-[2px] rounded-[6px] px-[7px] py-[3px] text-[12px] font-semibold tracking-[-0.3px]"
      style={{ backgroundColor: tg.bg, color: tg.fg }}
    >
      {t(tg.ko, tg.en)}
      {onRemove && (
        <button type="button" onClick={onRemove} className="flex items-center">
          <X size={14} />
        </button>
      )}
    </span>
  )
}

// One split-segment video card (Figma 2454:211966).
export function SplitCard({ n, img, tag, product, desc, range, t, selected, onSelect, selectRef }) {
  return (
    <div
      ref={selectRef}
      onClick={onSelect}
      className={`flex cursor-pointer items-stretch overflow-hidden rounded-[10px] bg-white ${
        selected ? 'border-2 border-navy-500' : 'border border-neutral-100'
      }`}
    >
      {/* video section */}
      <div className="relative flex h-[168px] w-[100px] shrink-0 flex-col items-start justify-between overflow-hidden p-[6px]">
        {img && <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        <span className="relative flex items-center justify-center rounded-[4px] bg-black/50 px-[4px] text-[10px] font-medium text-white">
          {String(n).padStart(2, '0')}
        </span>
        <span className="relative flex items-center justify-center rounded-[3px] bg-black/50 px-[4px] text-[10px] text-white">
          0:10
        </span>
      </div>
      {/* content */}
      <div className="flex flex-1 flex-col justify-between overflow-hidden p-[10px]">
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-start justify-between gap-[8px]">
            <div className="flex flex-col items-start gap-[4px]">
              <TagChip tag={tag} t={t} />
              <span className="flex items-center rounded-[6px] bg-[#f2f2f2] px-[7px] py-[3px] text-[12px] font-semibold tracking-[-0.3px] text-[#535353]">
                {product}
              </span>
            </div>
            {/* default checkbox shows only when not selected (selected = outline only) */}
            {!selected && (
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border border-neutral-300 bg-white">
                <Check size={14} strokeWidth={2.5} className="text-neutral-300" />
              </span>
            )}
          </div>
          <p className="line-clamp-3 text-[13px] font-medium leading-[1.4] tracking-[-0.325px] text-neutral-800">
            {desc}
          </p>
        </div>
        <p className="text-[12px] font-medium tracking-[-0.3px] text-neutral-500">{range}</p>
      </div>
    </div>
  )
}

// Preview section (Figma 2454:212733) — video + selected range + scrollable script.
export function PreviewSection({ card, product, t, script, scriptRef, onClose }) {
  const lines = (script || []).map((s) => ({ sp: s.speaker, time: s.time, text: s.text }))
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[10px] overflow-hidden rounded-[10px] bg-white px-[20px] pb-[10px] pt-[20px] shadow-[0_4px_20px_0_#e8e9f8]">
      {/* tab header (Figma 2454:214894) */}
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center border-b border-neutral-100">
          <div className="flex h-[32px] w-[110px] items-start justify-center border-b-2 border-navy-500 pb-[2px]">
            <p className="text-[16px] font-semibold tracking-[-0.4px] text-grayscale-800">{t('미리보기', 'Preview')}</p>
          </div>
          <div className="flex h-[32px] w-[110px] items-start justify-center pb-[2px]">
            <p className="text-[16px] font-semibold tracking-[-0.4px] text-grayscale-500">{t('제품 설정', 'Product')}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="flex shrink-0">
          <X size={24} className="text-grayscale-800" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
        {/* video preview — Figma ratio 321:570 (9:16) */}
        <div className="relative flex aspect-[321/570] w-full shrink-0 items-end justify-center overflow-hidden rounded-[9px] bg-black">
          {card?.img && <img src={card.img} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="relative z-10 flex w-full flex-col gap-[10px] p-[9px]">
            <div className="relative h-[4px] w-full bg-white/90">
              <div className="absolute left-0 top-0 h-full w-[42%] bg-navy-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-black/50">
                  <Play size={16} fill="white" className="text-white" />
                </span>
                <span className="flex h-[28px] items-center gap-[8px] rounded-full bg-black/50 px-[8px]">
                  <SkipBack size={16} className="text-white" />
                  <SkipForward size={16} className="text-white" />
                </span>
                <span className="flex h-[28px] items-center rounded-full bg-black/50 px-[8px] text-[12px] font-medium text-white">
                  00:00:02 / 00:00:18
                </span>
              </div>
              <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-black/50">
                <Volume2 size={16} className="text-white" />
              </span>
            </div>
          </div>
        </div>
        {/* Selected Range */}
        <div className="flex shrink-0 flex-col gap-[7px] rounded-[10px] border border-neutral-100 p-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold tracking-[-0.3px] text-neutral-800">
              {t('선택 구간', 'Selection')}
            </span>
            <span className="flex items-center gap-[10px] text-[12px] font-medium tracking-[-0.3px] text-neutral-500">
              {card?.range}
              <RotateCcw size={16} />
            </span>
          </div>
          <div className="relative h-[4px] w-full rounded-full bg-neutral-100">
            <div className="absolute left-0 top-0 h-full w-[42%] rounded-full bg-navy-500" />
            <div className="absolute left-[39%] top-1/2 h-[13px] w-[16px] -translate-y-1/2 rounded-full bg-navy-500" />
          </div>
        </div>
        {/* script — only this part scrolls */}
        <div className="flex min-h-0 flex-1 flex-col gap-[20px] overflow-hidden">
          <div className="flex items-center gap-[4px]">
            <TagChip tag={card?.tag} t={t} />
            <span className="flex items-center rounded-[6px] bg-[#f2f2f2] px-[7px] py-[3px] text-[13px] font-medium tracking-[-0.3px] text-[#535353]">
              {product}
            </span>
          </div>
          <div ref={scriptRef} className="flex min-h-0 flex-1 flex-col gap-[10px] overflow-y-auto pr-[6px]">
            {lines.map((l, i) => (
              <div key={i} className="flex gap-[8px]">
                <div className="flex shrink-0 items-center gap-[4px]">
                  <span
                    className="flex h-[16px] w-[16px] items-center justify-center rounded-full text-[10px] font-medium text-white"
                    style={{ backgroundColor: l.sp === 'A' ? '#d53b49' : '#3fb675' }}
                  >
                    {l.sp}
                  </span>
                  <span className="text-[12px] font-medium tracking-[-0.3px] text-grayscale-500">{l.time}</span>
                </div>
                <p className="flex-1 text-[14px] font-medium leading-[1.6] tracking-[-0.35px] text-grayscale-800">
                  {l.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Segment split results screen (Figma 2454:211946 header + 211947 section + 211966 card).
export function SplitView({ detail, title }) {
  const { t, lang } = useLang()
  const en = lang === 'en'
  const scenes = detail?.scenes || []
  // tag-filter dropdown stays hidden until the filter button is clicked
  const [filterOpen, setFilterOpen] = useState(false)
  const [checkedTags, setCheckedTags] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false, dur: 600 })
  const [cam, setCam] = useState({ scale: 1, x: 0, y: 0 })
  const rootRef = useRef(null)
  const tagBtnRef = useRef(null)
  const rowRefs = useRef({})
  const cardSelectRef = useRef(null)
  const scriptScrollRef = useRef(null)

  // Demo: cursor clicks Tags → opens the dropdown → checks sale, then insert.
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
      await wait(900)
      if (cancelled) return
      let p = aim(tagBtnRef.current)
      if (p) setCursor({ ...p, visible: true, dur: 650 })
      await wait(800)
      if (cancelled) return
      setFilterOpen(true)
      await wait(650)
      if (cancelled) return
      p = aim(rowRefs.current.sale)
      if (p) setCursor({ ...p, visible: true, dur: 600 })
      await wait(700)
      if (cancelled) return
      setCheckedTags(['sale'])
      await wait(650)
      if (cancelled) return
      p = aim(rowRefs.current.insert)
      if (p) setCursor({ ...p, visible: true, dur: 600 })
      await wait(700)
      if (cancelled) return
      setCheckedTags(['sale', 'insert'])
      await wait(650)
      if (cancelled) return
      setFilterOpen(false)
      await wait(650)
      if (cancelled) return
      // pick the first filtered card → preview opens on the right
      p = aim(cardSelectRef.current)
      if (p) setCursor({ ...p, visible: true, dur: 650 })
      await wait(800)
      if (cancelled) return
      const first = scenes
        .map((s, i) => ({ ...s, n: i + 1 }))
        .find((s) => ['sale', 'insert'].includes(s.tag))
      setSelectedCard(first || null)
      await wait(1100)
      if (cancelled) return
      setCursor((c) => ({ ...c, visible: false }))
      // ── finale: camera zooms into the preview, pans top→bottom, scrolls script ──
      setCam({ scale: 1.7, x: -1378, y: -406 })
      await wait(1600)
      if (cancelled) return
      setCam({ scale: 1.7, x: -1378, y: -1010 })
      await wait(1500)
      if (cancelled) return
      // drag the script scrollbar down with the cursor
      const sc = scriptScrollRef.current
      const root = rootRef.current
      if (sc && root) {
        const r = sc.getBoundingClientRect()
        const rr = root.getBoundingClientRect()
        const s = rr.width / 1440 || 1
        const cx = (r.right - rr.left) / s - 6
        const topY = (r.top - rr.top) / s
        const h = r.height / s
        const max = sc.scrollHeight - sc.clientHeight
        setCursor({ x: cx, y: topY + 12, visible: true, dur: 400 })
        await wait(450)
        const steps = 26
        for (let i = 1; i <= steps; i++) {
          if (cancelled) return
          sc.scrollTop = (max * i) / steps
          setCursor({ x: cx, y: topY + 12 + (h - 24) * (i / steps), visible: true, dur: 90 })
          await wait(85)
        }
      }
      await wait(900)
      if (!cancelled) setCursor((c) => ({ ...c, visible: false }))
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Two extra split-only cards (vitamin B cuts) appended after the 11 scenes.
  const extra = [
    {
      img: '/assets/creative/mkt-extra-1.jpg',
      tag: 'insert',
      range: '00:01:50 - 00:02:00',
      summary: t('비타민B 제품을 클로즈업으로 비춘다.', 'The vitamin B product is shown in close-up.'),
    },
    {
      img: '/assets/creative/mkt-extra-2.jpg',
      tag: 'sale',
      range: '00:02:00 - 00:02:10',
      summary: t(
        '쇼호스트 옆에서 연구원이 비타민B 제품을 설명한다.',
        'A researcher beside the host explains the vitamin B product.',
      ),
    },
  ]
  // Grid filters to the selected tags (original card numbers kept).
  const visible = [...scenes, ...extra]
    .map((s, i) => ({ ...s, n: i + 1 }))
    .filter((s) => checkedTags.length === 0 || checkedTags.includes(s.tag))
  const count = checkedTags.length ? visible.length : 48

  const collapsed = !!selectedCard
  return (
    <div className="relative h-[1024px] w-[1440px] overflow-hidden bg-grayscale-10">
      {/* camera — frames the page; zooms into the preview for the finale */}
      <div
        ref={rootRef}
        className="flex h-[1024px] w-[1440px] text-left"
        style={{
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
          transformOrigin: '0 0',
          transition: 'transform 1400ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
      {/* LNB — same as the legal screen; collapses to icons when the preview opens */}
      {collapsed ? (
        <aside className="flex h-[1024px] w-[72px] shrink-0 flex-col items-center justify-between border-r border-neutral-100 bg-white py-[24px]">
          <div className="flex flex-col items-center gap-[28px]">
            <PanelLeft size={24} className="rotate-180 text-[#9d9d9d]" />
            {[Video, ImageIcon, UserRound, Scissors, Save].map((Icon, i) => (
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
      ) : (
        <aside className="flex h-[1024px] w-[250px] shrink-0 flex-col justify-between border-r border-neutral-100 bg-white p-[24px]">
          <div className="flex flex-col gap-[68px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-[6px]">
                <img src="/assets/logo-symbol.svg" alt="" className="h-[28px] w-[26px]" />
                <img src="/assets/logo-wordmark.svg" alt="heimdex" className="h-[19px] w-[92px]" />
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
      )}

      {/* content */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* GNB */}
        <div className="flex h-[80px] shrink-0 items-center justify-between px-[32px]">
          <div className="flex items-center gap-[20px]">
            <span className="flex items-center gap-[4px] text-[16px] tracking-[-0.4px] text-grayscale-500">
              <ChevronLeft size={24} className="text-grayscale-800" />
              {t('장면 분석', 'Scene Analysis')}
            </span>
            <span className="text-[18px] font-semibold tracking-[-0.45px] text-black">{title}.mp4</span>
          </div>
          <div className="flex items-center gap-[28px]">
            <div className="flex items-center gap-[8px]">
              {/* Secondary */}
              <span className="flex h-[32px] items-center rounded-[8px] border border-[#7b7b7b] px-[10px] py-[6px] text-[12px] font-semibold text-[#7b7b7b]">
                {t('다시 분석', 'Re-analyze')}
              </span>
              {/* Primary */}
              <span className="flex h-[32px] items-center rounded-[8px] bg-navy-500 px-[10px] py-[6px] text-[12px] font-semibold text-white">
                {t('선택 구간 편집', 'Edit Selected')}
              </span>
            </div>
            <div className="flex items-center gap-[12px]">
              <div className="flex flex-col items-end">
                <p className="text-[16px] font-medium tracking-[-0.4px] text-grayscale-800">{t('하임덱스', 'Heimdex')}</p>
                <p className="text-[12px] tracking-[-0.3px] text-grayscale-500">heimdex@heimdex.co</p>
              </div>
              <span className="flex items-center justify-center rounded-full bg-[#d9dae9] p-[8px]">
                <UserRound size={24} className="text-white" />
              </span>
            </div>
          </div>
        </div>

        {/* Body — grid section (+ preview when a card is selected), 24px below header */}
        <div className="flex min-h-0 flex-1 items-stretch gap-[24px] px-[32px] pb-[24px] pt-[24px]">
          {/* grid section (Figma 2454:211947) — shrinks to 932 when a card is selected */}
          <div
            className={`flex flex-col gap-[16px] overflow-hidden rounded-[10px] bg-white p-[20px] shadow-[0_4px_20px_0_#e8e9f8] ${
              selectedCard ? 'w-[932px] shrink-0' : 'flex-1'
            }`}
          >
            {/* toolbar */}
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-[20px]">
                <p className="text-[18px] font-semibold tracking-[-0.45px] text-black">
                  {t('구간 분할 결과', 'Segment Results')}{' '}
                  <span className="text-grayscale-500">
                    {count}
                    {t('개', '')}
                  </span>
                </p>
                {checkedTags.length > 0 && (
                  <div className="flex items-center gap-[4px]">
                    {checkedTags.map((k) => (
                      <TagChip
                        key={k}
                        tag={k}
                        t={t}
                        onRemove={() => setCheckedTags((c) => c.filter((x) => x !== k))}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-[20px]">
                {/* By time (Figma 2454:211952) */}
                <div className="flex items-center gap-[4px] rounded-[8px] border border-[#7b7b7b] p-[6px] text-[16px] font-medium tracking-[-0.4px] text-[#7b7b7b]">
                  <ArrowUpDown size={20} />
                  {t('시간순', 'By Time')}
                  <ChevronDown size={24} />
                </div>
                {/* Tags (Figma 2454:211957) + dropdown (hidden until clicked) */}
                <div className="relative">
                  <button
                    ref={tagBtnRef}
                    type="button"
                    onClick={() => setFilterOpen((o) => !o)}
                    className="flex items-center gap-[4px] rounded-[8px] border border-[#7b7b7b] p-[6px] text-[16px] font-medium tracking-[-0.4px] text-[#7b7b7b]"
                  >
                    <Filter size={20} />
                    {t('태그', 'Tags')}
                    <ChevronDown size={24} />
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-20 flex w-max flex-col rounded-[10px] bg-white py-[4px] shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)]">
                      {SPLIT_TAG_ORDER.map((k) => {
                        const on = checkedTags.includes(k)
                        return (
                          <div
                            key={k}
                            ref={(el) => (rowRefs.current[k] = el)}
                            className="flex items-center gap-[10px] px-[10px] py-[8px]"
                          >
                            <span
                              className={`flex h-[16px] w-[16px] items-center justify-center rounded-[4px] ${
                                on ? 'bg-navy-500' : 'border-[0.5px] border-neutral-300'
                              }`}
                            >
                              <Check
                                size={11}
                                strokeWidth={2.5}
                                className={on ? 'text-white' : 'text-neutral-300'}
                              />
                            </span>
                            <TagChip tag={k} t={t} />
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3-column grid — filtered by the selected tags */}
            <div className="grid w-full grid-cols-3 gap-[16px]">
              {visible.map((s, i) => (
                <SplitCard
                  key={s.n}
                  n={s.n}
                  img={s.img}
                  tag={s.tag}
                  product={t('비타민C', 'Vitamin C')}
                  desc={s.summary}
                  range={s.range}
                  t={t}
                  selected={selectedCard?.n === s.n}
                  onSelect={() => setSelectedCard((c) => (c?.n === s.n ? null : s))}
                  selectRef={i === 0 ? cardSelectRef : null}
                />
              ))}
            </div>
          </div>
          {selectedCard && (
            <PreviewSection
              card={selectedCard}
              product={t('비타민C', 'Vitamin C')}
              t={t}
              script={detail?.script}
              scriptRef={scriptScrollRef}
              onClose={() => setSelectedCard(null)}
            />
          )}
        </div>
      </div>

      {/* demo cursor — split page, in 1440-local coords (inside the camera) */}
      <FakeCursor x={cursor.x} y={cursor.y} visible={cursor.visible} dur={cursor.dur} />
      </div>
    </div>
  )
}
