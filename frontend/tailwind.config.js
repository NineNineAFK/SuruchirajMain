/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
      30: '7.5rem',
      },
      colors: {
        mutedrose: '#B8A8A8',
        ivory: '#F6F5F3',
        palegold: '#E6BE8A',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['Raleway', 'sans-serif'],
        button: ['"Droid Sans"', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        shine: 'shine 1s linear forwards',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
