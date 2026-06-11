import { useSearchParams } from 'react-router-dom'
import { PRIVACY } from '../data/privacy.js'
import { TERMS } from '../data/terms.js'
import { Blocks } from '../components/PolicyBlocks.jsx'

const DOCS = { terms: TERMS, privacy: PRIVACY }
const TABS = [
  { id: 'terms', label: '서비스 이용약관' },
  { id: 'privacy', label: '개인정보 처리방침' },
]

export default function Policy() {
  const [params, setParams] = useSearchParams()
  const tab = DOCS[params.get('tab')] ? params.get('tab') : 'terms'
  const doc = DOCS[tab]

  return (
    <div className="bg-grayscale-10">
      <section className="mx-auto flex max-w-[920px] flex-col items-center px-[60px] pb-[120px] pt-[140px]">
        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-card">
          {TABS.map((t) => {
            const active = t.id === tab
            return (
              <button
                key={t.id}
                onClick={() => setParams({ tab: t.id })}
                className={`rounded-full px-4 py-[10px] text-sm font-semibold tracking-[-0.35px] transition-colors ${
                  active ? 'bg-softblue-50 text-navy-500' : 'text-neutral-300 hover:text-grayscale-500'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Document */}
        <article className="mt-12 w-full text-sm text-grayscale-800">
          <h1 className="text-2xl font-bold tracking-[-0.5px]">{doc.title}</h1>
          {doc.intro && <p className="mt-6 leading-[1.7] text-grayscale-500">{doc.intro}</p>}
          <div className="mt-8 space-y-7">
            {doc.sections.map((sec) => (
              <section key={sec.title}>
                <h2 className="mb-2 text-base font-bold leading-[1.5]">{sec.title}</h2>
                <div className="space-y-2 text-grayscale-500">
                  <Blocks blocks={sec.blocks} />
                </div>
              </section>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
