'use client'

import { useEffect, useRef, useState } from 'react'
import copyData from '../../../client/first-client/content/copy.json'

type PricingCard = {
  includes?: string[]
}

const pricingSection = copyData.sections.find((section) => section.id === 'pricing')
const pricingIncludes =
  ((pricingSection as { card?: PricingCard } | undefined)?.card?.includes ?? []) as string[]

export default function PricingTeaserCards() {
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
      className={`border-b border-border px-6 py-16 transition-all duration-700 sm:px-10 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-3xl font-heading text-text-primary">{pricingSection?.headline}</h2>
        <p className="mt-3 max-w-3xl text-text-secondary">{pricingSection?.subheadline}</p>
        <p className="mt-4 max-w-3xl text-text-secondary">{pricingSection?.body}</p>

        <article className="mt-8 max-w-2xl rounded-2xl border border-border bg-surface p-8">
          <h3 className="text-2xl font-heading text-primary">맞춤 견적</h3>
          <p className="mt-2 text-text-secondary">
            업종, 페이지 구성, 필요 기능을 알려주시면 24시간 이내에 견적을 보내드립니다.
          </p>
          <ul className="mt-6 space-y-3">
            {pricingIncludes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-text-secondary">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
          </ul>
          <a
            href="#contact"
            className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-text-primary transition hover:bg-[#7050ff]"
          >
            무료 견적 요청하기
          </a>
        </article>
      </div>
    </section>
  )
}
