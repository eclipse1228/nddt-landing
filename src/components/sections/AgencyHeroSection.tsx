'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Phone } from 'lucide-react'
import copyData from '../../../client/first-client/content/copy.json'

const heroSection = copyData.sections.find((section) => section.id === 'hero')

export default function AgencyHeroSection() {
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden border-b border-border px-6 py-20 transition-all duration-700 sm:px-10 md:py-28 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(91,46,255,0.45),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(255,106,0,0.2),transparent_35%),linear-gradient(180deg,#111a3a_0%,#060915_65%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <p className="text-sm font-medium tracking-wide text-text-secondary">옆집개발실 NDDT</p>
        <h1 className="max-w-4xl text-3xl font-heading leading-tight text-text-primary sm:text-4xl md:text-5xl">
          {heroSection?.headline}
        </h1>
        <p className="max-w-3xl text-lg text-text-secondary">{heroSection?.subheadline}</p>
        <p className="max-w-3xl text-base leading-relaxed text-text-secondary">{heroSection?.body}</p>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <a
            href="#contact"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-text-primary transition hover:bg-[#7050ff]"
          >
            무료 상담 받기
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="tel:010-8477-6339"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-base font-semibold text-text-primary transition hover:border-primary"
          >
            전화 문의
            <Phone className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
