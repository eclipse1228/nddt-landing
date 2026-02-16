'use client'

import { useEffect, useRef, useState } from 'react'
import copyData from '../../../client/first-client/content/copy.json'

const finalCtaSection = copyData.sections.find((section) => section.id === 'final_cta')

export default function FinalCtaBanner() {
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
      id="contact"
      ref={ref}
      className={`border-b border-border px-6 py-16 transition-all duration-700 sm:px-10 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-border bg-[linear-gradient(130deg,#5B2EFF26_0%,#10172B_45%,#FF6A001A_100%)] p-8 md:p-10">
        <h2 className="text-3xl font-heading text-text-primary">{finalCtaSection?.headline}</h2>
        <p className="mt-3 max-w-3xl text-text-secondary">{finalCtaSection?.subheadline}</p>
        <p className="mt-4 max-w-3xl text-text-secondary">{finalCtaSection?.body}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href="#contact"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-text-primary transition hover:bg-[#7050ff]"
          >
            무료 상담 신청
          </a>
          <a
            href="tel:010-8477-6339"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 text-base font-semibold text-text-primary transition hover:border-primary"
          >
            전화 문의
          </a>
          <a
            href="https://map.naver.com/v5/search/%EB%B6%80%EC%82%B0%20%EB%B6%80%EC%82%B0%EC%A7%84%EA%B5%AC%20%EB%8F%99%EC%B2%9C%EB%A1%9C%20116"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 text-base font-semibold text-text-primary transition hover:border-primary"
          >
            오시는 길 보기
          </a>
        </div>
      </div>
    </section>
  )
}
