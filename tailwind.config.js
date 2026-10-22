/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      colors: {
        lightBG: '#f4f3ef',
        secondaryLightBG: '#eae8e2',
        lightShade: '#dcd9cf',
        lightModeTextP: '#5a5852',
        lightModeTextT: '#1c1b18',
        lightAccent: '#1f7a4d',
        darkBG: '#121211',
        secondaryDarkBG: '#1c1c1a',
        darkShade: '#2e2d2a',
        darkModeTextP: '#b1afa7',
        darkModeTextT: '#edece7',
        darkAccent: '#5fcf92',
      },

      boxShadow: {
        'right': '0 0 30px rgba(0, 0, 0, 0.9)',
      },

      keyframes: {
        signal: {
          '0%, 100%': { opacity: '0.15' },
          '40%': { opacity: '1' },
        },
        blink: {
          '0%, 70%, 100%': { opacity: '1' },
          '80%': { opacity: '0.2' },
        },
        ding: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(-7deg)' },
          '45%': { transform: 'rotate(5deg)' },
          '70%': { transform: 'rotate(-2deg)' },
        },
        swing: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '60%': { transform: 'rotate(-6deg)' },
          '80%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-7px) rotate(1.5deg)' },
        },
        'float-shadow': {
          '0%, 100%': { transform: 'scaleX(1)', opacity: '1' },
          '50%': { transform: 'scaleX(0.78)', opacity: '0.55' },
        },
        beat: {
          '0%, 30%, 60%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.2)' },
          '45%': { transform: 'scale(1.12)' },
        },
        flip: {
          '0%, 100%': { transform: 'scaleX(1)' },
          '25%, 75%': { transform: 'scaleX(0)' },
          '50%': { transform: 'scaleX(-1)' },
        },
        transmit: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '35%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flash: {
          '0%, 100%': { opacity: '0' },
          '15%, 60%': { opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(0.4)', opacity: '0.9' },
          '100%': { transform: 'scale(1.35)', opacity: '0' },
        },
        snap: {
          '0%': { opacity: '0.85' },
          '100%': { opacity: '0' },
        },
        caret: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        loop: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        signal: 'signal 2.4s ease-in-out infinite',
        blink: 'blink 2.8s ease-in-out infinite',
        ding: 'ding 0.6s ease-in-out',
        swing: 'swing 1s ease-in-out',
        float: 'float 6s ease-in-out infinite',
        'float-shadow': 'float-shadow 6s ease-in-out infinite',
        beat: 'beat 0.9s ease-in-out',
        flip: 'flip 0.8s ease-in-out',
        transmit: 'transmit 0.5s ease-out',
        flash: 'flash 0.7s ease-out forwards',
        ripple: 'ripple 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        snap: 'snap 0.5s ease-out forwards',
        caret: 'caret 1.1s steps(1) infinite',
        loop: 'loop 0.95s cubic-bezier(0.65, 0, 0.35, 1)',
        // 10 and 7 teeth: the small gear turns 10/7 as fast, the other way
        'spin-slow': 'spin 14s linear infinite',
        'spin-slow-reverse': 'spin 9.8s linear infinite reverse',
      },
    },
  },
  plugins: [],
}
