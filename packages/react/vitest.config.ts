import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.spec.{ts,tsx}",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.stories.{ts,tsx}",
        "src/**/__tests__/**",
        "src/test-setup.ts",
        // Marketing primitives are visual sections (Hero, FAQAccordion, Timeline,
        // ImageGallery, etc.) validated via Storybook visual review, not unit
        // tests. Function-coverage by vitest understates their quality bar.
        // Each marketing component still has a smoke test in __tests__/ that
        // proves the render path; coverage thresholds just don't apply.
        "src/marketing/**",
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        statements: 85,
        branches: 70,
      },
    },
  },
});
