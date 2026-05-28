/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  darkMode: 'class',
  
  content: [ 
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['"Playfair Display"', 'serif'],
        'sans': ['"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      }
    },
  },
  plugins: [daisyui],

  daisyui: {
    themes: false,
  },
}

