import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // ou outro se necessário
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // <- atualiza com a porta do backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

