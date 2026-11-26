import { useEffect, useReducer } from 'react';
import {
  cargarMonedero,
  estadoInicialMonedero,
  guardarMonedero,
  monederoReducer,
} from '../logica/monedero';
import { MonederoContext } from './MonederoContext';

// El proveedor del monedero. En main.tsx envuelve a toda la aplicación, por encima del router:
// por eso el oro no se pierde al cambiar de página.
export default function MonederoProvider({ children }) {
  // TODO 7.3: Guarda el monedero con useReducer (monederoReducer y estadoInicialMonedero) y
  // comparte con <MonederoContext value={...}> un objeto con:
  //   - oro y compras, del estado,
  //   - ganar(cantidad), que lanza la acción { type: 'GANAR', payload: cantidad },
  //   - comprar(objeto), que lanza la acción { type: 'COMPRAR', payload: objeto }.
  // Así, los componentes no necesitan saber nada del reducer ni de sus acciones.
  // Para que el oro no se pierda al recargar (como la partida), guárdalo en localStorage:
  //   - useReducer admite un tercer argumento, una función que calcula el estado inicial a partir
  //     del segundo: useReducer(monederoReducer, estadoInicialMonedero, cargarMonedero),
  //   - y un efecto que llame a guardarMonedero(estado) cada vez que cambie el estado.
  // (cargarMonedero y guardarMonedero ya están hechas, en src/logica/monedero.)
  // (Tema 8, "useContext" y "useReducer"; tema 7, "Casos de uso típicos" para localStorage.)
  return children;
}
