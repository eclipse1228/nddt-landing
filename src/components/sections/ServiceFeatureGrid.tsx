'use client'

import { useEffect, useRef, useState } from 'react'
import { BarChart3, Code, Database, Globe, MessageSquare, Search } from 'lucide-react'
import copyData from '../../../client/first-client/content/copy.json'

type ServiceItem = {
  title: string
  description: string
}

const serviceSection = copyData.sections.find((section) => section.id === 'service_stack')
const serviceList = ((serviceSection as { services?: ServiceItem[] } | undefined)?.services ?? []) as ServiceItem[]
const serviceIcons = [Code, Database, Search, MessageSquare, BarChart3, Globe]

export default function ServiceFeatureGrid() {
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
        <h2 className="text-3xl font-heading text-text-primary">{serviceSection?.headline}</h2>
        <p className="mt-3 max-w-3xl text-text-secondary">{serviceSection?.subheadline}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {serviceList.map((service, index) => {
              const Icon = serviceIcons[index] ?? Globe

              return (
                <article key={service.title} className="rounded-xl border border-border bg-surface p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-heading text-text-primary">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{service.description}</p>
                </article>
              )
            })}
        </div>
      </div>
    </section>
  )
}
