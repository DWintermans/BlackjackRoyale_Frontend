/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '15px': '15px',
      },
      colors: {
        'darkgray': '#A9A9A9', 
        'lightgray': '#D3D3D3', 
      }
    },
  },
  plugins: [],
};

