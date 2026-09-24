/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFB800',
          yellowDark: '#D97706',
          yellowLight: '#FFFBEB',
          navy: '#0B1B3D',
          navyDark: '#071126',
          navyLight: '#162E66',
          navyCard: '#0F2452'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'],
        mono: ['Inter', 'monospace']
      }
    },
  },
  plugins: [],
}
