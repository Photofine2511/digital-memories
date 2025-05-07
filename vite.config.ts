import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Only use componentTagger in development mode
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Define environment variables for production
  define: mode === 'production' ? {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || ''),
    'import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY': JSON.stringify(process.env.VITE_IMAGEKIT_PUBLIC_KEY || ''),
    'import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT': JSON.stringify(process.env.VITE_IMAGEKIT_URL_ENDPOINT || '')
  } : {},
}));
