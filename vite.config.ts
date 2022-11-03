import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nodePolyfills from "vite-plugin-node-stdlib-browser";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), react()],
  build: {
    outDir: "build",
  },
  server: {
    open: true,
  },
  define: {
    global: "globalThis",
    'process.env': {}
  },
});