
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
    }),
  ],
  base: './',
  build: {
    outDir: path.resolve(__dirname, '../manage-core-backend/public/app'),
    emptyOutDir: false,
    cssMinify: true,
    cssCodeSplit: true,
    minify: 'esbuild',
    target: 'es2020',
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'vendor';
          if (id.includes('node_modules/bootstrap')) return 'bootstrap';
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs-2')) return 'charts';
          if (id.includes('node_modules/@fortawesome') || id.includes('node_modules/react-icons')) return 'icons';
          if (id.includes('node_modules/@tanstack/react-table')) return 'tables';
          if (id.includes('node_modules/framer-motion')) return 'animations';
          if (id.includes('node_modules/exceljs') || id.includes('node_modules/xlsx')) return 'excel';
          if (id.includes('node_modules/docx')) return 'docx';
          if (id.includes('node_modules/reactflow')) return 'reactflow';
          if (id.includes('node_modules/react-markdown')) return 'markdown';
          if (id.includes('/src/pages/systems/PMS/')) return 'pms';
          if (id.includes('/src/pages/systems/HRMS/')) return 'hrms';
          if (id.includes('/src/pages/systems/FMS/')) return 'fms';
          if (id.includes('/src/pages/systems/TMS/')) return 'tms';
          if (id.includes('/src/pages/systems/DMS/')) return 'dms';
          if (id.includes('/src/pages/systems/AI/')) return 'ai';
          if (id.includes('/src/pages/systems/MFG/')) return 'mfg';
          if (id.includes('/src/pages/systems/Inventory/')) return 'inventory';
          if (id.includes('/src/pages/systems/Investment/') || id.includes('/src/pages/systems/Loan/')) return 'finance';
          if (id.includes('/src/pages/superadmin/')) return 'superadmin';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: '0.0.0.0',
    port: 8061,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: '127.0.0.1',
    },
    proxy: {
      '/api': {
        target: 'http://managecore.local:8080',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 8061,
    strictPort: true,
  },
})
