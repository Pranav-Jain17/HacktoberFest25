/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
      primary: {
        DEFAULT: '#1E40AF', // main blue (passes AA)
        light: '#2563EB',   // hover
        dark: '#1E3A8A',    // pressed
      },
      accent: '#004080',
      },
    },
  },
  plugins: [],
}
