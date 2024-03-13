/** @type {import('tailwindcss').Config} */
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
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
      },
      animation: {
        blink: 'blink .6s ease-in-out infinite',
      },
    },
  },
}
