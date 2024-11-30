/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00ff66',
          hover: '#00cc52',
        },
        surface: {
          DEFAULT: '#1a1b1e',
          hover: '#2a2b2e',
          border: '#333438',
        },
        background: '#000000',
      },
      animation: {
        spin: 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
}