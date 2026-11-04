import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import Reveal from '../../components/Reveal.jsx'
import { DATA_PATH, COLLECTION_SLUGS, collectionPath, useDataCopy } from '../../data/dataMarket.js'
import { A, Button, IconTile } from '../../components/data/ui.jsx'
import { OrDivider, QuickRequest, RequestFlow, SampleForm, SamplePackage, SegmentedControl } from '../../components/data/RequestBlocks.jsx'

// /request — sample request (Figma: KO / 07 샘플 요청 /request).
// ?mode=1 opens on "맞춤 데이터 요청". Nothing is pre-selected.

const COL = 'mx-auto w-full max-w-[1168px] px-5 md:px-8 xl:px-0'
const INNER = 'xl:ml-[264px] xl:max-w-[904px]'

export function DataRequest() {
  const d = useDataCopy().request
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('mode') === '1' ? 1 : 0)

  return (
    <div className="bg-snow pb-[160px] pt-[200px] max-lg:pt-[140px] max-sm:pb-20 max-sm:pt-[110px]">
      <div className={`${COL} relative`}>
        <p className="absolute left-0 top-3 hidden text-[16px] font-medium tracking-[-0.03em] text-ink-mute xl:block">{d.breadcrumb}</p>
        <div className={INNER}>
          <Reveal>
            <h1 className="text-[40px] font-extrabold leading-[1.5] tracking-[-0.03em] text-ink max-md:text-[32px] max-sm:text-[26px]">
              {d.titleLines.map((l, i) => (
                <span key={l} className="block">
                  {i > 0 && ' '}
                  {l}
                </span>
              ))}
            </h1>
            <div className="mt-8">
              <SegmentedControl options={d.segments} value={mode} onChange={setMode} />
            </div>
          </Reveal>
          <Reveal className="mt-14 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <RequestFlow />
            <SamplePackage />
          </Reveal>
          <Reveal className="mt-14">
            <QuickRequest />
          </Reveal>
          <div className="my-[30px]">
            <OrDivider />
          </div>
          <Reveal>
            <SampleForm key={mode} mode={mode} />
          </Reveal>
        </div>
      </div>
    </div>
  )
}

// /request/done (Figma: KO / 08 제출 완료). The form passes a one-line summary in
// router state; a direct visit simply leaves the summary row out.
export function DataSubmitted() {
  const d = useDataCopy().submitted
  const { state } = useLocation()
  const summary = state?.summary
  return (
    <div className="bg-snow pb-24 pt-[168px] max-sm:pb-16 max-sm:pt-[108px]">
      <div className="mx-auto w-full max-w-[720px] px-5 md:px-0">
        <Reveal className="rounded-[24px] border border-line bg-white px-14 pb-14 pt-14 max-sm:px-6 max-sm:pb-10 max-sm:pt-10">
          <div className="flex flex-col items-center text-center">
            <span className="p-2">
              <IconTile icon={A('icon-check-big.svg')} size={76} iconSize={34} radius={38} />
            </span>
            <h1 className="mt-6 text-[32px] font-extrabold tracking-[-0.03em] text-ink max-sm:text-[24px]">{d.title}</h1>
            <p className="mt-3 text-[18px] font-semibold tracking-[-0.03em] text-ink-soft max-sm:text-[16px]">{d.body}</p>
          </div>
          <hr className="mt-12 border-mist" />
          {summary && (
            <div className="mt-10 flex items-center justify-between gap-6 rounded-[12px] bg-snow px-5 py-[19px] max-sm:flex-col max-sm:items-start max-sm:gap-1">
              <span className="shrink-0 text-[14px] font-bold tracking-[-0.03em] text-ink">{d.summaryLabel}</span>
              <span className="text-right text-[14px] font-semibold tracking-[-0.03em] text-ink max-sm:text-left">{summary}</span>
            </div>
          )}
          <p className="mt-10 text-[16px] font-bold tracking-[-0.03em] text-ink">{d.stepsTitle}</p>
          <ol className="relative mt-5 flex flex-col gap-6">
            <span aria-hidden className="absolute bottom-6 left-[13px] top-4 w-[2px] bg-line" />
            {d.steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-4">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                    i === 0 ? 'bg-accent text-white' : 'border-[1.5px] border-accent bg-white text-accent'
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="pt-[3px] text-[16px] font-bold tracking-[-0.03em] text-ink">{s.title}</p>
                  <p className="mt-1.5 text-[14px] tracking-[-0.03em] text-ink">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-[74px] flex flex-wrap justify-center gap-3 max-sm:mt-12">
            <Button to={DATA_PATH} type="soft" className="h-[52px] rounded-[26px] text-[14px]">{d.buttons[0]}</Button>
            <Button to={`${collectionPath(COLLECTION_SLUGS[0])}#delivery`} className="h-[52px] rounded-[26px]">{d.buttons[1]}</Button>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
