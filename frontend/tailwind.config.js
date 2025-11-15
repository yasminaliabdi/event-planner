/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#10b981',
          dark: '#0d9465',
          light: '#34d399',
        },
        surface: '#0f172a',
        muted: '#1e293b',
        accent: '#6366f1',
        'accent-light': '#a5b4fc',
        foreground: '#f8fafc',
        secondary: '#e2e8f0',
      },
      fontFamily: {
        sans: ['"Manrope"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 25px 50px -12px rgba(16, 185, 129, 0.35)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
}
