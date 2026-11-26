// El «servidor» del gremio. Ya está hecho.
// Simula una API lenta: cada llamada tarda un poco en responder, para que se note el «Enviando…».
// Los tests la sustituyen por una versión falsa, así que no esperan.

const ESPERA_MS = 900;
const esperar = () => new Promise((resolver) => setTimeout(resolver, ESPERA_MS));

/**
 * Una misión del gremio: qué monstruo hay que vencer, cuánto oro paga (además de un cofre) y
 * cuánto ataque hace falta para que el gremio te deje ir.
 */

/** Las misiones del tablón, de la más fácil a la más difícil. */
export const tablonMisiones = [
  { nombre: 'Escoltar la caravana', monstruo: 'Goblin', recompensa: 40, ataqueMinimo: 0 },
  { nombre: 'Limpiar la cripta', monstruo: 'Esqueleto', recompensa: 50, ataqueMinimo: 12 },
  {
    nombre: 'Cazar al lobo de las sombras',
    monstruo: 'Lobo de las sombras',
    recompensa: 70,
    ataqueMinimo: 16,
  },
  { nombre: 'Matar al dragón', monstruo: 'Dragón', recompensa: 200, ataqueMinimo: 20 },
];

// El «servidor» recuerda en qué misión estás apuntado (en localStorage, para simularlo)
const CLAVE_MISION = 'mazmorra-mision';

/** La misión en la que estás apuntado, o null si no hay ninguna. La lee la mazmorra (src/App). */
export function misionActiva() {
  const guardada = localStorage.getItem(CLAVE_MISION);
  return guardada !== null ? JSON.parse(guardada) : null;
}

/** Da la misión activa por cumplida (la mazmorra la llama al vencer a su monstruo). */
export function completarMision() {
  localStorage.removeItem(CLAVE_MISION);
}

/**
 * Apunta al héroe a una misión (sustituye a la que tuviera). Devuelve el mensaje de confirmación,
 * o lanza un Error si la misión no existe o si al héroe le falta ataque para ella.
 */
export async function inscribirEnMision(mision, heroe) {
  await esperar();
  const elegida = tablonMisiones.find((m) => m.nombre === mision);
  if (!elegida) throw new Error(`El gremio no tiene ninguna misión «${mision}».`);
  if (heroe.ataque < elegida.ataqueMinimo) {
    throw new Error(
      `El gremio no te deja ir: para «${mision}» hace falta ${elegida.ataqueMinimo} de ataque y ${heroe.nombre} tiene ${heroe.ataque}. Consigue un arma mejor.`,
    );
  }
  const nombre = heroe.nombre;
  localStorage.setItem(CLAVE_MISION, JSON.stringify(elegida));
  return `¡Hecho, ${nombre}! Te has apuntado a «${mision}»: vence a ${elegida.monstruo} en la mazmorra y cobrarás ${elegida.recompensa} 🪙 y un cofre.`;
}

/** Publica un rumor en el tablón. Devuelve el rumor guardado, ya con su id definitivo. */
export async function publicarRumor(texto) {
  await esperar();
  return { id: crypto.randomUUID(), texto };
}

/** Los rumores que ya hay en el tablón al empezar. */
export const rumoresIniciales = [
  {
    id: 'rumor-1',
    texto: 'El golem de piedra casi no siente los golpes: mejora tu arma antes de ir a por él.',
  },
  {
    id: 'rumor-2',
    texto: 'El dragón pega muy fuerte. Nadie ha vuelto de su cueva con menos de cinco pociones.',
  },
];
