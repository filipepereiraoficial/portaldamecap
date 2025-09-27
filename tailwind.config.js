// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-bg': '#2B2A4C',
        'sidebar-active': '#4F46E5',
      }
    }
  },
  plugins: [],
};
