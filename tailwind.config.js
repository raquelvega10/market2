/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-green': '#00CC33',
        'brand-green-dark': '#00B42D',
      },
    },
  },
  plugins: [],
};
