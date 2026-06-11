import { useEffect } from 'react'
import { X } from 'lucide-react'
import { PRIVACY } from '../data/privacy.js'
import { Blocks } from './PolicyBlocks.jsx'

export default function PrivacyModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[920px] flex-col rounded-[20px] bg-white p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <h2 className="text-xl font-bold tracking-[-0.5px] text-grayscale-800">
            {PRIVACY.title}
          </h2>
          <button onClick={onClose} aria-label="닫기" className="text-grayscale-500 hover:text-grayscale-800">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="mt-6 overflow-y-auto pr-2 text-sm text-grayscale-800">
          <p className="leading-[1.7]">{PRIVACY.intro}</p>
          <div className="mt-6 space-y-6">
            {PRIVACY.sections.map((sec) => (
              <section key={sec.title}>
                <h3 className="mb-2 font-bold leading-[1.5]">{sec.title}</h3>
                <div className="space-y-2 text-grayscale-500">
                  <Blocks blocks={sec.blocks} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
