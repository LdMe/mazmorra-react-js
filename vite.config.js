import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // ikasbot/ (npm run entregar -- --preparar, solo del profesorado) puede tener otra copia de los tests: fuera
    exclude: [...configDefaults.exclude, 'ikasbot/**'],
    setupFiles: './tests/setup.js',
  },
});
