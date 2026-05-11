/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark:    '#0D1B2A',
        card:    '#111F30',
        nav:     '#0A1520',
        border:  '#1E3A5F',
        accent:  '#3B82F6',
        primary: '#F1F5F9',
        muted:   '#64748B',
        subtle:  '#334155',
      },
    },
  },
  plugins: [],
}
