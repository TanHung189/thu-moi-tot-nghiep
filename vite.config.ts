import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// ⚠️ QUAN TRỌNG KHI DEPLOY LÊN GITHUB PAGES:
// Thay '/ten-repo/' bằng tên GitHub repository của bạn
// Ví dụ: nếu repo tên là 'graduation-invitation' thì base: '/graduation-invitation/'
// Nếu deploy lên custom domain hoặc chạy local thì để base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/', // 👈 ĐỔI THÀNH '/tên-repo/' KHI DEPLOY GITHUB PAGES
})
