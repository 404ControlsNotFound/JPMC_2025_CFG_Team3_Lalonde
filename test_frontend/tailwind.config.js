/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chat-bg': '#343541',
        'sidebar-bg': '#202123',
        'input-bg': '#40414f',
        'text-primary': '#ececf1',
        'text-secondary': '#c5c5d2',
        'border-gray': '#4d4d4f',
      }
    },
  },
  plugins: [],
}