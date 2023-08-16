/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        ifocus: {
          '0%, 100%, 50%, 53%': {
            transform: 'none',
          },

          '15%': {
            transform: 'translateX(66px) translateY(33px) skewX(5deg) skewY(-10deg) scale(0.95)',
          },

          '35%': {
            transform: 'translateX(-66px) translateY(33px) skewX(15deg) skewY(-10deg) scale(0.95)',
          },

          '60%': {
            transform: 'translateX(66px) translateY(-33px) skewX(5deg) skewY(2deg) scaleX(0.95)',
          },

          '85%': {
            transform: 'translateX(66px) translateY(33px) skewX(-15deg) skewY(10deg) scale(0.95)',
          },
        },
      },
      animation: {
        ifocus: 'ifocus 5s ease-out infinite'
      }
    },
  },
  plugins: [],
}
