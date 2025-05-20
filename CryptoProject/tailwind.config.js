/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    screens: {
      "xs": "550px",
      "sm": "340px",
      "lsm": "390px",
      "md": "768px",
      "lmd": "840px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
      "xlg": "968px"
    },
    extend: {},
  },
  plugins: [],
}