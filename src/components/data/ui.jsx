import { useState } from 'react'
import Link from '../../i18n/Link.jsx'
import { useLang } from '../../i18n/LanguageContext.jsx'

// Building blocks for the data-marketplace pages (Figma: homepage-wireframe ·
// 데이터마켓플레이스). Sizes follow the design's 1440 frame; layouts reflow below lg.

export const A = (name) => `/assets/data/${name}`

const BTN = {
  base: 'inline-flex items-center justify-center whitespace-nowrap font-bold tracking-[-0.03em] transition-[background-color,transform] duration-200 active:scale-[0.97]',
  L: 'h-12 rounded-[28px] px-[18px] text-[16px]',
  M: 'h-12 rounded-[26px] px-[18px] text-[16px]',
  S: 'h-10 rounded-[8px] px-4 text-[14px]',
  primary: 'bg-hx text-white hover:bg-primary-600',
  secondary: 'border border-line-strong bg-white text-ink hover:bg-snow',
  soft: 'bg-mist text-ink hover:bg-[#E5E8EB]',
}

// <Button to|href|onClick type="primary|secondary|soft" size="L|M|S">
export function Button({ to, href, type = 'primary', size = 'L', className = '', children, ...rest }) {
  const cls = `${BTN.base} ${BTN[size]} ${BTN[type]} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>
  return <button type="button" className={cls} {...rest}>{children}</button>
}

// Raised white tile with a soft blue gradient — the design's "Icon Tile / Plain".
export function IconTile({ icon, size = 48, iconSize = 24, radius, className = '' }) {
  const r = radius ?? (size >= 64 ? 18 : size >= 52 ? 16 : size >= 48 ? 14 : 12)
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center border border-white bg-gradient-to-b from-white to-[#EAF1FB] shadow-[0_4px_10px_-3px_rgba(10,34,64,0.16),inset_0_-2px_4px_0_rgba(10,34,64,0.07),inset_0_1px_0_0_#fff] ${className}`}
      style={{ width: size, height: size, borderRadius: r }}
    >
      {icon && <img src={icon} alt="" width={iconSize} height={iconSize} className="block" style={{ width: iconSize, height: iconSize }} />}
    </span>
  )
}

export function Eyebrow({ children, className = '' }) {
  return <p className={`text-[14px] font-bold tracking-[-0.03em] text-accent ${className}`}>{children}</p>
}

export function H2({ children, className = '' }) {
  return (
    <h2 className={`text-[40px] font-extrabold leading-[1.5] tracking-[-0.03em] text-ink max-md:text-[32px] max-sm:text-[26px] ${className}`}>
      {children}
    </h2>
  )
}

export function Lead({ children, className = '' }) {
  return <p className={`text-[18px] leading-[1.5] tracking-[-0.03em] text-ink-sub max-sm:text-[16px] ${className}`}>{children}</p>
}

// Grey outline tag (cards, hero).
export function Tag({ children, fill = false }) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-[8px] px-3 text-[12px] font-semibold tracking-[-0.03em] text-ink-soft ${
        fill ? 'bg-mist' : 'border border-line bg-white'
      }`}
    >
      {children}
    </span>
  )
}

// Selectable pill used by the request form.
export function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-10 items-center rounded-[24px] px-5 text-[14px] font-semibold tracking-[-0.03em] transition-colors ${
        selected ? 'bg-hx text-white' : 'border border-line-strong bg-white text-ink-soft hover:border-ink/40'
      }`}
    >
      {children}
    </button>
  )
}

export function NumberBadge({ n }) {
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hx text-[12px] font-bold text-white">{n}</span>
  )
}

export const inputCls =
  'w-full rounded-[12px] bg-snow px-4 text-[14px] tracking-[-0.03em] text-ink placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-accent/40'

// Consent checkbox row (Figma "Consent Row").
export function ConsentRow({ checked, onChange, label, tag, required, right }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <label className="flex cursor-pointer items-center gap-5">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-colors ${
            checked ? 'border-hx bg-hx' : 'border-line bg-white'
          }`}
        >
          {checked && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2.5 7.2l3 3 6-6.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} required={required} />
        <span className="flex flex-wrap items-center gap-2 text-[16px] tracking-[-0.03em] max-sm:text-[14px]">
          <span className="font-medium text-ink-soft">{label}</span>
          <span className="font-bold text-[#2F4B7C]">{tag}</span>
        </span>
      </label>
      {right}
    </div>
  )
}

// Optional marketing consent with an expandable detail (▾), same copy as the
// /contact form.
export function MarketingConsent({ checked, onChange, label, tag }) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  return (
    <div className="flex items-start gap-5 py-1.5">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onChange}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-colors ${
          checked ? 'border-hx bg-hx' : 'border-line bg-white'
        }`}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2.5 7.2l3 3 6-6.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="flex flex-1 flex-col">
        <span className="flex flex-wrap items-center gap-2 pt-0.5 text-[16px] tracking-[-0.03em] max-sm:text-[14px]">
          <span className="font-medium text-ink-soft">{label}</span>
          <span className="font-bold text-[#2F4B7C]">{tag}</span>
        </span>
        <div className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
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
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t('접기', 'Collapse') : t('펼치기', 'Expand')}
        className="shrink-0 text-ink-mute transition-colors hover:text-ink-sub"
      >
        <img src={A('icon-chevron-down.svg')} alt="" width="24" height="24" className={`transition-transform duration-300 ease-out ${open ? 'rotate-180' : ''}`} />
      </button>
    </div>
  )
}
