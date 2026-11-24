/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tokens do design CODIUB (cores, Open Sans, alturas de controle, raios)
  presets: [require('./tailwind.codiub.preset.js')],
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
