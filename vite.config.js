import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  optimizeDeps: {
    force: true,
    include: [
      "react",
      "react-dom/client",
      "@tanstack/react-query",
      "prop-types",
      "@mui/material",
      "@mui/icons-material",
      "date-fns",
      "react/jsx-dev-runtime"
    ],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  plugins: [react()],
});
