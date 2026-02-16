'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import copyData from '../../../client/first-client/content/copy.json'

const finalCtaSection = copyData.sections.find((section) => section.id === 'final_cta')

export default function FinalCtaBanner() {
  const router = useRouter()
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConsentChecked, setIsConsentChecked] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isConsentChecked) {
      setErrorMessage('전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/thank-you')
        return
      }

      setErrorMessage('전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } catch {
      setErrorMessage('전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
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

        <form
          id="contact"
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl border border-border bg-surface/90 p-5 sm:p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-text-secondary">
              이름
              <input
                type="text"
                name="name"
                required
                className="min-h-11 rounded-lg border border-border bg-background px-3 py-3 text-text-primary outline-none transition focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-text-secondary">
              전화번호
              <input
                type="tel"
                name="phone"
                required
                className="min-h-11 rounded-lg border border-border bg-background px-3 py-3 text-text-primary outline-none transition focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-text-secondary">
              이메일
              <input
                type="email"
                name="email"
                required
                className="min-h-11 rounded-lg border border-border bg-background px-3 py-3 text-text-primary outline-none transition focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-text-secondary md:col-span-2">
              요구사항
              <textarea
                name="message"
                required
                rows={5}
                className="min-h-11 rounded-lg border border-border bg-background px-3 py-3 text-text-primary outline-none transition focus:border-primary"
              />
            </label>
          </div>

          <input
            type="hidden"
            name="access_key"
            value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ''}
          />
          <input type="hidden" name="from_name" value="NDDT 랜딩페이지 문의" />
          <input type="hidden" name="subject" value="새 상담 문의 | 옆집개발실" />
          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

          <label className="mt-4 flex items-start gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              required
              checked={isConsentChecked}
              onChange={(event) => setIsConsentChecked(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border accent-primary"
            />
            <span>
              개인정보 수집·이용에 동의합니다.{' '}
              <Link href="/privacy" className="text-primary underline underline-offset-4">
                자세히 보기
              </Link>
            </span>
          </label>

          {errorMessage ? <p className="mt-3 text-sm text-[#ffb4ab]">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-text-primary transition hover:bg-[#7050ff] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? '전송 중...' : '상담 문의 보내기'}
          </button>
        </form>
      </div>
    </section>
  )
}
