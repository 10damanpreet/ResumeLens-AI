/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(40px)' },
          '50%': { opacity: '0.8', filter: 'blur(55px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-glow': 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.18) 0%, transparent 60%)',
      },
      boxShadow: {
        'neon-violet': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'neon-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'neon-amber': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  safelist: [
    'bg-violet-500/10', 'bg-blue-500/10', 'bg-emerald-500/10', 'bg-amber-500/10', 'bg-red-500/10',
    'border-violet-500/20', 'border-blue-500/20', 'border-emerald-500/20', 'border-amber-500/20', 'border-red-500/20',
    'border-violet-500/30', 'border-blue-500/30', 'border-emerald-500/30', 'border-amber-500/30', 'border-red-500/30',
    'text-violet-400', 'text-blue-400', 'text-emerald-400', 'text-amber-400', 'text-red-400',
    'from-violet-500', 'from-blue-500', 'from-emerald-500', 'from-amber-500', 'from-red-500',
    'to-violet-400', 'to-blue-400', 'to-emerald-400', 'to-amber-400', 'to-red-400',
  ],
  plugins: [],
};
