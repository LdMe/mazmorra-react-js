/** Con lo que empieza el monedero. */
export const estadoInicialMonedero = { oro: 100, compras: [] };

const CLAVE = 'mazmorra-monedero';

/** Ya hecha: el monedero guardado en localStorage, o `porDefecto` si no hay nada guardado. */
export function cargarMonedero(porDefecto) {
  const guardado = localStorage.getItem(CLAVE);
  return guardado !== null ? JSON.parse(guardado) : porDefecto;
}

/** Ya hecha: guarda el monedero en localStorage. */
export function guardarMonedero(estado) {
  localStorage.setItem(CLAVE, JSON.stringify(estado));
}

/**
 * El reducer del monedero: recibe el estado actual y una acción, y devuelve el estado nuevo.
 * Es una función pura: no modifica `estado`, devuelve otro objeto.
 */
export function monederoReducer(estado, accion) {
  // TODO 7.2: Un switch sobre accion.type:
  //   - 'GANAR': suma accion.payload al oro.
  //   - 'COMPRAR': accion.payload es el objeto. Si su valor es mayor que el oro que hay, no cambia
  //     nada (devuelve el mismo estado). Si llega, resta su valor al oro y añade el objeto al
  //     final de las compras.
  //   - 'REINICIAR': vuelve a estadoInicialMonedero.
  //   - cualquier otra: lanza un Error('Acción desconocida').
  // Nunca modifiques `estado` (nada de estado.oro += ... ni push): devuelve un objeto nuevo
  // con el operador spread (tema 8, "useReducer").
  return estado;
}
