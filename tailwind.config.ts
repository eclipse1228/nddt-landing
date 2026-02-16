import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B2EFF',
        accent: '#FF6A00',
        background: '#060915',
        surface: '#10172B',
        'surface-alt': '#1A2340',
        'text-primary': '#F3F6FF',
        'text-secondary': '#B6C0D8',
        border: '#29324A',
      },
      fontFamily: {
        heading: ['Pretendard Variable', 'Pretendard', 'Noto Sans KR', 'sans-serif'],
        body: ['SUIT Variable', 'SUIT', 'Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
