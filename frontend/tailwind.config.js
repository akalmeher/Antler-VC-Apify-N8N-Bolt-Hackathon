/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Iowan Old Style', 'Georgia', 'serif'],
      },
      colors: {
        charcoal: {
          DEFAULT: '#2D2D2D',
          50: '#EFEBE4',
          100: '#E5DFD6',
          200: '#D8D0C5',
          400: '#8A847C',
          500: '#5C5854',
          600: '#3F3F3C',
        },
        navy: {
          DEFAULT: '#2D2D2D',
          50: '#EFEBE4',
          100: '#E5DFD6',
          200: '#D8D0C5',
          400: '#8A847C',
          500: '#5C5854',
          600: '#3F3F3C',
          700: '#2D2D2D',
          800: '#242424',
          900: '#1C1C1C',
        },
        brand: {
          sage: '#7E9A7F',
          clay: '#AD2F2F',
          dusty: '#B16D6D',
          ochre: '#B18A54',
        },
        muted: '#6B6764',
        surface: '#FBF8F3',
        ink: {
          border: '#D8D0C5',
          bg: '#F4EFE7',
          card: '#FBF8F3',
        },
        semantic: {
          opportunity: '#7E9A7F',
          opportunityBg: '#F1F5F1',
          opportunityBorder: '#D3DDD3',
          threat: '#AD2F2F',
          threatBg: '#F6EEEE',
          threatBorder: '#E5C9C9',
          warning: '#B16D6D',
          warningBg: '#F6EEEE',
          warningBorder: '#E5C9C9',
          pricing: '#2D2D2D',
          pricingBg: '#FBF8F3',
          pricingBorder: '#D8D0C5',
          promotion: '#7E9A7F',
          promotionBg: '#F1F5F1',
          promotionBorder: '#D3DDD3',
          positioning: '#7E9A7F',
          positioningBg: '#F1F5F1',
          positioningBorder: '#D3DDD3',
        },
      },
      boxShadow: {
        soft: '0 10px 28px -18px rgba(45, 45, 45, 0.16)',
        lift: '0 14px 32px -16px rgba(45, 45, 45, 0.18)',
      },
      transitionDuration: {
        220: '220ms',
        260: '260ms',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fade: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'drawer-in': {
          from: { opacity: '0.7', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        textIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 260ms ease-out both',
        fade: 'fade 220ms ease-out both',
        'drawer-in': 'drawer-in 260ms ease-out both',
        'text-in': 'textIn 280ms ease-out both',
      },
    },
  },
  plugins: [],
};
