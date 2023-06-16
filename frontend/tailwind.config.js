/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
        colors: {
            'reddit-blue': '#0079d3',
            'reddit-orange': '#ff4500',
            'reddit-dark': '#1a1a1b',
            'reddit-light': '#f5f5f5',
            'reddit-grey': '#a8a8a8',
            'reddit-dark-grey': '#343434',
            'reddit-green': '#5fbb00',
            'reddit-red': '#ff4500',
            'reddit-yellow': '#ff4500',
        }
    },
  },
  plugins: [],
}