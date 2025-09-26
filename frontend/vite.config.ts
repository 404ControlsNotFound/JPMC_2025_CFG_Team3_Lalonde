/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const ReactCompilerConfig = {};

const isTest = process.env.NODE_ENV === "test";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/react-ts-template/" : "/",
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tailwindcss(),
    !isTest && tanstackRouter(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    isolate: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.tsx",
  },
});
