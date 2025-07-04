import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // 👈 Importante para Vite em produção no root do domínio
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});


