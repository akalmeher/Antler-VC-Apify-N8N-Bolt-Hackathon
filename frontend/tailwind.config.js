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
        ink: {
          border: '#DCE5EE',
          bg: '#FCFCFB',
        },
      },
    },
  },
  plugins: [],
};
