import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsConfigPaths from "vite-tsconfig-paths";
import rawPlugin from "vite-raw-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tsConfigPaths(),
        rawPlugin({
            fileRegex: /\.(frag|vert|glsl)$/,
        }),
    ]
});
