import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    // Playwright e2e specs run under `npx playwright test`, not Vitest.
    exclude: ["**/node_modules/**", "**/tests/e2e/**"],
  },
  resolve: { alias: { "@": "/src" } },
});
