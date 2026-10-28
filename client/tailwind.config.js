/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        agri: {
          deep: '#1b4332',
          DEFAULT: '#2d6a4f',
          light: '#40916c',
          leaf: '#52b788',
          mint: '#74c69d',
          mist: '#d8f3dc',
        },
        soil: {
          50: '#fcfaf8',
          100: '#f7f3ee',
          200: '#ede4d8',
          300: '#decbb8',
          400: '#c8ad93',
          500: '#a9876f',
          600: '#8c6b54',
          700: '#715341',
          800: '#5c4436',
          900: '#4d392e',
        },
        skyacc: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          700: '#0369a1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
