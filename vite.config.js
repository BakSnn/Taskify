import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "Taskify",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
