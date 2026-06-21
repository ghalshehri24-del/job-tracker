/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'Tajawal', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        brand: {
          50:  '#eef4ff',
          100: '#dbe6ff',
          500: '#4f6bff',
          600: '#3b54e6',
          700: '#2f43b8'
        }
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)'
      }
    }
  },
  plugins: []
}
