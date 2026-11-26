import { useEffect, useState } from 'react';

/**
 * Como useState, pero el valor se guarda en localStorage con la clave `clave` y se recupera al
 * recargar la página. Se usa igual: const [heroe, setHeroe] = useLocalStorage('mazmorra-heroe', heroes[0]);
 * La mazmorra (src/App) ya lo usa para recordar tu héroe.
 */
export function useLocalStorage(clave, inicial) {
  // TODO 7.1: Es lo mismo que hiciste en el Diario (TODO 5.4 y 5.5), pero sirve para cualquier
  // valor, no solo texto, y para cualquier clave:
  //   - el estado empieza con lo guardado en localStorage (conviértelo con JSON.parse), o con
  //     `inicial` si no hay nada. Léelo solo al montar: inicialización perezosa.
  //   - un efecto lo guarda (con JSON.stringify) cada vez que cambia.
  //   - devuelve [valor, setValor], igual que useState.
  // Hasta que lo hagas, funciona como un useState normal: no se guarda nada.
  // (Tema 8, "Ejemplo 1: useLocalStorage".)
  return useState(inicial);
}
