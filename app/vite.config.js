import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 便于部署到任意静态子路径（与现有 china.html 静态托管一致）
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
  },
});
