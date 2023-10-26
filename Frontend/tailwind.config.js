/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto-mono': ['Roboto Mono', 'monospace'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      colors: {
        marron: '#6B3737',
        verde: "#37686B",
      },
    },
  },
  plugins: [],
}
