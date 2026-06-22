/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          950: '#050208',
          900: '#0a0118',
          850: '#0f0320',
          800: '#150829',
          700: '#1f0a4d',
          600: '#2d1060',
          500: '#3f1878',
          400: '#5521a0',
          300: '#7a3ec7',
          200: '#a66de0',
          100: '#cda8f5',
        },
        gold: {
          900: '#5c4100',
          800: '#7a5700',
          700: '#9c7000',
          600: '#c48b00',
          500: '#d4a017',
          400: '#e6b930',
          300: '#f2cc5a',
          200: '#f8dc8a',
          100: '#fdf0c2',
        },
        dark: {
          DEFAULT: '#030105',
          card: '#0a0118',
          border: '#1f0a4d',
          muted: '#2d1060',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.9s ease-out forwards',
        'fade-in-up-2': 'fadeInUp 0.9s ease-out 0.2s forwards',
        'fade-in-up-3': 'fadeInUp 0.9s ease-out 0.4s forwards',
        'fade-in-up-4': 'fadeInUp 0.9s ease-out 0.6s forwards',
        'scale-in': 'scaleIn 0.7s ease-out forwards',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'nav-link-in': 'navLinkIn 0.5s ease-out forwards',
        'footer-col': 'footerCol 0.7s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,160,23,0.3)' },
          '50%': { boxShadow: '0 0 50px rgba(212,160,23,0.7), 0 0 80px rgba(212,160,23,0.3)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        navLinkIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        footerCol: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(212,160,23,0.3)' },
          '50%': { borderColor: 'rgba(212,160,23,0.8)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(90deg, #c48b00, #f2cc5a, #e6b930, #f2cc5a, #c48b00)',
        'purple-glow': 'radial-gradient(ellipse at center, #150829 0%, #050208 70%)',
        'purple-radial': 'radial-gradient(ellipse at top, #1f0a4d 0%, #050208 65%)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
