import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // path modülü eklendi

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ckeditor': path.resolve(__dirname, 'node_modules/@ckeditor'),
    },
  },
  proxy: {
    '/rest/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/rest\/api/, ''),
    },
  },
});
  