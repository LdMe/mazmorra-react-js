// Textos de los objetos. Este archivo ya está hecho.
import { CURACION_POCION } from './combate';

/** Botones de filtro del inventario, en orden. */
export const FILTROS = ['todos', 'arma', 'armadura', 'pocion', 'tesoro'];

/** Texto de cada botón de filtro. */
export const ETIQUETA_FILTRO = {
  todos: 'Todo',
  arma: 'Armas',
  armadura: 'Armaduras',
  pocion: 'Pociones',
  tesoro: 'Tesoros',
};

/** Texto de cada rareza. */
export const ETIQUETA_RAREZA = {
  comun: 'Común',
  rara: 'Rara',
  epica: 'Épica',
  legendaria: 'Legendaria',
};

/** Lo que suma al ataque (un arma) o a la defensa (una armadura), según su rareza. */
const BONUS_POR_RAREZA = { comun: 2, rara: 5, epica: 9, legendaria: 15 };

export function bonusDe(objeto) {
  return BONUS_POR_RAREZA[objeto.rareza];
}

/** Lo probable que es cada rareza al abrir un cofre (suman 100). */
const PROBABILIDAD_COFRE = { comun: 62, rara: 27, epica: 9, legendaria: 2 };

/**
 * Saca un objeto al azar de `posibles`: primero elige la rareza según PROBABILIDAD_COFRE y luego
 * un objeto cualquiera de esa rareza. Los objetos pueden repetirse.
 */
export function objetoAlAzar(posibles) {
  let tirada = Math.random() * 100;
  let rareza = 'comun';
  for (const [nombre, probabilidad] of Object.entries(PROBABILIDAD_COFRE)) {
    if (tirada < probabilidad) {
      rareza = nombre;
      break;
    }
    tirada -= probabilidad;
  }
  const deEsaRareza = posibles.filter((objeto) => objeto.rareza === rareza);
  const lista = deEsaRareza.length > 0 ? deEsaRareza : posibles;
  return lista[Math.floor(Math.random() * lista.length)];
}

/**
 * El equipo del héroe: la mejor arma y la mejor armadura de la mochila (las de más valor).
 * El héroe suma su bonus al ataque y a la defensa.
 */
export function equipoDe(objetos) {
  const mejor = (tipo) =>
    objetos.filter((objeto) => objeto.tipo === tipo).sort((a, b) => b.valor - a.valor)[0];
  return { arma: mejor('arma'), armadura: mejor('armadura') };
}

/** Lo que paga la tienda por un objeto: la mitad de su valor (como mínimo 1). */
export function precioDeVenta(objeto) {
  return Math.max(1, Math.floor(objeto.valor / 2));
}

/** Para qué sirve un objeto, en texto: lo que suma al héroe o lo que cura. */
export function efectoDe(objeto) {
  if (objeto.tipo === 'arma') return `+${bonusDe(objeto)} ataque`;
  if (objeto.tipo === 'armadura') return `+${bonusDe(objeto)} defensa`;
  if (objeto.tipo === 'pocion') return `cura ${CURACION_POCION} PV`;
  return 'tesoro: se vende bien';
}
