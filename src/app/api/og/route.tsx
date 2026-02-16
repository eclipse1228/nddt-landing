import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#060915',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F3F6FF',
          fontSize: 48,
        }}
      >
        옆집개발실 NDDT
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
