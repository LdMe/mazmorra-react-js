// Reglas para crear héroes. Este archivo ya está hecho.

/** Puntos que hay que repartir entre ataque y defensa. */
export const PUNTOS_A_REPARTIR = 20;

export const CLASES = ['Guerrera', 'Mago', 'Pícaro'];

export const AVATARES = ['🛡️', '🧙', '🗡️', '🏹', '🧝'];

/** Vida con la que empieza cada clase. */
export const VIDA_POR_CLASE = {
  Guerrera: 120,
  Mago: 70,
  Pícaro: 90,
};

/** Estado inicial del formulario de creación. */
export const DATOS_INICIALES = {
  nombre: '',
  clase: 'Guerrera',
  avatar: '🛡️',
  ataque: '',
  defensa: '',
};

/** Convierte los datos (ya validados) del formulario en un héroe de nivel 1. */
export function crearHeroe(datos) {
  const vida = VIDA_POR_CLASE[datos.clase];
  return {
    nombre: datos.nombre.trim(),
    clase: datos.clase,
    nivel: 1,
    avatar: datos.avatar,
    vida,
    vidaMax: vida,
    ataque: Number(datos.ataque),
    defensa: Number(datos.defensa),
  };
}
