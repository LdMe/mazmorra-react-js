import { useContext } from 'react';
import { MonederoContext } from '../contexto/MonederoContext';

/** El monedero compartido: { oro, compras, ganar, comprar }. Solo funciona dentro de <MonederoProvider>. */
export function useMonedero() {
  // TODO 7.4: Lee MonederoContext con useContext y devuélvelo. Si vale null, es que el componente
  // no está dentro de un <MonederoProvider>: lanza un Error con el mensaje
  // 'useMonedero tiene que usarse dentro de <MonederoProvider>'.
  // Así, quien se olvide del proveedor ve un error claro en lugar de un «cannot read properties
  // of null» (tema 8, "Hooks personalizados").
  throw new Error('Pendiente: TODO 7.4');
}
