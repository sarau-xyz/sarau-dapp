import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// yarn add --dev @esbuild-plugins/node-globals-polyfill
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
// yarn add --dev @esbuild-plugins/node-modules-polyfill
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
      // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
      // process and buffer are excluded because already managed
      // by node-globals-polyfill
      // util: "rollup-plugin-node-polyfills/polyfills/util",
      // sys: "util",
      // events: "rollup-plugin-node-polyfills/polyfills/events",
      // path: "rollup-plugin-node-polyfills/polyfills/path",
      // querystring: "rollup-plugin-node-polyfills/polyfills/qs",
      // punycode: "rollup-plugin-node-polyfills/polyfills/punycode",
      crypto: "rollup-plugin-node-polyfills/polyfills/crypto",
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      assert: "rollup-plugin-node-polyfills/polyfills/assert",
      http: "rollup-plugin-node-polyfills/polyfills/http",
      https: "rollup-plugin-node-polyfills/polyfills/http",
      os: "rollup-plugin-node-polyfills/polyfills/os",
      url: "rollup-plugin-node-polyfills/polyfills/url",
      
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
      ],
    },
    outDir: "build",
  },
  server: {
    open: true,
  },
});
