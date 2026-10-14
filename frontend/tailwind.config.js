/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  safelist: [
    // Ensure dynamically-built classes aren't purged
    'bg-violet-500/10', 'bg-blue-500/10', 'bg-emerald-500/10',
    'border-violet-500/20', 'border-blue-500/20', 'border-emerald-500/20',
    'text-violet-400', 'text-blue-400', 'text-emerald-400',
    'from-violet-500', 'from-blue-500', 'from-emerald-500',
    'to-violet-400', 'to-blue-400', 'to-emerald-400',
    'bg-white/8',
  ],
  plugins: [],
}
