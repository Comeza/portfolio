import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import rawPlugin from "vite-raw-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    rawPlugin({
      fileRegex: /\.(frag|vert)$/,
    }),
  ],
  define: { global: "window" },
});
