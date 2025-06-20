import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  base: command === "serve" ? "/" : "/dnd-character-forge/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));
