/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono:    ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        bg:      '#080b0f',
        surface: '#0d1117',
        border:  '#1a2332',
        cyan:    '#00e5ff',
        neon:    '#00ff9d',
        amber:   '#ffb800',
        danger:  '#ff4466',
      },
    },
  },
  plugins: [],
}