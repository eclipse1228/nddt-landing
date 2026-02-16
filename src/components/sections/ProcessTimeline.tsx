'use client'

import { useEffect, useRef, useState } from 'react'
import copyData from '../../../client/first-client/content/copy.json'

type ProcessStep = {
  step: number
  title: string
  description: string
}

const processSection = copyData.sections.find((section) => section.id === 'process')
const stepList = ((processSection as { steps?: ProcessStep[] } | undefined)?.steps ?? []) as ProcessStep[]

export default function ProcessTimeline() {
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
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="text-3xl font-heading text-text-primary">{processSection?.headline}</h2>
        <p className="mt-3 max-w-2xl text-text-secondary">{processSection?.subheadline}</p>

        <div className="relative mt-10 space-y-7 before:absolute before:bottom-4 before:left-5 before:top-2 before:w-[2px] before:bg-primary/70">
          {stepList.map((step) => (
              <article key={step.step} className="relative pl-14">
                <span className="absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-background text-sm font-semibold text-primary">
                  {step.step}
                </span>
                <h3 className="text-xl font-heading text-text-primary">{step.title}</h3>
                <p className="mt-2 text-text-secondary">{step.description}</p>
              </article>
            ))}
        </div>
      </div>
    </section>
  )
}
