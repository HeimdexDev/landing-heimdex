import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

/**
 * Bottom call-to-action banner with the soft blue glow background.
 * Reused across the main page and all solution pages — copy differs per page.
 */
export default function CtaBanner({
  title,
  subtitle,
  primaryLabel = '한 달 무료신청',
  outlineLabel = '웹에서 체험하기',
}) {
  return (
    <section className="flex justify-center">
      <div
        className="relative flex h-[480px] w-full items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(146.3deg, #e8edf5 0%, #f2f2f7 41.667%, #e5ebf5 83.333%)',
        }}
      >
        {/* Soft blue glows */}
        <div className="pointer-events-none absolute -right-40 top-1/2 h-[600px] w-[950px] -translate-y-1/2 rounded-full bg-softblue-500/25 blur-[120px]" />
        <div className="pointer-events-none absolute -left-60 top-0 h-[700px] w-[1100px] rounded-full bg-softblue-50/60 blur-[120px]" />

        <div className="relative flex flex-col items-center gap-[50px] max-sm:gap-8 max-sm:px-5">
          <div className="flex flex-col items-center gap-5 text-center text-neutral-800">
            <h2 className="text-[40px] font-bold leading-[1.4] tracking-[-1px] max-md:text-[28px] max-sm:text-[24px]">
              {typeof title === 'string'
                ? title.split('\n').map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))
                : title}
            </h2>
            <p className="text-xl font-medium leading-[1.4] tracking-[-0.5px] max-sm:text-sm">
              {subtitle}
            </p>
          </div>
          <div className="flex items-start justify-center gap-5 max-sm:flex-wrap">
            <Link to="/contact" className="btn-primary w-[200px]">
              {primaryLabel}
              <ArrowUpRight size={20} strokeWidth={2} />
            </Link>
            <a
              href="https://playground.heimdex.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-[200px]"
            >
              {outlineLabel}
              <ArrowUpRight size={20} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
