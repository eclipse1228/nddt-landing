'use client'

import { useEffect, useRef, useState } from 'react'
import copyData from '../../../client/first-client/content/copy.json'

const painSection = copyData.sections.find((section) => section.id === 'pain_solution')
const problemList = painSection && 'problems' in painSection ? painSection.problems ?? [] : []

export default function PainSolutionCards() {
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
      { threshold: 0.15 }
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
        <h2 className="text-3xl font-heading text-text-primary">{painSection?.headline}</h2>
        <p className="mt-3 max-w-3xl text-text-secondary">{painSection?.subheadline}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {problemList.map((item, index) => (
              <article key={`${item.pain}-${index}`} className="rounded-xl border border-border bg-surface p-6">
                <p className="text-sm font-semibold text-accent">고민</p>
                <p className="mt-1 text-lg font-semibold text-text-primary">{item.pain}</p>
                <p className="mt-4 text-sm font-semibold text-primary">해결</p>
                <p className="mt-1 text-text-secondary">{item.solution}</p>
              </article>
            ))}
        </div>

        <a
          href="#contact"
          className="mt-10 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-text-primary transition hover:bg-[#7050ff]"
        >
          내 상황에 맞는 상담 받기
        </a>
      </div>
    </section>
  )
}
