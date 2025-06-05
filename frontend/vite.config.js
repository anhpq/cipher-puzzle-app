// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    port: parseInt(process.env.PORT) || 4173, // Railway cung cấp PORT env var
    host: true,                             // bind tất cả interface
    strictPort: true,                       // không fallback sang port khác
    open: false,                           // tránh tự động mở browser
    allowedHosts: ['cipher-puzzle-frontend.up.railway.app', 'localhost'], // whitelist domain
  },
});
