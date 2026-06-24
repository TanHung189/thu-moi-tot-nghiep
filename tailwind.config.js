/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          50: '#f9f8f6',
          100: '#f2eee9',
          200: '#e5ddd3',
          300: '#d5c6b6',
          400: '#c4a991',
          500: '#bca374', // main accent gold
          600: '#a38757',
          700: '#866c45',
          800: '#6d583b',
          900: '#5a4933',
        },
        gold: {
          50: '#f9f8f6',
          100: '#f2eee9',
          200: '#e5ddd3',
          300: '#d5c6b6',
          400: '#c4a991',
          500: '#bca374', // main accent gold
          600: '#a38757',
          700: '#866c45',
          800: '#6d583b',
          900: '#5a4933',
        },
      },
      fontFamily: {
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Alex Brush"', 'cursive'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'sticky-wobble': 'stickyWobble 4s ease-in-out infinite',
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
        stickyWobble: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
      backgroundImage: {
        // Đổi sang gradient blue
        'gold-gradient': 'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 50%, #1d4ed8 100%)',
        'navy-gradient': 'linear-gradient(135deg, #071327 0%, #153969 50%, #0e2648 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(7, 19, 39, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
        // Đổi gold-glow sang blue-glow
        'gold-glow': '0 0 30px rgba(59, 130, 246, 0.5)',
        'navy-glow': '0 0 30px rgba(21, 57, 105, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
