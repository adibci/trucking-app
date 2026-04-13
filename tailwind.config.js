/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#1A3C5E',
        'brand-mid': '#2563A8',
        'brand-light': '#EFF6FF',
        accent: '#F59E0B',
        'accent-soft': '#FEF3C7',
        surface: '#F8FAFC',
        text1: '#0F172A',
        text2: '#475569',
        text3: '#94A3B8',
        'em-green': '#059669',
        'em-green-soft': '#D1FAE5',
        'em-red': '#DC2626',
        'em-red-soft': '#FEE2E2',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
