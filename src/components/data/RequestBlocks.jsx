import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { trackLead } from '../../lib/analytics/ga.js'
import PrivacyModal from '../PrivacyModal.jsx'
import { useLang, localizePath } from '../../i18n/LanguageContext.jsx'
import { REQUEST_DONE_PATH, useDataCopy } from '../../data/dataMarket.js'
import { A, Chip, ConsentRow, IconTile, MarketingConsent, NumberBadge, inputCls } from './ui.jsx'

// Sample-request pieces shared by the /data landing ("샘플 요청" section) and the
// /request page: intro (segments · flow · sample package), the email-only quick
// card, and the full 9-question form.

const EMAIL_RE = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>".]{2,}$/ // same as api/contact.js

// POSTs to the same /api/contact endpoint as the demo form, tagged kind:'sample'
// (the API accepts it with only an e-mail).
async function sendSample(payload, formId) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // lang/page context let /api/contact forward the lead to HubSpot like the contact form.
    body: JSON.stringify({
      kind: 'sample',
      ...payload,
      pageUri: window.location.href,
      pageName: document.title,
    }),
  })
  if (!res.ok) throw new Error('send failed')
  trackLead({ formId, kind: 'sample' })
}

export function SegmentedControl({ options, value, onChange }) {
  return (
    <div role="tablist" className="inline-flex rounded-[12px] bg-mist p-1">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          role="tab"
          aria-selected={value === i}
          onClick={() => onChange(i)}
          className={`h-10 rounded-[9px] px-[18px] text-[14px] font-bold tracking-[-0.03em] transition-colors ${
            value === i ? 'bg-white text-hx shadow-[0_1px_2px_rgba(10,34,64,0.06)]' : 'text-ink-sub hover:text-ink'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export function RequestFlow() {
  const c = useDataCopy().request
  return (
    <div className="border-t border-line pt-[19px]">
      <p className="text-[14px] font-bold tracking-[-0.03em] text-ink-sub">{c.flowTitle}</p>
      <ol className="mt-6 flex flex-col gap-6">
        {c.flow.map((s, i) => (
          <li key={s} className="flex items-start gap-[14px]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-50 text-[12px] font-bold text-accent">{i + 1}</span>
            <span className="pt-1 text-[14px] tracking-[-0.03em] text-ink-sub">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Example delivery folder (Figma "Sample Package").
export function SamplePackage() {
  const files = useDataCopy().request.packageFiles
  const [root, ...rest] = files
  return (
    <div className="rounded-[20px] border border-line bg-white px-6 py-[23px]">
      <p className="flex items-center gap-2.5 text-[14px] font-bold tracking-[-0.03em] text-ink">
        <img src={A(root.icon)} alt="" width="18" height="18" /> {root.name}
      </p>
      <ul className="ml-2 mt-1.5 border-l border-[#E9EDF2] pl-4">
        {rest.map((f) => (
          <li key={f.name} className="flex h-[34px] items-center gap-2.5 text-[14px] font-medium tracking-[-0.03em] text-ink-sub">
            <img src={A(f.icon)} alt="" width="18" height="18" /> {f.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function QuickRequest({ accentButton = false }) {
  const c = useDataCopy().request
  const { lang } = useLang()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!EMAIL_RE.test(email.trim())) return setErr(c.form.needEmail)
    setBusy(true)
    setErr('')
    try {
      await sendSample({ email: email.trim(), quick: true, lang }, 'data_quick')
      navigate(localizePath(REQUEST_DONE_PATH, lang), { state: { summary: email.trim() } })
    } catch {
      setErr(c.form.error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[24px] bg-white p-8 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.1)] max-sm:p-5">
      <div className="flex items-center gap-[11px]">
        <IconTile icon={A('icon-send.svg')} iconSize={22} className="m-[5px]" />
        <div>
          <p className="text-[20px] font-extrabold tracking-[-0.03em] text-ink max-sm:text-[18px]">{c.quick.title}</p>
          <p className="mt-1.5 text-[14px] tracking-[-0.03em] text-ink-sub">{c.quick.body}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-3 max-sm:flex-col">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={c.quick.placeholder}
          aria-label={c.form.email}
          className={`${inputCls} h-14 flex-1`}
        />
        <button
          type="submit"
          disabled={busy}
          className={`h-14 shrink-0 rounded-[28px] px-[26px] text-[16px] font-bold tracking-[-0.03em] text-white transition-colors disabled:opacity-60 ${
            accentButton ? 'bg-accent hover:bg-[#2B7FEA]' : 'bg-hx hover:bg-primary-600'
          }`}
        >
          {c.quick.button}
        </button>
      </div>
      <p className={`mt-4 text-[12px] tracking-[-0.03em] ${err ? 'font-semibold text-[#D81D2F]' : 'text-ink-mute'}`}>{err || c.quick.note}</p>
    </form>
  )
}

export function OrDivider() {
  const c = useDataCopy().request
  return (
    <div className="flex items-center gap-4">
      <span className="h-[2px] flex-1 bg-mist" />
      <span className="shrink-0 text-center text-[14px] font-semibold tracking-[-0.03em] text-ink-sub">{c.divider}</span>
      <span className="h-[2px] flex-1 bg-mist" />
    </div>
  )
}

function Question({ n, title, hint, children, className = '' }) {
  return (
    <fieldset className={className}>
      <legend className="flex items-center gap-2.5">
        <NumberBadge n={n} />
        <span className="text-[18px] font-extrabold tracking-[-0.03em] text-ink">{title}</span>
      </legend>
      {hint && <p className="ml-[34px] mt-[5px] text-[14px] tracking-[-0.03em] text-ink-mute">{hint}</p>}
      <div className="mt-[17px]">{children}</div>
    </fieldset>
  )
}

const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

// The full 9-step form. `initialCollections`: indices into the chip list to
// pre-select (a detail page opens it with its own collection chosen).
export function SampleForm({ initialCollections = [], mode = 0 }) {
  const d = useDataCopy()
  const c = d.request.form
  const { lang } = useLang()
  const navigate = useNavigate()
  const chips = [...d.collections.map((x) => x.name), ...c.collections]

  const [f, setF] = useState({ name: '', email: '', company: '', scene: '', gap: '', format: '' })
  const [cols, setCols] = useState(initialCollections)
  const [model, setModel] = useState(null)
  const [volume, setVolume] = useState(null)
  const [license, setLicense] = useState(null)
  const [timeline, setTimeline] = useState(null)
  const [agree, setAgree] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [modal, setModal] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!EMAIL_RE.test(f.email.trim())) return setErr(c.needEmail)
    if (!agree) return setErr(c.needConsent)
    setBusy(true)
    setErr('')
    const picked = cols.map((i) => chips[i])
    const summary = [picked.join(', '), model !== null && c.models[model], f.company].filter(Boolean).join(' · ')
    try {
      await sendSample({
        mode: d.request.segments[mode],
        name: f.name.trim(),
        email: f.email.trim(),
        company: f.company.trim(),
        collections: picked,
        scene: f.scene,
        model: model !== null ? c.models[model] : '',
        gap: f.gap,
        volume: volume !== null ? c.volumes[volume] : '',
        format: f.format,
        license: license !== null ? c.licenses[license] : '',
        timeline: timeline !== null ? c.timelines[timeline] : '',
        marketingAgreed: marketing,
        privacyAgreed: agree,
        lang,
      }, 'data_sample')
      navigate(localizePath(REQUEST_DONE_PATH, lang), { state: { summary } })
    } catch {
      setErr(c.error)
    } finally {
      setBusy(false)
    }
  }

  const area = `${inputCls} min-h-[104px] resize-y py-[10px]`
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-[45px] rounded-[24px] bg-white px-11 pb-12 pt-10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5)] max-md:px-6 max-sm:px-5"
    >
      <Question n={1} title={c.basic}>
        <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
          {[
            ['name', c.name, c.namePh, 'text'],
            ['email', c.email, c.emailPh, 'email'],
            ['company', c.company, c.companyPh, 'text'],
          ].map(([k, label, ph, type]) => (
            <label key={k} className="flex flex-col gap-[13px]">
              <span className="text-[14px] font-semibold tracking-[-0.03em] text-ink-soft">{label}</span>
              <input type={type} value={f[k]} onChange={set(k)} placeholder={ph} className={`${inputCls} h-14`} />
            </label>
          ))}
        </div>
      </Question>

      <Question n={2} title={c.q2} hint={c.q2hint}>
        <div className="flex flex-wrap gap-x-2 gap-y-3">
          {chips.map((label, i) => (
            <Chip key={label} selected={cols.includes(i)} onClick={() => setCols((s) => toggle(s, i))}>
              {label}
            </Chip>
          ))}
        </div>
      </Question>

      <Question n={3} title={c.q3} hint={c.q3hint}>
        <textarea value={f.scene} onChange={set('scene')} placeholder={c.q3ph} className={area} />
      </Question>

      <Question n={4} title={c.q4} hint={c.q4hint}>
        <div className="flex flex-wrap gap-x-2 gap-y-3">
          {c.models.map((label, i) => (
            <Chip key={label} selected={model === i} onClick={() => setModel(model === i ? null : i)}>
              {label}
            </Chip>
          ))}
        </div>
      </Question>

      <Question n={5} title={c.q5} hint={c.q5hint}>
        <textarea value={f.gap} onChange={set('gap')} placeholder={c.q5ph} className={area} />
      </Question>

      <Question n={6} title={c.q6}>
        <div className="flex flex-wrap gap-2">
          {c.volumes.map((label, i) => (
            <Chip key={label} selected={volume === i} onClick={() => setVolume(volume === i ? null : i)}>
              {label}
            </Chip>
          ))}
        </div>
      </Question>

      <Question n={7} title={c.q7} hint={c.q7hint}>
        <input value={f.format} onChange={set('format')} placeholder={c.q7ph} className={`${inputCls} h-14`} />
      </Question>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:gap-[45px]">
        <Question n={8} title={c.q8}>
          <div className="flex flex-wrap gap-2">
            {c.licenses.map((label, i) => (
              <Chip key={label} selected={license === i} onClick={() => setLicense(license === i ? null : i)}>
                {label}
              </Chip>
            ))}
          </div>
        </Question>
        <Question n={9} title={c.q9}>
          <div className="flex flex-wrap gap-2">
            {c.timelines.map((label, i) => (
              <Chip key={label} selected={timeline === i} onClick={() => setTimeline(timeline === i ? null : i)}>
                {label}
              </Chip>
            ))}
          </div>
        </Question>
      </div>

      <div className="border-t border-line pt-7">
        <p className="text-[18px] font-bold tracking-[-0.03em] text-ink">{c.consentTitle}</p>
        <div className="mt-[18px] flex flex-col gap-2.5">
          <ConsentRow
            checked={agree}
            onChange={() => setAgree((v) => !v)}
            label={c.consentRequired}
            tag={c.required}
            required
            right={
              <button type="button" onClick={() => setModal(true)} className="shrink-0 text-[16px] tracking-[-0.03em] text-ink-mute hover:text-ink max-sm:text-[14px]">
                {c.viewFull}
              </button>
            }
          />
          <MarketingConsent checked={marketing} onChange={() => setMarketing((v) => !v)} label={c.consentOptional} tag={c.optional} />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-6 h-[55px] w-full rounded-[28px] bg-hx text-[16px] font-bold tracking-[-0.03em] text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {c.submit}
        </button>
        {err && <p className="mt-3 text-center text-[14px] font-semibold text-[#D81D2F]">{err}</p>}
        <p className="mt-5 flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-1 text-center">
          <span className="text-[14px] tracking-[-0.03em] text-ink-sub">{c.footNote1}</span>
          <span className="text-[12px] tracking-[-0.03em] text-ink-mute">
            {c.footNote2}{' '}
            <button type="button" onClick={() => setModal(true)} className="underline-offset-2 hover:text-ink hover:underline">
              {c.footLink}
            </button>
          </span>
        </p>
      </div>
      <PrivacyModal open={modal} onClose={() => setModal(false)} />
    </form>
  )
}
