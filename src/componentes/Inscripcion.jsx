import { useActionState } from 'react';
import { inscribirEnMision, misionActiva, tablonMisiones } from '../logica/gremio';
import BotonEnviar from './BotonEnviar';

const estadoInicial = { tipo: 'inicial' };

/**
 * La Action del formulario. Recibe lo que devolvió la vez anterior y los datos del formulario,
 * y devuelve el estado nuevo: { tipo: 'ok', mensaje } o { tipo: 'error', mensaje }.
 */
async function inscribir(_anterior, datos) {
  // TODO 8.1:
  //   - Saca del FormData la misión elegida ("mision") y los datos del héroe, que van en dos
  //     campos ocultos: "heroe" (su nombre) y "ataque" (conviértelo en número con Number).
  //   - Si no se ha elegido ninguna misión (la opción vacía), devuelve el error
  //     'Elige una misión.' sin llamar al gremio.
  //   - Si no, espera a inscribirEnMision(mision, { nombre, ataque }) y devuelve
  //     { tipo: 'ok', mensaje } con el mensaje que te da.
  //   - Si inscribirEnMision lanza un error (por ejemplo, porque al héroe le falta ataque para
  //     esa misión), devuelve { tipo: 'error', mensaje: error.message }.
  // (Tema 9, "useActionState".)
  return _anterior;
}

// Formulario para apuntar al héroe a una misión del gremio.
export default function Inscripcion({ heroe }) {
  // TODO 8.2: Conecta la Action con useActionState(inscribir, estadoInicial): te da el estado
  // (lo último que devolvió inscribir) y la acción para el action del <form>.
  // Sin useState, sin preventDefault y sin onSubmit: React se encarga de todo.
  // Hasta que lo hagas, el formulario no hace nada.
  const estado = estadoInicial;
  const accion = () => {};

  return (
    <form className="gremio-form" action={accion}>
      {/* Campos ocultos: no se ven, pero van en el FormData con el resto del formulario */}
      <input type="hidden" name="heroe" value={heroe.nombre} />
      <input type="hidden" name="ataque" value={heroe.ataque} />

      <label className="campo">
        Misión para {heroe.nombre} (⚔️ {heroe.ataque})
        <select name="mision" defaultValue="">
          <option value="">Elige una misión…</option>
          {tablonMisiones.map((mision) => (
            <option key={mision.nombre} value={mision.nombre}>
              {mision.nombre} · vence a {mision.monstruo} · 🪙 {mision.recompensa} · ⚔️{' '}
              {mision.ataqueMinimo}+
            </option>
          ))}
        </select>
      </label>
      <BotonEnviar>Apuntarme</BotonEnviar>

      {estado.tipo === 'error' && (
        <p className="gremio-form__mensaje gremio-form__mensaje--error" role="alert">
          {estado.mensaje}
        </p>
      )}
      {estado.tipo === 'ok' && (
        <p className="gremio-form__mensaje" role="status">
          {estado.mensaje}
        </p>
      )}

      {/* Ya hecho: la misión que tienes ahora (el gremio la recuerda) */}
      <p className="nota">📜 Tu misión: {misionActiva()?.nombre ?? 'ninguna'}</p>
    </form>
  );
}
