// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "react",
      "react-dom/client",
      "@tanstack/react-query",
      "prop-types",
      "@mui/material",
      "@mui/icons-material",
      "date-fns",
      "react/jsx-dev-runtime",
      "cookie",
    ],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  css: { devSourcemap: false },
  build: { sourcemap: false },
});
