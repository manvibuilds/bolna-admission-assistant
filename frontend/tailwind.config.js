/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        brand: {
          50:  '#fef2ee',
          100: '#fcddc7',
          500: '#c84b2f',
          600: '#a83a20',
          900: '#2d1208',
        }
      }
    },
  },
  plugins: [],
}
