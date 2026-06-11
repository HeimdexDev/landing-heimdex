import { useSearchParams, Link } from 'react-router-dom'
import {
  ArrowUpRight,
  ChevronDown,
  ClockArrowDown,
  BrainCircuit,
  ShieldCheck,
} from 'lucide-react'
import { TABS, SOLUTIONS } from '../data/solutions.js'
import CtaBanner from '../components/CtaBanner.jsx'
import Reveal from '../components/Reveal.jsx'

const ICONS = { clock: ClockArrowDown, brain: BrainCircuit, shield: ShieldCheck }

export default function Solution() {
  const [params, setParams] = useSearchParams()
  const tab = SOLUTIONS[params.get('tab')] ? params.get('tab') : 'legal'
  const data = SOLUTIONS[tab]

  return (
    <div className="bg-grayscale-10">
      {/* ───────── Hero ───────── */}
      <section className="flex flex-col items-center px-[100px] pb-[140px] pt-[150px]">
        <div className="flex w-full max-w-[1240px] flex-col items-center gap-[120px]">
          {/* Tab pills */}
          <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-card">
            {TABS.map((t) => {
              const active = t.id === tab
              return (
                <button
                  key={t.id}
                  onClick={() => setParams({ tab: t.id })}
                  className={`flex w-[133px] items-center justify-center rounded-full px-4 py-[10px] text-lg font-semibold leading-[1.4] tracking-[-0.45px] transition-colors ${
                    active
                      ? 'bg-softblue-50 text-navy-500'
                      : 'text-neutral-300 hover:text-grayscale-500'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Hero copy + image */}
          <Reveal className="flex w-full items-center gap-[100px]">
            <div className="flex flex-1 flex-col items-start gap-10">
              <div className="flex flex-col gap-5">
                <p className="font-product text-2xl font-bold leading-[1.4] text-navy-500">
                  {data.label}
                </p>
                <h1 className="font-product text-[54px] font-bold leading-[1.4] text-grayscale-800">
                  {data.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
              </div>
              <Link to="/contact" className="btn-primary">
                한 달 무료신청
                <ArrowUpRight size={20} strokeWidth={2} />
              </Link>
            </div>
            <img
              src={data.hero}
              alt=""
              className="h-[313px] w-[515px] shrink-0 rounded-[10px] object-cover"
            />
          </Reveal>
        </div>

        {/* Question cards */}
        <Reveal className="mt-[120px] flex overflow-hidden rounded-[20px] bg-white shadow-card" delay={120}>
          {data.questions.map((q, i) => (
            <div
              key={i}
              className={`flex w-[400px] items-center justify-center px-6 py-10 text-center ${
                i === 1 ? 'border-x border-neutral-100' : ''
              }`}
            >
              <p className="text-lg font-semibold leading-[1.4] tracking-[-0.45px] text-navy-500">
                {q.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ───────── Steps ───────── */}
      <Reveal as="section" className="flex items-center justify-center py-[100px]">
        <div className="flex flex-col items-center gap-10">
          {data.steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-10">
              {i > 0 && <ChevronDown size={64} strokeWidth={1.5} className="text-grayscale-800" />}
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-[40px] font-bold leading-[1.4] tracking-[-1px] text-navy-500">
                  Step {i + 1}
                </p>
                <div className="flex flex-col items-center gap-6 text-grayscale-800">
                  <h3 className="text-4xl font-bold leading-[1.4] tracking-[-0.9px]">
                    {step.title}
                  </h3>
                  <p className="font-noto text-2xl leading-[1.4] tracking-[-0.6px]">
                    {step.desc.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ───────── Reasons ───────── */}
      <Reveal as="section" className="flex flex-col items-center gap-20 pb-[200px] pt-[100px]">
        <h2 className="text-center text-[40px] font-bold leading-[1.4] tracking-[-1px] text-neutral-800">
          <span className="text-navy-500">{data.reasonHighlight}</span>가
          <br />
          하임덱스를 선택하는 이유
        </h2>
        <div className="flex items-stretch">
          {data.reasons.map((r, i) => {
            const Icon = ICONS[r.icon]
            return (
              <div
                key={i}
                className={`flex w-[440px] flex-col items-center gap-10 p-[30px] text-center ${
                  i === 1 ? 'border-x border-neutral-300' : ''
                }`}
              >
                <Icon size={100} strokeWidth={1.5} className="text-navy-500" />
                <div className="flex flex-col items-center gap-5 text-grayscale-800">
                  <h3 className="text-[28px] font-bold leading-[1.4] tracking-[-0.7px]">
                    {r.title}
                  </h3>
                  <p className="font-noto text-lg leading-[1.4] tracking-[-0.45px]">
                    {r.desc.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Reveal>

      {/* ───────── CTA ───────── */}
      <Reveal>
        <CtaBanner
          title={data.cta.title}
          subtitle={
            <>
              <span className="font-semibold text-navy-500">{data.cta.highlight}</span>
              {data.cta.rest}
            </>
          }
        />
      </Reveal>
    </div>
  )
}
