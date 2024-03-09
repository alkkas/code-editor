/** @type {import('tailwindcss').Config} */
const { createThemes } = require('tw-colors')
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
      animation: {
        blink: 'blink .2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    createThemes({
      default: {
        primary: 'black',
        secondary: 'white',
      },
    }),
  ],
}
