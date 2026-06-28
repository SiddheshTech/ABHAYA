import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api/mission': {
          target: 'http://localhost:5005',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/mission/, '/api')
        },
        '/api/psych': {
          target: 'http://localhost:8004',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/psych/, '/api')
        },
        '/api/auth': {
          target: 'http://localhost:5010',
          changeOrigin: true,
        },
        '/api/children': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/api/shelters': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/api/family-matches': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/api/wellness': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/api/journeys': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/api/stats': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
