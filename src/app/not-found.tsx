import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 text-center sm:p-10">
        <h1 className="text-3xl font-heading text-text-primary">페이지를 찾을 수 없습니다</h1>
        <p className="mt-3 text-text-secondary">
          요청하신 페이지가 이동되었거나 삭제되었습니다. 아래 버튼으로 홈으로 이동해 주세요.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-text-primary transition hover:bg-[#7050ff]"
        >
          홈으로 이동
        </Link>
      </div>
    </main>
  )
}
