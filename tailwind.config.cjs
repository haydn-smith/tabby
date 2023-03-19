/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['Lato', 'sans-serif'],
      'mono': ['Ubuntu Mono', 'monospace']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
