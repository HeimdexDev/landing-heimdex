import { useState } from 'react'
import { Check as CheckIcon, ChevronDown } from 'lucide-react'
import PrivacyModal from '../components/PrivacyModal.jsx'
import Reveal from '../components/Reveal.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { useDataCopy } from '../data/dataMarket.js'

function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-colors ${
        checked ? 'border-hx bg-hx' : 'border-line bg-white'
      }`}
    >
      {checked && <CheckIcon size={16} strokeWidth={3} className="text-white" />}
    </button>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-1 flex-col gap-[13px]">
      <div className="flex items-center gap-1 text-[14px] tracking-[-0.03em]">
        <span className="font-semibold text-ink-soft">{label}</span>
        {required && <span className="font-bold text-[#D81D2F]">*</span>}
      </div>
      {children}
    </div>
  )
}

// Figma KO / 09 문의하기: filled grey inputs, no border.
const inputCls =
  'h-14 w-full rounded-[12px] bg-snow px-4 text-[14px] tracking-[-0.03em] text-ink placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-accent/40'

export default function Contact() {
  const { t, lang } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', jobTitle: '', message: '' })
  const [agreeRequired, setAgreeRequired] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)
  const [marketingOpen, setMarketingOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState({ email: false, phone: false })
  const [website, setWebsite] = useState('') // bot trap (honeypot): a field hidden from humans

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const markTouched = (k) => () => setTouched((s) => ({ ...s, [k]: true }))

  const emailOk = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>".]{2,}$/.test(form.email.trim())
  const phoneDigits = form.phone.replace(/\D/g, '')
  const phoneOk = phoneDigits.length >= 7 && phoneDigits.length <= 15
  const canSubmit =
    form.name.trim() &&
    phoneOk &&
    emailOk &&
    agreeRequired &&
    !submitting

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          marketingAgreed: agreeMarketing,
          privacyAgreed: agreeRequired,
          lang,
          website,
          pageUri: window.location.href,
          pageName: document.title,
        }),
      })
      if (!res.ok) throw new Error('전송 실패')

      alert(
        t(
          '상담 신청이 접수되었습니다. 곧 연락드리겠습니다.',
          'Your request has been received. We’ll be in touch shortly.',
        ),
      )
      setForm({ name: '', phone: '', email: '', company: '', jobTitle: '', message: '' })
      setAgreeRequired(false)
      setAgreeMarketing(false)
      setTouched({ email: false, phone: false })
    } catch {
      alert(
        t(
          '전송에 실패했습니다. 잠시 후 다시 시도해주세요.',
          'Submission failed. Please try again in a moment.',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const d = useDataCopy().contact
  return (
    <div className="bg-snow">
      <section className="mx-auto w-full max-w-[1168px] px-5 pb-40 pt-[200px] md:px-8 xl:px-0 max-lg:pt-[140px] max-sm:pb-20 max-sm:pt-[110px]">
        <div className="relative xl:ml-[264px] xl:max-w-[904px]">
          <p className="absolute -left-[264px] top-3 hidden text-[16px] font-medium tracking-[-0.03em] text-ink-mute xl:block">{d.breadcrumb}</p>
          <Reveal>
            <h1 className="text-[40px] font-extrabold leading-[1.5] tracking-[-0.03em] text-ink max-md:text-[32px] max-sm:text-[26px]">
              {d.titleLines.map((l, i) => (
                <span key={l} className="block">
                  {i > 0 && ' '}
                  {l}
                </span>
              ))}
            </h1>
            <p className="mt-4 text-[18px] leading-[1.5] tracking-[-0.03em] text-ink-sub max-sm:text-[16px]">
              {d.bodyLines.map((l, i) => (
                <span key={l} className="block">
                  {i > 0 && ' '}
                  {l}
                </span>
              ))}
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-[50px]">
            <form onSubmit={onSubmit} className="relative flex flex-col rounded-[24px] bg-white px-11 pb-11 pt-11 max-md:px-6 max-sm:px-5">
              {/* bot trap (honeypot): hidden from humans; if filled, the server ignores the submission */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
              />
              <div className="flex flex-col gap-7">
                <div className="flex gap-4 max-sm:flex-col max-sm:gap-7">
                  <Field label={d.name} required>
                    <input className={inputCls} placeholder={d.namePh} value={form.name} onChange={set('name')} maxLength={100} />
                  </Field>
                  <Field label={d.phone} required>
                    <input className={inputCls} placeholder={d.phonePh} value={form.phone} onChange={set('phone')} onBlur={markTouched('phone')} inputMode="numeric" maxLength={30} />
                    {touched.phone && form.phone.trim() && !phoneOk && (
                      <span className="-mt-1.5 text-[12px] font-medium tracking-[-0.03em] text-[#D81D2F]">{t('숫자 7자리 이상 입력해주세요.', 'Enter at least 7 digits.')}</span>
                    )}
                  </Field>
                </div>
                <Field label={d.email} required>
                  <input className={inputCls} placeholder={d.emailPh} type="email" value={form.email} onChange={set('email')} onBlur={markTouched('email')} maxLength={254} />
                  {touched.email && form.email.trim() && !emailOk && (
                    <span className="-mt-1.5 text-[12px] font-medium tracking-[-0.03em] text-[#D81D2F]">{t('유효한 이메일 형식이 아닙니다.', 'Enter a valid email address.')}</span>
                  )}
                </Field>
                <div className="flex gap-4 max-sm:flex-col max-sm:gap-7">
                  <Field label={d.company}>
                    <input className={inputCls} placeholder={d.companyPh} value={form.company} onChange={set('company')} maxLength={200} />
                  </Field>
                  <Field label={d.jobTitle}>
                    <input className={inputCls} placeholder={d.jobTitlePh} value={form.jobTitle} onChange={set('jobTitle')} maxLength={100} />
                  </Field>
                </div>
                <Field label={d.message}>
                  <div className="relative">
                    <textarea
                      className="h-[120px] w-full resize-none rounded-[12px] border border-line bg-snow px-4 py-4 text-[14px] tracking-[-0.03em] text-ink placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-accent/40"
                      placeholder={d.messagePh}
                      maxLength={300}
                      value={form.message}
                      onChange={set('message')}
                    />
                    <span className="pointer-events-none absolute bottom-3 right-4 text-[12px] tracking-[-0.03em] text-ink-mute">{form.message.length}/300</span>
                  </div>
                </Field>
              </div>

              <div className="mt-10 h-px w-full bg-mist" />

              {/* Consent */}
              <div className="mt-8 flex flex-col">
                <h2 className="text-[18px] font-bold tracking-[-0.03em] text-ink">{d.consentTitle}</h2>
                <div className="mt-7 flex flex-col gap-5">
                  <div className="flex items-center justify-between gap-4 py-1.5">
                    <div className="flex items-center gap-5">
                      <Checkbox checked={agreeRequired} onChange={() => setAgreeRequired((v) => !v)} />
                      <span className="flex flex-wrap items-center gap-2 text-[16px] tracking-[-0.03em] max-sm:text-[14px]">
                        <span className="font-medium text-ink-soft">{d.consentRequired}</span>
                        <span className="font-bold text-[#2F4B7C]">{d.required}</span>
                      </span>
                    </div>
                    <button type="button" onClick={() => setModalOpen(true)} className="shrink-0 text-[16px] tracking-[-0.03em] text-ink-mute hover:text-ink max-sm:text-[14px]">
                      {d.viewFull}
                    </button>
                  </div>

                  {/* Marketing (expandable) */}
                  <div className="flex w-full items-start gap-5 py-1.5">
                    <Checkbox checked={agreeMarketing} onChange={() => setAgreeMarketing((v) => !v)} />
                    <div className="flex flex-1 flex-col">
                      <span className="flex flex-wrap items-center gap-2 pt-0.5 text-[16px] tracking-[-0.03em] max-sm:text-[14px]">
                        <span className="font-medium text-ink-soft">{d.consentOptional}</span>
                        <span className="font-bold text-[#2F4B7C]">{d.optional}</span>
                      </span>
                      <div className={`grid transition-all duration-300 ease-out ${marketingOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="pt-[10px] text-[13px] font-medium leading-[1.6] tracking-[-0.03em] text-ink-sub">
                            <p>{t('하임덱스의 서비스 업데이트 및 이벤트 정보를 수신하는 데 동의합니다.', 'I agree to receive Heimdex service updates and event information.')}</p>
                            <ul className="list-disc pl-[18px]">
                              <li>{t('수집 항목: 이메일 주소, 휴대전화 번호', 'Items collected: email address, mobile phone number')}</li>
                              <li>{t('수집 목적: 신규 기능 안내, 웨비나/이벤트 초대, 맞춤형 비즈니스 솔루션 제안', 'Purpose: new feature announcements, webinar/event invitations, tailored business-solution proposals')}</li>
                              <li>{t('보유 기간: 동의 철회 시 또는 회원 탈퇴 시까지', 'Retention period: until consent is withdrawn or the account is closed')}</li>
                            </ul>
                            <p className="mt-3">
                              {t(
                                '해당 내용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부할 경우 주요 업데이트 안내를 받지 못할 수 있습니다.',
                                'You have the right to decline this consent. However, if you decline, you may not receive important update announcements.',
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMarketingOpen((v) => !v)}
                      aria-label={marketingOpen ? t('접기', 'Collapse') : t('펼치기', 'Expand')}
                      className="shrink-0 text-ink-mute transition-colors hover:text-ink-sub"
                    >
                      <ChevronDown size={24} className={`transition-transform duration-300 ease-out ${marketingOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-[46px] h-12 w-full rounded-[28px] bg-hx text-[16px] font-bold tracking-[-0.03em] text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? t('전송 중...', 'Sending...') : d.submit}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <PrivacyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
