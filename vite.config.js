import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5187,
    strictPort: false,
  },
  preview: {
    port: 4187,
    strictPort: false,
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-gsap': ['gsap', 'gsap/ScrollTrigger'],
          'vendor-motion': ['motion/react'],
          'vendor-three': ['three'],
        },
      },
    },
  },
});
