import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from "@tailwindcss/vite"; // ✅ Add Tailwind as a Vite plugin

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    force: true // Force dependency pre-bundling to clear corrupted cache
  },
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
});
