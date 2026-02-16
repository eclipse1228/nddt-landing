'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function LegalFooter() {
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
    <footer
      ref={ref}
      className={`px-6 py-10 transition-all duration-700 sm:px-10 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 text-sm text-text-secondary">
        <p className="text-base font-semibold text-text-primary">옆집개발실(NDDT)</p>
        <p>대표자: 고병수</p>
        <p>사업장 주소: 부산 부산진구 동천로 116 3층 303호</p>
        <p>연락처: 010-8477-6339</p>
        <p>
          이메일:{' '}
          <a href="mailto:qudtnrh@naver.com" className="text-primary underline underline-offset-4">
            qudtnrh@naver.com
          </a>
        </p>
        <p>
          <Link href="/privacy" className="min-h-[44px] text-primary underline underline-offset-4">
            개인정보처리방침
          </Link>
        </p>
        <p>Copyright © 2026 옆집개발실(NDDT). All rights reserved.</p>
      </div>
    </footer>
  )
}
