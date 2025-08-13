/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#AEE7F4',
      },fontFamily: {
        knewave: ['Knewave', 'cursive'], // Define la fuente personalizada
      }
    },
  },
  plugins: [],
}

