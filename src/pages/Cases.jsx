import Reveal from '../components/Reveal.jsx'
import { Chip, DarkCta, IndustryImage, MoreLink } from '../components/Sections.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { INDUSTRIES, industryPath } from '../data/industries.js'
import { TESTIMONIALS } from '../data/testimonials.js'

// 도입 사례 — GNB item and the main slider's "전체 보기" target. The wireframe has
// no design for it yet, so it lists every customer quote by industry (priority order).
export default function Cases() {
  const { lang, t } = useLang()
  const en = lang === 'en'
  const groups = INDUSTRIES.filter((i) => TESTIMONIALS[i.slug]?.length)

  return (
    <div>
      <section className="hx-section pb-16 pt-[140px] max-sm:pt-[112px]">
        <Reveal className="mx-auto max-w-[1200px]">
          <p className="hx-eyebrow">{t('도입 사례', 'Customer stories')}</p>
          <h1 className="mt-3 text-[52px] font-bold leading-[1.25] tracking-[-1.5px] text-ink max-md:text-[36px] max-sm:text-[30px]">
            {t('현장에서 먼저 쓰고 있습니다', 'Already at work in the field')}
          </h1>
        </Reveal>
      </section>

      <section className="hx-section pb-[120px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
          {groups.map((ind) =>
            TESTIMONIALS[ind.slug].map((q) => (
              <Reveal
                key={q.who + ind.slug}
                className="grid grid-cols-[1.4fr_1fr] overflow-hidden rounded-[22px] border border-line bg-white max-md:grid-cols-1"
              >
                <div className="flex flex-col p-10 max-sm:p-6">
                  <Chip className="self-start">{en ? ind.nameEn : ind.name}</Chip>
                  <blockquote className="mt-5 flex-1 text-[20px] font-medium leading-[1.6] text-ink max-sm:text-[17px]">
                    “{en ? q.quoteEn : q.quote}”
                  </blockquote>
                  <p className="mt-5 text-[15px] text-ink-sub">— {en ? q.whoEn : q.who}</p>
                  <MoreLink to={industryPath(ind.slug)} className="mt-5">
                    {en ? `Heimdex for ${ind.nameEn}` : `${ind.name} 솔루션 보기`}
                  </MoreLink>
                </div>
                <div className="relative min-h-[220px] bg-[#E5E8EB]">
                  <div className="absolute inset-0">
                    <IndustryImage industry={ind} />
                  </div>
                </div>
              </Reveal>
            )),
          )}
        </div>
      </section>

      <DarkCta
        lines={[t('다음 도입 사례의 주인공이', 'Your team could be'), t('되어 보세요', 'the next story')]}
        sub={t('무료 1달 PoC로 우리 영상 데이터에서 먼저 확인해 보세요.', 'See it on your own footage first with a free 1-month PoC.')}
      />
    </div>
  )
}
