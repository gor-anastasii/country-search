import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/country-search/',
  plugins: [],
  test: {
    environment: 'jsdom',
    globals: true,
    clearMocks: true,
  },
});
