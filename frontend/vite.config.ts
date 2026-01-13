import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const domain = env.ADDITIONAL_DOMAIN;

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', domain].filter(Boolean),
        watch: {
          usePolling: true,
        },
        hmr: {
          host: domain,
          clientPort: 443,
          protocol: 'wss'
        },
        proxy: {
          '/api': {
            target: 'http://backend:8080',
            changeOrigin: true,
            secure: false,
          }
        }
      },
      plugins: [
        react(),
        tailwindcss(),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
