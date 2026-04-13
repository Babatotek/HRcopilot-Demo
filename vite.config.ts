import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react({
        // Babel fast-refresh only in dev
        babel: {
          plugins: mode === 'production' ? ['transform-remove-console'] : [],
        },
      }),
      tailwindcss(),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') },
    },
    optimizeDeps: {
      // Pre-bundle heavy deps so Vite doesn't re-process them on every cold start
      include: [
        'react', 'react-dom', 'react-router-dom',
        'recharts', 'framer-motion', 'lucide-react',
      ],
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          // Fine-grained manual chunks — each loads only when its route is visited
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react-core';
            if (id.includes('node_modules/react-router')) return 'router';
            if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) return 'charts';
            if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) return 'motion';
            if (id.includes('node_modules/lucide-react')) return 'icons';
            if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) return 'maps';
            if (id.includes('node_modules/@tanstack')) return 'query';
            if (id.includes('node_modules/groq-sdk') || id.includes('node_modules/@google')) return 'ai-sdk';
            if (id.includes('/pages/')) return 'pages';
            if (id.includes('/components/')) return 'components';
            if (id.includes('/services/')) return 'services';
          },
        },
      },
    },
  };
});
