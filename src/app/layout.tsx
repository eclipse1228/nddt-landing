import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import fs from 'node:fs'
import path from 'node:path'
import './globals.css'
import seoData from '../../client/first-client/content/seo.json'

const schemaData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'client/first-client/content/schema.jsonld'), 'utf-8')
)

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://nddt-landing.vercel.app'),
  title: seoData.title,
  description: seoData.description,
  alternates: {
    canonical: seoData.canonical || '/',
  },
  keywords: seoData.keywords,
  robots: {
    index: seoData.robots.includes('index'),
    follow: seoData.robots.includes('follow'),
  },
  openGraph: {
    type: seoData.og.type as 'website',
    title: seoData.og.title,
    description: seoData.og.description,
    locale: seoData.locale,
    images: [
      {
        url: seoData.og.image,
        width: seoData.og.image_width,
        height: seoData.og.image_height,
        alt: seoData.og.title,
      },
    ],
  },
  twitter: {
    card: seoData.twitter.card as 'summary_large_image',
    title: seoData.twitter.title,
    description: seoData.twitter.description,
    images: [seoData.og.image],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
