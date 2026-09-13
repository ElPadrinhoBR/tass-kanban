/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-red': {
          '0%, 100%': { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.4)' },
          '50%': { backgroundColor: 'rgba(239,68,68,0.3)', borderColor: 'rgba(239,68,68,0.8)' },
        },
      },
      animation: {
        confetti: 'confetti 2s ease-in forwards',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
        'pulse-red': 'pulse-red 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
