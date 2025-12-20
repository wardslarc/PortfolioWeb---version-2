import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
  
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
  },
  
  plugins: [
    react(),
    tempo(),
  ],
  
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    target: 'esnext',
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-animation': ['framer-motion'],
          'vendor-ui': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    sourcemap: false,
  },
  
  server: {
    // @ts-ignore
    allowedHosts: true,
    middlewareMode: false,
    headers: {
      // Security headers to prevent common attacks
      'X-Content-Type-Options': 'nosniff', // Prevent MIME sniffing
      'X-Frame-Options': 'DENY', // Prevent clickjacking
      'X-XSS-Protection': '1; mode=block', // Enable XSS protection
      'Referrer-Policy': 'strict-origin-when-cross-origin', // Control referrer info
      'Cache-Control': 'public, max-age=3600',
    },
  },
  
  css: {
    postcss: './postcss.config.js',
  },
});
