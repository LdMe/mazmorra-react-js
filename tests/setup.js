// Se ejecuta antes de los tests. No hace falta tocarlo.
import '@testing-library/jest-dom/vitest'; // añade toBeInTheDocument(), toBeDisabled()...
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Desmonta lo que haya pintado cada test para que no interfiera con el siguiente
afterEach(() => {
  cleanup();
});
