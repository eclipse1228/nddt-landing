import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  title: '소상공인 랜딩페이지 제작 | 옆집개발실 NDDT',
  description: 'AI 기반으로 3일 만에 반응형 랜딩페이지를 제작합니다. DB수집, SEO 최적화 기본 포함. 부산 소상공인·스타트업 전문.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
