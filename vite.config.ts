import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },

  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',

    // Disable file watching during AI Studio edits.
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },

  build: {
    chunkSizeWarningLimit: 800,
  },
});
