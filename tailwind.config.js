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
        'wayv-green': '#00FF87',
        'wayv-green-dark': '#00CC6A',
        'wayv-green-light': '#33FFA2',
        'member-kun': '#00FF87',
        'member-ten': '#FF6B6B',
        'member-xiaojun': '#4ECDC4',
        'member-hendery': '#FFE66D',
        'member-yangyang': '#A8E6CF',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        glow: {
          'from': { boxShadow: '0 0 10px #00FF87, 0 0 20px #00FF87, 0 0 30px #00FF87' },
          'to': { boxShadow: '0 0 20px #00FF87, 0 0 30px #00FF87, 0 0 40px #00FF87' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}