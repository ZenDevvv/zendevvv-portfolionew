/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBG: '#fefffe',
        secondaryLightBG: '#f9f8fa',
        lightModeTextP: '#4B5563', 
        lightModeTextT: '#111827',
        darkBG: '#020710',
        secondaryDarkBG: '#101826',
        darkModeTextP: '#D1D5DB',
        darkModeTextT: '#F9FAFB',

      },

      boxShadow: {
        'right': '0 0 30px rgba(0, 0, 0, 0.9)',
      },

      
    },
  },
  plugins: [],
}

