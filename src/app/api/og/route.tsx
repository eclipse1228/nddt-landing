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
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '88px',
            position: 'relative',
            background:
              'radial-gradient(circle at 15% 10%, rgba(91,46,255,0.35), transparent 45%), radial-gradient(circle at 75% 15%, rgba(255,106,0,0.18), transparent 35%)',
          }}
        >
          <div
            style={{
              width: '180px',
              height: '12px',
              background: '#5B2EFF',
              borderRadius: '999px',
              marginBottom: '36px',
            }}
          />
          <h1 style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1, margin: 0 }}>옆집개발실 NDDT</h1>
          <p
            style={{
              fontSize: 36,
              marginTop: '20px',
              color: '#B6C0D8',
              lineHeight: 1.35,
            }}
          >
            소상공인 랜딩페이지 제작 전문
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
