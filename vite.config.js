import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/carbon/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Extract vendor libraries into separate chunks
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'vendor-jspdf'; // lazy-loaded, isolated
            }
          }
          // Group pages by feature
          if (id.includes('src/pages/DashboardPage')) {
            return 'page-dashboard';
          }
          if (id.includes('src/pages/CoachPage')) {
            return 'page-coach';
          }
          if (id.includes('src/pages/LearnPage')) {
            return 'page-learn';
          }
          if (id.includes('src/pages/NewsPage')) {
            return 'page-news';
          }
          if (id.includes('src/pages/ActPlatformPage')) {
            return 'page-act';
          }
          if (id.includes('src/pages/FutureEarthSimulator')) {
            return 'page-simulator';
          }
          // Shared utilities chunk
          if (id.includes('src/utils/') || id.includes('src/hooks/')) {
            return 'shared-utils';
          }
          // Shared components chunk
          if (id.includes('src/components/')) {
            return 'shared-components';
          }
        }
      }
    },
    chunkSizeWarningLimit: 500, // Warn for chunks > 500KB
    sourcemap: false, // Disable sourcemaps in production for smaller output
  }
})