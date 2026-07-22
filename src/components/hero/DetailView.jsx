import { Play, SkipBack, SkipForward, Volume2, RotateCcw, Search, Copy, Check } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext.jsx'
import { SPEAKER_COLOR } from './constants.js'
import { FakeCursor } from './atoms.jsx'

// Speaker badge colors (A red, B green) — matches Figma 화자 component.

export function ScriptRow({ speaker, time, text }) {
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
export function SceneCard({ img, label, range, dur, summary, selected, checkRef, vertical }) {
  // Thumbnail keeps the source ratio: 16:9 landscape, or 9:16 portrait (taller card).
  return (
    <div
      className={`flex items-stretch overflow-hidden rounded-[10px] bg-white ${
        vertical ? 'h-[160px]' : 'h-[102px]'
      } ${selected ? 'border-2 border-navy-500' : 'border border-neutral-100'}`}
    >
      <div
        className={`relative h-full shrink-0 overflow-hidden bg-black ${
          vertical ? 'w-[112px]' : 'w-[180px]'
        }`}
      >
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
export function DetailView({
  card,
  detail,
  date,
  tab,
  sceneTabRef,
  tabCursor,
  selectedScene,
  sceneCheckRef,
  editBtnRef,
  vertical,
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
                  vertical={vertical}
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
