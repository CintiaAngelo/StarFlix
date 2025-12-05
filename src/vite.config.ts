import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
      interval: 1000
    },
    hmr: true
  },
  optimizeDeps: {
    include: ['@angular/common', '@angular/compiler', '@angular/core', '@angular/platform-browser']
  }
});