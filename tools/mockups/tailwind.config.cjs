/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/demos/bio-links/**/*.html',
    './public/demos/qr-menus/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        cobalt: {
          DEFAULT: '#0044FF',
          500: '#0044FF',
          600: '#0033CC',
          900: '#001155',
          base: '#030305',
          blue: '#2563EB',
          bluedark: '#1E3A8A',
          dark: '#002699',
          glow: 'rgba(0, 68, 255, 0.5)',
          light: '#4D88FF',
          lines: '#1F2025',
          muted: '#71717A',
          surface: '#0A0A0C',
          text: '#EDEDED',
        },
        coffee: {
          500: '#D97706',
          600: '#B45309',
          900: '#78350F',
        },
        dark: { bg: '#050508', surface: '#111113' },
        bmw: {
          blue: '#0066B1',
          dark: '#030303',
          gray: '#1C1C1E',
          light: '#4C9EEB',
          surface: '#111113',
        },
        starbucks: {
          dark: '#0B0B0B',
          gold: '#CBA258',
          green: '#006241',
          lightGreen: '#1E3932',
          surface: '#141414',
        },
        surface: { DEFAULT: '#0A0A0C', panel: '#121216' },
        moon: {
          crater: '#5A5A66',
          dust: '#DCDCE0',
          glow: '#F4F6FF',
          surface: '#0A0A0E',
          void: '#030305',
        },
        botanical: {
          faded: '#8A8C86',
          ink: '#2A2C29',
          lines: '#E2E0D8',
          paper: '#F7F6F2',
          saffron: '#D97725',
          sage: '#C4CBBF',
        },
        reserve: {
          bg: '#0B0C0A',
          copper: '#C69C6D',
          copperDim: 'rgba(198, 156, 109, 0.2)',
          muted: '#7A7A75',
          surface: '#131412',
          text: '#EAE8E3',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};
