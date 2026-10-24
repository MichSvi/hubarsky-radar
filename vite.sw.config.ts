import { defineConfig } from 'vite';

// Builds the service worker as one classic script at dist/sw.js (works in all browsers).
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: { entry: 'src/sw.ts', formats: ['iife'], name: 'sw', fileName: () => 'sw.js' },
  },
});
