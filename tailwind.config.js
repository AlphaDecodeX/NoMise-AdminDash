/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#16ED79",
        'secondary': "#FFFFFF",
        'background': "#282A29"
      },
      fontFamily: {
        sans: ['Ubuntu', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

