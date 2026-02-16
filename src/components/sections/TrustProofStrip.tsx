'use client'

import { useEffect, useRef, useState } from 'react'
import copyData from '../../../client/first-client/content/copy.json'

const proofSection = copyData.sections.find((section) => section.id === 'proof_strip')
const metrics = proofSection && 'metrics' in proofSection ? proofSection.metrics ?? [] : []

export default function TrustProofStrip() {
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
      className={`border-b border-border bg-surface px-6 py-12 transition-all duration-700 sm:px-10 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <h2 className="text-2xl font-heading text-text-primary">{proofSection?.headline}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
              <article
                key={metric.id}
                className="rounded-xl border border-border bg-background/70 p-6"
              >
                <p className="text-sm text-text-secondary">{metric.label}</p>
                <p className="mt-2 text-3xl font-heading text-primary">{metric.value}</p>
                <p className="mt-1 text-sm text-text-secondary">{metric.detail}</p>
              </article>
            ))}
        </div>
      </div>
    </section>
  )
}
