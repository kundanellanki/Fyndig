import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Palette derived from the fyndig logo
        ink: {
          950: '#070B12',
          900: '#0B111C',
          800: '#111A28',
          700: '#1B2536',
          600: '#26334A',
          500: '#33425C',
        },
        navy: '#1E2A3F', // logo mark navy
        steel: '#6B7A90', // logo wordmark grey
        mist: '#A9B6C7',
        accent: {
          DEFAULT: '#5B9BFF',
          soft: '#8FBBFF',
          deep: '#2F6FE0',
        },
        ember: '#E3A455', // warm forest accent, used sparingly
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.32em',
      },
      maxWidth: {
        shell: '1240px',
      },
      boxShadow: {
        glass: '0 24px 70px -30px rgba(0,0,0,0.85)',
        glow: '0 0 0 1px rgba(91,155,255,0.28), 0 20px 60px -24px rgba(91,155,255,0.35)',
      },
      keyframes: {
        pulseNode: {
          '0%,100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.35)' },
        },
        floatSlow: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        drift: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%,90%': { opacity: '0.5' },
          '100%': { transform: 'translateY(-120px) translateX(24px)', opacity: '0' },
        },
      },
      animation: {
        pulseNode: 'pulseNode 3.2s ease-in-out infinite',
        floatSlow: 'floatSlow 7s ease-in-out infinite',
        drift: 'drift 14s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
