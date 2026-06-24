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
        // Bảng màu chính: Trắng, Navy đậm, Xanh Blue (thay vàng Gold)
        navy: {
          50:  '#eef2f7',
          100: '#d5e0ee',
          200: '#aac0dd',
          300: '#7fa0cc',
          400: '#5480bb',
          500: '#2960aa',
          600: '#1d4d8a',
          700: '#153969',
          800: '#0e2648',
          900: '#071327',
          950: '#030a14',
        },
        // gold ở đây được đổi thành blue — giữ tên 'gold' để không cần sửa component nào
        gold: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',   // blue-400 — màu xanh sáng dùng cho accent text
          500: '#3b82f6',   // blue-500 — màu xanh chủ đạo
          600: '#2563eb',   // blue-600
          700: '#1d4ed8',   // blue-700 — xanh đậm cho hover
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      fontFamily: {
        // Be Vietnam Pro — thiết kế riêng cho tiếng Việt, hỗ trợ đầy đủ dấu
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        // Playfair Display — serif sang trọng cho tiêu đề
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
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
