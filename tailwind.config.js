/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0e0e0f',
        bg2: '#161618',
        bg3: '#1e1e21',
        bg4: '#26262a',
        accent: '#6c63ff',
        accent2: '#8b85ff',
        success: '#3ecf8e',
        warn: '#f0a050',
        danger: '#f06060',
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.07)',
        strong: 'rgba(255,255,255,0.12)',
      },
    },
  },
  plugins: [],
}
