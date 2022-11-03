import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
  },
  server: {
    open: true,
  },
});
