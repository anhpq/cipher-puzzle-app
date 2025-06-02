// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    port: parseInt(process.env.PORT) || 4173,
    host: true // ❗ Bắt buộc để cho Railway nhận kết nối bên ngoài
  },
});