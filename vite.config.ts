import { defineConfig } from 'vite'
import tailwind from "@tailwindcss/vite"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
    plugins: [tailwind(),tsConfigPaths()]
})
