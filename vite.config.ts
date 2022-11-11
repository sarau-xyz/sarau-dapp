import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// yarn add --dev @esbuild-plugins/node-globals-polyfill
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
// yarn add --dev @esbuild-plugins/node-modules-polyfill
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
import rollupNodePolyFill from "rollup-plugin-polyfill-node";
// import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
// https://medium.com/@ftaioli/using-node-js-builtin-modules-with-vite-6194737c2cd2
export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
    //   manifest: {
    //     name: "Sarau.xyz",
    //     short_name: "Sarau",
    //     theme_color: "#35D07F",
    //     background_color: "#fff",
    //     display: "standalone",
    //     orientation: "portrait",
    //     scope: "/",
    //     start_url: "/",
    //     icons: [
    //       {
    //         src: "images/icons/icon-72x72.png",
    //         sizes: "72x72",
    //         type: "image/png",
    //       },
    //       {
    //         src: "images/icons/icon-96x96.png",
    //         sizes: "96x96",
    //         type: "image/png",
    //       },
    //       {
    //         src: "images/icons/icon-128x128.png",
    //         sizes: "128x128",
    //         type: "image/png",
    //       },
    //       {
    //         src: "images/icons/icon-144x144.png",
    //         sizes: "144x144",
    //         type: "image/png",
    //       },
    //       {
    //         src: "images/icons/icon-152x152.png",
    //         sizes: "152x152",
    //         type: "image/png",
    //       },
    //       {
    //         src: "images/icons/icon-192x192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "images/icons/icon-384x384.png",
    //         sizes: "384x384",
    //         type: "image/png",
    //       },
    //       {
    //         src: "images/icons/icon-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //     ],
    //   },
    // }),
  ],
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
      crypto: "crypto-browserify",
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
