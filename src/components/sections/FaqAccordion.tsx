'use client'

import { useEffect, useRef, useState } from 'react'
import faqsData from '../../../client/first-client/content/faqs.json'
import copyData from '../../../client/first-client/content/copy.json'

const faqSection = copyData.sections.find((section) => section.id === 'faq')

export default function FaqAccordion() {
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
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="text-3xl font-heading text-text-primary">{faqSection?.headline}</h2>
        <p className="mt-3 text-text-secondary">{faqSection?.subheadline}</p>

        <div className="mt-8 space-y-3">
          {faqsData.faqs.slice(0, 8).map((faq) => (
            <details key={faq.question} className="rounded-xl border border-border bg-surface p-5">
              <summary className="min-h-[44px] cursor-pointer list-none pr-6 text-base font-semibold text-text-primary marker:content-none">
                {faq.question}
              </summary>
              <p className="mt-3 leading-relaxed text-text-secondary">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
