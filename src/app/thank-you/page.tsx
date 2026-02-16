'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ThankYouPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-text-primary">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface p-8 text-center sm:p-10">
        <h1 className="text-3xl font-heading">문의가 접수되었습니다</h1>
        <p className="mt-3 text-text-secondary">빠른 시일 내에 연락드리겠습니다</p>
        <p className="mt-2 text-sm text-text-secondary">5초 후 자동으로 홈 화면으로 이동합니다.</p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-text-primary transition hover:bg-[#7050ff]"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  )
}
