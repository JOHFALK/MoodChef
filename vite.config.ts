import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Listen on all addresses
    port: 8080,
    strictPort: true, // Fail if port is already in use
    hmr: {
      // Handle HMR connections properly
      clientPort: 443,
      protocol: 'wss',
      host: '9ea3ff5b-92d9-4f8c-8794-a7ac4bab02d2.lovableproject.com'
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));