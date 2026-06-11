/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Heimdex design tokens (from Figma)
        navy: {
          500: '#234c77', // heimdex-navy/500 — primary brand
        },
        softblue: {
          50: '#e4f2ff',
          500: '#3991ff',
        },
        grayscale: {
          10: '#fcfcff',
          100: '#e8e9f8',
          300: '#c4c5d4',
          500: '#7c7d8b',
          800: '#272833',
        },
        neutral: {
          100: '#e9e9e9',
          300: '#c4c4c4',
          800: '#262626',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        noto: ['"Noto Sans KR"', 'Pretendard', 'sans-serif'],
        product: ['"Product Sans"', 'Pretendard', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 4px 20px 0px #e8e9f8',
      },
      maxWidth: {
        page: '1440px',
      },
    },
  },
  plugins: [],
}
