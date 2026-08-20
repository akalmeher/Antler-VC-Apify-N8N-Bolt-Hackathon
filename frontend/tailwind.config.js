/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#102334',
          50: '#E8EDF1',
          100: '#C7D3DC',
          200: '#9FB1C0',
          400: '#3D556B',
          500: '#1E3A52',
          600: '#162B3D',
          700: '#102334',
          800: '#0B1924',
          900: '#07121A',
        },
        brand: {
          blue: '#0868D9',
          cyan: '#0EA5E9',
        },
        muted: '#64748B',
        ink: {
          border: '#DCE5EE',
          bg: '#FCFCFB',
        },
        semantic: {
          opportunity: '#047857',
          opportunityBg: '#ECFDF5',
          opportunityBorder: '#A7F3D0',
          threat: '#B91C1C',
          threatBg: '#FEF2F2',
          threatBorder: '#FECACA',
          warning: '#B45309',
          warningBg: '#FFFBEB',
          warningBorder: '#FDE68A',
          promotion: '#7C3AED',
          promotionBg: '#F5F3FF',
          promotionBorder: '#DDD6FE',
          pricing: '#0868D9',
          pricingBg: '#EFF6FF',
          pricingBorder: '#BFDBFE',
          positioning: '#0F766E',
          positioningBg: '#F0FDFA',
          positioningBorder: '#99F6E4',
        },
      },
    },
  },
  plugins: [],
};
