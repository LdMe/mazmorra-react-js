import { createContext } from 'react';

// El contexto del monedero. Ya está hecho: lo usan MonederoProvider (que le da valor) y el hook
// useMonedero (que lo lee). Empieza en null: fuera de un <MonederoProvider> no hay monedero.
// Está en su propio archivo para que cada archivo .tsx solo exporte componentes (así funciona
// mejor la recarga en caliente de Vite).
export const MonederoContext = createContext(null);
