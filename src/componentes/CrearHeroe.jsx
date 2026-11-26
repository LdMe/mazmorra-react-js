import { useState } from 'react';
import { AVATARES, CLASES, DATOS_INICIALES, PUNTOS_A_REPARTIR, crearHeroe } from '../logica/heroes';

// Formulario para crear un héroe nuevo. Cuando los datos son válidos, llama a onCrear con el héroe.
// Todos los campos son CONTROLADOS: su valor vive en el estado `datos` (tema 6).
export default function CrearHeroe({ onCrear }) {
  // Ya hecho: todos los campos en un único objeto de estado (tema 6, "Formulario controlado").
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [errores, setErrores] = useState({});
  const [creado, setCreado] = useState(null);

  const alCambiar = (e) => {
    // TODO 4.1 (parte 1): Un único manejador para todos los campos. Lee `name` y `value` del
    // campo que ha cambiado (e.target) y guarda en `datos` ese campo con el nuevo valor,
    // conservando el resto. Pista: [name]: value (tema 6, "Formulario controlado: ejemplo completo").
  }; // TODO 4.3 (parte 1): Puntos que quedan por repartir: PUNTOS_A_REPARTIR menos el ataque y la
  // defensa escritos. Ojo: en `datos` son texto ('12'), hay que convertirlos con Number().
  // No lo guardes en el estado: se calcula (tema 4, "Estado derivado").
  const restantes = PUNTOS_A_REPARTIR;
  const validar = () => {
    const nuevos = {};
    // TODO 4.4: Comprueba los datos y añade a `nuevos` los mensajes de error:
    //   nombre (sin espacios al principio y al final, .trim()):
    //     vacío                    → nuevos.nombre = 'El nombre es obligatorio'
    //     menos de 3 o más de 12   → nuevos.nombre = 'El nombre debe tener entre 3 y 12 letras'
    //   puntos:
    //     ataque o defensa < 1     → nuevos.puntos = 'Ataque y defensa deben ser al menos 1'
    //     si no, y restantes ≠ 0   → nuevos.puntos = `Te quedan ${restantes} puntos por repartir`
    // Pista: tema 6, "Validación".
    return nuevos;
  };

  const alEnviar = (e) => {
    e.preventDefault(); // Ya hecho: sin esto, el navegador recargaría la página
    // TODO 4.5: Valida los datos y guarda los errores en el estado (siempre: así desaparecen los
    // que ya se han corregido). Si no hay ninguno:
    //   1. crea el héroe con crearHeroe(datos) y pásaselo a onCrear,
    //   2. guarda su nombre en `creado` (para el mensaje de confirmación),
    //   3. vacía el formulario volviendo a DATOS_INICIALES.
    // Pista: Object.keys(objeto).length te dice cuántos campos tiene un objeto.
  };

  return (
    <form className="crear-heroe" onSubmit={alEnviar} noValidate>
      <div className="campo">
        <label htmlFor="heroe-nombre">Nombre</label>
        <input
          id="heroe-nombre"
          name="nombre"
          autoComplete="off"
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={errores.nombre ? 'error-nombre' : undefined}
          // TODO 4.1 (parte 2): Conecta el campo con el estado: su valor es datos.nombre y,
          // al cambiar, llama a alCambiar (tema 6, "Componente controlado").
        />
        {errores.nombre && (
          <p id="error-nombre" className="campo__error">
            {errores.nombre}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor="heroe-clase">Clase</label>
        <select
          id="heroe-clase"
          name="clase"
          // TODO 4.2 (parte 1): Igual que el nombre, pero con datos.clase
          // (tema 6, "Selects, checkboxes y radios").
        >
          {CLASES.map((clase) => (
            <option key={clase} value={clase}>
              {clase}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="campo campo--avatares">
        <legend>Avatar</legend>
        {AVATARES.map((avatar) => (
          <label key={avatar} className="avatar">
            <input
              type="radio"
              name="avatar"
              value={avatar}
              // TODO 4.2 (parte 2): Este radio está marcado si su avatar es datos.avatar.
              // Al cambiar, llama a alCambiar.
            />
            {avatar}
          </label>
        ))}
      </fieldset>

      <div className="campo campo--puntos">
        <label htmlFor="heroe-ataque">Ataque</label>
        <input
          id="heroe-ataque"
          name="ataque"
          type="number"
          min={1}
          // TODO 4.3 (parte 2): Conecta ataque y defensa con el estado, como el nombre.
        />
        <label htmlFor="heroe-defensa">Defensa</label>
        <input id="heroe-defensa" name="defensa" type="number" min={1} />
      </div>
      <p className="crear-heroe__puntos">
        Puntos por repartir: <strong>{restantes}</strong>
      </p>
      {errores.puntos && <p className="campo__error">{errores.puntos}</p>}

      <p className="crear-heroe__vista">
        Vista previa: {datos.avatar} {datos.nombre.trim() || 'Sin nombre'} · {datos.clase} · ⚔️{' '}
        {datos.ataque || 0} · 🛡️ {datos.defensa || 0}
      </p>

      <button type="submit" className="boton-accion">
        ✨ Crear héroe
      </button>
      {creado && (
        <p className="crear-heroe__creado" role="status">
          ✅ {creado} se une a la aventura
        </p>
      )}
    </form>
  );
}
