import { useState } from 'react'
import { Check as CheckIcon, ChevronDown } from 'lucide-react'
import PrivacyModal from '../components/PrivacyModal.jsx'
import Reveal from '../components/Reveal.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'

function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border p-[3px] transition-colors ${
        checked ? 'border-navy-500 bg-navy-500' : 'border-neutral-100 bg-white'
      }`}
    >
      {checked && <CheckIcon size={16} strokeWidth={3} className="text-white" />}
    </button>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-1">
        <span className="text-base font-medium tracking-[-0.4px] text-grayscale-800">{label}</span>
        {required && <span className="text-[#fa5252]">*</span>}
      </div>
      {children}
    </div>
  )
}

const inputCls =
  'w-full rounded-[10px] border border-grayscale-500 px-4 py-3 text-sm font-medium tracking-[-0.35px] text-grayscale-800 placeholder:text-neutral-300 focus:border-navy-500 focus:outline-none'

export default function Contact() {
  const { t, lang } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', message: '' })
  const [agreeRequired, setAgreeRequired] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)
  const [marketingOpen, setMarketingOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const canSubmit =
    form.name.trim() &&
    form.phone.trim() &&
    form.email.trim() &&
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
        body: JSON.stringify({ ...form, marketingAgreed: agreeMarketing }),
      })
      if (!res.ok) throw new Error('전송 실패')

      alert(
        t(
          '상담 신청이 접수되었습니다. 곧 연락드리겠습니다.',
          'Your request has been received. We’ll be in touch shortly.',
        ),
      )
      setForm({ name: '', phone: '', email: '', company: '', message: '' })
      setAgreeRequired(false)
      setAgreeMarketing(false)
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

  return (
    <div className="bg-grayscale-10">
      <section className="mx-auto flex min-h-[1180px] max-w-page items-start justify-center gap-20 px-[60px] pb-[120px] pt-[200px] max-lg:flex-col max-lg:items-center max-lg:min-h-0 max-lg:gap-10 max-lg:px-8 max-lg:pt-[120px] max-lg:pb-[80px] max-sm:px-5 max-sm:pt-[100px]">
        {/* Left headline — top-anchored so it stays put when the form card grows */}
        <Reveal className="flex shrink-0 flex-col gap-4 pt-[60px] max-lg:pt-0 max-lg:items-center max-lg:text-center max-lg:w-full max-lg:max-w-[671px] max-lg:shrink">
          <h1 className="font-product text-[48px] font-bold leading-[1.4] tracking-[0.8px] max-md:text-[34px] max-sm:text-[28px]">
            <span className="block text-navy-500">{t('데모 상담 신청', 'Request a Demo')}</span>
            <span className="block text-grayscale-800">{t('찾지 말고, 검색하세요', 'Don’t search by hand. Just search.')}</span>
          </h1>
          <p className="text-base leading-[1.5] tracking-[0.32px] text-grayscale-500">
            {lang === 'en' ? (
              <>
                In a 15-minute consultation, we’ll diagnose where time leaks in your
                <br />
                current video workflow and the hours Heimdex can save you.
              </>
            ) : (
              <>
                15분 상담으로 지금 영상 관리에서 어디서 시간이 새는지 진단하고,
                <br />
                하임덱스가 줄여줄 작업 시간을 함께 계산해드립니다.
              </>
            )}
          </p>
        </Reveal>

        {/* Form card */}
        <Reveal className="shrink-0 max-lg:w-full max-lg:max-w-[671px] max-lg:shrink" delay={120}>
        <form
          onSubmit={onSubmit}
          className="flex w-[671px] shrink-0 -translate-y-[20px] translate-x-[40px] flex-col gap-6 rounded-[10px] bg-white p-[30px] shadow-card max-lg:w-full max-lg:translate-x-0 max-lg:translate-y-0 max-lg:shrink max-sm:p-5"
        >
          <div className="flex flex-col gap-[20px]">
            <div className="flex gap-[10px] max-sm:flex-col">
              <Field label={t('이름', 'Name')} required>
                <input className={inputCls} placeholder={t('이름을 입력해주세요.', 'Enter your name.')} value={form.name} onChange={set('name')} />
              </Field>
              <Field label={t('연락처', 'Phone')} required>
                <input className={inputCls} placeholder={t('대시(-)를 제외한 숫자만 입력해주세요.', 'Numbers only, no dashes.')} value={form.phone} onChange={set('phone')} inputMode="numeric" />
              </Field>
            </div>
            <Field label={t('이메일주소', 'Email')} required>
              <input className={inputCls} placeholder={t('이메일 주소를 입력해주세요.', 'Enter your email address.')} type="email" value={form.email} onChange={set('email')} />
            </Field>
            <Field label={t('회사명', 'Company')}>
              <input className={inputCls} placeholder={t('회사명을 입력해주세요.', 'Enter your company name.')} value={form.company} onChange={set('company')} />
            </Field>
            <Field label={t('문의내용', 'Message')}>
              <div className="relative">
                <textarea
                  className={`${inputCls} h-[93px] resize-none`}
                  placeholder={t('내용을 입력해주세요.', 'Enter your message.')}
                  maxLength={300}
                  value={form.message}
                  onChange={set('message')}
                />
                <span
                  className={`pointer-events-none absolute bottom-3 right-4 text-sm transition-colors ${
                    form.message.length ? 'text-navy-500' : 'text-[#dcdce4]'
                  }`}
                >
                  {form.message.length}/300
                </span>
              </div>
            </Field>
          </div>

          <div className="h-px w-full bg-neutral-100" />

          {/* Consent */}
          <div className="flex flex-col gap-6">
            <h2 className="text-base font-bold tracking-[-0.4px] text-grayscale-800">
              {t('개인정보 수집 및 이용에 관한 동의', 'Consent to collection and use of personal information')}
            </h2>

            <div className="flex flex-col gap-4">
              {/* Required */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  <Checkbox checked={agreeRequired} onChange={() => setAgreeRequired((v) => !v)} />
                  <span className="flex items-center gap-1 text-sm font-semibold tracking-[-0.35px]">
                    <span className="text-grayscale-800">{t('개인정보 처리방침에 동의합니다.', 'I agree to the Privacy Policy.')}</span>
                    <span className="text-navy-500">{t('(필수)', '(Required)')}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="text-sm font-medium tracking-[-0.35px] text-grayscale-500 hover:text-grayscale-800"
                >
                  {t('전문보기', 'View full text')}
                </button>
              </div>

              {/* Marketing (expandable) — always top-aligned so the label doesn't shift on toggle */}
              <div className="flex w-full items-start gap-[10px]">
                <Checkbox checked={agreeMarketing} onChange={() => setAgreeMarketing((v) => !v)} />
                <div className="flex flex-1 flex-col">
                  <span className="py-px text-sm font-semibold tracking-[-0.35px] text-grayscale-800">
                    {t('하임덱스의 마케팅 정보를 수신하는 데 동의합니다.', 'I agree to receive marketing information from Heimdex.')}
                    <span className="text-navy-500"> {t('(선택)', '(Optional)')}</span>
                  </span>
                  {/* expandable detail with a smooth height + fade transition */}
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      marketingOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-[10px] text-xs font-medium leading-[1.6] tracking-[-0.3px] text-grayscale-800">
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
                  className="shrink-0 text-neutral-300 transition-colors hover:text-grayscale-500"
                >
                  <ChevronDown
                    size={24}
                    className={`transition-transform duration-300 ease-out ${
                      marketingOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`h-11 w-full rounded-lg text-base font-medium transition-colors ${
              canSubmit
                ? 'bg-navy-500 text-white hover:bg-[#1b3c5e]'
                : 'cursor-not-allowed bg-neutral-100 text-neutral-300'
            }`}
          >
            {submitting
              ? t('전송 중...', 'Sending...')
              : t('상담 신청하기', 'Request a Consultation')}
          </button>
        </form>
        </Reveal>
      </section>

      <PrivacyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
