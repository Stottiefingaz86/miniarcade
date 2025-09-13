/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'casino-gold': '#FFD700',
        'casino-red': '#DC2626',
        'casino-green': '#16A34A',
        'casino-blue': '#2563EB',
        'casino-purple': '#7C3AED',
        'casino-orange': '#EA580C',
      },
      animation: {
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-gentle': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
}

