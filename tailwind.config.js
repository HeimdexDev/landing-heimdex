/** @type {import('tailwindcss').Config} */
export default {
  // Only apply hover: styles on devices that actually support hover (mouse),
  // so touch devices don't get "stuck" hover states after a tap.
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // v1.2 palette (homepage-wireframe "04 컬러 팔레트") — warm off-white base,
        // one strong brand cyan; dark tones only for demo areas and the last CTA band.
        cyan: {
          50: '#E6F8FA', // tag · selected background
          500: '#13B5CB', // brand key color · CTA on dark backgrounds
          700: '#0B7A8C', // primary button · link on light backgrounds (AA)
          900: '#0A3F4A', // hover · emphasis text
        },
        // Brand colour chips (2026-10): main brand #0A2240, primary #234D78.
        // The primary scale is tinted/shaded from #234D78; 900 is the brand navy.
        primary: {
          50: '#EEF3F8', // tag · selected background
          100: '#DCE6F1',
          200: '#B5C9DF',
          300: '#8BA9C9',
          400: '#5F86B0', // accent on dark backgrounds
          500: '#234D78', // primary button · link
          600: '#1B3D60', // hover · pressed
          700: '#15304C',
          900: '#0A2240', // = main brand colour
        },
        violet: { 50: '#F3F0FF', 500: '#7A5CFF' }, // heimlog (creator) accent
        // Data marketplace (Figma homepage-wireframe · 데이터마켓플레이스): bright accent
        // for eyebrows/steps, plus the page greys used by its forms and bands.
        accent: { DEFAULT: '#3991FF', 50: '#EBF4FF', 100: '#CFE2FF' },
        snow: '#F7F8FA', // input fill · grey section
        ice: '#F3F6FB', // tinted band
        'line-strong': '#D1D6DB', // outline buttons · chips
        placeholder: '#B0B8C1',
        // heimlog brand (from the heimlog app / heimlight landing): coral accent,
        // dark text on coral fills, coral-ink for accent text on light grounds.
        heimlog: {
          DEFAULT: '#FF7A66',
          hover: '#F2604B',
          ink: '#B25547',
          on: '#2B0F06',
          cream: '#FFF2F0',
          tint: '#FFD0C9',
          night: '#262626',
        },
        pink: { 400: '#F27AC4' },
        hx: '#0A2240', // main brand colour (HEIMDEX navy) — logo tiles, closing band
        // toss.im-style neutrals: a pure white page, cool greys for surfaces
        // instead of borders, and blue-black text.
        warm: '#FFFFFF', // page background
        mist: '#F2F4F6', // card · panel surface (replaces bordered boxes)
        fog: '#F9FAFB', // quiet section band
        line: '#E5E8EB', // dividers (used sparingly)
        ink: { DEFAULT: '#191F28', soft: '#333D4B', sub: '#4E5968', mute: '#8B95A1' }, // text tiers
        dark: { bg: '#0B0E14', surface: '#151A23', line: '#262C38' },
        // Heimdex design tokens (from Figma)
        navy: {
          500: '#234D78', // heimdex-navy/500 — same as primary-500
        },
        // Legacy Figma softblue, now tinted from primary so older pages match.
        softblue: {
          50: '#EEF3F8',
          500: '#5F86B0',
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
        soft: '0 2px 8px rgba(0,27,55,0.04), 0 16px 40px -12px rgba(0,27,55,0.10)',
        lift: '0 4px 12px rgba(0,27,55,0.05), 0 28px 60px -20px rgba(0,27,55,0.18)',
        menu: '0 12px 40px -12px rgba(20,22,27,0.18)',
      },
      backgroundImage: {
        // Hero / product visuals only — never on text or buttons.
        brand: 'linear-gradient(90deg, #0A2240 0%, #234D78 50%, #8BA9C9 100%)',
      },
      maxWidth: {
        page: '1440px',
      },
    },
  },
  plugins: [],
}
