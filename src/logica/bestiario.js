import { fichas } from '../datos/bestiario';

/** Las fichas cuyo nombre contiene `texto`, sin distinguir mayúsculas de minúsculas. */
export const filtrarFichas = (lista, texto) => {
  const buscado = texto.trim().toLowerCase();
  return lista.filter((ficha) => ficha.nombre.toLowerCase().includes(buscado));
};

/** La ficha con ese id (que llega de la URL como texto), o undefined si no existe. */
export function buscarFicha(id) {
  return fichas.find((ficha) => String(ficha.id) === id);
}
