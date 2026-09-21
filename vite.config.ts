import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative base so the built site works from any path (e.g. GitHub Pages project sites).
  base: './',
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
