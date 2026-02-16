import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-text-primary sm:px-10">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-surface p-8 sm:p-10">
        <h1 className="text-3xl font-heading">개인정보처리방침</h1>
        <p className="mt-3 text-text-secondary">
          옆집개발실(NDDT)은 상담 문의 처리 과정에서 최소한의 개인정보를 수집하며, 관련 법령을 준수합니다.
        </p>

        <section className="mt-8 space-y-4 text-text-secondary">
          <h2 className="text-xl font-heading text-text-primary">1. 수집하는 개인정보 항목</h2>
          <p>이름, 전화번호, 이메일, 요구사항</p>
        </section>

        <section className="mt-8 space-y-4 text-text-secondary">
          <h2 className="text-xl font-heading text-text-primary">2. 개인정보 수집 및 이용 목적</h2>
          <p>상담 문의 처리 및 회신</p>
        </section>

        <section className="mt-8 space-y-4 text-text-secondary">
          <h2 className="text-xl font-heading text-text-primary">3. 개인정보 보관 기간</h2>
          <p>상담 완료 후 1년</p>
        </section>

        <section className="mt-8 space-y-4 text-text-secondary">
          <h2 className="text-xl font-heading text-text-primary">4. 개인정보 제3자 제공</h2>
          <p>
            문의 폼 전송을 위해 Web3Forms(폼 전송 서비스)를 이용하며, 입력된 정보는 문의 처리 목적으로만 전송됩니다.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-text-secondary">
          <h2 className="text-xl font-heading text-text-primary">5. 동의 거부 권리 및 불이익</h2>
          <p>
            이용자는 개인정보 수집 및 이용 동의를 거부할 권리가 있습니다. 다만 필수 항목 수집에 동의하지 않을 경우 상담 문의 접수가 제한될 수 있습니다.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-text-secondary">
          <h2 className="text-xl font-heading text-text-primary">6. 개인정보 보호책임자</h2>
          <p>성명: 고병수</p>
          <p>이메일: qudtnrh@naver.com</p>
        </section>

        <Link
          href="/"
          className="mt-10 inline-flex min-h-[44px] items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-primary"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  )
}
