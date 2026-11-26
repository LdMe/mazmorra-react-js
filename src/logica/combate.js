// Reglas del combate. Este archivo ya está hecho: úsalo desde tus componentes.

/** Puntos de vida que recupera una poción. */
export const CURACION_POCION = 30;

/** Monedas de oro que da vencer a un monstruo: más cuanto más duro es. */
export function recompensaPor(monstruo) {
  return Math.round(monstruo.vidaMax / 2 + monstruo.ataque);
}

/** Daño de un golpe: ataque menos defensa, pero como mínimo 1. */
export function calcularDanio(ataque, defensa) {
  return Math.max(1, ataque - defensa);
}

/** Texto del registro para un ataque. */
export function mensajeAtaque(atacante, objetivo, danio) {
  return `${atacante} ataca a ${objetivo}: -${danio} PV`;
}

/** Texto del registro para una poción. */
export function mensajePocion(nombre, curacion) {
  return `${nombre} bebe una poción: +${curacion} PV`;
}

/** Crea una línea del registro con un id único (para usarlo como `key`). */
export function crearEntrada(texto) {
  return { id: crypto.randomUUID(), texto };
}
